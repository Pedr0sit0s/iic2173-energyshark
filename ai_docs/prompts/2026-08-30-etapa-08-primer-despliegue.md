# Registro de IA — 2026-08-30 — Inicio de la Etapa 8 (primer despliegue en producción)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-30 (decimosexta sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 7 (infraestructura AWS: EC2 + RDS, CP-P1) y solicitó iniciar la Etapa 8 del Plan Maestro (primer despliegue en producción, MVP en EC2), siguiendo el flujo de documentación del proyecto.

## Prompt (resumen fiel)

"vamos a la etapa 8" — bajo las reglas vigentes: seguir el flujo de documentación (plan detallado en `etapas/`, bitácora y registro en `ai_docs/prompts`), sin escribir todavía el código/script de la etapa.

## Resumen de la respuesta

- Documento `etapas/etapa-08-primer-despliegue.md` con la estructura de 17 secciones:
  - Sub-etapas 8.1 (código en EC2) a 8.4 (procedimiento de despliegue/rollback), alineadas con el plan maestro.
  - Decisiones técnicas: `compose.prod.yaml` separado (sin `postgres`, conectado a RDS), `master` publicando solo `127.0.0.1:3000`, migraciones contra RDS con `migration:run:prod`, build en EC2 sin registry, `.env` de producción en el host, `restart: unless-stopped` y rollback por `git checkout` + rebuild.
  - Verificación end-to-end por `curl` interno (sin exponer el puerto) y pruebas de resiliencia.
  - Comandos de despliegue, checklist, troubleshooting y registro para la bitácora (Entrada 18).
- Actualización de la bitácora (Entrada 17) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 8 como guía de trabajo (archivo `etapas/etapa-08-primer-despliegue.md`).
- **Adoptado:** los recursos de la Etapa 7 (EC2, IP, RDS) y las decisiones de las Etapas 4–6 (migraciones, health checks, comunicación por nombre de servicio).
- **Pendiente de usuario:** ejecutar las sub-etapas 8.1–8.4 (clonar en EC2, `.env` prod, Compose prod, verificación end-to-end y documentación de rollback).

## Archivos afectados

- `etapas/etapa-08-primer-despliegue.md` (creado)
- `docs/bitacora.md` (Entrada 17 agregada + índice)
- `ai_docs/prompts/2026-08-30-etapa-08-primer-despliegue.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 8 y siguiente etapa)
