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
| Exchange | `energy.x` |
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
