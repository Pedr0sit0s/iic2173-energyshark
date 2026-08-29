/**
 * PoC Etapa 3 — Conexión a RabbitMQ (AMQPS/TLS), consumo y reconexión automática.
 *
 * Valida la viabilidad del flujo del `connector` (RNF-3): conexión al broker del
 * curso, consumo de la cola asignada con ack explícito, parsing/validación del
 * evento y reconexión con backoff exponencial ante caídas. No es el servicio
 * `connector` definitivo (eso es la Etapa 5).
 *
 * Uso:
 *   npx tsx --env-file=.env amqp-poc.ts
 *
 * En la terminal: presiona 'd' para simular un corte de red (modo caos) y
 * Ctrl+C / SIGINT / SIGTERM para un apagado limpio.
 */
import { connect, type Channel, type ChannelModel, type ConsumeMessage } from 'amqplib';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface AmqpConfig {
  url: string;
  queue: string;
}

interface BackoffOptions {
  baseMs: number;
  capMs: number;
  jitterMs: number;
}

/** Estructura mínima del evento esperado según el modelo de datos de la Etapa 2. */
interface EnergyEvent {
  idpk: string;
  type: string;
  packageBody: {
    validUntil?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Socket TCP subyacente de la conexión AMQP (uso interno de amqplib, solo modo caos). */
interface RawSocket {
  destroy(): void;
}

interface AmqpConnectionWithSocket {
  connection?: { stream?: RawSocket };
}

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const DEFAULT_BACKOFF: BackoffOptions = { baseMs: 1_000, capMs: 30_000, jitterMs: 1_000 };

// ---------------------------------------------------------------------------
// Logger estructurado (timestamp UTC ISO 8601)
// ---------------------------------------------------------------------------

function timestamp(): string {
  return new Date().toISOString();
}

const log = {
  info: (message: string): void => console.log(`[${timestamp()}] INFO  ${message}`),
  warn: (message: string): void => console.warn(`[${timestamp()}] WARN  ${message}`),
  error: (message: string): void => console.error(`[${timestamp()}] ERROR ${message}`),
};

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

function loadConfig(): AmqpConfig {
  const url = process.env.RABBITMQ_URL;
  const queue = process.env.RABBITMQ_QUEUE;

  if (!url) {
    throw new Error('Falta la variable RABBITMQ_URL (ejecutar con --env-file=.env).');
  }
  if (!queue) {
    throw new Error('Falta la variable RABBITMQ_QUEUE (ejecutar con --env-file=.env).');
  }

  return { url, queue };
}

/** Oculta la contraseña de una URL AMQP antes de mostrarla en logs. */
function formatUrl(url: string): string {
  const parsed = new URL(url);
  parsed.password = '***';
  return parsed.toString();
}

// ---------------------------------------------------------------------------
// Backoff exponencial con tope y jitter
// ---------------------------------------------------------------------------

function computeBackoffDelay(attempt: number, options: BackoffOptions): number {
  const exponential = options.baseMs * 2 ** attempt;
  const capped = Math.min(exponential, options.capMs);
  const jitter = Math.random() * options.jitterMs;
  return capped + jitter;
}

// ---------------------------------------------------------------------------
// Procesamiento de mensajes
// ---------------------------------------------------------------------------

function parseEnergyEvent(content: Buffer): EnergyEvent {
  const raw: unknown = JSON.parse(content.toString('utf8'));

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('El mensaje no es un objeto JSON válido.');
  }

  const event = raw as Partial<EnergyEvent>;

  if (typeof event.idpk !== 'string' || event.idpk.trim() === '') {
    throw new Error("Falta el campo 'idpk' o no es un string válido.");
  }
  if (typeof event.type !== 'string' || event.type.trim() === '') {
    throw new Error("Falta el campo 'type' o no es un string válido.");
  }
  if (typeof event.packageBody !== 'object' || event.packageBody === null || Array.isArray(event.packageBody)) {
    throw new Error("Falta el campo 'packageBody' o no es un objeto válido.");
  }

  return event as EnergyEvent;
}

function handleMessage(channel: Channel, message: ConsumeMessage | null): void {
  if (message === null) {
    log.warn('Consumidor cancelado por el broker.');
    return;
  }

  const deliveryTag = message.fields.deliveryTag;

  try {
    const event = parseEnergyEvent(message.content);
    const receivedAt = new Date().toISOString();
    const validUntil = event.packageBody.validUntil ?? 'Sin fecha';

    log.info(
      `EVENTO_VÁLIDO tag=${deliveryTag} type=${event.type} idpk=${event.idpk} ` +
        `receivedAt=${receivedAt} validUntil=${validUntil}`,
    );

    // Ack solo tras procesar: el mensaje se elimina de la cola (at-least-once).
    channel.ack(message);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    log.error(`MENSAJE_INVÁLIDO tag=${deliveryTag}: ${reason}`);

    // Descartar sin reencolar para no caer en un bucle infinito de reentrega.
    channel.nack(message, false, false);
  }
}

// ---------------------------------------------------------------------------
// Cliente AMQP con reconexión automática
// ---------------------------------------------------------------------------

class AmqpConsumer {
  private readonly config: AmqpConfig;
  private readonly backoff: BackoffOptions;

  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private reconnecting = false;
  private shuttingDown = false;
  private attempt = 0;

