# Bitácora Técnica — EnergyShark (IIC2173 · Entrega 0)

> Registro cronológico del proyecto: decisiones, problemas, soluciones, comandos importantes y resultados de pruebas.
> **Regla:** los secretos (contraseñas, access keys, archivos `.pem`) NUNCA se registran aquí.

## Plantilla de entrada

```markdown
## Entrada N — Título

- **Fecha:**
- **Objetivo:**
- **Decisiones técnicas:**
- **Problemas encontrados y solución:**
- **Comandos importantes:**
- **Resultado de pruebas:**
- **Registro de IA:** (archivos en `ai_docs/prompts/` relacionados)
- **Estado:** En progreso / Verificado localmente / Verificado en producción / Completado
```

## Índice de entradas

| # | Fecha | Título |
| --- | --- | --- |
| 1 | 2026-08-23 | Planificación del proyecto y Plan Maestro |
| 2 | 2026-08-23 | Definición de la estructura de documentación (`etapas/`) |
| 3 | 2026-08-23 | Etapa 1 — Preparación del entorno local (ejecución) |
| 4 | 2026-08-23 | Cierre documental de la Etapa 1 |
| 5 | 2026-08-23 | Etapa 2 — Diseño de arquitectura (desarrollo del documento) |
| 6 | 2026-08-26 | Cierre de la Etapa 2 |
| 7 | 2026-08-26 | Etapa 3 — PoC RabbitMQ (planificación e inicio) |
| 8 | 2026-08-29 | Etapa 3 — PoC RabbitMQ (ejecución, refactor y cierre) |
| 9 | 2026-08-29 | Etapa 4 — Servicio `master` local (planificación e inicio) |
| 10 | 2026-08-29 | Etapa 4 — Servicio `master` local (ejecución y cierre) |
| 11 | 2026-08-29 | Etapa 5 — Servicio `connector` local (planificación e inicio) |
| 12 | 2026-08-29 | Etapa 5 — Servicio `connector` local (ejecución y cierre) |
| 13 | 2026-08-29 | Etapa 6 — Dockerización y Docker Compose (planificación e inicio) |
| 14 | 2026-08-29 | Etapa 6 — Dockerización y Docker Compose (ejecución y cierre) |
| 15 | 2026-08-30 | Etapa 7 — Infraestructura AWS: EC2 + RDS (planificación e inicio) |
| 16 | 2026-08-30 | Etapa 7 — Infraestructura AWS: EC2 + RDS (ejecución y cierre) |
| 17 | 2026-08-30 | Etapa 8 — Primer despliegue en producción (planificación e inicio) |
| 18 | 2026-08-30 | Etapa 8 — Primer despliegue en producción (ejecución y cierre) |
| 19 | 2026-08-30 | Etapa 9 — Dominio y DNS (planificación e inicio) |
| 20 | 2026-08-30 | Etapa 9 — Dominio y DNS (ejecución y cierre) |
| 21 | 2026-08-30 | Etapa 10 — Nginx reverse proxy (planificación e inicio) |
| 22 | 2026-08-30 | Etapa 10 — Nginx reverse proxy (ejecución y cierre) |

---

## Entrada 1 — Planificación del proyecto y Plan Maestro

- **Fecha:** 2026-08-23
- **Objetivo:** Definir el Plan Maestro de desarrollo completo (roadmap, etapas, trazabilidad de requisitos y checkpoints).
- **Decisiones técnicas:**
  - Roadmap incremental con 16 etapas (0 a 15), desde preparación del entorno hasta entrega final.
  - Checkpoints `[L]` (local) y `[P]` (producción): una funcionalidad solo se considera terminada cuando se verifica en su entorno real.
  - Parte variable elegida: **HTTPS con Let's Encrypt** (con sección opcional separada de balanceo de carga con Nginx).
  - Estrategia de secretos: `.env` locales fuera del repo, `.gitignore` estricto, `.pem` jamás versionado.
- **Problemas encontrados y solución:** El PDF del enunciado no pudo ser leído por la herramienta de IA; el plan se basó en los requisitos entregados por contexto. Pendiente: contrastar con el PDF.
- **Comandos importantes:** `mkdir -p etapas ai_docs/prompts docs apps/connector apps/master infra/nginx`
- **Resultado de pruebas:** Documentos `etapas/etapa-00-plan-maestro.md` y `etapas/README.md` generados y revisados.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-plan-maestro.md`
- **Estado:** Completado

---

## Entrada 2 — Definición de la estructura de documentación (`etapas/`)

- **Fecha:** 2026-08-23
- **Objetivo:** Fijar la organización física de la documentación: una etapa principal = un archivo `.md` dentro de `etapas/`, con índice general en `etapas/README.md` y desarrollo progresivo etapa a etapa.
- **Decisiones técnicas:**
  - Numeración secuencial descriptiva: `etapa-00-plan-maestro.md`, `etapa-01-preparacion-entorno.md`, ..., `etapa-15-entrega-final.md`.
  - Estados por etapa: Pendiente / En progreso / Verificado localmente / Verificado en producción / Completado.
  - El Plan Maestro (`etapa-00`) contiene roadmap, dependencias, matriz de trazabilidad y checkpoints, pero no desarrolla etapas.
- **Problemas encontrados y solución:** Reorganización del contenido ya generado hacia la nueva estructura. El diseño de arquitectura (desarrollado inicialmente como "Etapa 1") quedó asignado a `etapa-02-diseno-arquitectura.md`, pendiente de persistir.
- **Comandos importantes:** ninguno relevante.
- **Resultado de pruebas:** Estructura `etapas/` verificada en el repositorio.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-plan-maestro.md`
- **Estado:** Completado

---

## Entrada 3 — Etapa 1 — Preparación del entorno local (ejecución)

- **Fecha:** 2026-08-23
- **Objetivo:** Instalar y verificar herramientas, preparar cuentas y crear la estructura del repositorio (checkpoint CP-L1).
- **Decisiones técnicas:** Las registradas en `etapas/etapa-01-preparacion-entorno.md` (sección 5).

### Versiones instaladas

| Herramienta | Versión registrada | Estado |
| --- | --- | --- |
| psql | 17.11 (Homebrew) | Verificado |
| AWS CLI | 2.36.29 | Verificado |
| jq | 1.7.1 | Verificado |
| curl | 8.7.1 | Verificado |
| git | — | Pendiente de registrar |
| Node.js | — | Pendiente de registrar |
| npm | — | Pendiente de registrar |
| Docker | — | Pendiente de registrar |
| Docker Compose | — | Pendiente de registrar |

> Completar con: `git --version; node -v; npm -v; docker --version; docker compose version`

### Cuentas

- **GitHub:** repositorio `https://github.com/Pedr0sit0s/iic2173-energyshark.git` (remoto `origin` configurado en rama `main`).
- **AWS:** pendiente de registrar en bitácora (usuario IAM `energyshark-deploy`, región `us-east-1`, MFA en root).
- **Dominio:** `persito.online` (Namecheap). cPanel del hosting disponible en `server352.web-hosting.com`.

### RabbitMQ (infraestructura del curso)

