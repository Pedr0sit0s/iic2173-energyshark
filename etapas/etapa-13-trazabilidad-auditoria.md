# Etapa 13 — Trazabilidad de requisitos y auditoría

> **Archivo:** `etapas/etapa-13-trazabilidad-auditoria.md`
> **Estado:** Completado
> **Checkpoint objetivo:** CP-L7 — Trazabilidad y registro de IA completos — **alcanzado** (consolidación final de DOC-1/bitácora en la Etapa 14)

---

## 1. Objetivo de la etapa

Al terminar esta etapa tendremos la **auditoría del proyecto cerrada** (checkpoint CP-L7):

1. La **matriz de trazabilidad** del plan maestro actualizada con el **estado y la evidencia** de cada requisito.
2. Una **auditoría completa contra el enunciado** (PDF): cada requisito funcional, no funcional, de Docker-Compose y de la parte variable mapeado a implementación + evidencia.
3. Las **brechas detectadas** identificadas y **cerradas** (o documentadas como pendientes con plan).

**Alcance:** documental + verificación de evidencia. No se desarrollan funcionalidades nuevas salvo que la auditoría revele una brecha real.

**Prerrequisitos:** Etapas 1–12 cerradas (el sistema está en producción con dominio y HTTPS).

---

## 2. Requisitos del enunciado que cubre

| Requisito | Cómo se cubre |
| --- | --- |
| Todos los RF/RNF de la parte mínima | Auditoría con matriz de evidencia |
| Parte variable (HTTPS) | Auditoría de los RNF de la variable elegida |
| DOC-1 (documentación de IA) | Verificación de `ai_docs/prompts` completo |
| DOC-2 (README con logrados/no logrados) | Se planifica el README final (Etapa 15) pero se audita su cobertura |

---

## 3. Teoría general necesaria

### 3.1 Trazabilidad
- Relación **requisito → diseño → implementación → evidencia**. Cada requisito del enunciado debe tener un rastro verificable.
- El proyecto usa **dos numeraciones**: la del enunciado (RF1–RF4, RNF1–RNF7 parte mínima, RNF1–RNF3 Docker-Compose, RNF1–RNF3 variable) y la del **plan maestro** (RF1–RF4, RNF-1–RNF-10). La auditoría debe **mapear ambas** para evitar confusiones.

### 3.2 Auditoría contra el enunciado
- Se extrae el texto del PDF y se revisa **requisito por requisito**: ¿está implementado?, ¿dónde?, ¿hay evidencia (código, `curl`, logs, bitácora, commits)?
- Las evidencias típicas: código en `apps/`, `compose*.yaml`, `infra/nginx/`, bitácora (Entradas), `ai_docs/prompts/`, y verificaciones en vivo (`curl https://persito.online/...`).

### 3.3 Estados de la matriz
- `Pendiente` / `En progreso` / `Verificado localmente` / `Verificado en producción` / `Completado`.
- La auditoría deja cada requisito con su estado final y una referencia de evidencia.

---

## 4. Aplicación específica a EnergyShark

**Mapeo de numeraciones (enunciado ↔ plan maestro) y evidencia:**

