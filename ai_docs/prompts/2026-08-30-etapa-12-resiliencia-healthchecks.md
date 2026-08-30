# Registro de IA — 2026-08-30 — Inicio de la Etapa 12 (resiliencia y health checks)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-30 (vigesimocuarta sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 11 (HTTPS Let's Encrypt, CP-P5) y solicitó iniciar la Etapa 12 del Plan Maestro (pruebas de resiliencia y health checks), siguiendo el flujo de documentación del proyecto.

## Prompt (resumen fiel)

"vamos a la etapa 12" — bajo las reglas vigentes: seguir el flujo de documentación (plan detallado en `etapas/`, bitácora y registro en `ai_docs/prompts`), sin escribir todavía el código/script de la etapa.

## Resumen de la respuesta

- Documento `etapas/etapa-12-resiliencia-healthchecks.md` con la estructura de 17 secciones:
  - Sub-etapas 12.1 (caída/recuperación de RabbitMQ) a 12.6 (revisión de logs), alineadas con el plan maestro.
  - 7 escenarios de prueba en producción (tabla de la sección 4), incluyendo la **simulación de caída del broker con iptables** (el broker del curso es compartido y no se detiene), reinicios de contenedores, `/history` durante fallos, volumen (paginación profunda y filtros con `EXPLAIN ANALYZE`), health checks (`docker ps`/`inspect`) y logs.
  - Comandos, checklist, troubleshooting y registro para la bitácora (Entrada 26).
- Actualización de la bitácora (Entrada 25) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 12 como guía de trabajo (archivo `etapas/etapa-12-resiliencia-healthchecks.md`).
- **Adoptado:** la simulación del corte del broker con iptables (controlado y reversible) para no tocar la infraestructura compartida del curso.
- **Pendiente de usuario:** ejecutar las sub-etapas 12.1–12.6 (escenarios de resiliencia y health checks en producción).

## Archivos afectados

- `etapas/etapa-12-resiliencia-healthchecks.md` (creado)
- `docs/bitacora.md` (Entrada 25 agregada + índice)
- `ai_docs/prompts/2026-08-30-etapa-12-resiliencia-healthchecks.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 12 y siguiente etapa)