| Dato | Valor |
| --- | --- |
| Host | `broker.iic2173.org` |
| Puerto | `5671` |
| Transporte | AMQPS (TLS) |
| Virtual host | `energy` |
| Usuario | `observer.45` |
| Exchange | `fulfillment.x` |
| Cola asignada al observer | `observer.45.q` (confirmada en la Entrada 8) |
| Contraseña | Solo en `.env` local — nunca documentada |

URL de conexión prevista: `amqps://observer.45:<password>@broker.iic2173.org:5671/energy`

### Problemas encontrados y solución

- En el registro manual de versiones se ejecutó `q --version` por error; el comando correcto es `jq --version` (jq 1.7.1 verificado).
- La bitácora quedó inicialmente con salida de terminal cruda; se reorganizó en entradas estructuradas (Entrada 4).

### Comandos importantes

```bash
git remote add origin https://github.com/Pedr0sit0s/iic2173-energyshark.git
git branch -M main
```

- **Resultado de pruebas:** Herramientas principales verificadas; pendiente completar la tabla de versiones.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-etapa-01-preparacion-entorno.md`
- **Estado:** En progreso (pendiente: versiones faltantes, confirmar cola AMQP, primer commit y push)

---

## Entrada 4 — Cierre documental de la Etapa 1

- **Fecha:** 2026-08-23
- **Objetivo:** Dejar el "papeleo" de la Etapa 1 terminado: README principal completo, bitácora reorganizada y registro de uso de IA iniciado.
- **Decisiones técnicas:**
  - README raíz con arquitectura, stack, estructura del repo, reglas de seguridad y estado del proyecto.
  - Bitácora reorganizada en entradas numeradas con plantilla fija.
  - `ai_docs/` con índice (`README.md`) y un archivo por interacción relevante de IA.
  - Se agregaron `.gitkeep` en `apps/connector`, `apps/master` e `infra/nginx` para que la estructura quede visible en el repositorio.
- **Problemas encontrados y solución:** Sin problemas relevantes.
- **Comandos importantes:** pendientes del usuario (primer commit y push).
- **Resultado de pruebas:** Documentos generados y revisados; estructura completa.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-papeleo-final-etapa-01.md`
- **Estado:** Completado

---

## Entrada 5 — Etapa 2 — Diseño de arquitectura (desarrollo del documento)

- **Fecha:** 2026-08-23
- **Objetivo:** Persistir el diseño de arquitectura completo en `etapas/etapa-02-diseno-arquitectura.md` como documento canónico del proyecto.
- **Decisiones técnicas:**
  - Monorepo (`apps/connector`, `apps/master`, `infra/nginx`).
  - `connector` como app NestJS standalone (sin servidor HTTP).
  - Cliente RabbitMQ: **amqplib** (control total de reconexión + soporte TLS).
  - Conexión al broker con **AMQPS/TLS** (`amqps://observer.45@broker.iic2173.org:5671/energy`), requerida por el curso.
  - ORM: TypeORM. Modelo híbrido: columnas (`id`, `idpk`, `type`, `receivedAt`, `validUntil`, `createdAt`) + `packageBody` JSONB.
  - Paginación con `LIMIT/OFFSET` (`page`/`limit`, default 25).
  - `receivedAt` asignado por `master` (no por `connector`).
  - Región AWS `us-east-1`; PostgreSQL de desarrollo en contenedor Docker.
- **Problemas encontrados y solución:**
  - El broker del curso usa TLS en puerto 5671: se incorporó la decisión técnica #10 y se ajustó la URL de conexión a `amqps://`.
  - La cola AMQP asignada sigue pendiente de confirmación: quedó marcada como prerrequisito de la Etapa 3.
- **Comandos importantes:** `git add etapas/etapa-02-diseno-arquitectura.md && git commit -m "docs: etapa 2 diseno de arquitectura"`
- **Resultado de pruebas:** Documento generado con teoría, diagramas, modelo de datos, API, contrato connector→master y configuración por entorno. Pendiente: validación contra el enunciado oficial.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-etapa-02-diseno-arquitectura.md`
- **Estado:** En progreso (pendiente: validar contra enunciado, confirmar cola AMQP, checklist de la sección 13)

---

## Entrada 6 — Cierre de la Etapa 2

- **Fecha:** 2026-08-26
- **Objetivo:** Cerrar la Etapa 2 (diseño de arquitectura) al 100% y dejarla como referencia canónica para las Etapas 3–6.
- **Decisiones técnicas:**
  - El documento `etapas/etapa-02-diseno-arquitectura.md` queda aprobado como diseño canónico del proyecto (10 decisiones técnicas, modelo de datos híbrido, API, contrato connector→master y configuración por entorno).
  - Checklist de finalización de la etapa completada (sección 13), con una excepción: la confirmación del nombre de la cola AMQP se traspasa a la Etapa 3 como **Paso 0**.
- **Problemas encontrados y solución:**
  - Pérdida del historial de la sesión anterior: el estado del proyecto se reconstruyó íntegramente desde los archivos del repositorio.
  - La cola AMQP asignada sigue sin confirmar: no bloquea el cierre documental; queda como prerrequisito explícito de la Etapa 3.
- **Comandos importantes:** ninguno nuevo en esta entrada.
- **Resultado de pruebas:** Estado de la Etapa 2 actualizado a **Completado** en `etapas/README.md`; matriz de trazabilidad del plan maestro actualizada (RF4 y RNF-2 → En progreso).
- **Registro de IA:** `ai_docs/prompts/2026-08-26-etapa-03-poc-rabbitmq.md` (el cierre se documenta en la sesión de inicio de la Etapa 3).
- **Estado:** Completado

---

## Entrada 7 — Etapa 3 — PoC RabbitMQ (planificación e inicio)

- **Fecha:** 2026-08-26
- **Objetivo:** Iniciar la Etapa 3 según el Plan Maestro: generar el plan detallado `etapas/etapa-03-poc-rabbitmq.md` y dejar lista la hoja de ruta para ejecutar el PoC de conexión a RabbitMQ (checkpoint CP-L3).
- **Decisiones técnicas:**
  - PoC ubicado en `apps/connector/poc/` (será la base del `connector` real de la Etapa 5, sin ensuciar la raíz del repo).
  - Stack mínimo del PoC: TypeScript + `amqplib` + `tsx` (sin NestJS todavía: la app standalone llega en la Etapa 5).
  - Consumo con ack explícito (`noAck: false`); mensaje malformado → `nack(requeue: false)` + log, para no caer en bucles de reentrega.
  - Reconexión automática con backoff exponencial; el proceso nunca termina por caída del broker (RNF-3).
  - Simulación de caída del broker destruyendo el socket subyacente de la conexión AMQP.
- **Problemas encontrados y solución:**
  - Cola AMQP pendiente de confirmación: se incorporó como Paso 0 (prerrequisito) del plan; el resto del plan puede avanzarse (script, parsing y simulación de caída).
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-03-poc-rabbitmq.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones (objetivo, teoría, decisiones, pasos, verificación, troubleshooting y checklist); aún sin ejecutar las sub-etapas 3.1–3.3.
- **Registro de IA:** `ai_docs/prompts/2026-08-26-etapa-03-poc-rabbitmq.md`
- **Estado:** En progreso (pendiente: Paso 0 — confirmar cola AMQP; sub-etapas 3.1–3.3; checkpoint CP-L3)

---

## Entrada 8 — Etapa 3 — PoC RabbitMQ (ejecución, refactor y cierre)

- **Fecha:** 2026-08-29
- **Objetivo:** Ejecutar el PoC de conexión a RabbitMQ (sub-etapas 3.1–3.3), confirmar la cola asignada al observer y alcanzar el checkpoint CP-L3.
- **Decisiones técnicas:**
  - Cola AMQP asignada confirmada: **`observer.45.q`** (registrada aquí, en `etapas/etapa-03-poc-rabbitmq.md` y en `.env.example`).
  - Refactor de `apps/connector/poc/amqp-poc.ts`: tipado estricto, logging estructurado con timestamp UTC, backoff exponencial aislado en función pura, clase `AmqpConsumer` con ciclo de vida, modo caos por teclado y apagado limpio (SIGINT/SIGTERM/Ctrl+C).
  - Se agregó `tsconfig.json` (modo estricto) y el script `npm run typecheck` (`tsc --noEmit`) para validar el tipado.
- **Problemas encontrados y solución:**
  - `tsx` no arrancaba en el entorno: esbuild tenía el binario de plataforma incorrecta (arm64 en un Mac x64) porque npm tenía bloqueado el script de instalación. Solución: `npm approve-scripts --all && npm rebuild esbuild`.
  - El socket TCP para la simulación de caída se destruye vía `connection.connection.stream.destroy()`: es un acceso interno de amqplib, por lo que quedó tipado con un cast explícito y documentado como uso exclusivo del modo caos.
- **Comandos importantes:**
  ```bash
  cd apps/connector/poc
  npm install amqplib
  npm install -D tsx typescript @types/node
  npm run typecheck
  npm start   # npx tsx --env-file=.env amqp-poc.ts
  ```
- **Resultado de pruebas:**
  - Conexión AMQPS/TLS establecida correctamente (heartbeat 5 s) contra `broker.iic2173.org:5671`.
  - Consumo real: 3 eventos `demand-set` recibidos, parseados y validados (ack correcto) en la primera ejecución; estructura confirmada: `idpk` (uuid), `type`, `packageBody.validUntil`.
  - Prueba de caos: 3 ciclos de destrucción del socket → detección de caída (Heartbeat timeout) → backoff exponencial (~1 s) → reconexión → re-suscripción, sin intervención manual. El proceso nunca terminó por caída del broker (**RNF-3 verificado en local**).
  - `npm run typecheck` sin errores; el guard de configuración falla de forma controlada si faltan variables de entorno.
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-03-refactor-y-cierre.md`
- **Estado:** Verificado localmente (checkpoint CP-L3 alcanzado)