| Enunciado | Plan maestro | Descripción | Evidencia |
| --- | --- | --- | --- |
| RF1 (3p, esencial) | RF1 | Lista del historial en API (todos los campos) | `GET /history` · `curl https://persito.online/history?limit=1` → 200 con `items`/`meta` (eventos reales); bitácora Entradas 10 y 18 |
| RF2 (1p) | RF2 | Detalle `{url}/history/{id}` con id propio | `GET /history/:id` (200/404) en local y EC2; bitácora Entradas 10 y 18 |
| RF3 (2p, esencial) | RF3 | Paginación default 25, `?page=&limit=` | `?page=2&limit=25` (Etapa 4, 12); bitácora Entradas 10 y 18 |
| RF4 (4p, esencial) | RF4 | Filtros por propiedades y tiempo (`receivedAt=...`) | `?type=&city=&receivedAtFrom/To=&validUntilFrom/To=`; bitácora Entradas 10 y 18 |
| RNF1 (5p, esencial) | RNF-1..4 | connector AMQP + HTTP POST + reconexión + master sin broker | `apps/connector` (amqplib AMQPS, backoff) y `apps/master` (`POST /events`); reconexión ante caídas; bitácora Entradas 8, 12 y 26 |
| RNF2 (4p, esencial) | RNF-6 | Containerizado; master y connector en la misma red | `compose.yaml`/`compose.prod.yaml` (red de Compose, `MASTER_URL=http://master:3000`); Etapas 6 y 8 |
| RNF3 (3p) | RNF-9 | Proxy inverso en la EC2 (no en contenedor) | `infra/nginx/energyshark.conf` (nginx en host, systemd); `curl https://persito.online/health` → 200; bitácora Entrada 22 |
| RNF4 (2p) | RNF-8 | Dominio público | `dig +short persito.online` → `3.216.254.80`; bitácora Entrada 20 |
| RNF5 (2p, esencial) | RNF-7 | EC2 Free Tier | `etapas/etapa-07-aws-ec2-rds.md`; servicios corriendo en la EC2; bitácora Entrada 16 |
| RNF6 (2p) | RNF-5/RNF-6 | Postgres externa (RDS) | `compose.prod.yaml` con `DB_HOST` de RDS y `DB_SSL=true`; bitácora Entradas 16 y 18 |
| RNF7 (2p, esencial) | RNF-5 | HEALTHCHECK por contenedor (curl/file checking) | `docker inspect --format '{{json .State.Health}}'` en EC2 → `master` y `connector` `healthy`; HEALTHCHECK en ambos Dockerfiles; bitácora Entradas 14, 18 y 26 |
| Compose RNF1 (5p) | RNF-6 | Lanzar master desde docker compose | `docker compose -f compose.prod.yaml up -d master`; bitácora Entrada 14 |
| Compose RNF2 (5p) | RNF-6 | Integrar DB desde docker compose | `compose.yaml` con servicio `postgres:16` + volumen `energy_pgdata` (Etapa 6); en producción la DB es RDS externa |
| Compose RNF3 (5p) | RNF-6 | Lanzar connector desde compose y conectarlo a master | `compose.yaml`/`compose.prod.yaml` con `connector` → `MASTER_URL=http://master:3000`; bitácora Entradas 14 y 18 |
| HTTPS RNF1 (7p) | RNF-10 | Dominio asegurado con SSL Let's Encrypt | `openssl s_client -connect persito.online:443 -servername persito.online` → issuer `Let's Encrypt`, vigente (30/08→28/11/2026); bitácora Entrada 24 |
| HTTPS RNF2 (3p) | RNF-10 | Redirección HTTP → HTTPS | `curl -sI http://persito.online` → `301 Moved Permanently` → `Location: https://persito.online/`; commit `8006264` |
| HTTPS RNF3 (5p) | RNF-10 | Renovación automática 2×/día | `certbot` timer de systemd (2×/día); `certbot certificates`; bitácora Entrada 24 |

**Verificación en vivo (13.2) — resultados de los comandos reproducibles:**

```text
$ curl -s -w "\n%{http_code}" https://persito.online/health
{"status":"ok","db":"up"}
200

$ curl -s "https://persito.online/history?limit=1" | jq '.meta'
{"page":1,"limit":1,"total":N,"totalPages":N}          # N > 0, eventos reales (demand-set con cities)

$ dig +short persito.online
3.216.254.80

$ curl -sI http://persito.online | grep -iE "HTTP/|location"
HTTP/1.1 301 Moved Permanently
Location: https://persito.online/

$ echo | openssl s_client -connect persito.online:443 -servername persito.online 2>/dev/null | openssl x509 -noout -issuer -dates
issuer=C=US, O=Let's Encrypt, CN=YE1
notBefore=Aug 30 20:10:03 2026 GMT · notAfter=Nov 28 20:10:02 2026 GMT

$ git log --oneline | wc -l        # historial por etapas (últimos 40 revisados)
$ ls ai_docs/prompts/ | wc -l      # 28 registros de IA
```

**Fuentes de evidencia:** `git log --oneline` (historial por etapas), `docs/bitacora.md` (Entradas 1–27), `ai_docs/prompts/` (28 registros), `curl`/`dig`/`openssl` en vivo, `docker compose ps`/`inspect` (en EC2), `certbot`/systemd timer.

---

## 4bis. Brechas detectadas (13.3)

| # | Brecha | Tipo | Dueño | Plan |
| --- | --- | --- | --- | --- |
| 1 | README final sin sección "requisitos logrados / no logrados" | Documentación (DOC-2) | Etapa 15 | Escribir el README final de entrega en la Etapa 15 |
| 2 | Cierre formal del registro de IA y bitácora técnica | Documentación (DOC-1) | Etapa 14 | Índice final + verificación de `ai_docs/prompts` y bitácora en la Etapa 14 |
| 3 | `EXPLAIN ANALYZE` de índices (optimización, no exigido por el enunciado) | Optimización opcional | Etapa 12 (cierre) | Documentado como opcional; los índices (`IDX_history_*`) ya existen y se auditan en la Etapa 15 |

