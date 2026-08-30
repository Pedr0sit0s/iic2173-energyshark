# EnergyShark — Master API

Servicio `master` de EnergyShark (Entrega 0 · IIC2173): API REST NestJS que persiste y consulta el historial de eventos de demanda eléctrica en PostgreSQL.

## Endpoints

| Método | Ruta | Descripción | Requisito |
| --- | --- | --- | --- |
| POST | `/events` | Ingesta interna de eventos (`connector` → `master`); asigna `receivedAt` (UTC), extrae `validUntil` de `packageBody` y es idempotente por `idpk` | RNF-2 |
| GET | `/history` | Historial paginado (default 25) con filtros `type`, `receivedAt` (día), `receivedAtFrom/To`, `validUntilFrom/To` y `city` (dentro de `packageBody.demands[]`) | RF1, RF3, RF4 |
| GET | `/history/:id` | Detalle por `id` propio (404 si no existe) | RF2 |
| GET | `/health` | Health check con verificación de conexión a PostgreSQL | RNF-5 |

Respuesta de `GET /history`: `{ items: [...], meta: { page, limit, total, totalPages } }`.

## Configuración

Variables de entorno (ver `.env.example` en la raíz del repositorio): `NODE_ENV`, `PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_SSL` (opcional, para RDS). El `.env` real no se versiona.

## Requisitos locales

PostgreSQL de desarrollo (contenedor Docker):

```bash
docker run -d --name energy-postgres \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=energy_db \
  -p 5432:5432 -v energy_pgdata:/var/lib/postgresql/data postgres:16
```

## Scripts

```bash
npm install                     # instalar dependencias
npm run build                   # compilar
npm run start                   # arrancar (desarrollo)
npm run start:prod              # arrancar compilado
npm run migration:generate -- src/migrations/Nombre -d src/data-source.ts
npm run migration:run           # aplicar migraciones
npm run migration:revert        # revertir la última migración
```

## Arquitectura

- `src/history/`: módulo de la tabla `history` (entidad, DTOs, controlador y servicio).
- `src/health/`: endpoint `/health` con chequeo real de la base de datos.
- `src/config/env.validation.ts`: validación fail-fast de las variables de entorno.
- `src/data-source.ts`: DataSource para la CLI de migraciones (TypeORM).