---

## Entrada 9 — Etapa 4 — Servicio `master` local (planificación e inicio)

- **Fecha:** 2026-08-29
- **Objetivo:** Iniciar la Etapa 4 según el Plan Maestro: generar el plan detallado `etapas/etapa-04-master-api-local.md` y dejar lista la hoja de ruta para construir el servicio `master` en local (checkpoint CP-L4, RF1–RF4).
- **Decisiones técnicas:**
  - Scaffold NestJS en `apps/master` con `@nestjs/cli` (`--skip-git`, el monorepo ya es el repo).
  - ORM TypeORM con **migraciones desde el inicio** (DataSource para CLI); `synchronize` nunca en producción.
  - `id` propio generado en app (`crypto.randomUUID()`/`@PrimaryGeneratedColumn('uuid')`); `receivedAt` asignado por `master` en UTC.
  - `ValidationPipe` global con `class-validator` para errores 400 automáticos; QueryBuilder para filtros dinámicos (RF4).
  - PostgreSQL de desarrollo en contenedor `postgres:16` con volumen (`energy_postgres`).
  - Filtro `city` sobre `packageBody` JSONB (operador `->>`); duplicados por `idpk` se toleran en esta etapa (at-least-once).
  - `GET /health` con chequeo real de DB (`SELECT 1`), preparando RNF-5 y la Etapa 6.
- **Problemas encontrados y solución:** Sin problemas en esta iteración (solo planificación documental; la ejecución de la etapa queda pendiente).
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-04-master-api-local.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; la estructura real del evento de la Etapa 3 (`idpk`, `type`, `packageBody.validUntil`) se incorporó al DTO y a los casos de prueba.
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-04-master-local.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 4.1–4.6; checkpoint CP-L4)

---

## Entrada 10 — Etapa 4 — Servicio `master` local (ejecución y cierre)

- **Fecha:** 2026-08-29
- **Objetivo:** Ejecutar las sub-etapas 4.3–4.6 de la Etapa 4: persistencia (`history`), `POST /events`, endpoints de consulta y `GET /health`, alcanzando el checkpoint CP-L4 (RF1–RF4 verificados localmente). Elevar la calidad del código de configuración, entidad y módulos a un estándar profesional.
- **Decisiones técnicas:**
  - **Configuración profesional**: variables de entorno validadas en arranque (`src/config/env.validation.ts`, `class-validator` + `validateSync`, conversión de `PORT`/`DB_PORT` a `number`, fail-fast con mensajes claros); `.env` resuelto desde `__dirname` (raíz del repo) en `ConfigModule` y en el DataSource de CLI; `ssl` configurable para RDS y `retryAttempts`/`retryDelay` en la conexión.
  - **Entidad `History`**: `packageBody` tipado como `Record<string, unknown>` (ya no `any`), índices con nombre explícito (`IDX_history_type/received_at/valid_until`), comentarios de columna en el esquema.
  - **Módulos por feature**: `HistoryModule` (controller + service + repository) y `HealthModule`, eliminando `forFeature` del `AppModule`.
  - **Validación estricta**: `@IsUUID()` de `validator.js` 13.15 valida también los *variant bits* de RFC 4122; `ParseUUIDPipe` en `:id`; `page`/`limit` con default 25 y tope 100.
  - **Filtro `city`** sobre `packageBody` JSONB con quoting explícito de la columna (`"h"."packageBody"->>'city'`), porque TypeORM 1.x no re-escribe la expresión JSONB y PostgreSQL dobla a minúsculas los identificadores sin comillas.
- **Problemas encontrados y solución:**
  - **Glob de migraciones roto** (`*.{.ts,.js}` → no matcheaba ningún archivo): corregido a `*{.ts,.js}`; `migration:run` decía "No migrations are pending" con la tabla vacía.
  - **`envFilePath` y `dotenv` apuntaban a `apps/`** en vez de la raíz del repo: corregido con `join(__dirname, '..', '..', '..', '.env')`.
  - **Migración duplicada** (`InitHistory` con dos timestamps): eliminado el archivo más antiguo (`1788050673050`), se conservó el vigente.
  - **500 en el filtro `city`**: TypeORM dejaba `h.packageBody->>'city'` sin comillas → columna `packagebody` no existe; fix con `"h"."packageBody"->>'city'`.
  - **UUIDs de prueba rechazados** por `validator.js` (variant bits RFC 4122): los eventos de prueba se generaron con `crypto.randomUUID()` (el evento real del curso `2a68a81d-...` pasó sin problema).
  - **Revisión post-entrega (2026-08-29)**: `main.ts` escuchaba en un puerto hardcodeado (3000) ignorando `PORT`; se corrigió para leerlo de la configuración y se quitó el emoji del log. La migración `InitHistory` usaba `uuid_generate_v4()` sin garantizar la extensión → se agregó `CREATE EXTENSION IF NOT EXISTS "pgcrypto"` para que la tabla no dependa de una extensión preinstalada. Se removieron residuos del scaffold en `package.json` (`@nestjs/observe`, `@nestjs/mau`, script `deploy`), se declaró `dotenv` explícitamente, se agregaron los scripts `migration:generate/run/revert`, se reemplazó el README por defecto por uno propio del servicio y se eliminó `apps/master/.gitkeep`.
  - **Lint y tests**: `oxlint` queda funcional (sin errores en `npm run lint`). `jest` sigue pendiente: los paquetes de NestJS 12 (`@nestjs/common`, `@nestjs/testing`) son ESM-only y `jest-runtime` no puede `require()`los desde tests CJS, aunque la app corre porque Node 24 resuelve `require(esm)` nativamente. La corrección de tests (modo ESM de jest o transpilación de `@nestjs/*`) queda diferida y no bloquea la etapa.
