# Etapa 2 — Fundamentos teóricos y diseño de arquitectura

> **Archivo:** `etapas/etapa-02-diseno-arquitectura.md`
> **Estado:** Completado
> **Checkpoint objetivo:** CP-L2 — Arquitectura diseñada y versionada

---

## 1. Objetivo de la etapa

Al terminar esta etapa tendremos, **solo con documentación (sin código de aplicación)**:

1. Los conceptos fundamentales comprendidos (AMQP, NestJS, Docker, AWS, Nginx, HTTPS, resiliencia).
2. La arquitectura lógica del proyecto documentada con diagramas.
3. El modelo de datos decidido y justificado (columnas vs JSONB).
4. La API REST diseñada y mapeada a los requisitos RF1–RF4.
5. El contrato de comunicación `connector → master` definido.
6. El inventario de variables de entorno para desarrollo y producción.
7. Todas las decisiones técnicas registradas con sus alternativas.

Este documento es la referencia contra la cual se desarrollarán las Etapas 3–6 y la auditoría final (Etapa 13).

---

## 2. Requisitos del enunciado que cubre

| Requisito | Cómo se cubre |
| --- | --- |
| RF1 (historial de demanda) | Diseño de `GET /history` y del modelo de datos (sección 8.4 y 8.3) |
| RF2 (detalle por id propio) | Diseño de `GET /history/:id` usando el `id` generado por el sistema |
| RF3 (paginación, default 25) | Diseño de parámetros `page`/`limit` con `LIMIT/OFFSET` |
| RF4 (filtros, incl. `receivedAt`) | Decisión columnas vs JSONB + diseño de filtros temporales |
| RNF-1 (separación de servicios) | Arquitectura lógica: `connector` y `master` independientes |
| RNF-2 (HTTP POST connector→master) | Contrato de comunicación (sección 8.5) |
| RNF-3 (reconexión automática) | Decisiones sobre cliente AMQP y backoff (sección 5) |
| RNF-4 (master opera sin RabbitMQ) | Arquitectura desacoplada: `master` solo depende de PostgreSQL |
| RNF-7/RNF-8/RNF-9/RNF-10 | Referencias de arquitectura para AWS, dominio, Nginx y HTTPS (etapas 7–11) |

---

## 3. Teoría general necesaria

### 3.1 AMQP y RabbitMQ
- **Broker**: servidor RabbitMQ que recibe, enruta y entrega mensajes.
- **Exchange**: punto de entrada donde los *producers* publican. NO almacena mensajes; los enruta según su tipo (direct, fanout, topic, headers).
- **Queue**: estructura que **sí almacena** mensajes hasta que un *consumer* los toma.
- **Binding**: regla que conecta una queue a un exchange mediante una *routing key*. En nuestro caso la infraestructura del curso ya tiene este binding hecho: nosotros solo consumimos de una cola asignada.
- **Consumir por AMQP**: abrir una *connection* (TCP), sobre ella abrir *channels* (canales lógicos multiplexados) y usar `basic.consume` para recibir mensajes en modo push.
- **Ack (acknowledgement)**: el mensaje solo se elimina de la queue cuando el consumer lo confirma. Si la conexión cae antes del ack, RabbitMQ reencola el mensaje → semántica **at-least-once** → nuestro sistema debe tolerar duplicados.
- **Reconexión**: si la connection se cierra, el cliente debe detectarlo y reconectar; las librerías exponen eventos (`close`, `error`, `blocked`) para reaccionar.
- **AMQPS (TLS)**: la conexión se cifra. El broker del curso usa TLS en el puerto `5671`, por lo que el cliente debe configurar TLS explícitamente.

