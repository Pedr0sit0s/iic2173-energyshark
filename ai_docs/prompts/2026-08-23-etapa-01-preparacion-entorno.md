# Registro de IA — 2026-08-23 — Desarrollo de la Etapa 1

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-pro
- **Fecha y hora:** 2026-08-23 (segunda sesión de trabajo)
- **Contexto:** Ejecución de la Etapa 1 del Plan Maestro (preparación del entorno local).

## Prompt (resumen fiel)

"empecemos etapa 1" — aplicando las reglas definidas: generar exclusivamente el archivo `etapas/etapa-01-preparacion-entorno.md`, con la estructura obligatoria de 16 secciones (objetivo, requisitos, teoría, aplicación a EnergyShark, decisiones técnicas, sub-etapas, action items, comandos, resultados esperados, verificación, troubleshooting, checklist, pruebas locales, pruebas en producción, registro para la bitácora) y sin escribir código de aplicación.

## Resumen de la respuesta

Documento `etapa-01-preparacion-entorno.md` con:
- Teoría práctica: Git, Node/npm, Docker, AWS CLI/IAM, credenciales RabbitMQ, `.env`.
- 17 pasos accionables en 3 sub-etapas (herramientas locales, cuentas y credenciales, estructura del repositorio), cada uno con comandos y verificación.
- Tabla de decisiones técnicas (instalador oficial LTS de Node, npm, Docker Desktop, `libpq`, Homebrew, IAM con políticas acotadas, región `us-east-1`).
- Checklist de finalización, 5 pruebas locales, troubleshooting con 12 casos típicos.

## Uso dado

- **Adoptado:** la guía completa; el usuario ejecutó casi todos los pasos.
- **Adoptado:** comandos de instalación y verificación.
- **Adaptado por el usuario:** registró la salida de comandos en `docs/bitacora.md` en bruto (posteriormente reorganizada con IA, ver registro del cierre documental).

## Archivos afectados

- `etapas/etapa-01-preparacion-entorno.md`
