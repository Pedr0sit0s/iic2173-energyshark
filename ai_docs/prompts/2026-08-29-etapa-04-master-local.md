# Registro de IA — 2026-08-29 — Inicio de la Etapa 4 (servicio `master` local)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-29 (séptima sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 3 (PoC RabbitMQ) y solicitó iniciar la Etapa 4 del Plan Maestro (servicio `master` con API REST y PostgreSQL local), pidiendo una guía paso a paso.

## Prompt (resumen fiel)

"ahora quiero que vamos a la etapa 4, para eso dame la guia paso a paso de lo que se debe hacer" — bajo las reglas vigentes del proyecto: seguir el flujo de documentación (registro en `ai_docs/prompts`, bitácora y plan detallado en `etapas/`), sin escribir código de aplicación todavía (la etapa se ejecuta después del plan).

## Resumen de la respuesta

- Revisión del estado actual: `apps/master` vacío (solo `.gitkeep`), Etapa 3 cerrada (CP-L3), cola `observer.45.q` confirmada.
- Documento `etapas/etapa-04-master-api-local.md` con la estructura de 17 secciones heredada de las etapas 2–3:
  - Sub-etapas 4.1 (scaffold NestJS) a 4.6 (pruebas `curl`), alineadas con el plan maestro.
  - Modelo de datos de la tabla `history` tomado de la Etapa 2 (id, idpk, type, receivedAt UTC, validUntil, packageBody jsonb, createdAt) + índices.
  - Decisiones técnicas: TypeORM con migraciones desde el inicio, `ValidationPipe` global, `receivedAt` asignado por `master`, QueryBuilder para filtros, `city` vía JSONB, tolerancia de duplicados (at-least-once), `/health` con chequeo de DB.
  - Estructura real del evento de la Etapa 3 incorporada al DTO y a los casos de prueba.
  - Comandos de scaffold, contenedor `postgres:16`, migraciones y pruebas `curl`.
- Actualización de la bitácora (Entrada 9) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 4 como guía de trabajo (archivo `etapas/etapa-04-master-api-local.md`).
- **Adoptado:** decisiones de la Etapa 2 como referencia canónica (modelo de datos, API, variables de entorno).
- **Pendiente de usuario:** ejecutar las sub-etapas 4.1–4.6 (scaffold, PostgreSQL local, migraciones, endpoints y pruebas).

## Archivos afectados

- `etapas/etapa-04-master-api-local.md` (creado)
- `docs/bitacora.md` (Entrada 9 agregada + índice)
- `ai_docs/prompts/2026-08-29-etapa-04-master-local.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 4 y siguiente etapa)