- **Comandos importantes:**
  ```bash
  npx typeorm-ts-node-commonjs migration:generate src/migrations/InitHistory -d src/data-source.ts
  npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts
  npm run build && npm run start:prod
  curl -X POST http://localhost:3000/events -H 'Content-Type: application/json' -d '{...}'
  curl "http://localhost:3000/history?page=2&limit=2&type=demand-set&city=Santiago"
  ```
- **Resultado de pruebas:** evidencia completa en `/tmp/etapa4-pruebas.txt` (12 pruebas T1–T12):

  | # | Prueba | Resultado |
  | --- | --- | --- |
  | T1 | `POST /events` (evento real Etapa 3) | 201 + registro con `id` propio y `receivedAt` UTC |
  | T2 | `POST /events` sin `idpk` | 400 (validation) |
  | T3 | `GET /health` | 200 `{ status: 'ok', db: 'up' }` (SELECT 1) |
  | T4 | `GET /history` | 200 `{ items, meta }`, default 25, ordenado por `receivedAt` DESC |
  | T5 | `GET /history?page=2&limit=2` | Segundo bloque de 2; `meta: { total: 6, totalPages: 3 }` |
  | T6 | `GET /history?type=demand-set` | Solo eventos `demand-set` |
  | T7 | `GET /history?city=Santiago` | Filtro JSONB: solo eventos con `packageBody.city = Santiago` |
  | T8 | `GET /history?receivedAtFrom=...&receivedAtTo=...` | Solo eventos en el rango |
  | T9 | `GET /history/:id` | 200 con el detalle completo |
  | T10 | `GET /history/:id` inexistente | 404 |
  | T11 | `GET /history?limit=999` | 400 (tope 100) |
  | T12 | `GET /history/abc` | 400 (UUID inválido) |

  - **RF1** (lista) ✓ · **RF2** (detalle + 404) ✓ · **RF3** (paginación) ✓ · **RF4** (filtros) ✓ · **RNF-4** (master sin RabbitMQ) ✓ · **RNF-5 parcial** (`/health`) ✓.
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-04-ejecucion-cierre.md`
- **Estado:** Verificado localmente (checkpoint CP-L4 alcanzado)

---

## Entrada 11 — Etapa 5 — Servicio `connector` local (planificación e inicio)

- **Fecha:** 2026-08-29
- **Objetivo:** Iniciar la Etapa 5 según el Plan Maestro: generar el plan detallado `etapas/etapa-05-connector-local.md` y dejar lista la hoja de ruta para construir el `connector` como app NestJS standalone y cerrar el flujo end-to-end local (checkpoint CP-L5).
- **Decisiones técnicas:**
  - App **NestJS standalone** (`createApplicationContext`, sin servidor HTTP) en `apps/connector`, conservando la carpeta `poc/` de la Etapa 3 como referencia.
  - Cliente AMQP: **`amqplib`** con `prefetch(1)`, consumo de `observer.45.q` y reconexión con backoff exponencial + jitter (función pura `computeBackoffDelay`).
  - Reenvío HTTP con **`fetch` nativo** + `AbortSignal.timeout` (5–10 s); **ack solo tras 2xx**. 4xx → `nack(requeue:false)`; 5xx/timeout/red → reintento con tope (ej. 5) → `nack(requeue:false)`.
  - `ConfigModule` con validación fail-fast (`RABBITMQ_URL`, `RABBITMQ_QUEUE`, `MASTER_URL`, `REQUEST_TIMEOUT_MS`); lifecycle hooks `OnApplicationBootstrap`/`OnApplicationShutdown`.
  - Logging estructurado con timestamp UTC y contexto por evento (patrón del PoC refactorizado).
- **Problemas encontrados y solución:** El scaffold de Nest CLI pisaría `apps/connector/poc`; se resolverá generando el scaffold en una carpeta temporal y moviendo el contenido a `apps/connector`. Sin otros problemas en esta iteración (solo planificación documental).
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-05-connector-local.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron los aprendizajes de las Etapas 2–4 (contrato connector→master, cola confirmada `observer.45.q`, patrón de backoff del PoC).
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-05-connector-local.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 5.1–5.5; checkpoint CP-L5)

---

## Entrada 12 — Etapa 5 — Servicio `connector` local (ejecución y cierre)

- **Fecha:** 2026-08-29
- **Objetivo:** Ejecutar las sub-etapas 5.1–5.5 de la Etapa 5: app NestJS standalone en `apps/connector`, consumidor AMQP robusto, reenvío HTTP con ack/nack y logging estructurado, cerrando el flujo end-to-end local RabbitMQ → connector → master → DB (checkpoint CP-L5, RNF-2/RNF-3).
- **Decisiones técnicas:**
  - **App NestJS standalone** (`NestFactory.createApplicationContext`, `logger: false` para no mezclar el logger de Nest con el estructurado propio) en `apps/connector`, conservando `poc/`. Scaffold escrito a mano (sin `nest new`): toolchain idéntico al de `master` (@nestjs/cli 12, TS 6) + **jest 30 + ts-jest 29.4.12** (par compatible, a diferencia de `master` donde quedó roto) → `npm test` funciona (4/4).
  - **`ConfigModule` con validación** fail-fast (`src/config/env.validation.ts`): `RABBITMQ_URL` validada con `IsUrl` (protocolos `amqps`/`amqp`), `MASTER_URL` con `IsUrl`, `REQUEST_TIMEOUT_MS` (default 5000) y `MAX_FORWARD_RETRIES` (default 5) con `IsInt` + rango. Carga `.env` raíz y `apps/connector/.env` (si existe), con `envFilePath` absoluto desde `__dirname`.
  - **Backoff centralizado** en `src/amqp/backoff.ts` (función pura `computeBackoffDelay`, misma fórmula del PoC) + **test unitario** (`backoff.spec.ts`, 4 casos).
  - **`AmqpService`** con `OnApplicationBootstrap`/`OnApplicationShutdown`: `prefetch(1)`, `consume(queue, handler, { noAck: false })`, reconexión con backoff (base 1 s, cap 30 s, jitter 1 s, reintentos infinitos) y apagado limpio (bandera `shuttingDown` + limpieza del timer de reconexión). El handler delega en `ForwardService`.
  - **`ForwardService`** con `fetch` + `AbortSignal.timeout`: 2xx → `ack`; 4xx → `nack(requeue:false)` + log del body de `master`; 5xx/timeout/red → reintento con backoff (tope 5) → `nack(requeue:false)`.
  - **Logging estructurado** (`src/common/logger.ts`): `[timestamp UTC] NIVEL mensaje`, contexto por evento (`tag`, `idpk`, `type`), sin emojis; `formatUrl` oculta la contraseña de `RABBITMQ_URL` en los logs.
- **Problemas encontrados y solución:**
  - **`@nestjs/schematics@12` exige TypeScript ≥ 6**: subí TS a `^6.0.2` (consistente con `master`) y usé **ts-jest 29.4.12** (soporta TS < 7 y jest 30) para que `npm test` funcionara.
  - **ts-jest error TS5011** (rootDir): se agregó `"rootDir": "./src"` al `tsconfig.json`.
  - **Pruebas contra el broker real poco controlables**: la cola del curso publica ráfagas y los mensajes de prueba quedaban atrás de la cola / expiraban (TTL). Para las pruebas de resiliencia se usó un **RabbitMQ local en Docker** (`rabbitmq:3`) con una cola de prueba `test.q`, apuntando un segundo conector vía variables de entorno (`RABBITMQ_URL`/`RABBITMQ_QUEUE`/`MASTER_URL`). El conector no declara colas (constraint de producción): la cola local se declaró con `assertQueue` en el script de prueba.
  - **`pkill -f "node dist/main"` mataba también a `master`** (mismo comando): para matar solo `master` se usó `lsof -ti :3000 -sTCP:LISTEN`.
  - **Revisión post-entrega (2026-08-29)**: `tsc --noEmit` incluía por defecto `apps/connector/poc/` y `jest.config.ts`, fuera de `rootDir` (TS6059); se agregó `"include": ["src"]` al `tsconfig.json` y `typecheck` quedó en verde. En `AmqpService.connect()` se agrega limpieza de la conexión si el canal/consumo falla a mitad de la conexión. Se eliminó `apps/connector/.gitkeep` (directorio ya poblado) y se creó el `README.md` del servicio.
- **Comandos importantes:**
  ```bash
  cd apps/connector && npm install && npm run build && npm test
  npm run start                      # consume observer.45.q del broker del curso
  # Pruebas controladas con broker local:
  docker run -d --name e5-rabbit -p 5672:5672 rabbitmq:3
  RABBITMQ_URL=amqp://guest:guest@localhost:5672 RABBITMQ_QUEUE=test.q node dist/main
  docker stop e5-rabbit && docker start e5-rabbit   # prueba de reconexión
  ```
- **Resultado de pruebas:** (evidencia en `/tmp/connector.log` y `/tmp/connector-local.log`)

  **End-to-end real (broker del curso):**
  - El conector consumió 400+ eventos `demand-set` reales, los reenvió a `POST /events` (201) e hizo ack; `master` llegó a **437 registros** y `psql` confirma `receivedAt` en UTC:
    `e1c877c2-... | demand-set | 2026-08-30 01:45:06.55+00`.
  - Con `master` detenido: `REINTENTO intento=1/5 ... motivo=fetch failed` → tras 5 reintentos `NACK_AGOTADO reintentos=5` (descartado con log, sin bloquear la cola). Al volver `master`: `ACK status=201`.

  **Pruebas controladas (broker local):**
  | # | Prueba | Resultado |
  | --- | --- | --- |
  | 1 | `npm test` (backoff) | 4/4 OK |
  | 2 | Marcadores A–C con `master` arriba | `ACK tag=... status=201` y persistidos (6 marcadores en DB) |
  | 3 | `master` caído → evento pendiente | `REINTENTO` 1/5..5/5 (`fetch failed`); al volver `master`, el intento final → `ACK 201` y registrado en DB |
  | 4 | Corte de red del broker (`docker stop`) | `Conexión cerrada por el broker` → `BACKOFF intento=1..5 espera=1.04s/2.47s/4.35s/8.69s/16.94s` → al volver (`docker start`) → `CONEXIÓN TCP establecida` → `ESCUCHANDO` y sigue consumiendo |
  | 5 | Evento inválido (`idpk` no UUID) | `NACK_4XX status=400 body={"message":["idpk must be a UUID"]...}` y el conector sigue vivo |
  | 6 | Apagado con SIGTERM | `Señal SIGTERM recibida. Cerrando...` → canal/conexión cerrados (shutdown ordenado) |
  | 7 | `npm run build`, `typecheck`, `lint` | Sin errores |

  - **RNF-2** (connector→master vía HTTP) ✓ · **RNF-3** (reconexión automática) ✓ · **RNF-1** (separación de servicios) ✓ · **CP-L5** alcanzado.
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-05-ejecucion-cierre.md`
- **Estado:** Verificado localmente (checkpoint CP-L5 alcanzado)