### 3.2 NestJS y TypeScript
- **Módulo**: unidad de organización que agrupa lógica relacionada (ej. `HistoryModule`, `DatabaseModule`).
- **Controlador**: recibe requests HTTP y delega en servicios.
- **Servicio (provider)**: contiene la lógica de negocio.
- **Inyección de dependencias (DI)**: el contenedor de NestJS instancia y conecta las dependencias declaradas; facilita tests y reemplazo de implementaciones.
- **ConfigModule**: mecanismo para cargar variables de entorno de forma centralizada y validada.

### 3.3 Docker y Docker Compose
- **Imagen**: artefacto inmutable construido desde un Dockerfile.
- **Contenedor**: proceso aislado que ejecuta una imagen.
- **Docker Compose**: orquesta múltiples contenedores, define redes, volúmenes, variables de entorno y healthchecks en un archivo declarativo.
- **Healthcheck**: prueba activa que Docker ejecuta periódicamente para saber si el contenedor está operativo.

### 3.4 AWS: VPC, Security Groups, EC2, RDS
- **VPC**: red virtual privada dentro de AWS.
- **Security Group (SG)**: firewall con estado asociado a recursos; define reglas de entrada/salida por puerto y origen. Hay que permitir explícitamente cada flujo (SSH, HTTP, HTTPS, EC2→RDS).
- **EC2**: máquina virtual Linux (Ubuntu) donde correrá Docker con `master` y `connector`, más Nginx en el host.
- **RDS**: base PostgreSQL administrada por AWS; se accede mediante un endpoint DNS y solo desde la EC2 (vía SG).

