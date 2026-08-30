# Registro de IA — 2026-08-23 — Plan Maestro y estructura de documentación

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-23 (sesión inicial del proyecto)
- **Contexto:** Inicio del proyecto IIC2173 — Entrega 0. Sin código ni infraestructura previos.

## Prompt (resumen fiel)

Se pidió al asistente actuar como Tech Lead / Arquitecto / DevOps y generar un **Plan Maestro de Desarrollo** para EnergyShark:
- Contexto completo del proyecto: `connector` (RabbitMQ AMQP) + `master` (API NestJS) + PostgreSQL + Nginx + AWS EC2/RDS + dominio + HTTPS.
- Stack obligatorio: TypeScript, NestJS, RabbitMQ, PostgreSQL, Docker, Docker Compose, EC2, RDS, Nginx en host, Namecheap, Let's Encrypt/Certbot.
- Requisitos RF1–RF4 y no funcionales (separación, resiliencia, dockerización, AWS, dominio, HTTPS).
- Restricción absoluta: NO escribir código; solo planificar.
- Salida inicial: únicamente el índice del Plan Maestro.
- En un prompt posterior se definió la estructura física obligatoria: carpeta `etapas/`, un archivo `.md` por etapa, `etapas/README.md` como índice, `etapa-00-plan-maestro.md` como roadmap, y desarrollo progresivo etapa a etapa.

## Resumen de la respuesta

1. Índice completo del Plan Maestro: 16 etapas (0–15) con sub-etapas, tareas y micro-tareas, diferenciando desarrollo local, PoC, Dockerización, AWS, deployment, HTTPS, validación y entrega.
2. Generación de `etapas/README.md` (índice con estados) y `etapas/etapa-00-plan-maestro.md` (roadmap, dependencias en Mermaid, matriz de trazabilidad RF/RNF, checkpoints `[L]` y `[P]`, sección opcional de balanceo de carga).
3. Aplicación de la estructura obligatoria de 16 secciones para cada etapa (objetivo, teoría, aplicación a EnergyShark, decisiones, action items, troubleshooting, checklist, bitácora).

## Uso dado

- **Adoptado:** el Plan Maestro completo como roadmap oficial del proyecto (archivos `etapas/etapa-00-plan-maestro.md` y `etapas/README.md`).
- **Adoptado:** la matriz de trazabilidad y los checkpoints local/producción.
- **Modificado:** la numeración de etapas se reindexó al definir la estructura `etapas/` (el diseño de arquitectura pasó a ser la Etapa 2).
- **Pendiente:** contrastar el plan con el PDF oficial del enunciado (la herramienta no pudo leerlo).

## Archivos afectados

- `etapas/etapa-00-plan-maestro.md`
- `etapas/README.md`