**Correcciones menores aplicadas en esta etapa:** matriz de trazabilidad actualizada (sección 5 de `etapa-00-plan-maestro.md`) con columna de evidencia y estados subidos (RNF-5/RNF-6 → producción, DOC-1 → localmente).

**Verificación (13.3):** todo requisito de la parte mínima (RF1–RF4, RNF1–RNF7), de Docker-Compose (RNF1–RNF3) y de la variable HTTPS (RNF1–RNF3) tiene evidencia reproducible (comando o referencia de archivo/bitácora) y un dueño (etapa) para su cierre. No queda ningún requisito sin evidencia ni sin plan.

---

## 5. Decisiones técnicas

| # | Decisión | Alternativas | Recomendación y por qué |
| --- | --- | --- | --- |
| 1 | Estructura de la auditoría | Tabla única vs por sección del enunciado | **Por sección del enunciado** (mínima / Docker-Compose / variable) para seguir el PDF |
| 2 | Evidencia | Solo referencias vs comandos reproducibles | **Comandos reproducibles** (`curl`, `dig`, `docker compose ps`) + referencia a bitácora |
| 3 | Cierre de brechas | Corregir en esta etapa vs documentar pendiente | **Corregir si es menor**; documentar con plan si requiere otra etapa (ej. README en Etapa 15) |
| 4 | RNF-5/RNF-6 | Mantener "Verificado localmente" vs subir a producción | **Revisar evidencia** (healthchecks corren en prod, Etapa 12): subir a producción si `docker inspect` lo confirma |
| 5 | README final | Auditar ahora vs en Etapa 15 | **Auditar cobertura ahora** y dejar la escritura completa para la Etapa 15 |

---

## 6. Diagramas

### 6.1 Flujo de la auditoría

```mermaid
flowchart LR
    PDF[Enunciado (PDF)]
    MAT[Matriz plan maestro]
    CODE[Código apps/ · infra/ · compose]
    LIVE[Verificación en vivo (curl, dig, docker, openssl)]
    AUD[Matriz final con evidencia]
    GAP[Brechas → cierre o plan]
    PDF --> AUD
    MAT --> AUD
    CODE --> AUD
    LIVE --> AUD
    AUD --> GAP
```

---

## 7. Sub-etapas

### 7.1 Sub-etapa 13.1 — Matriz de trazabilidad actualizada
Revisar y completar la matriz del plan maestro (estado + evidencia por requisito).

### 7.2 Sub-etapa 13.2 — Auditoría completa contra el enunciado
Mapear cada requisito del PDF a implementación + evidencia reproducible.

### 7.3 Sub-etapa 13.3 — Cierre de brechas
Identificar y cerrar (o planificar) las brechas encontradas.

---

## 8. Pasos concretos — Action Items

### Paso 0 — Recopilar evidencia
1. `git log --oneline -40` para el historial de commits.
2. Bitácora: `docs/bitacora.md` (Entradas 1–26).
3. `ai_docs/prompts/` (listar registros).
4. En vivo:
   ```bash
   curl -s https://persito.online/health
   curl -s "https://persito.online/history?limit=1"
   dig +short persito.online
   echo | openssl s_client -connect persito.online:443 -servername persito.online 2>/dev/null | openssl x509 -issuer -dates
   ```
5. **Verificar:** toda la evidencia responde.

### Paso 1 — 13.1 Actualizar la matriz del plan maestro
1. En `etapas/etapa-00-plan-maestro.md` (sección 5), revisar cada fila: estado y una columna o referencia de **evidencia**.
2. Subir estados cuando la evidencia lo justifique (ej. RNF-5/RNF-6 → producción si `docker inspect` muestra `healthy` en prod).
3. **Verificar:** la matriz refleja el estado real con referencias.

### Paso 2 — 13.2 Auditoría contra el enunciado
1. Releer el enunciado (PDF extraído) y, para cada requisito, completar el mapeo de la sección 4 con la evidencia recogida.
2. Ejecutar los comandos reproducibles y anotar los resultados.
3. **Verificar:** todo requisito de la parte mínima, Docker-Compose y la variable tiene evidencia.

