# Registro de IA — 2026-08-29 — Etapa 6: ejecución (Docker) y cierre

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-29 (décima sesión de trabajo)
- **Contexto:** El usuario solicitó ejecutar la Etapa 6 del Plan Maestro (dockerización y Docker Compose): Dockerfiles de `master` y `connector`, `compose.yaml`, HEALTHCHECK por contenedor y pruebas con Compose, dejando el código `.ts` y la infraestructura lo más profesional posible.

## Prompt (resumen fiel)

"Realiza todo esto con el código más profesional posible: Pasos 0–6 de la Etapa 6 (Dockerfiles, Docker Compose, HEALTHCHECKs, pruebas con Compose y resiliencia en contenedores)."

## Resumen de la respuesta

- **Dockerfiles multi-stage** (`node:24-alpine`) de `master` y `connector` + `.dockerignore` (excluye `node_modules`, `dist`, `.env` y, en connector, `poc/`).
- **`migration:run:prod`** en `master` (`typeorm migration:run -d dist/data-source.js`) para correr migraciones en runtime sin `ts-node`.
- **`compose.yaml`** con `postgres` + `master` + `connector`, red interna, volumen `energy_pgdata`, `depends_on` `service_healthy` y `restart: unless-stopped`.
- **HEALTHCHECKs**: `pg_isready` (postgres), `node -e fetch /health` (master) y **heartbeat** en `AmqpService` (escribe `/tmp/connector-heartbeat` cada 5 s; arranque/limpieza con lifecycle hooks) + `stat -c %Y` (connector).
- **`main.ts` de master** ya leía `PORT` de `ConfigService` (confirmado, sin cambios).
- **Verificación con Compose**: los tres contenedores `healthy`, migraciones automáticas, `GET /health` 200, `GET /history` con 97 eventos reales, y pruebas de resiliencia (restart de `master` y `connector`, caída/recuperación de `postgres`) — todo se recuperó solo.
- **Cierre**: bitácora (Entrada 14), registro de IA (este archivo), `etapas/README.md`, matriz de trazabilidad (RNF-5, RNF-6 → Verificado localmente) y commit.

## Uso dado

- **Adoptado:** toda la implementación de la Etapa 6 tal como se describió.
- **Corregido durante la ejecución:** en Dockerfile, `HEALTHCHECK` no acepta `CMD-SHELL` (sintaxis de Compose) y `$$` no se escapa a `$`: se usó la forma shell de Docker con `$` simple (en Compose sí se usa `$$`).
- **Restauración del entorno:** se detuvieron `master` local y PostgreSQL de Homebrew (puertos 3000/5432) durante las pruebas y se restauraron al final; el contenedor `energy-postgres` (5433) quedó intacto.
- **Pendiente de usuario:** producción/despliegue (Etapas 7–8) y Compose de producción con RDS.

## Archivos afectados

- `apps/master/Dockerfile`, `apps/master/.dockerignore` (creados)
- `apps/master/package.json` (script `migration:run:prod`)
- `apps/connector/Dockerfile`, `apps/connector/.dockerignore` (creados)
- `apps/connector/src/amqp/amqp.service.ts` (heartbeat)
- `compose.yaml` (creado)
- `docs/bitacora.md` (Entrada 14 + índice)
- `ai_docs/prompts/2026-08-29-etapa-06-docker-ejecucion-cierre.md` (este archivo)
- `ai_docs/README.md` (índice de registros)
- `etapas/README.md` y `etapas/etapa-00-plan-maestro.md` (estados)
- `etapas/etapa-06-docker-compose.md` (estado del encabezado)