---

## Entrada 13 — Etapa 6 — Dockerización y Docker Compose (planificación e inicio)

- **Fecha:** 2026-08-29
- **Objetivo:** Iniciar la Etapa 6 según el Plan Maestro: generar el plan detallado `etapas/etapa-06-docker-compose.md` y dejar lista la hoja de ruta para dockerizar `master` y `connector` y orquestarlos con Compose (checkpoint CP-L6, RNF-5/RNF-6).
- **Decisiones técnicas:**
  - **Dockerfile multi-stage** por servicio (`node:24-alpine`): etapa build (compila TS) y runtime (`npm ci --omit=dev` + `dist/`), sin devDependencies en producción.
  - **Migraciones en contenedor**: nuevo script `migration:run:prod` (`typeorm migration:run -d dist/data-source.js`) porque `typeorm-ts-node-commonjs` requiere `ts-node` (devDep) y TS fuente; el comando del contenedor de `master` ejecuta migraciones y luego `node dist/main`.
  - **`compose.yaml` en la raíz**: `postgres` + `master` + `connector` en la red interna de Compose; `connector` usa `MASTER_URL=http://master:3000`; volumen nombrado `energy_pgdata`; `depends_on` con `condition: service_healthy`.
  - **HEALTHCHECK por contenedor**: `pg_isready` (postgres), `fetch` real a `/health` con `node -e` (master, sin instalar curl en Alpine) y **heartbeat file** en `AmqpService` + `stat -c %Y` (connector, validación operativa real).
  - Variables de entorno vía `environment:` de Compose (valores desde el `.env` host no versionado), sin montar el `.env` dentro del contenedor.
  - Broker RabbitMQ del curso externo (no se conteneriza); opcional `rabbitmq:3` con `profile` para pruebas controladas.
- **Problemas encontrados y solución:** El comando `migration:run` local no funciona en runtime (depende de `ts-node`/TS): se resuelve con `migration:run:prod` sobre la DataSource compilada. Sin otros problemas en esta iteración (solo planificación documental).
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-06-docker-compose.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron las decisiones y aprendizajes de las Etapas 4–5 (migraciones, health check, `MASTER_URL` en la red).
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-06-docker-compose.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 6.1–6.5; checkpoint CP-L6)

---

## Entrada 14 — Etapa 6 — Dockerización y Docker Compose (ejecución y cierre)

