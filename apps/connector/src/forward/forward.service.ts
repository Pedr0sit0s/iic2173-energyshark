import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Channel, ConsumeMessage } from 'amqplib';
import { computeBackoffDelay, type BackoffOptions } from '../amqp/backoff';
import type { EnergyEvent } from '../amqp/energy-event';
import { logger, reasonOf } from '../common/logger';

const FORWARD_BACKOFF: BackoffOptions = {
  baseMs: 1_000,
  capMs: 30_000,
  jitterMs: 1_000,
};

// Pausa previa al requeue para no generar un loop agresivo de redelivery
// mientras `master` permanece caído (con prefetch(1) el ciclo completo de
// reintentos + esta pausa dura ~36s).
const REQUEUE_GRACE_MS = 5_000;

const MAX_BODY_LOG_LENGTH = 300;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ForwardService {
  private readonly masterUrl: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly internalToken: string;

  constructor(configService: ConfigService) {
    this.masterUrl = configService.getOrThrow<string>('MASTER_URL');
    this.timeoutMs = configService.get<number>('REQUEST_TIMEOUT_MS') ?? 5_000;
    this.maxRetries = configService.get<number>('MAX_FORWARD_RETRIES') ?? 5;
    this.internalToken = configService.getOrThrow<string>('INTERNAL_TOKEN');
  }

  /**
   * Reenvía el evento a `POST {MASTER_URL}/events` y decide el destino del
   * mensaje AMQP según el resultado:
   *   - 2xx → ack (se elimina de la cola).
   *   - 4xx (excepto 408/429) → nack(requeue: false): evento inválido, se descarta con log.
   *   - 5xx / timeout / error de red / 408 / 429 → reintento con backoff; agotados
   *     los reintentos se devuelve a la cola con nack(requeue: true) para NO perder
   *     el evento ante una caída temporal de master.
   */
  async forward(event: EnergyEvent, channel: Channel, message: ConsumeMessage): Promise<void> {
    const tag = message.fields.deliveryTag;
    const context = `tag=${tag} idpk=${event.idpk} type=${event.type}`;
    let attempt = 0;

    for (;;) {
      try {
        const response = await this.postToMaster(event);

        if (response.ok) {
          channel.ack(message);
          logger.info(`ACK ${context} status=${response.status}`);
          return;
        }

        if (this.isPermanentFailure(response.status)) {
          channel.nack(message, false, false);
          const body = await this.safeBody(response);
          logger.error(`NACK_4XX ${context} status=${response.status} body=${body}`);
          return;
        }

        throw new Error(`master respondió con HTTP ${response.status}`);
      } catch (error) {
        if (attempt >= this.maxRetries) {
          // Requeue seguro: el evento vuelve a la cola para reintentarlo cuando
          // master se recupere. La pausa previa evita un loop de redelivery agresivo.
          await sleep(REQUEUE_GRACE_MS);
          channel.nack(message, false, true);
          logger.warn(
            `REQUEUE ${context} reintentos=${attempt} motivo=${reasonOf(error)}`,
          );
          return;
        }

        const delay = computeBackoffDelay(attempt, FORWARD_BACKOFF);
        attempt += 1;
        logger.warn(
          `REINTENTO ${context} intento=${attempt}/${this.maxRetries} ` +
            `espera=${(delay / 1000).toFixed(2)}s motivo=${reasonOf(error)}`,
        );
        await sleep(delay);
      }
    }
  }

  private isPermanentFailure(status: number): boolean {
    // 4xx = error permanente (evento inválido según master); 408 y 429 son transitorios.
    return status >= 400 && status < 500 && status !== 408 && status !== 429;
  }

  private async postToMaster(event: EnergyEvent): Promise<Response> {
    return fetch(`${this.masterUrl}/events`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-internal-token': this.internalToken,
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(this.timeoutMs),
    });
  }

  private async safeBody(response: Response): Promise<string> {
    try {
      const text = await response.text();
      return text.length > MAX_BODY_LOG_LENGTH
        ? `${text.slice(0, MAX_BODY_LOG_LENGTH)}...`
        : text;
    } catch {
      return '<sin cuerpo>';
    }
  }
}
