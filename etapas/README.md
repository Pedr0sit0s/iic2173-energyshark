# Índice de Etapas — EnergyShark (IIC2173 · Entrega 0)

> Documentación del proyecto organizada por etapas. **Cada etapa principal del Plan Maestro tiene exactamente un archivo `.md` en esta carpeta.**

## Estructura del repositorio

```text
/
├── etapas/                  ← Documentación por etapas (esta carpeta)
│   ├── README.md            ← Este índice general
│   ├── etapa-00-plan-maestro.md
│   ├── etapa-01-preparacion-entorno.md
│   └── ...
├── ai_docs/
│   └── prompts/             ← Registro obligatorio del uso de IA
└── README.md                ← README principal del proyecto
```

## Reglas de uso

1. Una etapa principal = un archivo `.md` en `etapas/`.
2. Las sub-etapas y tareas se documentan **dentro** del archivo de su etapa.
3. Al completar una etapa se actualiza el estado en la tabla de abajo.
4. Un requisito solo se marca **Verificado en producción** cuando fue probado en el entorno de despliegue, no solo en local.
5. Cada archivo de etapa registra al final qué anotar en la bitácora y en `ai_docs/prompts`.

## Estados posibles

| Estado | Significado |
| --- | --- |
| Pendiente | No iniciada |
| En progreso | En desarrollo |
| Verificado localmente | Implementada y probada en local |
| Verificado en producción | Implementada y probada en EC2/AWS |
| Completado | Todos los criterios de finalización verificados |

## Índice general

| Etapa | Archivo | Objetivo | Estado |
| --- | --- | --- | --- |
| 0 | `etapa-00-plan-maestro.md` | Roadmap general, trazabilidad y checkpoints | Completado |
| 1 | `etapa-01-preparacion-entorno.md` | Preparación del entorno local, cuentas y repositorio | En progreso |
| 2 | `etapa-02-diseno-arquitectura.md` | Fundamentos teóricos y diseño de la arquitectura | Completado |
| 3 | `etapa-03-poc-rabbitmq.md` | Prueba de concepto: conexión, consumo y reconexión AMQP | Verificado localmente |
| 4 | `etapa-04-master-api-local.md` | Servicio `master`: API REST + persistencia local (RF1–RF4) | Verificado localmente |
| 5 | `etapa-05-connector-local.md` | Servicio `connector`: consumo AMQP + reenvío HTTP | Verificado localmente |
| 6 | `etapa-06-docker-compose.md` | Dockerización de ambos servicios + Compose + health checks | Pendiente |
| 7 | `etapa-07-aws-ec2-rds.md` | Infraestructura AWS: EC2 (Free Tier) + RDS PostgreSQL | Pendiente |
| 8 | `etapa-08-primer-despliegue.md` | Primer despliegue funcional en EC2 (MVP en producción) | Pendiente |
| 9 | `etapa-09-dominio-dns.md` | Dominio Namecheap, registro A y propagación DNS | Pendiente |
| 10 | `etapa-10-nginx-reverse-proxy.md` | Nginx en el host EC2 como reverse proxy | Pendiente |
| 11 | `etapa-11-https-letsencrypt.md` | HTTPS con Let's Encrypt + renovación automática | Pendiente |
| 12 | `etapa-12-resiliencia-healthchecks.md` | Pruebas de resiliencia y validación de health checks | Pendiente |
| 13 | `etapa-13-trazabilidad-auditoria.md` | Trazabilidad de requisitos y auditoría contra el enunciado | Pendiente |
| 14 | `etapa-14-documentacion-ia-bitacora.md` | Documentación de uso de IA y bitácora técnica | Pendiente |
| 15 | `etapa-15-entrega-final.md` | Preparación de la entrega final | Pendiente |

## Nota de numeración

La Etapa 2 (diseño de arquitectura) está **Completada** al 100%. Las Etapas 3 (PoC RabbitMQ), 4 (`master` local) y 5 (`connector` local) están **Verificadas localmente** (checkpoints CP-L3, CP-L4 y CP-L5): el PoC consume y se reconecta, `master` persiste/consulta eventos, y el `connector` consume `observer.45.q`, reenvía a `master` y se reconecta ante caídas del broker.

## Siguiente etapa recomendada

**Etapa 5** (`etapa-05-connector-local.md`) — **Verificada localmente** (checkpoint CP-L5): `connector` NestJS standalone consume la cola del curso, reenvía cada evento a `POST /events` con timeout, reintentos y ack solo tras 2xx, y se reconecta con backoff ante cortes (RNF-1, RNF-2, RNF-3). El flujo RabbitMQ → connector → master → DB quedó verificado con eventos reales. Próxima etapa: **Etapa 6 — Dockerización** (Dockerfiles multi-stage + Docker Compose + HEALTHCHECK).