- **Fecha:** 2026-08-29
- **Objetivo:** Ejecutar las sub-etapas 6.1–6.5 de la Etapa 6: Dockerfiles multi-stage de `master` y `connector`, `compose.yaml` de desarrollo, HEALTHCHECK por contenedor y pruebas (build, arranque, flujo real y resiliencia), alcanzando el checkpoint CP-L6 (RNF-5/RNF-6).
- **Decisiones técnicas:**
  - **Dockerfiles multi-stage** (`node:24-alpine`): etapa build (`npm ci` + `nest build`) y runtime (`npm ci --omit=dev` + `dist/`, sin devDependencies ni TS fuente). `.dockerignore` excluye `node_modules`, `dist`, `.env` y, en `connector`, también `poc/`.
  - **`migration:run:prod`** (`typeorm migration:run -d dist/data-source.js`): las migraciones corren con la DataSource compilada y el binario `typeorm` (dependencia de producción), sin `ts-node`. El `command` del contenedor de `master` es `sh -c "npm run migration:run:prod && node dist/main"`.
  - **`compose.yaml`** en la raíz (`name: energyshark`): `postgres:16` (volumen `energy_pgdata`, host 5432), `master` (host 3000, `DB_HOST=postgres`/`DB_PORT=5432`), `connector` (`MASTER_URL=http://master:3000`, broker del curso externo). `depends_on` con `condition: service_healthy` ordena el arranque; `restart: unless-stopped` en todos. Variables vía `environment:` interpoladas desde el `.env` host (no versionado).
  - **HEALTHCHECK por contenedor**: postgres `pg_isready`; master `node -e fetch(.../health)` (sin curl en Alpine); connector **heartbeat** implementado en `AmqpService` (escribe `/tmp/connector-heartbeat` cada 5 s; se inicia en `onApplicationBootstrap` y se limpia en `onApplicationShutdown`) validado con `stat -c %Y` (antigüedad < 15 s).
  - **`main.ts` de master ya lee `PORT`** de `ConfigService` (no hardcodeado), lo que permite fijar el puerto vía entorno en el contenedor.
- **Problemas encontrados y solución:**
  - **`CMD-SHELL` no existe en HEALTHCHECK de Dockerfile** (es sintaxis de Compose): el HEALTHCHECK del connector se corrigió a la forma shell de Docker (`CMD test $(( ... )) -lt 15`). Además, en Dockerfile **`$$` NO se escapa a `$`** (a diferencia de Compose): el shell veía `$$` (PID) y rompía la aritmética; se usó `$` simple.
  - **Puertos host ocupados**: `:3000` (master local de la Etapa 5) y `:5432` (PostgreSQL de Homebrew). Se detuvieron los servicios locales antes de `docker compose up` y se **restauraron al final** (`brew services start postgresql@17`). El contenedor `energy-postgres` (host 5433) no compite y quedó intacto.
  - **El usuario `observer.45` del curso solo tiene permiso de CONSUMO** (`ACCESS_REFUSED` al publicar): las pruebas de resiliencia se hicieron con eventos reales del curso, aprovechando su cadencia (~1/30 s) y el reintento del connector.
  - **Revisión post-entrega (2026-08-29)**: se agregó el script `typecheck` (`tsc --noEmit`) a `apps/master` (que no lo tenía, a diferencia de `connector`). Se confirmó que `ts-node` presente en el runtime **no es un error del Dockerfile**: es dependencia de producción transitiva de `typeorm@1.x`, por lo que `npm ci --omit=dev` la instala igual; no se usa en runtime y no afecta la imagen. Verificación en la auditoría: `docker build` de ambas imágenes, `docker compose config`, `npm run build`/`lint`/`typecheck` y `npm test` (4/4) en verde.
- **Comandos importantes:**
  ```bash
  docker compose config                        # validar sintaxis
  docker compose up --build -d                 # construir y arrancar (todo healthy)
  docker compose ps
  docker compose logs connector master
  docker compose restart master                # resiliencia: connector reintenta y recupera
  docker compose restart connector             # se reconecta y vuelve a consumir
  docker compose stop postgres && docker compose start postgres
  docker compose down                          # detener (conserva el volumen)
  docker inspect --format '{{json .State.Health}}' energyshark-master-1
  ```
- **Resultado de pruebas:**
  - **Imágenes**: `energyshark-master` (385 MB) y `energyshark-connector` (303 MB) construidas; `npm run build` pasa en ambas apps y `npm test` del connector 4/4.
  - **Arranque ordenado**: postgres → (healthy) → master (migraciones + `node dist/main`) → (healthy) → connector → (healthy). `docker compose ps` mostró los tres `healthy`.
  - **API**: `GET /health` → 200 `{status: ok, db: up}`; `GET /history` creció hasta **97 eventos reales** del curso con `receivedAt` UTC; tabla `history` e índices verificados con `\d history` en el postgres de Compose (migraciones aplicadas automáticamente).
  - **Flujo interno**: el connector logueó `ACK tag=... status=201` usando `MASTER_URL=http://master:3000` (red interna) y la contraseña del broker enmascarada (`observer.45:***`).
  - **Resiliencia (todo automático, sin intervención):**
    | # | Prueba | Resultado |
    | --- | --- | --- |
    | 1 | `docker compose restart master` | connector con `REINTENTO intento=1/5..4/5 motivo=fetch failed`; al volver master → `ACK 201`; evento `f07bd93c-...` persistido (02:37:24 UTC) |
    | 2 | `docker compose restart connector` | reconexión (`CONECTANDO amqps://observer.45:***@...`) → `ESCUCHANDO` → `ACK tag=1` (canal nuevo) |
    | 3 | `docker compose stop postgres` → `start` | `/health` degradó a **503** con la DB caída y volvió a **200** en el primer chequeo tras arrancar postgres |
  - **RNF-5** (Docker + HEALTHCHECK) ✓ · **RNF-6** (Compose master+connector+postgres) ✓ · **CP-L6** alcanzado.
- **Registro de IA:** `ai_docs/prompts/2026-08-29-etapa-06-docker-ejecucion-cierre.md`
- **Estado:** Verificado localmente (checkpoint CP-L6 alcanzado)

---

## Entrada 15 — Etapa 7 — Infraestructura AWS: EC2 + RDS (planificación e inicio)

- **Fecha:** 2026-08-30
- **Objetivo:** Iniciar la Etapa 7 según el Plan Maestro: generar el plan detallado `etapas/etapa-07-aws-ec2-rds.md` y dejar lista la hoja de ruta para crear la infraestructura AWS de producción (checkpoint CP-P1, RNF-7 parcial).
- **Decisiones técnicas:**
  - Región `us-east-1`; instancia **Ubuntu 24.04 LTS `t2.micro`** (Free Tier) con EBS `gp3` 20 GB.
  - Key pair `energyshark` (`.pem` en `~/.ssh/`, `chmod 400`, **fuera del repo**).
  - **SG EC2**: SSH (22) solo desde mi IP, 80 y 443 abiertos (prepara Nginx/HTTPS); puerto 3000 nunca expuesto.
  - **SG RDS**: 5432 solo desde el SG de la EC2; RDS `postgres` 16, `db.t3.micro`, `gp3` 20 GB, sin Multi-AZ, `public accessibility: false`.
  - **Elastic IP** asociada (IP fija para el registro A de la Etapa 9).
  - **Docker Engine + Compose plugin** en la EC2 (repos oficiales, usuario en grupo `docker`); usuario propio `energyshark` con sudo (hardening básico).