  constructor(config: AmqpConfig, backoff: BackoffOptions) {
    this.config = config;
    this.backoff = backoff;
  }

  /** Conecta, abre el canal y se suscribe a la cola. Reintenta solo ante fallos de conexión. */
  async start(): Promise<void> {
    try {
      log.info(`CONECTANDO ${formatUrl(this.config.url)}`);
      const connection = await connect(this.config.url);
      this.connection = connection;
      this.attempt = 0;
      log.info('CONEXIÓN TCP establecida.');

      connection.on('error', (error: Error) => {
        log.error(`ERROR de RabbitMQ: ${error.message}`);
        this.scheduleReconnect();
      });

      connection.on('close', () => {
        log.warn('Conexión cerrada por el broker.');
        this.scheduleReconnect();
      });

      const channel = await connection.createChannel();
      this.channel = channel;
      log.info('Canal de comunicación abierto.');

      channel.on('error', (error: Error) => {
        log.error(`ERROR de canal: ${error.message}`);
      });

      const handler = (message: ConsumeMessage | null): void => handleMessage(channel, message);
      await channel.consume(this.config.queue, handler, { noAck: false });

      log.info(`ESCUCHANDO cola=${this.config.queue}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      log.error(`FALLO al conectar: ${reason}`);
      this.scheduleReconnect();
    }
  }

  /** Modo caos: destruye el socket TCP para simular un corte de red. */
  destroySocket(): void {
    const socket = this.activeSocket();
    if (socket === null) {
      log.warn('No hay conexión activa que destruir.');
      return;
    }
    log.warn('CHAOS: destruyendo el socket TCP (simula corte de red)...');
    socket.destroy();
  }

  /** Cierra canal y conexión de forma ordenada (no programa reconexiones). */
  async shutdown(): Promise<void> {
    this.shuttingDown = true;
    log.info('Cerrando canal y conexión...');

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

  private scheduleReconnect(): void {
    if (this.shuttingDown || this.reconnecting) {
      return;
    }
    this.reconnecting = true;

    const delay = computeBackoffDelay(this.attempt, this.backoff);
    this.attempt += 1;
    log.info(`BACKOFF intento=${this.attempt} espera=${(delay / 1000).toFixed(2)}s`);

    setTimeout(() => {
      this.reconnecting = false;
      void this.start();
    }, delay);
  }

  private activeSocket(): RawSocket | null {
    const raw = this.connection as unknown as AmqpConnectionWithSocket | null;
    return raw?.connection?.stream ?? null;
  }
}

// ---------------------------------------------------------------------------
// Modo caos (teclado) y apagado limpio
// ---------------------------------------------------------------------------

function setupChaosMode(consumer: AmqpConsumer): void {
  if (!process.stdin.isTTY) {
    log.warn('stdin no es una TTY: modo caos deshabilitado.');
    return;
  }

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  log.info("MODO CAOS: presiona 'd' para simular un corte de red y 'Ctrl+C' para salir.");

  process.stdin.on('data', (key: string) => {
    if (key === 'd' || key === 'D') {
      consumer.destroySocket();
    } else if (key === '\u0003') {
      void gracefulShutdown(consumer);
    }
  });
}

async function gracefulShutdown(consumer: AmqpConsumer): Promise<void> {
  log.info('Cerrando aplicación...');
  process.stdin.setRawMode(false);
  await consumer.shutdown();
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Punto de entrada
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const config = loadConfig();
  const consumer = new AmqpConsumer(config, DEFAULT_BACKOFF);

  process.on('SIGINT', () => void gracefulShutdown(consumer));
  process.on('SIGTERM', () => void gracefulShutdown(consumer));
  process.on('unhandledRejection', (reason: unknown) => {
    log.error(`Rechazo de promesa no manejado: ${reason}`);
  });

  await consumer.start();
  setupChaosMode(consumer);
}

void main().catch((error: unknown) => {
  const reason = error instanceof Error ? error.message : String(error);
  log.error(`Error fatal: ${reason}`);
  process.exit(1);
});
