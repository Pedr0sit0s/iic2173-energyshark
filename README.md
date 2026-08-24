# EnergyShark — IIC2173 · Entrega 0

Plataforma observadora del flujo de energía eléctrica entre ciudades. Consume eventos publicados por la infraestructura del curso en RabbitMQ (AMQP), los persiste en PostgreSQL y expone una API REST para consultar el historial de demanda.

## Estado del proyecto

| Etapa | Estado |
| --- | --- |
| 0 — Plan Maestro | Completado |
| 1 — Preparación del entorno | En progreso (cierre documental) |
| 2–15 | Pendientes |

Índice completo y trazabilidad: [`etapas/README.md`](etapas/README.md) y [`etapas/etapa-00-plan-maestro.md`](etapas/etapa-00-plan-maestro.md).

## Arquitectura

```mermaid
flowchart LR
    subgraph Curso[Infraestructura del curso]
        P[Producer]
        X[Exchange energy.x]
        Q[Cola del observer]
    end
    subgraph EC2[AWS EC2 · Docker]
        C[connector]
        M[master · API REST]
    end
    DB[(PostgreSQL · RDS)]
    N[Nginx en host EC2]
    Cliente[Cliente externo]

    P -->|publish| X
    X --> Q
    Q -->|AMQPS consume| C
    C -->|HTTP POST /events| M
    M --> DB
    Cliente -->|HTTPS| N
    N -->|proxy_pass| M
```

| Componente | Responsabilidad | Tecnología |
| --- | --- | --- |
| `connector` | Consume la cola AMQP del observer, parsea el JSON, se reconecta automáticamente y reenvía cada evento a `master` por HTTP POST | NestJS standalone + amqplib |
| `master` | API REST: recibe eventos, asigna `receivedAt` (UTC), persiste y sirve el historial paginado y filtrable | NestJS + TypeORM |
| PostgreSQL | Persistencia del historial de eventos | RDS en producción, contenedor en desarrollo |
| Nginx | Reverse proxy en el host: dominio → `master`, HTTPS | Nginx + Let's Encrypt/Certbot |

## Stack

- TypeScript · NestJS · amqplib
- PostgreSQL
- Docker · Docker Compose
- AWS EC2 · AWS RDS (Free Tier)
- Nginx (instalado en el host de EC2)
- Dominio Namecheap · Let's Encrypt · Certbot
- Ubuntu en EC2

## Estructura del repositorio

```text
/
├── apps/
│   ├── connector/          ← Consumidor AMQP + reenvío HTTP
│   └── master/             ← API REST NestJS
├── etapas/                 ← Documentación por etapas (una etapa = un archivo)
├── ai_docs/prompts/        ← Registro obligatorio del uso de IA
├── docs/bitacora.md        ← Bitácora técnica del proyecto
├── infra/nginx/            ← Configuraciones de Nginx versionadas
└── README.md
```

## Requisitos del enunciado

| ID | Requisito | Estado |
| --- | --- | --- |
| RF1 | Historial de demanda eléctrica | Pendiente |
| RF2 | Detalle de un registro (`/history/{id}`) | Pendiente |
| RF3 | Paginación (default 25) | Pendiente |
| RF4 | Filtros (incl. `receivedAt` y fechas) | Pendiente |
| RNF | Separación de servicios, resiliencia, Docker, AWS, dominio, Nginx, HTTPS | Pendientes |

Matriz de trazabilidad completa: `etapas/etapa-00-plan-maestro.md` (sección 5).

## Documentación

- **Etapas y avance:** [`etapas/README.md`](etapas/README.md)
- **Bitácora técnica:** [`docs/bitacora.md`](docs/bitacora.md)
- **Registro de uso de IA:** [`ai_docs/`](ai_docs/)

## Reglas de seguridad

- Los archivos `.env` **nunca** se versionan (solo `.env.example`).
- El archivo `.pem` de EC2 **jamás** se sube al repositorio.
- Contraseñas y access keys viven únicamente en archivos locales fuera del control de versiones.
- En producción, los secretos se guardan en el host EC2, no en el repositorio.

## Quickstart

En construcción: estará disponible a partir de la Etapa 4 (API local) y la Etapa 6 (Docker Compose).

## Uso de IA

Todo el trabajo asistido por herramientas de IA queda registrado en [`ai_docs/prompts/`](ai_docs/prompts/) según lo exige el enunciado (requisito DOC-1).