- **Problemas encontrados y solución:** Sin problemas en esta iteración (solo planificación documental). Pendiente para la ejecución: confirmar el AMI de Ubuntu en la región, mi IP actual al abrir el SG y el estado de Free Tier de la cuenta.
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-07-aws-ec2-rds.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron los datos de la bitácora (usuario IAM `energyshark-deploy`, región us-east-1) y las reglas de seguridad del proyecto (`.pem` jamás versionado).
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-07-aws-ec2-rds.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 7.1–7.6; checkpoint CP-P1)

---

## Entrada 16 — Etapa 7 — Infraestructura AWS: EC2 + RDS (ejecución y cierre)

- **Fecha:** 2026-08-30
- **Objetivo:** Ejecutar las sub-etapas 7.2–7.6 de la Etapa 7: crear la infraestructura AWS (key pair, Security Groups, EC2, Docker, Elastic IP y RDS) y verificar el checkpoint CP-P1.
- **Recursos creados** (IDs y endpoint, **sin secretos**):

  | Recurso | Valor |
  | --- | --- |
  | Instancia EC2 | `i-001abcc637483ce58` |
  | IP pública / Elastic IP | `3.216.254.80` |
  | SG EC2 | `sg-092d5b2ce9377dee0` (`energyshark-ec2`) |
  | SG RDS | `sg-0215b94a3a77894cd` (`energyshark-rds`) |
  | Endpoint RDS | `energyshark.cy3ceaoa6tdt.us-east-1.rds.amazonaws.com` |

- **Decisiones técnicas:** las registradas en `etapas/etapa-07-aws-ec2-rds.md` (sección 5). Se confirmó la IP pública fija (destino del registro A en la Etapa 9) y el endpoint interno del RDS.
- **Problemas encontrados y solución:** Sin bloqueos relevantes; la ejecución fue manual por AWS CLI (sin código de aplicación). El `.pem` permanece en `~/.ssh/` y **no** se versiona.
- **Comandos importantes:**
  ```bash
  aws ec2 describe-instances --filters "Name=tag:Name,Values=energyshark" \
    --query "Reservations[*].Instances[*].[InstanceId, PublicIpAddress]" --output text
  aws ec2 describe-security-groups --filters "Name=group-name,Values=*energyshark*"
  aws rds describe-db-instances --db-instance-identifier energyshark \
    --query "DBInstances[0].Endpoint.Address" --output text
  ```
- **Resultado de pruebas:** EC2 `running` con IP pública fija; SGs `energyshark-ec2` y `energyshark-rds` creados; RDS `available` con endpoint interno (5432 solo desde la EC2); Docker Engine + Compose instalados en la EC2. **CP-P1 alcanzado.**
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-07-cierre-auditoria.md`
- **Estado:** Verificado en producción (checkpoint CP-P1 alcanzado)

---

## Entrada 17 — Etapa 8 — Primer despliegue en producción (planificación e inicio)

- **Fecha:** 2026-08-30
- **Objetivo:** Iniciar la Etapa 8 según el Plan Maestro: generar el plan detallado `etapas/etapa-08-primer-despliegue.md` y dejar lista la hoja de ruta para desplegar el MVP en la EC2 conectado a RDS (checkpoint CP-P2, RF1–RF4 y RNF-7 en producción).
- **Decisiones técnicas:**
  - **`compose.prod.yaml` separado** (sin `postgres`): `master` + `connector` conectados a RDS; deja intacto el `compose.yaml` de desarrollo.
  - `master` apunta a RDS (`DB_HOST=<endpoint>`, `DB_SSL=true`) y publica **solo `127.0.0.1:3000`** (Nginx lo alcanzará en la Etapa 10; el SG no abre 3000).
  - Migraciones contra RDS con `migration:run:prod` en el arranque de `master` (patrón de la Etapa 6).
  - Build en la EC2 (`docker compose build`, sin registry); `.env` de producción en el host (`~/iic2173-energyshark/.env`, no versionado).
  - `restart: unless-stopped`; rollback por `git checkout <commit>` + rebuild (la data vive en RDS).
  - Verificación end-to-end por `curl 127.0.0.1:3000` desde la EC2 (sin exponer el puerto al mundo).
- **Problemas encontrados y solución:** Sin problemas en esta iteración (solo planificación documental). Pendiente para la ejecución: construir las imágenes en `t2.micro` (1 GB de RAM) de a una para no quedarse sin memoria.
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-08-primer-despliegue.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron los recursos de la Etapa 7 (EC2 `i-001abcc637483ce58`, IP `3.216.254.80`, RDS endpoint) y las decisiones de las Etapas 4–6 (migraciones, health checks, `MASTER_URL`).
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-08-primer-despliegue.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 8.1–8.4; checkpoint CP-P2)

---

## Entrada 18 — Etapa 8 — Primer despliegue en producción (ejecución y cierre)

- **Fecha:** 2026-08-30
- **Objetivo:** Ejecutar las sub-etapas 8.1–8.4 de la Etapa 8: desplegar el MVP en la EC2 conectado a RDS y verificar el flujo end-to-end en producción (checkpoint CP-P2, RF1–RF4 y RNF-7).
- **Logros y cambios implementados:**
  - **`compose.prod.yaml`** (nuevo): `master` + `connector` sin `postgres`. `master` apunta a RDS (`DB_HOST` interpolado, `DB_SSL=true`) y publica **solo `127.0.0.1:3000`**; `connector` usa `MASTER_URL=http://master:3000`; ambos con `restart: unless-stopped` y HEALTHCHECK. Migraciones contra RDS con `migration:run:prod` en el arranque de `master`.
  - **Fix `PORT` opcional**: `env.validation.ts` ahora permite `PORT` con default `3000` (antes `getOrThrow` rompía el arranque si la variable no venía definida).
  - Repo clonado en la EC2 (`~/iic2173-energyshark`) con `.env` de producción en el host (no versionado).
  - Verificación end-to-end en producción: `GET /health` → `{ status: ok, db: up }`, `GET /history` con eventos reales del curso persistidos en RDS y resiliencia ante `restart` de `master`/`connector`.
- **Problemas encontrados y solución:**
  - Arranque fallaba si `PORT` no estaba definido → se hizo `PORT` opcional con default 3000 (commit `5bf3fa7`).
  - Build en `t2.micro` (1 GB RAM): se construyó de a una imagen para no agotar memoria.
- **Comandos importantes:**
  ```bash
  ssh -i ~/.ssh/energyshark.pem energyshark@3.216.254.80
  cd ~/iic2173-energyshark
  docker compose -f compose.prod.yaml build
  docker compose -f compose.prod.yaml up -d
  docker compose -f compose.prod.yaml ps
  curl -s http://127.0.0.1:3000/health
  ```
