# Registro de IA — 2026-08-29 — Inicio de la Etapa 5 (servicio `connector` local)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-29 (décima sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 4 (servicio `master` local, CP-L4) y solicitó iniciar la Etapa 5 del Plan Maestro (servicio `connector` local), pidiendo una guía paso a paso para cerrar el flujo end-to-end local.

## Prompt (resumen fiel)

"Ahora quiero que vamos a la etapa 5, para eso dame la guía paso a paso de lo que se debe hacer" — bajo las reglas vigentes del proyecto: seguir el flujo de documentación (registro en `ai_docs/prompts`, bitácora y plan detallado en `etapas/`), sin escribir código de aplicación todavía (la etapa se ejecuta después del plan).

## Resumen de la respuesta

- Revisión del estado actual: `apps/master` con la API local (Etapa 4 cerrada, CP-L4), PoC de la Etapa 3 en `apps/connector/poc`, cola `observer.45.q` confirmada.
- Documento `etapas/etapa-05-connector-local.md` con la estructura de 17 secciones heredada de las etapas 2–4:
  - Sub-etapas 5.1 (scaffold NestJS standalone) a 5.5 (integración end-to-end local), alineadas con el plan maestro.
  - Decisiones técnicas: NestJS standalone (`createApplicationContext`, sin HTTP), `amqplib` con `prefetch(1)`, reconexión con backoff (función pura del PoC), `fetch` nativo + `AbortSignal.timeout` para el reenvío, ack solo tras 2xx (4xx → nack; 5xx/timeout/red → reintentos con tope), `ConfigModule` con validación, logging estructurado.
  - Contrato `connector → master` (POST /events con el evento tal cual, `master` autoridad de `receivedAt`).
  - Comandos de scaffold (en carpeta temporal para no pisar `poc/`), arranque y pruebas.
- Actualización de la bitácora (Entrada 11) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 5 como guía de trabajo (archivo `etapas/etapa-05-connector-local.md`).
- **Adoptado:** el patrón de backoff y el logging del PoC de la Etapa 3 como base.
- **Pendiente de usuario:** ejecutar las sub-etapas 5.1–5.5 (scaffold, consumidor, reenvío, logging y prueba end-to-end).

## Archivos afectados

- `etapas/etapa-05-connector-local.md` (creado)
- `docs/bitacora.md` (Entrada 11 agregada + índice)
- `ai_docs/prompts/2026-08-29-etapa-05-connector-local.md` (este archivo)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 5 y siguiente etapa)
