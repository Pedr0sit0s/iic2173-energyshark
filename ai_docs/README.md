# Registro de uso de IA — EnergyShark

Directorio obligatorio según el enunciado (`ai_docs/prompts`). Aquí se documenta **todo** uso de herramientas de IA en el proyecto: prompts, respuestas y decisiones adoptadas.

## Estructura

```text
ai_docs/
├── README.md              ← Este archivo (índice y formato de registro)
└── prompts/
    └── YYYY-MM-DD-tema.md ← Un archivo por interacción relevante
```

## Formato de cada registro

```markdown
# Registro de IA — <fecha> — <tema>

- **Herramienta:** (ej. opencode CLI · modelo deepseek-v4-flash)
- **Fecha y hora:** 
- **Contexto:** (etapa del proyecto en la que se usó)
- **Prompt:** (texto o resumen fiel del prompt enviado)
- **Resumen de la respuesta:** (qué entregó la herramienta)
- **Uso dado:** (qué se adoptó, qué se modificó, qué se descartó)
- **Archivos afectados:**
```

## Índice de registros

| Fecha | Archivo | Tema |
| --- | --- | --- |
| 2026-08-23 | `prompts/2026-08-23-plan-maestro.md` | Plan Maestro y estructura de documentación |
| 2026-08-23 | `prompts/2026-08-23-etapa-01-preparacion-entorno.md` | Desarrollo de la Etapa 1 |
| 2026-08-23 | `prompts/2026-08-23-papeleo-final-etapa-01.md` | Cierre documental de la Etapa 1 |
| 2026-08-23 | `prompts/2026-08-23-etapa-02-diseno-arquitectura.md` | Desarrollo de la Etapa 2 (diseño de arquitectura) |
| 2026-08-26 | `prompts/2026-08-26-etapa-03-poc-rabbitmq.md` | Inicio de la Etapa 3 (PoC RabbitMQ) |
| 2026-08-29 | `prompts/2026-08-29-etapa-03-refactor-y-cierre.md` | Etapa 3: refactor del PoC, revisión de bitácora y versionado |
| 2026-08-29 | `prompts/2026-08-29-etapa-04-master-local.md` | Inicio de la Etapa 4 (servicio `master` local) |
| 2026-08-29 | `prompts/2026-08-29-etapa-04-revision-commits.md` | Etapa 4: revisión, correcciones, bitácora y reescritura de commits |
| 2026-08-29 | `prompts/2026-08-29-etapa-04-ejecucion-cierre.md` | Etapa 4: ejecución (endpoints RF1–RF4) y cierre |
| 2026-08-29 | `prompts/2026-08-29-etapa-05-connector-local.md` | Inicio de la Etapa 5 (servicio `connector` local) |
| 2026-08-29 | `prompts/2026-08-29-etapa-05-ejecucion-cierre.md` | Etapa 5: ejecución (connector standalone) y cierre |
| 2026-08-29 | `prompts/2026-08-29-etapa-05-auditoria-cierre.md` | Etapa 5: auditoría de código, cierre documental y commits granulares |
| 2026-08-29 | `prompts/2026-08-29-etapa-06-docker-compose.md` | Inicio de la Etapa 6 (Dockerización y Docker Compose) |
| 2026-08-29 | `prompts/2026-08-29-etapa-06-docker-ejecucion-cierre.md` | Etapa 6: ejecución (Docker y Compose) y cierre |
| 2026-08-29 | `prompts/2026-08-29-etapa-06-docker-auditoria-cierre.md` | Etapa 6: auditoría de código, cierre documental y commits granulares |
| 2026-08-30 | `prompts/2026-08-30-etapa-07-aws-ec2-rds.md` | Inicio de la Etapa 7 (Infraestructura AWS: EC2 + RDS) |
| 2026-08-30 | `prompts/2026-08-30-etapa-07-cierre-auditoria.md` | Etapa 7: cierre (auditoría, documentación y versionado granular) |
| 2026-08-30 | `prompts/2026-08-30-etapa-08-primer-despliegue.md` | Inicio de la Etapa 8 (primer despliegue en producción) |
| 2026-08-30 | `prompts/2026-08-30-etapa-08-cierre-auditoria.md` | Etapa 8: cierre (despliegue en producción, documentación y push) |
| 2026-08-30 | `prompts/2026-08-30-etapa-09-dominio-dns.md` | Inicio de la Etapa 9 (dominio y DNS) |
| 2026-08-30 | `prompts/2026-08-30-etapa-09-cierre-auditoria.md` | Etapa 9: cierre (dominio y DNS, documentación y versionado) |
| 2026-08-30 | `prompts/2026-08-30-etapa-10-nginx-reverse-proxy.md` | Inicio de la Etapa 10 (Nginx reverse proxy) |
| 2026-08-30 | `prompts/2026-08-30-etapa-10-cierre-auditoria.md` | Etapa 10: cierre (Nginx reverse proxy, documentación y versionado) |
