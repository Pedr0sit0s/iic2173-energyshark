# Bitácora Técnica — EnergyShark (IIC2173 · Entrega 0)

> Registro cronológico del proyecto: decisiones, problemas, soluciones, comandos importantes y resultados de pruebas.
> **Regla:** los secretos (contraseñas, access keys, archivos `.pem`) NUNCA se registran aquí.

## Plantilla de entrada

```markdown
## Entrada N — Título

- **Fecha:**
- **Objetivo:**
- **Decisiones técnicas:**
- **Problemas encontrados y solución:**
- **Comandos importantes:**
- **Resultado de pruebas:**
- **Registro de IA:** (archivos en `ai_docs/prompts/` relacionados)
- **Estado:** En progreso / Verificado localmente / Verificado en producción / Completado
```

## Índice de entradas

| # | Fecha | Título |
| --- | --- | --- |
| 1 | 2026-08-23 | Planificación del proyecto y Plan Maestro |
| 2 | 2026-08-23 | Definición de la estructura de documentación (`etapas/`) |
| 3 | 2026-08-23 | Etapa 1 — Preparación del entorno local (ejecución) |
| 4 | 2026-08-23 | Cierre documental de la Etapa 1 |

---

## Entrada 1 — Planificación del proyecto y Plan Maestro

- **Fecha:** 2026-08-23
- **Objetivo:** Definir el Plan Maestro de desarrollo completo (roadmap, etapas, trazabilidad de requisitos y checkpoints).
- **Decisiones técnicas:**
  - Roadmap incremental con 16 etapas (0 a 15), desde preparación del entorno hasta entrega final.
  - Checkpoints `[L]` (local) y `[P]` (producción): una funcionalidad solo se considera terminada cuando se verifica en su entorno real.
  - Parte variable elegida: **HTTPS con Let's Encrypt** (con sección opcional separada de balanceo de carga con Nginx).
  - Estrategia de secretos: `.env` locales fuera del repo, `.gitignore` estricto, `.pem` jamás versionado.
- **Problemas encontrados y solución:** El PDF del enunciado no pudo ser leído por la herramienta de IA; el plan se basó en los requisitos entregados por contexto. Pendiente: contrastar con el PDF.
- **Comandos importantes:** `mkdir -p etapas ai_docs/prompts docs apps/connector apps/master infra/nginx`
- **Resultado de pruebas:** Documentos `etapas/etapa-00-plan-maestro.md` y `etapas/README.md` generados y revisados.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-plan-maestro.md`
- **Estado:** Completado

---

## Entrada 2 — Definición de la estructura de documentación (`etapas/`)

- **Fecha:** 2026-08-23
- **Objetivo:** Fijar la organización física de la documentación: una etapa principal = un archivo `.md` dentro de `etapas/`, con índice general en `etapas/README.md` y desarrollo progresivo etapa a etapa.
- **Decisiones técnicas:**
  - Numeración secuencial descriptiva: `etapa-00-plan-maestro.md`, `etapa-01-preparacion-entorno.md`, ..., `etapa-15-entrega-final.md`.
  - Estados por etapa: Pendiente / En progreso / Verificado localmente / Verificado en producción / Completado.
  - El Plan Maestro (`etapa-00`) contiene roadmap, dependencias, matriz de trazabilidad y checkpoints, pero no desarrolla etapas.
- **Problemas encontrados y solución:** Reorganización del contenido ya generado hacia la nueva estructura. El diseño de arquitectura (desarrollado inicialmente como "Etapa 1") quedó asignado a `etapa-02-diseno-arquitectura.md`, pendiente de persistir.
- **Comandos importantes:** ninguno relevante.
- **Resultado de pruebas:** Estructura `etapas/` verificada en el repositorio.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-plan-maestro.md`
- **Estado:** Completado

---

## Entrada 3 — Etapa 1 — Preparación del entorno local (ejecución)

- **Fecha:** 2026-08-23
- **Objetivo:** Instalar y verificar herramientas, preparar cuentas y crear la estructura del repositorio (checkpoint CP-L1).
- **Decisiones técnicas:** Las registradas en `etapas/etapa-01-preparacion-entorno.md` (sección 5).

### Versiones instaladas

| Herramienta | Versión registrada | Estado |
| --- | --- | --- |
| psql | 17.11 (Homebrew) | Verificado |
| AWS CLI | 2.36.29 | Verificado |
| jq | 1.7.1 | Verificado |
| curl | 8.7.1 | Verificado |
| git | — | Pendiente de registrar |
| Node.js | — | Pendiente de registrar |
| npm | — | Pendiente de registrar |
| Docker | — | Pendiente de registrar |
| Docker Compose | — | Pendiente de registrar |

> Completar con: `git --version; node -v; npm -v; docker --version; docker compose version`

### Cuentas

- **GitHub:** repositorio `https://github.com/Pedr0sit0s/iic2173-energyshark.git` (remoto `origin` configurado en rama `main`).
- **AWS:** pendiente de registrar en bitácora (usuario IAM `energyshark-deploy`, región `us-east-1`, MFA en root).
- **Dominio:** `persito.online` (Namecheap). cPanel del hosting disponible en `server352.web-hosting.com`.

### RabbitMQ (infraestructura del curso)

| Dato | Valor |
| --- | --- |
| Host | `broker.iic2173.org` |
| Puerto | `5671` |
| Transporte | AMQPS (TLS) |
| Virtual host | `energy` |
| Usuario | `observer.45` |
| Exchange | `energy.x` |
| Cola asignada al observer | **Pendiente de confirmar** (requerida para la Etapa 3) |
| Contraseña | Solo en `.env` local — nunca documentada |

URL de conexión prevista: `amqps://observer.45:<password>@broker.iic2173.org:5671/energy`

### Problemas encontrados y solución

- En el registro manual de versiones se ejecutó `q --version` por error; el comando correcto es `jq --version` (jq 1.7.1 verificado).
- La bitácora quedó inicialmente con salida de terminal cruda; se reorganizó en entradas estructuradas (Entrada 4).

### Comandos importantes

```bash
git remote add origin https://github.com/Pedr0sit0s/iic2173-energyshark.git
git branch -M main
```

- **Resultado de pruebas:** Herramientas principales verificadas; pendiente completar la tabla de versiones.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-etapa-01-preparacion-entorno.md`
- **Estado:** En progreso (pendiente: versiones faltantes, confirmar cola AMQP, primer commit y push)

---

## Entrada 4 — Cierre documental de la Etapa 1

- **Fecha:** 2026-08-23
- **Objetivo:** Dejar el "papeleo" de la Etapa 1 terminado: README principal completo, bitácora reorganizada y registro de uso de IA iniciado.
- **Decisiones técnicas:**
  - README raíz con arquitectura, stack, estructura del repo, reglas de seguridad y estado del proyecto.
  - Bitácora reorganizada en entradas numeradas con plantilla fija.
  - `ai_docs/` con índice (`README.md`) y un archivo por interacción relevante de IA.
  - Se agregaron `.gitkeep` en `apps/connector`, `apps/master` e `infra/nginx` para que la estructura quede visible en el repositorio.
- **Problemas encontrados y solución:** Sin problemas relevantes.
- **Comandos importantes:** pendientes del usuario (primer commit y push).
- **Resultado de pruebas:** Documentos generados y revisados; estructura completa.
- **Registro de IA:** `ai_docs/prompts/2026-08-23-papeleo-final-etapa-01.md`
- **Estado:** Completado