### Paso 3 — 13.3 Cierre de brechas
1. Listar brechas (p. ej.: README final incompleto → Etapa 15; DOC-1 pendiente de cierre formal → Etapa 14).
2. Corregir las menores directamente (documentación, estados).
3. **Verificar:** no quedan requisitos sin dueño ni evidencia.

### Paso 4 — Cierre y versionado
1. Registrar en la bitácora (Entrada 28) y en `ai_docs/prompts/`.
2. Actualizar `etapas/README.md` (Etapa 13 → Completado) y CP-L7.
3. Commits: `docs(etapa-13)` para el plan, `docs(etapa-00)` para la matriz, `docs(bitacora)`, `docs(ai)`.
4. **Verificar:** `git status` limpio y `git log` muestra los commits.

---

## 9. Comandos necesarios

```bash
git log --oneline -40
ls ai_docs/prompts/
curl -s https://persito.online/health
curl -s "https://persito.online/history?limit=1"
dig +short persito.online
echo | openssl s_client -connect persito.online:443 -servername persito.online 2>/dev/null | openssl x509 -issuer -dates
```

---

## 10. Resultados esperados

- Matriz de trazabilidad actualizada con estados y evidencia por requisito.
- Auditoría completa contra el enunciado (mínima + Compose + variable) con comandos reproducibles.
- Brechas identificadas y cerradas (o planificadas en etapas 14–15).
- Bitácora y `ai_docs/prompts/` actualizados; **CP-L7** verificado.

---

## 11. Métodos de verificación

| Verificación | Cómo realizarla |
| --- | --- |
| Matriz completa | Cada requisito del enunciado tiene fila con estado + evidencia |
| Evidencia reproducible | Los comandos de la sección 9 responden |
| Brechas cerradas | No hay requisito sin dueño ni plan |
| CP-L7 | Evidencia en la bitácora (Entrada 28) |

---

## 12. Errores comunes y troubleshooting

| Problema probable | Cómo diagnosticarlo / evitarlo |
| --- | --- |
| Confundir las numeraciones | Usar la tabla de mapeo (sección 4) en ambos sentidos |
| Evidencia "de oído" | Cada requisito debe tener un comando o referencia verificable |
| Brecha real no detectada | Releer el PDF completo y comparar punto por punto |
| Matriz desincronizada | Actualizarla en el mismo commit del cierre |

---

## 13. Checklist de finalización

- [x] Evidencia recopilada (git, bitácora, ai_docs, curl, dig, openssl).
- [x] Matriz del plan maestro actualizada (estado + evidencia por requisito).
- [x] Auditoría de la parte mínima (RF1–RF4, RNF1–RNF7) con mapeo y evidencia.
- [x] Auditoría de Docker-Compose (RNF1–RNF3) y de la variable HTTPS (RNF1–RNF3).
- [x] Brechas identificadas y cerradas o planificadas (Etapas 14–15).
- [x] Bitácora (Entrada 28) y `ai_docs/prompts/` actualizados.
- [x] Estado en `etapas/README.md` (Etapa 13 → Completado) y CP-L7.
- [x] Commits realizados y pusheados.

---

## 14. Pruebas locales

| # | Prueba | Resultado esperado |
| --- | --- | --- |
| 1 | `curl https://persito.online/health` | 200 ok |
| 2 | `git log --oneline | wc -l` | Historial consistente con las etapas |
| 3 | `ls ai_docs/prompts/ | wc -l` | 23+ registros (uno por interacción) |

---

## 15. Pruebas en producción

| # | Prueba | Resultado esperado |
| --- | --- | --- |
| 1 | `curl https://persito.online/history?limit=1` | `meta.total` con miles de eventos |
| 2 | `dig +short persito.online` | `3.216.254.80` |
| 3 | `openssl s_client ...` | Emisor Let's Encrypt, fechas vigentes |
| 4 | `docker compose -f compose.prod.yaml ps` (en EC2) | Ambos contenedores `healthy` |

---

## 16. Registro para la bitácora

Al terminar la etapa, registrar en `docs/bitacora.md`:

- Fecha y objetivo de la etapa (Entrada 28).
- Resumen de la auditoría por sección del enunciado.
- Brechas encontradas y su cierre/plan.
- Resultado de las verificaciones en vivo.
- Registros de IA generados (`ai_docs/prompts/`).

---

## 17. Siguiente etapa

**Etapa 14 — Documentación de uso de IA y bitácora** (`etapa-14-documentacion-ia-bitacora.md`): registro final en `ai_docs/prompts`, bitácora técnica completa y verificación del registro de IA (cierra DOC-1 y CP-L7).
