import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { connect, type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';
import { computeBackoffDelay, type BackoffOptions } from './backoff';
import { parseEnergyEvent, type EnergyEvent } from './energy-event';
import { logger, reasonOf } from '../common/logger';
import { ForwardService } from '../forward/forward.service';

const RECONNECT_BACKOFF: BackoffOptions = {
  baseMs: 1_000,
  capMs: 30_000,
  jitterMs: 1_000,
};

const HEARTBEAT_FILE = '/tmp/connector-heartbeat';
const HEARTBEAT_INTERVAL_MS = 5_000;

/** Oculta la contraseña de una URL AMQP antes de mostrarla en logs. */
function formatUrl(url: string): string {
  const parsed = new URL(url);
  parsed.password = '***';
  return parsed.toString();
}

@Injectable()
export class AmqpService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly url: string;
  private readonly queue: string;

  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnecting = false;
  private shuttingDown = false;
  private attempt = 0;

  constructor(
    configService: ConfigService,
    private readonly forwardService: ForwardService,
  ) {
    this.url = configService.getOrThrow<string>('RABBITMQ_URL');
    this.queue = configService.getOrThrow<string>('RABBITMQ_QUEUE');
  }

  async onApplicationBootstrap(): Promise<void> {
    this.startHeartbeat();
    await this.connect();
  }

  async onApplicationShutdown(): Promise<void> {
    this.shuttingDown = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    logger.info('Cerrando canal y conexión...');
    await this.close();
  }

  /**
   * Latido del proceso para el HEALTHCHECK de Docker: escribe un archivo cada
   * `HEARTBEAT_INTERVAL_MS`. Refleja que el proceso está vivo y activo (no la
   * conexión, que puede estar en reconexión por diseño — RNF-3).
   */
  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      return;
    }
    this.heartbeatTimer = setInterval(() => {
      try {
        writeFileSync(HEARTBEAT_FILE, Date.now().toString());
      } catch (error) {
        logger.error(`No se pudo escribir el heartbeat: ${reasonOf(error)}`);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private async connect(): Promise<void> {
    let connection: ChannelModel | null = null;
    try {
      logger.info(`CONECTANDO broker=${formatUrl(this.url)}`);
      connection = await connect(this.url);
      this.connection = connection;
      this.attempt = 0;
      logger.info('CONEXIÓN TCP establecida.');

      connection.on('error', (error: Error) => {
        logger.error(`ERROR de RabbitMQ: ${error.message}`);
        this.scheduleReconnect();
      });
      connection.on('close', () => {
        logger.warn('Conexión cerrada por el broker.');
        this.scheduleReconnect();
      });

      const channel = await connection.createChannel();
      this.channel = channel;
      logger.info('Canal de comunicación abierto.');

      channel.on('error', (error: Error) => {
        logger.error(`ERROR de canal: ${error.message}`);
      });
      channel.on('close', () => {
        if (this.shuttingDown || this.channel !== channel) {
          // Cierre intencional (shutdown) o canal viejo de una reconexión previa.
          return;
        }
        this.channel = null;
        logger.warn('Canal cerrado por el broker.');
        // Si la conexión sigue viva, la cerramos para forzar una reconexión limpia
        // y no dejar una conexión huérfana sin consumidor.
        if (this.connection) {
          this.connection.close().catch(() => undefined);
        }
        this.scheduleReconnect();
      });

      await channel.prefetch(1);

      const handler = (message: ConsumeMessage | null): void => {
        void this.handleMessage(channel, message);
      };
      await channel.consume(this.queue, handler, { noAck: false });

      logger.info(`ESCUCHANDO cola=${this.queue}`);
    } catch (error) {
      // Si la conexión quedó a medio establecer, se cierra antes de reintentar.
      if (connection) {
        try {
          await connection.close();
        } catch {
          // Conexión ya cerrada: se ignora.
        }
        this.connection = null;
        this.channel = null;
      }
      logger.error(`FALLO al conectar: ${reasonOf(error)}`);
      this.scheduleReconnect();
    }
  }

  private async handleMessage(
    channel: Channel,
    message: ConsumeMessage | null,
  ): Promise<void> {
    if (message === null) {
      logger.warn('Consumidor cancelado por el broker.');
      return;
    }

    const tag = message.fields.deliveryTag;
    let event: EnergyEvent;

    try {
      event = parseEnergyEvent(message.content);
    } catch (error) {
      logger.error(`MENSAJE_INVÁLIDO tag=${tag} motivo=${reasonOf(error)}`);
      channel.nack(message, false, false);
      return;
    }

    await this.forwardService.forward(event, channel, message);
  }

  private scheduleReconnect(): void {
    if (this.shuttingDown || this.reconnecting) {
      return;
    }
    this.reconnecting = true;

    const delay = computeBackoffDelay(this.attempt, RECONNECT_BACKOFF);
    this.attempt += 1;
    logger.info(`BACKOFF intento=${this.attempt} espera=${(delay / 1000).toFixed(2)}s`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnecting = false;
      this.reconnectTimer = null;
      void this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private async close(): Promise<void> {
    try {
      await this.channel?.close();
    } catch {
      // Canal ya cerrado: se ignora.
    }
    try {
      await this.connection?.close();
    } catch {
      // Conexión ya cerrada: se ignora.
    }
    this.channel = null;
    this.connection = null;
  }
}
