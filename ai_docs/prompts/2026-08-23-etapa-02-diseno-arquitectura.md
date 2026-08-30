# Registro de IA — 2026-08-23 — Desarrollo de la Etapa 2 (diseño de arquitectura)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-23 (cuarta sesión de trabajo)
- **Contexto:** El usuario completó la Etapa 1 y solicitó avanzar a la Etapa 2 del Plan Maestro.

## Prompt (resumen fiel)

"vamos a la etapa 2" — bajo las reglas vigentes: generar exclusivamente el archivo `etapas/etapa-02-diseno-arquitectura.md` con la estructura obligatoria de 16 secciones, sin escribir código de aplicación, y persistir el diseño de arquitectura previamente desarrollado en conversación.

## Resumen de la respuesta

Documento `etapa-02-diseno-arquitectura.md` con:
- Teoría práctica de AMQP/RabbitMQ (incl. AMQPS/TLS), NestJS/DI, Docker, AWS, Nginx/DNS/HTTPS, resiliencia y UTC.
- Dos diagramas Mermaid (flujo de eventos y flujo de consultas).
- 10 decisiones técnicas con alternativas (monorepo, amqplib, TypeORM, modelo híbrido columnas/JSONB, `LIMIT/OFFSET`, `receivedAt` en master, región us-east-1, TLS obligatorio).
- Modelo de datos de la tabla `history`, diseño de API (`/events`, `/history`, `/history/:id`, `/health`), contrato connector→master (ack tras 2xx) e inventario de variables de entorno dev/prod.
- Incorporación de los datos reales de la bitácora: `broker.iic2173.org:5671` AMQPS, vhost `energy`, usuario `observer.45`, exchange `fulfillment.x`.
- Checklist de finalización, troubleshooting y registro para la bitácora.

## Uso dado

- **Adoptado:** el documento como diseño canónico del proyecto (archivo `etapas/etapa-02-diseno-arquitectura.md`).
- **Adoptado:** la decisión de usar `amqps://` con TLS, detectada a partir de los datos del broker registrados en la bitácora.
- **Pendiente de usuario:** validación contra el enunciado oficial y confirmación de la cola AMQP asignada.

## Archivos afectados

- `etapas/etapa-02-diseno-arquitectura.md` (creado)
- `etapas/README.md` (nota y siguiente etapa actualizadas)
- `docs/bitacora.md` (Entrada 5 agregada)