### 3.5 Nginx, DNS y HTTPS
- **Reverse proxy**: recibe las requests externas en los puertos 80/443 y las reenvía internamente a `master`. El mundo exterior nunca habla directo con la API.
- **DNS**: traduce el dominio a una IP. Un **registro A** apunta el nombre al Elastic IP de la EC2.
- **HTTPS/TLS**: cifra la conexión entre cliente y servidor. Un **certificado** emitido por una CA (Let's Encrypt vía Certbot) valida que el dominio nos pertenece.

### 3.6 Resiliencia y health checks
- **Sistema resiliente**: ante fallos parciales (RabbitMQ caído, `master` caído), el sistema no colapsa permanentemente: se degrada o se recupera solo.
- **Health check**: verificación activa de que un servicio "está vivo de verdad" (no solo que el proceso existe). Ej: `/health` en `master` que además verifica conexión a DB.

### 3.7 Timestamps en UTC
- Todos los campos temporales del sistema (especialmente `receivedAt`) se almacenan como timestamp **con zona horaria UTC** (ISO8601), nunca como `timestamp without time zone` ni como strings ambiguos.

---

## 4. Aplicación específica a EnergyShark

| Concepto | Aplicación en el proyecto |
| --- | --- |
| RabbitMQ | La infraestructura del curso publica eventos en el exchange `fulfillment.x` y los enruta a **nuestra cola asignada**. El `connector` la consume con `basic.consume` por AMQPS (TLS). |
| Ack / at-least-once | `connector` solo confirma (ack) un mensaje **después** de que `master` lo persistió (HTTP 2xx). Un duplicado ocasional es aceptable; la pérdida de eventos, no. |
| Reconexión AMQP | `connector` implementa backoff exponencial y nunca termina permanentemente por caída del broker (RNF-3). |
| NestJS | `master` es una app NestJS con HTTP (controladores + TypeORM). `connector` es una app NestJS standalone (sin servidor HTTP) que usa el cliente AMQP. |
| Modelo de datos | Tabla `history` con columnas para los campos filtrables y JSONB para el cuerpo completo del evento. |
| Docker | Cada servicio tiene su Dockerfile; Compose define la red interna entre `connector`, `master` y `postgres` local. |
| EC2 + RDS | En producción, `master` y `connector` corren en contenedores en EC2; PostgreSQL vive en RDS. |
| Nginx | Instalado en el host de la EC2, recibe tráfico por el dominio `persito.online` y lo reenvía a `master`. |
| receivedAt | Lo asigna `master` en el instante de recepción del POST, en UTC. |

**Datos de la infraestructura del curso (no sensibles, de la bitácora):**

| Dato | Valor |
| --- | --- |
| Host | `broker.iic2173.org` |
| Puerto | `5671` (AMQPS/TLS) |
| Virtual host | `energy` |
| Usuario | `observer.45` |
| Exchange | `fulfillment.x` |
| Cola asignada | **Pendiente de confirmar — prerrequisito para la Etapa 3** |

---

## 5. Decisiones técnicas

| # | Decisión | Alternativas | Recomendación y por qué |
| --- | --- | --- | --- |
| 1 | Estructura del repo | Dos repos separados vs monorepo | **Monorepo** (`apps/connector`, `apps/master`, `infra/nginx`): entrega universitaria, un solo `git clone` en EC2, más simple de auditar |
| 2 | `connector` en NestJS | Script standalone Node/TS vs NestJS standalone | **NestJS standalone** (sin HTTP server): consistencia con `master`, misma tooling (TS, config, logs); evita una API innecesaria |
| 3 | Cliente RabbitMQ | `amqplib` (bajo nivel) vs `@golevelup/nestjs-rabbitmq` | **`amqplib`**: control total de la reconexión (RNF-3) y soporte directo de conexiones TLS (requerido por el broker del curso, AMQPS) |
| 4 | ORM | TypeORM vs Prisma vs Knex | **TypeORM**: integración nativa con NestJS, migraciones integradas, ampliamente usado en el curso |
| 5 | Cuerpo del evento | Todo JSONB vs todo columnas | **Híbrido**: columnas para campos consultados/filtrados (`idpk`, `type`, `receivedAt`, `validUntil`) + `packageBody` JSONB completo. Equilibrio flexibilidad/rendimiento |
| 6 | Paginación | `LIMIT/OFFSET` vs keyset (cursor) | **`LIMIT/OFFSET`**: suficiente para miles de registros y cumple exactamente `?page=2&limit=25`; keyset solo si las pruebas de la Etapa 12 muestran degradación |
| 7 | Origen de `receivedAt` | connector vs master | **master** lo asigna al recibir el POST: una sola fuente de verdad del "momento de recepción" |
| 8 | Región AWS | us-east-1 vs otra | **us-east-1 (N. Virginia)**: Free Tier estándar del curso |
| 9 | PostgreSQL en dev | Docker vs instalación nativa | **Contenedor Docker** en dev: replica el entorno de producción y no ensucia el sistema local |
| 10 | Conexión AMQPS con TLS | Sin TLS (5672) vs TLS (5671) | **TLS obligatorio**: el broker del curso expone `5671` con AMQPS; `amqplib` lo soporta mediante opciones de conexión TLS |

---

## 6. Diagramas

### 6.1 Flujo de eventos (núcleo del proyecto)

```mermaid
flowchart LR
    subgraph Curso[Infraestructura del curso]
        P[Producer del curso]
        X[Exchange fulfillment.x]
        Q[Cola asignada<br/>al observer]
    end
    subgraph Docker[EC2 · Docker]
        C[connector<br/>cliente AMQP + HTTP]
        M[master<br/>API NestJS]
    end
    DB[(PostgreSQL<br/>RDS en prod / contenedor en dev)]
    P -->|publish| X
    X -->|binding| Q
    Q -->|basic.consume AMQPS| C
    C -->|ack solo tras éxito| Q
    C -->|POST /events| M
    M -->|INSERT + receivedAt| DB
```

### 6.2 Flujo de consultas (clientes → API)

```mermaid
flowchart LR
    Cliente[Cliente externo]
    N[Nginx en host EC2<br/>80/443]
    M[master :3000]
    DB[(PostgreSQL)]
    Cliente -->|https://persito.online/history| N
    N -->|proxy_pass| M
    M -->|SELECT con paginación| DB
```

Puntos clave del diseño:

- `connector` y `master` solo se comunican por HTTP interno (red Docker / localhost).
- Nada externo toca `connector` ni la base de datos directamente.
- `master` sigue respondiendo `/history` aunque RabbitMQ o `connector` estén caídos (RNF-4).

---

## 7. Sub-etapas

### 7.1 Sub-etapa 2.1 — Conceptos esenciales
Repaso guiado de la sección 3: AMQP/RabbitMQ, NestJS/DI, Docker/Compose, AWS (VPC/SG/EC2/RDS), Nginx/DNS/HTTPS, resiliencia/health checks, UTC.

### 7.2 Sub-etapa 2.2 — Arquitectura lógica
Validación de componentes, responsabilidades y diagramas de flujo; contrato `connector → master`.

### 7.3 Sub-etapa 2.3 — Modelo de datos
Decisión columnas vs JSONB, tabla `history`, índices, `receivedAt` en UTC.

### 7.4 Sub-etapa 2.4 — API REST
Endpoints, paginación, filtros y mapeo a RF1–RF4.

### 7.5 Sub-etapa 2.5 — Configuración por entorno
Variables de entorno dev/prod y estrategia de secretos.

---

## 8. Pasos concretos — Action Items

### Paso 1 — Revisar la teoría (Sub-etapa 2.1)
1. Leer la sección 3 completa de este documento.
2. Si algún concepto no queda claro, preguntar al asistente (o al equipo del curso) **antes** de seguir.
3. **Verificar:** puedes explicar con tus palabras qué diferencia hay entre exchange y queue, y qué significa "consumir con ack".

### Paso 2 — Validar los componentes contra el enunciado (Sub-etapa 2.2)
1. Comparar la lista de componentes de la sección 4 con el enunciado oficial.
2. Confirmar que `connector` y `master` tienen responsabilidades separadas y sin solapamiento.
3. Confirmar la cola AMQP asignada al observer y actualizar la tabla de la sección 4.
4. **Verificar:** cada componente del enunciado aparece en el diagrama 6.1 con su responsabilidad correcta.

### Paso 3 — Aprobar el modelo de datos (Sub-etapa 2.3)
1. Revisar la tabla propuesta:

| Columna | Tipo | Descripción |
| --- | --- | --- |
| `id` | `uuid` PK (generado por el sistema) | Identificador propio; es el `{id}` de RF2 |
| `idpk` | `uuid` | `idpk` del evento del curso |
| `type` | `text` | Tipo del evento (ej. `demand-set`) |
| `receivedAt` | `timestamptz` NOT NULL | Timestamp de recepción en UTC |
| `validUntil` | `timestamptz` NULL | Extraído de `packageBody` para filtros temporales |
| `packageBody` | `jsonb` NOT NULL | Cuerpo completo del evento, sin alterar |
| `createdAt` | `timestamptz` | Auditoría de inserción |

2. Confirmar índices: btree en `receivedAt`, `validUntil` y `type`; opcional GIN en `packageBody` si los filtros JSONB lo justifican.
3. Justificar en la bitácora por qué `packageBody` es JSONB y los campos filtrables son columnas.
4. **Verificar:** la tabla cubre RF1–RF4 y el campo `receivedAt` del enunciado.

### Paso 4 — Aprobar la API REST (Sub-etapa 2.4)
1. Revisar los endpoints:

| Endpoint | Método | Función | Requisitos |
| --- | --- | --- | --- |
| `/events` | POST | Ingesta interna connector→master; asigna `receivedAt`, inserta, responde 201 con el registro creado (incluye `id`) | RNF-2 |
| `/history` | GET | Lista paginada con todos los campos relevantes; `page` y `limit` (default 25); filtros por `type`, `receivedAt` (desde/hasta), `validUntil` (desde/hasta) y opcional `city` (JSONB) | RF1, RF3, RF4 |
| `/history/:id` | GET | Detalle por `id` propio; 404 si no existe | RF2 |
| `/health` | GET | Health check real (API + DB) | RNF-5 |

2. Confirmar formato de respuesta de `/history`: `{ items: [...], meta: { page, limit, total, totalPages } }`.
3. Confirmar errores estándar: 400 (parámetros inválidos), 404, 500.
4. **Verificar:** cada RF del enunciado está mapeado a un endpoint.

### Paso 5 — Aprobar el contrato `connector → master` (Sub-etapa 2.2)
1. Reglas acordadas:
   - `connector` envía el JSON recibido **tal cual** en el body del `POST /events`.
   - `master` (y no `connector`) es la autoridad sobre `receivedAt` y sobre el `id` propio.
   - Éxito = HTTP 2xx → `connector` hace ack. Error/red caída → NO ack + reintento con backoff.
   - Timeout de la request configurable (ej. 5–10 s).
2. **Verificar:** el diseño tolera duplicados pero no pierde eventos.

### Paso 6 — Aprobar la configuración por entorno (Sub-etapa 2.5)
1. Revisar el inventario base:

| Variable | Servicio | Dev (local) | Prod (AWS) |
| --- | --- | --- | --- |
| `PORT` | master | 3000 | 3000 |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | master | contenedor postgres local | endpoint RDS |
| `RABBITMQ_URL` | connector | `amqps://observer.45:<pass>@broker.iic2173.org:5671/energy` | la misma (curso) |
| `RABBITMQ_QUEUE` | connector | cola asignada | cola asignada |
| `MASTER_URL` | connector | `http://master:3000` (red Docker) | `http://localhost:3000` (mismo host) |
| `NODE_ENV` | ambos | development | production |

2. Confirmar la estrategia de secretos: `.env` no versionado, `.env.example` versionado, en EC2 el `.env` vive en el host.
3. **Verificar:** ninguna credencial aparece en documentación versionada.

### Paso 7 — Validación final y versionado
1. Contrastar todo este documento con el enunciado oficial (PDF) y anotar discrepancias en la bitácora.
2. Registrar la entrada de bitácora y el registro de IA correspondientes.
3. Commit: `git add etapas/etapa-02-diseno-arquitectura.md docs/bitacora.md ai_docs/ && git commit -m "docs: etapa 2 diseno de arquitectura"` (adaptar archivos según lo modificado).
4. Actualizar el estado de la etapa en `etapas/README.md`.
5. **Verificar:** `git log --oneline` muestra el commit.

---

## 9. Comandos necesarios

```bash
# Versionado del diseño
git add etapas/etapa-02-diseno-arquitectura.md docs/bitacora.md ai_docs/prompts/
git commit -m "docs: etapa 2 diseno de arquitectura"
git push
```

---

## 10. Resultados esperados

- El documento de diseño (este archivo) queda versionado y validado contra el enunciado.
- La cola AMQP asignada queda confirmada y registrada.
- La matriz de trazabilidad se actualiza: los requisitos RF4 y RNF-2 (diseño) pasan a "En progreso/Verificado localmente" en lo que corresponde al diseño.
- La bitácora y `ai_docs/prompts/` quedan actualizados.

---

## 11. Métodos de verificación

| Verificación | Cómo realizarla |
| --- | --- |
| Diseño cubre el enunciado | Checklist de la sección 13 + revisión del PDF oficial |
| Consistencia de diagramas | Los componentes de los diagramas coinciden con los de la sección 4 |
| Modelo de datos coherente | La tabla cubre RF1–RF4 y `receivedAt` es `timestamptz` UTC |
| API mapeada | Cada endpoint de la sección 8.4 referencia su requisito |
| Sin secretos expuestos | `grep -R "pass\|password" etapas/ docs/ ai_docs/` no muestra credenciales reales |
| Versionado | `git log --oneline` muestra el commit de la etapa |

---

## 12. Errores comunes y troubleshooting

| Problema probable | Cómo diagnosticarlo / evitarlo |
| --- | --- |
| Confundir exchange con queue | El `connector` **solo consume de la queue asignada**; jamás declara ni publica en exchanges del curso. Verificar nombres en la bitácora |
| Olvidar que el broker usa TLS (5671) | Usar `amqp://` en vez de `amqps://` fallará en la Etapa 3. La URL de conexión debe usar `amqps://` y opciones TLS |
| Ack mal ubicado | Ack antes de persistir = pérdida de eventos. Regla: ack **solo** tras 2xx |
| `receivedAt` sin zona horaria | El tipo debe ser `timestamptz`; la app trabaja siempre en UTC |
| Confundir `id` propio con `idpk` | `/history/:id` usa **nuestro** `id`; `idpk` es un campo más del evento |
| URL de RabbitMQ mal formada | Validar formato `amqps://user:pass@host:5671/vhost`; vhost incorrecto es causa típica de fallo |
| Variables de entorno mezcladas entre entornos | Mantener separación dev/prod definida en la sección 8.6; prohibir valores por defecto de producción |
| Diagramas desactualizados | Cada cambio de diseño se refleja el mismo día en este archivo y en la bitácora |

---

## 13. Checklist de finalización

- [x] Teoría de la sección 3 leída y comprendida.
- [x] Componentes validados contra el enunciado (sección 4).
- [ ] Cola AMQP asignada confirmada y registrada en la bitácora. *(traspasada a la Etapa 3 como Paso 0 — única excepción del cierre)*
- [x] Diagramas 6.1 y 6.2 aprobados y consistentes.
- [x] Modelo de datos aprobado (tabla + índices, columnas vs JSONB justificado).
- [x] `receivedAt` definido como `timestamptz` UTC asignado por `master`.
- [x] API diseñada y mapeada a RF1–RF4 (endpoints, paginación, filtros, errores).
- [x] Contrato connector→master definido (ack solo tras 2xx, reintentos).
- [x] Inventario de variables de entorno dev/prod aprobado.
- [x] Estrategia de secretos verificada (sin credenciales versionadas).
- [x] Documento contrastado con el enunciado oficial (PDF).
- [x] Matriz de trazabilidad actualizada (diseño de RF4 y RNF-2).
- [x] Bitácora y `ai_docs/prompts/` actualizados.
- [x] Commit realizado y pusheado.

---

## 14. Pruebas locales

| # | Prueba | Resultado esperado |
| --- | --- | --- |
| 1 | Walkthrough del diseño con el enunciado al lado | Todos los requisitos RF1–RF4 y RNF-1–RNF-4 quedan cubiertos por el diseño |
| 2 | Revisión del contrato connector→master | No hay caso de fallo que produzca pérdida de eventos |
| 3 | `grep` de secretos en archivos versionados | Sin coincidencias de credenciales reales |
| 4 | Render del diagrama Mermaid | Los diagramas se visualizan correctamente en GitHub |

---

## 15. Pruebas en producción

No aplica en esta etapa: no hay código ni infraestructura. Las primeras pruebas en producción ocurren en las Etapas 7–8.

---

## 16. Registro para la bitácora

Al terminar la etapa, registrar en `docs/bitacora.md`:

- Fecha y objetivo de la etapa.
- Decisiones técnicas aprobadas (tabla de la sección 5).
- Resultado de la validación contra el enunciado (con discrepancias si las hubo).
- Cola AMQP confirmada (nombre).
- Problemas encontrados y soluciones (sección 12).
- Registro de IA generado (`ai_docs/prompts/`).

---

## 17. Siguiente etapa

**Etapa 3 — Prueba de concepto: conexión a RabbitMQ** (`etapa-03-poc-rabbitmq.md`): script mínimo AMQP con TLS, consumo de la cola asignada, parsing JSON y prueba de reconexión. **Prerrequisito:** nombre de la cola confirmado.
