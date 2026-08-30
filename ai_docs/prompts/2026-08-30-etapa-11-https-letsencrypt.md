# Registro de IA — 2026-08-30 — Inicio de la Etapa 11 (HTTPS con Let's Encrypt)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-30 (vigesimosegunda sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 10 (Nginx reverse proxy, CP-P4) y solicitó iniciar la Etapa 11 del Plan Maestro (HTTPS con Let's Encrypt, parte variable elegida), siguiendo el flujo de documentación del proyecto.

## Prompt (resumen fiel)

"ahora vamos a la etapa 11" — bajo las reglas vigentes: seguir el flujo de documentación (plan detallado en `etapas/`, bitácora y registro en `ai_docs/prompts`), sin escribir todavía el código/config de la etapa.

## Resumen de la respuesta

- Documento `etapas/etapa-11-https-letsencrypt.md` con la estructura de 17 secciones:
  - Sub-etapas 11.1 (instalación de Certbot) a 11.5 (verificación del certificado), alineadas con el plan maestro.
  - Decisiones técnicas: Certbot con plugin Nginx (HTTP-01), certificado para `persito.online` + `www` con `--redirect`, renovación automática con `certbot.timer` (2×/día) y `dry-run`, configuración versionada en `infra/nginx/energyshark.conf`, verificación con `curl`/`openssl`/navegador.
  - Comandos, checklist, troubleshooting y registro para la bitácora (Entrada 24).
- Actualización de la bitácora (Entrada 23) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 11 como guía de trabajo (archivo `etapas/etapa-11-https-letsencrypt.md`).
- **Adoptado:** el dominio (`persito.online`/`www`), Nginx del host (Etapa 10) y el SG con 80/443.
- **Pendiente de usuario:** ejecutar las sub-etapas 11.1–11.5 (emitir certificado, configurar HTTPS, renovación y verificación).

## Archivos afectados

- `etapas/etapa-11-https-letsencrypt.md` (creado)
- `docs/bitacora.md` (Entrada 23 agregada + índice)
- `ai_docs/prompts/2026-08-30-etapa-11-https-letsencrypt.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 11 y siguiente etapa)