- **Resultado de pruebas:** MVP funcionando en AWS: `master` + `connector` `healthy`, migraciones aplicadas a RDS, eventos reales del curso persistidos y consultables, y recuperación automática ante reinicios. **CP-P2 alcanzado**; RF1–RF4 y RNF-7 verificados en producción.
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-08-cierre-auditoria.md`
- **Estado:** Verificado en producción (checkpoint CP-P2 alcanzado)

---

## Entrada 19 — Etapa 9 — Dominio y DNS (planificación e inicio)

- **Fecha:** 2026-08-30
- **Objetivo:** Iniciar la Etapa 9 según el Plan Maestro: generar el plan detallado `etapas/etapa-09-dominio-dns.md` y dejar lista la hoja de ruta para apuntar el dominio a la EC2 (checkpoint CP-P3, RNF-4).
- **Decisiones técnicas:**
  - Dominio `persito.online` (registrado en Namecheap, bitácora Entrada 3) apuntando a la Elastic IP `3.216.254.80`.
  - **Registro A** en el apex (`@` → `3.216.254.80`) y `www` como CNAME al apex.
  - **Fuente de DNS única** (Namecheap BasicDNS o el cPanel del hosting en `server352.web-hosting.com`); se decide en la ejecución según los nameservers actuales.
  - **TTL bajo (300 s)** durante la configuración para acelerar la propagación.
  - Verificación con `dig`/`nslookup` y verificadores online (`dnschecker.org`, `whatsmydns.net`).
- **Problemas encontrados y solución:** El dominio ya tiene un hosting con cPanel (bitácora Entrada 3): hay que confirmar dónde se administra el DNS para no crear registros en dos fuentes (conflicto). Pendiente de resolver en la ejecución.
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-09-dominio-dns.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron el dominio, la Elastic IP y los datos de la bitácora.
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-09-dominio-dns.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 9.1–9.3; checkpoint CP-P3)

---

## Entrada 20 — Etapa 9 — Dominio y DNS (ejecución y cierre)

- **Fecha:** 2026-08-30
- **Objetivo:** Ejecutar las sub-etapas 9.1–9.3 de la Etapa 9: apuntar el dominio a la EC2 y verificar la propagación (checkpoint CP-P3, RNF-4).
- **Resumen técnico:**
  - Dominio `persito.online` **activo**; fuente única de DNS elegida: **Namecheap BasicDNS** (NS `dns1/dns2.registrar-servers.com`).
  - **Registro A** del apex `@` → `3.216.254.80` y **`www`** como CNAME → `persito.online`.
- **Verificación (evidencia real):**
  ```text
  $ dig +short persito.online @8.8.8.8
  3.216.254.80
  $ dig +short www.persito.online @8.8.8.8
  persito.online.
  3.216.254.80
  ```
- **Problemas encontrados y solución:** El dominio ya tenía hosting con cPanel; se resolvió usando **una sola fuente de DNS** (Namecheap BasicDNS) para evitar registros duplicados/conflictivos.
- **Comandos importantes:** `dig +short persito.online`, `dig +short www.persito.online`, `dig +short NS persito.online`.
- **Resultado de pruebas:** apex y `www` resuelven a `3.216.254.80` desde el resolver de Google y el local. **CP-P3 alcanzado**; RNF-4 verificado.
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-09-cierre-auditoria.md`
- **Estado:** Verificado en producción (checkpoint CP-P3 alcanzado)

---

## Entrada 21 — Etapa 10 — Nginx reverse proxy (planificación e inicio)

- **Fecha:** 2026-08-30
- **Objetivo:** Iniciar la Etapa 10 según el Plan Maestro: generar el plan detallado `etapas/etapa-10-nginx-reverse-proxy.md` y dejar lista la hoja de ruta para servir la API por el dominio vía Nginx en el host (checkpoint CP-P4, RNF-3/RNF-9).
- **Decisiones técnicas:**
  - **Nginx en el host EC2** (no en contenedor, obligatorio por el enunciado RNF-3), instalado por `apt` y gestionado por systemd.
  - Server block `persito.online` + `www` con **`proxy_pass http://127.0.0.1:3000`** (el `master` publicado solo en localhost).
  - Cabeceras de proxy completas (`Host`, `X-Real-IP`, `X-Forwarded-*`); configuración versionada en `infra/nginx/energyshark.conf` (regla del plan maestro).
  - Puertos: solo 80/443 abiertos (SG); 3000 nunca expuesto.
  - Logs en `/var/log/nginx/access.log` y `error.log`.
- **Problemas encontrados y solución:** Sin problemas en esta iteración (solo planificación documental).
- **Comandos importantes:** pendientes de la ejecución (sección 9 de `etapa-10-nginx-reverse-proxy.md`).
- **Resultado de pruebas:** Plan detallado generado con 17 secciones; se incorporaron el dominio (`persito.online`), la EC2/IP y el backend `127.0.0.1:3000` de las etapas 8–9.
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-10-nginx-reverse-proxy.md`
- **Estado:** En progreso (pendiente: ejecutar sub-etapas 10.1–10.4; checkpoint CP-P4)

---

## Entrada 22 — Etapa 10 — Nginx reverse proxy (ejecución y cierre)

- **Fecha:** 2026-08-30
- **Objetivo:** Ejecutar las sub-etapas 10.1–10.4 de la Etapa 10: instalar Nginx en el host EC2, configurar el server block HTTP con `proxy_pass` a `master`, cerrar puertos directos y revisar logs (checkpoint CP-P4, RNF-3/RNF-9).
- **Resumen técnico:**
  - **Nginx instalado en el host EC2** (por `apt`, systemd `active`) y configurado con el server block de `persito.online` + `www` → **`proxy_pass http://127.0.0.1:3000`**.
  - Configuración **versionada en `infra/nginx/energyshark.conf`** (regla del plan maestro), copiada a `/etc/nginx/sites-available/` + symlink en `sites-enabled`; se deshabilitó el `default`.
  - Cabeceras de proxy completas (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`).
  - **Puerto 3000 no expuesto**: el `master` publica solo en `127.0.0.1` y el SG solo abre 22/80/443.
- **Verificación (evidencia real desde el exterior):**
  ```text
  $ curl http://persito.online/health
  {"status":"ok","db":"up"}
  $ curl "http://persito.online/history?limit=2"
  {"items":[...],"meta":{"page":1,"limit":2,"total":2166,"totalPages":1083}}
  # 2166 eventos reales del curso persistidos en RDS; validUntil poblado desde packageBody
  $ curl http://3.216.254.80:3000/health   # sin respuesta (puerto cerrado)
  ```
- **Problemas encontrados y solución:** Sin bloqueos; se usó `sites-available`/`sites-enabled` y se removió el `default` para que `persito.online` sea el único server block.
- **Comandos importantes:**
  ```bash
  sudo apt install -y nginx && sudo systemctl enable --now nginx
  sudo cp infra/nginx/energyshark.conf /etc/nginx/sites-available/energyshark
  sudo ln -sf /etc/nginx/sites-available/energyshark /etc/nginx/sites-enabled/energyshark
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
  sudo tail -f /var/log/nginx/access.log
  ```
- **Resultado de pruebas:** API accesible por `http://persito.online` (health y history con eventos reales); puerto 3000 no accesible desde el exterior. **CP-P4 alcanzado**; RNF-3/RNF-9 verificados.
- **Registro de IA:** `ai_docs/prompts/2026-08-30-etapa-10-cierre-auditoria.md`
- **Estado:** Verificado en producción (checkpoint CP-P4 alcanzado)
