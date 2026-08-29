# Registro de IA — 2026-08-26 — Inicio de la Etapa 3 (PoC RabbitMQ)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-pro
- **Fecha y hora:** 2026-08-26 (quinta sesión de trabajo)
- **Contexto:** El usuario perdió el historial de la sesión anterior. El estado del proyecto se reconstruyó desde los archivos del repositorio (`etapas/etapa-00-plan-maestro.md` como base). La Etapa 2 quedó finalizada al 100%. Se solicita iniciar la Etapa 3 siguiendo el flujo de documentación establecido.

## Prompt (resumen fiel)

"Perdí el historial de nuestra sesión anterior. Sin embargo, el estado del proyecto se mantiene en los archivos. El archivo base es etapas/etapa-00-plan-maestro.md. La Etapa 2 ya está finalizada al 100%. Objetivo Actual: Iniciar el desarrollo de la Etapa 3 siguiendo el flujo de documentación establecido. Tareas a ejecutar (en orden): (1) Registro: crea o actualiza el registro de este prompt dentro de ai_docs/prompts. (2) Bitácora: actualiza el archivo de la bitácora indicando el cierre de la Etapa 2 y el inicio de la Etapa 3. (3) Planificación: revisa el archivo etapa-00-plan-maestro.md para entender el alcance de la Etapa 3, y luego genera el archivo con el plan detallado para esta nueva etapa dentro del directorio etapas/."

Además, el asistente preguntó por la cola AMQP asignada (registrada como pendiente en la bitácora) y el usuario respondió: **dejarla como pendiente en el plan** (Paso 0).

## Resumen de la respuesta

- Reconstrucción del contexto a partir de los archivos (`etapas/`, `docs/bitacora.md`, `ai_docs/`) al no existir historial de sesión.
- Registro de este prompt (este archivo) y actualización del índice de `ai_docs/README.md`.
- Bitácora: Entrada 6 (cierre de la Etapa 2, estado Completado) y Entrada 7 (inicio de la Etapa 3, estado En progreso).
- Documento `etapas/etapa-03-poc-rabbitmq.md` con la estructura de 17 secciones heredada de la Etapa 2:
  - PoC ubicado en `apps/connector/poc/` con TypeScript + `amqplib` + `tsx` (sin NestJS todavía: eso es Etapa 5).
  - Sub-etapas 3.1 (conexión/consumo AMQPS-TLS), 3.2 (parsing y validación JSON) y 3.3 (desconexión/reconexión con backoff).
  - Paso 0: confirmar la cola AMQP asignada (pendiente del usuario).
  - Simulación de caída del broker destruyendo el socket subyacente.
- Actualización de estados: `etapas/README.md` (Etapa 2 → Completado, Etapa 3 → En progreso), cabecera de `etapa-02-diseno-arquitectura.md` y matriz de trazabilidad del plan maestro (RF4 y RNF-2 → En progreso).

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 3 como guía de trabajo (archivo `etapas/etapa-03-poc-rabbitmq.md`).
- **Adoptado:** decisiones de ubicación del PoC (`apps/connector/poc/`), stack mínimo (TypeScript + `amqplib` + `tsx`) y estrategia de reconexión con backoff exponencial.
- **Pendiente de usuario:** confirmar la cola AMQP asignada (Paso 0) y ejecutar las sub-etapas 3.1–3.3.

## Archivos afectados

- `ai_docs/prompts/2026-08-26-etapa-03-poc-rabbitmq.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `docs/bitacora.md` (Entradas 6 y 7 agregadas + índice)
- `etapas/etapa-03-poc-rabbitmq.md` (creado)
- `etapas/README.md` (estados de etapas 2 y 3 actualizados)
- `etapas/etapa-02-diseno-arquitectura.md` (estado → Completado)
- `etapas/etapa-00-plan-maestro.md` (matriz de trazabilidad: RF4 y RNF-2 → En progreso)
