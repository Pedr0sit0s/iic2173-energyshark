# EnergyShark — Connector

Servicio `connector` de EnergyShark (Entrega 0 · IIC2173): consumidor AMQP (app NestJS standalone, sin servidor HTTP) que lee los eventos de la cola asignada y los reenvía a `POST /events` del `master`.

## Comportamiento

- Se conecta al broker del curso por **AMQPS/TLS** (`amqps://observer.45:<pass>@broker.iic2173.org:5671/energy`) y consume la cola `observer.45.q` con `prefetch(1)` y `noAck: false`.
- Reenvía cada evento a `POST {MASTER_URL}/events` con el JSON **tal cual** (contrato connector → master) y un timeout configurable.
- **Ack solo tras 2xx**. Ante `4xx` descarta con `nack(requeue:false)`; ante `5xx`/timeout/error de red reintenta con backoff exponencial (tope configurable) y, si se agota, descarta con log.
- **Reconexión automática** ante caídas del broker con backoff exponencial + jitter (reintentos infinitos, RNF-3).
- **Apagado ordenado** con `SIGINT`/`SIGTERM` (cierra canal y conexión sin reconectar).

## Configuración

Variables de entorno (ver `.env.example` en esta carpeta): `NODE_ENV`, `RABBITMQ_URL`, `RABBITMQ_QUEUE`, `MASTER_URL`, `REQUEST_TIMEOUT_MS` (default 5000) y `MAX_FORWARD_RETRIES` (default 5). El `.env` real no se versiona.

## Scripts

```bash
npm install        # instalar dependencias
npm run build      # compilar
npm run typecheck  # tsc --noEmit
npm run start      # arrancar (desarrollo)
npm run start:prod # arrancar compilado
npm run test       # tests unitarios (backoff)
```

## Arquitectura

- `src/amqp/`: conexión AMQP, consumo y reconexión (`AmqpService`), parsing/validación del evento (`energy-event.ts`) y backoff (`backoff.ts`, con test unitario).
- `src/forward/`: reenvío HTTP a `master` con reintentos y ack/nack (`ForwardService`).
- `src/common/logger.ts`: logging estructurado con timestamp UTC.
- `src/config/env.validation.ts`: validación fail-fast de las variables de entorno.

> `src/../poc/` contiene el PoC de la Etapa 3 (referencia histórica), independiente del servicio.
