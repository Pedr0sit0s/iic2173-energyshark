# Registro de IA — 2026-08-30 — Inicio de la Etapa 10 (Nginx reverse proxy)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-30 (vigésima sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 9 (dominio y DNS, CP-P3) y solicitó iniciar la Etapa 10 del Plan Maestro (Nginx reverse proxy en el host), siguiendo el flujo de documentación del proyecto.

## Prompt (resumen fiel)

"vamos a la etapa 10" — bajo las reglas vigentes: seguir el flujo de documentación (plan detallado en `etapas/`, bitácora y registro en `ai_docs/prompts`), sin escribir todavía el código/config de la etapa.

## Resumen de la respuesta

- Documento `etapas/etapa-10-nginx-reverse-proxy.md` con la estructura de 17 secciones:
  - Sub-etapas 10.1 (instalación de Nginx) a 10.4 (logs), alineadas con el plan maestro.
  - Decisiones técnicas: Nginx en el host EC2 (obligatorio por RNF-3), server block `persito.online`/`www` con `proxy_pass http://127.0.0.1:3000`, cabeceras de proxy completas, configuración versionada en `infra/nginx/energyshark.conf`, puertos solo 80/443 y logs de Nginx.
  - Server block de referencia y comandos de instalación/symlink/reload.
  - Comandos, checklist, troubleshooting y registro para la bitácora (Entrada 22).
- Actualización de la bitácora (Entrada 21) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 10 como guía de trabajo (archivo `etapas/etapa-10-nginx-reverse-proxy.md`).
- **Adoptado:** los datos del dominio (`persito.online`), la EC2/IP y el backend `127.0.0.1:3000` de las etapas 8–9.
- **Pendiente de usuario:** ejecutar las sub-etapas 10.1–10.4 (instalar Nginx, server block, cerrar puertos y revisar logs).

## Archivos afectados

- `etapas/etapa-10-nginx-reverse-proxy.md` (creado)
- `docs/bitacora.md` (Entrada 21 agregada + índice)
- `ai_docs/prompts/2026-08-30-etapa-10-nginx-reverse-proxy.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 10 y siguiente etapa)
