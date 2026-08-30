# Registro de IA — 2026-08-29 — Etapa 5: ejecución (connector standalone) y cierre

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-29 (novena sesión de trabajo)
- **Contexto:** El usuario solicitó ejecutar la Etapa 5 del Plan Maestro (`connector` NestJS standalone local): prerrequisitos, scaffold, configuración con validación, backoff, módulo AMQP con reconexión, reenvío HTTP con ack/nack, logging estructurado e integración end-to-end, dejando el código `.ts` lo más profesional posible.

## Prompt (resumen fiel)

"Realiza todo esto con un código perfecto en ts: Pasos 0–7 de la Etapa 5 (prerrequisitos, scaffold NestJS standalone, config con validación, backoff, módulo AMQP, ForwardService, logging, integración local end-to-end) y verificar CP-L5."

## Resumen de la respuesta

- **Scaffold manual** (sin `nest new`) en `apps/connector`, conservando `poc/`: `package.json`, `tsconfig*`, `nest-cli.json`, `.prettierrc`, `oxlint.json`, `jest.config.ts`, `.gitignore`, `.env.example`. Toolchain: @nestjs/cli 12 + TS 6 (requisito de @nestjs/schematics 12) + **jest 30 + ts-jest 29.4.12** (compatible, `npm test` 4/4), a diferencia de `master` donde jest quedó roto.
- **`src/main.ts`**: `NestFactory.createApplicationContext(AppModule, { logger: false })`, manejo de SIGINT/SIGTERM con cierre ordenado y `process.exit(0)`.
- **`src/config/env.validation.ts`**: `RABBITMQ_URL` (`IsUrl` amqps/amqp), `RABBITMQ_QUEUE`, `MASTER_URL` (`IsUrl`), `REQUEST_TIMEOUT_MS` (default 5000) y `MAX_FORWARD_RETRIES` (default 5).
- **`src/amqp/backoff.ts`** + `backoff.spec.ts` (test unitario).
- **`src/amqp/amqp.service.ts`**: `OnApplicationBootstrap`/`OnApplicationShutdown`, `prefetch(1)`, reconexión con backoff (timer cancelable), apagado limpio, `destroySocket()` (modo caos para pruebas manuales).
- **`src/forward/forward.service.ts`**: `fetch` + `AbortSignal.timeout`, 2xx→ack, 4xx→nack, 5xx/timeout/red→reintentos (tope 5)→nack.
- **`src/common/logger.ts`**: timestamp UTC, niveles, contexto por evento, sin emojis.
- **Verificación**: end-to-end real (400+ eventos del curso → master → DB, 437 registros), y pruebas controladas con un **RabbitMQ local en Docker** (retry con recuperación, reconexión tras corte de red, NACK 4xx, apagado ordenado).
- **Cierre**: bitácora (Entrada 12), registro de IA (este archivo), `etapas/README.md`, matriz de trazabilidad (RNF-1, RNF-2, RNF-3 → Verificado localmente) y commit.

## Uso dado

- **Adoptado:** toda la implementación de la Etapa 5 tal como se describió (código en `apps/connector/src`).
- **Adoptado:** jest 30 + ts-jest 29.4.12 para tener tests funcionales (decisión que `master` aún no toma).
- **Descartado:** `nest new` como método de scaffold (se prefirió scaffold manual consistente con `master` y sin `platform-express`).
- **Pendiente de usuario:** ejecutar el connector en producción/despliegue (Etapas 6–8).

## Archivos afectados

- `apps/connector/package.json`, `tsconfig.json`, `tsconfig.build.json`, `nest-cli.json`, `.prettierrc`, `oxlint.json`, `.gitignore`, `.env.example`, `jest.config.ts` (creados)
- `apps/connector/src/main.ts`, `app.module.ts` (creados)
- `apps/connector/src/config/env.validation.ts` (creado)
- `apps/connector/src/common/logger.ts` (creado)
- `apps/connector/src/amqp/backoff.ts`, `backoff.spec.ts`, `energy-event.ts`, `amqp.service.ts`, `amqp.module.ts` (creados)
- `apps/connector/src/forward/forward.service.ts`, `forward.module.ts` (creados)
- `docs/bitacora.md` (Entrada 12 + índice)
- `ai_docs/prompts/2026-08-29-etapa-05-connector-local.md` (este archivo)
- `ai_docs/README.md` (índice de registros)
- `etapas/README.md` y `etapas/etapa-00-plan-maestro.md` (estados)
- `etapas/etapa-05-connector-local.md` (estado del encabezado)
