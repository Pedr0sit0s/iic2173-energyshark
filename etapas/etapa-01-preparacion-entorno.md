# Etapa 1 — Preparación del entorno local y de trabajo

> **Archivo:** `etapas/etapa-01-preparacion-entorno.md`
> **Estado:** En progreso
> **Checkpoint objetivo:** CP-L1 — Herramientas locales, cuentas y repositorio listos

---

## 1. Objetivo de la etapa

Al terminar esta etapa tendremos:

1. El computador local con todas las herramientas necesarias instaladas y verificadas.
2. Las cuentas necesarias creadas y configuradas (GitHub, AWS, dominio Namecheap).
3. Las credenciales de RabbitMQ del curso identificadas y guardadas de forma segura.
4. El repositorio con la estructura de carpetas definitiva, `.gitignore`, README inicial, bitácora y registro de uso de IA iniciados.
5. Un primer commit como línea base del proyecto.

**No se escribe código de aplicación en esta etapa.** Solo instalación, configuración y documentación.

---

## 2. Requisitos del enunciado que cubre

| Requisito | Cómo se relaciona |
| --- | --- |
| Base de todo el proyecto | Sin entorno preparado no hay desarrollo posible |
| Separación desarrollo local / producción | Aquí se define la estrategia de configuración y secretos que luego aplican `master` y `connector` |
| Seguridad y secretos (`.env`, `.pem`, credenciales) | Se define y aplica la política de no versionar secretos |
| DOC-1 (registro de uso de IA en `ai_docs/prompts`) | Se crea la estructura y se registran las interacciones desde el inicio del proyecto |
| RNF-7 (AWS) y RNF-8 (dominio) | Se preparan las cuentas y credenciales que se usarán en las etapas 7 y 9 |

---

## 3. Teoría general necesaria

### 3.1 Git y repositorios
- **Git** es un sistema de control de versiones distribuido: guarda un historial de cambios (commits) del proyecto.
- **Repositorio remoto (GitHub)**: copia central del historial que permite respaldo y entrega.
- **`.gitignore`**: lista de archivos/carpetas que Git **no** debe versionar (secretos, dependencias, artefactos).

### 3.2 Node.js y npm
- **Node.js** ejecuta JavaScript/TypeScript fuera del navegador. NestJS (nuestro stack) corre sobre Node.
- **npm** es el gestor de paquetes que viene con Node: instala dependencias y ejecuta scripts definidos en `package.json`.
- Se recomienda siempre la versión **LTS** (Long Term Support): estable y con soporte prolongado.

### 3.3 Docker
- **Docker Desktop** (macOS/Windows) incluye el *daemon* de Docker y el plugin de **Docker Compose**.
- El daemon es el proceso que construye y ejecuta contenedores; si Docker Desktop no está corriendo, ningún comando `docker` funciona.
- En Linux (EC2) se instala **Docker Engine** + plugin Compose directamente en el sistema.

### 3.4 AWS CLI y usuario IAM
- La **cuenta root** de AWS tiene acceso total: solo se usa para activar MFA y crear usuarios IAM.
- Un **usuario IAM** es una identidad con permisos acotados; sus **access keys** permiten usar la API de AWS desde el terminal vía **AWS CLI**.
- `aws configure` guarda región y credenciales en `~/.aws/` (fuera del repositorio).

### 3.5 Credenciales de RabbitMQ
- Para conectarse por AMQP se necesita una URL de conexión con el formato `amqp://usuario:contraseña@host:puerto/vhost`.
- El **vhost** es una partición lógica dentro del broker; omitirlo o ponerlo mal es una causa típica de fallos de conexión.
- La **cola asignada al observer** es el punto exacto desde donde el `connector` consumirá.

### 3.6 Variables de entorno y secretos
- Un archivo `.env` guarda configuración sensible en formato `CLAVE=valor`.
- Regla de oro del proyecto: **los `.env` nunca se versionan**; se versiona solo un `.env.example` con nombres de variables y valores de ejemplo.
- En producción (EC2), los `.env` vivirán en el host, fuera del repositorio.

---

## 4. Aplicación específica a EnergyShark

| Herramienta | Uso en el proyecto |
| --- | --- |
| Git + GitHub | Versionar todo el código, `etapas/`, `infra/nginx/` y `ai_docs/`. La EC2 clonará este repo (Etapa 8) |
| Node.js + npm | Ejecutar y compilar `master` y `connector` (NestJS + TypeScript) |
| Docker Desktop | Construir imágenes y probar contenedores localmente (Etapa 6) |
| AWS CLI | Crear/administrar EC2 y RDS desde el terminal (Etapa 7) |
| `psql` | Verificar conectividad con el RDS PostgreSQL (Etapa 7) |
| `curl` + `jq` | Probar la API REST local y en producción (Etapas 4, 8, 12) |
| Credenciales RabbitMQ | Conectar el `connector` con la infraestructura del curso (Etapas 3, 5) |
| Dominio Namecheap | Exponer la API públicamente (Etapas 9–11) |

```mermaid
flowchart LR
    subgraph Workstation[Computador local]
        G[Git + GitHub]
        N[Node.js + npm]
        D[Docker Desktop]
        A[AWS CLI]
        P[psql]
        C[curl + jq]
    end
    subgraph Externos[Servicios externos]
        GH[Repositorio GitHub]
        AWS[AWS: EC2 + RDS]
        RMQ[RabbitMQ del curso]
        NC[Namecheap · dominio]
    end
    G --> GH
    D -->|imágenes/contenedores locales| G
    A --> AWS
    P --> AWS
    C -->|pruebas HTTP| AWS
    N -->|apps NestJS| D
    RMQ -->|credenciales del curso| G
    NC -->|registro A → EC2| AWS
```

---

## 5. Decisiones técnicas

| # | Decisión | Alternativas | Recomendación y por qué |
| --- | --- | --- | --- |
| 1 | Instalación de Node | Instalador oficial LTS vs `nvm` | **Instalador oficial LTS** (nodejs.org): simple, sin configuración de shell. Usar `nvm` solo si necesitas varias versiones en paralelo |
| 2 | Gestor de paquetes | npm vs pnpm | **npm**: ya viene con Node, cero configuración; suficiente para un monorepo de 2 apps |
| 3 | Docker en macOS | Docker Desktop vs Colima/OrbStack | **Docker Desktop**: opción oficial, incluye Compose; ideal para un proyecto del curso |
| 4 | Instalación de Git | `xcode-select` vs Homebrew | **Homebrew** si ya lo tienes; `xcode-select --install` como alternativa sin dependencias |
| 5 | Cliente `psql` | `brew install libpq` vs Postgres.app | **`libpq`**: liviano, solo el cliente (la DB de desarrollo correrá en Docker) |
| 6 | AWS CLI | Homebrew vs instalador oficial | **Homebrew**: instalación y actualización en un comando |
| 7 | Usuario IAM | AdministratorAccess vs políticas acotadas | **Políticas acotadas** (`AmazonEC2FullAccess` + `AmazonRDSFullAccess`): suficiente para las etapas 7–8 y no expone toda la cuenta |
| 8 | Región AWS | us-east-1 vs otras | **us-east-1 (N. Virginia)**: Free Tier estándar del curso |
| 9 | Almacenamiento de secretos | Archivos `.env` locales fuera del repo | **`.env` local + `.env.example` versionado**: simple y adecuado para una entrega universitaria; sin servicios empresariales |

---

## 6. Sub-etapas

### 6.1 Sub-etapa 1.1 — Preparación del computador local
Instalar y verificar: Git, Node.js LTS, npm, Docker Desktop, editor, `psql`, AWS CLI, `curl`, `jq`.

### 6.2 Sub-etapa 1.2 — Cuentas y credenciales
GitHub (repositorio), AWS (cuenta + MFA + usuario IAM + AWS CLI), RabbitMQ (credenciales del curso), dominio Namecheap.

### 6.3 Sub-etapa 1.3 — Estructura del repositorio
Carpetas del monorepo, `.gitignore`, README inicial, bitácora, registro de IA, primer commit.

---

## 7. Pasos concretos — Action Items

## 7.1 — Sub-etapa 1.1: Preparación del computador local

### Paso 1 — Instalar Git
1. Abrir el terminal.
2. Verificar si ya está instalado: `git --version`.
3. Si no está: instalar con Homebrew (`brew install git`) o con `xcode-select --install` (sigue las instrucciones de la ventana).
4. Configurar identidad global:
   - `git config --global user.name "Tu Nombre"`
   - `git config --global user.email "tu@correo.com"`
5. **Verificar:** `git --version` muestra una versión y `git config --global user.name` muestra tu nombre.

### Paso 2 — Instalar Node.js LTS y npm
1. Descargar el instalador LTS desde `https://nodejs.org` (pestaña "LTS").
2. Ejecutar el instalador y seguir los pasos.
3. Abrir un terminal nuevo y verificar: `node -v` y `npm -v`.
4. **Verificar:** ambos comandos muestran versiones (Node ≥ v20, idealmente la LTS vigente).

### Paso 3 — Instalar Docker Desktop
1. Descargar Docker Desktop desde `https://www.docker.com/products/docker-desktop/` (versión para tu chip: Apple Silicon o Intel).
2. Instalar y abrir la aplicación; aceptar los términos.
3. Esperar a que el motor inicie (ícono de ballena estable).
4. Verificar en terminal:
   - `docker --version`
   - `docker compose version`
   - `docker run --rm hello-world` (debe imprimir un mensaje de bienvenida)
5. **Verificar:** el mensaje de `hello-world` confirma que el daemon responde.

### Paso 4 — Instalar editor (VS Code)
1. Descargar desde `https://code.visualstudio.com` e instalar.
2. Opcional: instalar extensiones para TypeScript/NestJS y Docker.

### Paso 5 — Instalar herramientas de soporte
1. Instalar Homebrew si no está (desde `https://brew.sh`).
2. Cliente PostgreSQL: `brew install libpq`
   - En Apple Silicon, agregar al PATH en `~/.zshrc`: `export PATH="/opt/homebrew/opt/libpq/bin:$PATH"` y recargar con `source ~/.zshrc`.
3. AWS CLI: `brew install awscli`
4. `jq`: `brew install jq`
5. `curl` ya viene con macOS.
6. **Verificar** con:
   - `psql --version`
   - `aws --version`
   - `jq --version`
   - `curl --version`

### Paso 6 — Registrar versiones en la bitácora
1. Ejecutar todos los comandos de versión juntos y guardar la salida en la bitácora (sección 11 de este documento).
2. **Verificar:** la bitácora tiene la tabla de versiones completa.

## 7.2 — Sub-etapa 1.2: Cuentas y credenciales

### Paso 7 — Cuenta GitHub y repositorio
1. Crear cuenta en `https://github.com` si no existe.
2. Crear un repositorio **privado** llamado `iic2173-energyshark` (o similar), sin README inicial (lo crearemos nosotros).
3. Decidir visibilidad (privado por defecto salvo indicación del curso).
4. Inicializar el repo local y conectarlo:
   - `git init`
   - `git remote add origin https://github.com/<tu-usuario>/<repo>.git`
5. **Verificar:** `git remote -v` muestra el remoto correcto.

### Paso 8 — Cuenta AWS
1. Crear cuenta en `https://aws.amazon.com` (plan gratuito/educativo según el curso).
2. Activar **MFA** en la cuenta root (AWS → cuenta → Security credentials → MFA).
3. Crear un usuario IAM (IAM → Users → Create user):
   - Nombre: `energyshark-deploy`
   - Acceso: programmatic access (access keys)
   - Permisos: adjuntar políticas `AmazonEC2FullAccess` y `AmazonRDSFullAccess`
4. Guardar Access Key ID y Secret Access Key en un lugar seguro (NO en el repositorio).
5. **Verificar:** el usuario aparece en la lista de IAM con las dos políticas adjuntas.

### Paso 9 — Configurar AWS CLI
1. Ejecutar `aws configure` e ingresar:
   - Access Key ID y Secret (del paso 8)
   - Región: `us-east-1`
   - Formato: `json`
2. Verificar identidad: `aws sts get-caller-identity`
3. **Verificar:** la salida muestra Account, UserId y Arn del usuario IAM.

### Paso 10 — Credenciales de RabbitMQ del curso
1. Ubicar en el enunciado o en la infraestructura del curso: host, puerto AMQP, usuario, contraseña, vhost y **nombre de la cola asignada a tu observer**.
2. Guardarlas en un lugar seguro local (gestor de contraseñas o archivo fuera del repo).
3. Armar mentalmente la URL de conexión: `amqp://usuario:contraseña@host:puerto/vhost`.
4. Registrar en la bitácora solo los datos no sensibles (host, cola, vhost); **nunca** usuario/contraseña en documentación versionada.
5. **Verificar:** tienes a mano todos los datos necesarios para la Etapa 3.

### Paso 11 — Dominio en Namecheap
1. Entrar a `https://www.namecheap.com` y adquirir (o verificar que posees) un dominio para el proyecto.
2. Registrar el dominio elegido en la bitácora.
3. No hace falta tocar DNS todavía: el registro A se configura en la Etapa 9.
4. **Verificar:** el dominio aparece en tu panel de Namecheap.

## 7.3 — Sub-etapa 1.3: Estructura del repositorio

### Paso 12 — Crear carpetas del monorepo
1. En la raíz del proyecto:
   ```
   mkdir -p apps/connector apps/master infra/nginx docs ai_docs/prompts
   ```
2. La carpeta `etapas/` ya existe (documentación por etapas).
3. **Verificar:** `ls` muestra la estructura esperada.

### Paso 13 — Crear `.gitignore`
1. Crear `.gitignore` en la raíz con al menos estas entradas:
   ```
   node_modules/
   dist/
   .env
   .env.*
   !.env.example
   *.pem
   *.log
   .DS_Store
   ```
2. **Verificar:** `git status` NO lista archivos `.env` ni `node_modules`.

### Paso 14 — README inicial
1. Crear `README.md` con: nombre del proyecto, descripción breve, stack, estructura del repo y referencia a `etapas/`.
2. Se completará a fondo en la Etapa 15.
3. **Verificar:** `README.md` existe y renderiza correctamente en GitHub.

### Paso 15 — Bitácora técnica
1. Crear `docs/bitacora.md` con una entrada de plantilla:
   - Fecha, objetivo, decisiones técnicas, problemas encontrados, solución, comandos importantes, resultado de pruebas, referencia al registro de IA.
2. Registrar aquí las primeras entradas: instalación del entorno, versiones, cuentas creadas.
3. **Verificar:** la bitácora ya tiene al menos una entrada completa.

### Paso 16 — Registro de uso de IA (`ai_docs/prompts/`)
1. Crear un archivo por interacción relevante (ej. `2026-08-23-plan-maestro.md`).
2. Cada archivo registra:
   - Fecha y herramienta de IA utilizada
   - Prompt completo
   - Resumen de la respuesta
   - Cómo se usó la respuesta (decisión adoptada / código generado / descartado)
3. Registrar **desde el inicio del proyecto**: la sesión de planificación del Plan Maestro y de esta etapa.
4. **Verificar:** existen al menos 2 registros de IA completos.

### Paso 17 — Primer commit
1. `git add .` y revisar con `git status` que no se está versionando nada sensible.
2. `git commit -m "feat: estructura inicial del proyecto y documentacion de etapas"`
3. `git branch -M main` (si el repo local quedó en `master`)
4. `git push -u origin main`
5. **Verificar:** `git log --oneline` muestra el commit y el repo remoto lo tiene.

---

## 8. Comandos de referencia (resumen)

```bash
# Verificación general
git --version
node -v && npm -v
docker --version && docker compose version
docker run --rm hello-world
psql --version
aws --version
jq --version

# Identidad Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"

# AWS CLI
aws configure
aws sts get-caller-identity

# Estructura del repo
mkdir -p apps/connector apps/master infra/nginx docs ai_docs/prompts

# Primer commit
git add .
git status
git commit -m "feat: estructura inicial del proyecto"
git branch -M main
git push -u origin main
```

---

## 9. Resultados esperados

- Todos los comandos de versión responden sin error.
- `docker run hello-world` funciona (daemon operativo).
- `aws sts get-caller-identity` devuelve la identidad del usuario IAM.
- El repositorio existe en GitHub con el primer commit.
- La estructura de carpetas del monorepo está creada y versionada.
- La bitácora y `ai_docs/prompts/` tienen sus primeras entradas.

---

## 10. Métodos de verificación

| Verificación | Cómo realizarla |
| --- | --- |
| Herramientas instaladas | Cada comando de versión imprime una versión sin error |
| Docker operativo | `docker run --rm hello-world` imprime el mensaje de bienvenida |
| AWS CLI autenticada | `aws sts get-caller-identity` muestra Account y Arn |
| Remoto conectado | `git remote -v` y `git push` sin errores |
| Sin secretos versionados | `git ls-files | grep -E '\.env|\.pem'` no devuelve resultados |
| Estructura correcta | `ls -R` muestra `apps/`, `infra/nginx/`, `docs/`, `ai_docs/prompts/`, `etapas/` |

---

## 11. Errores comunes y troubleshooting

| Problema | Causa probable | Solución |
| --- | --- | --- |
| `docker: command not found` o "Cannot connect to the Docker daemon" | Docker Desktop no instalado o no está corriendo | Abrir Docker Desktop y esperar a que el motor inicie; reintentar |
| `docker compose` no funciona | Versión antigua sin plugin | Actualizar Docker Desktop; verificar con `docker compose version` |
| `node: command not found` tras instalar | Terminal abierto antes de la instalación | Abrir un terminal nuevo o reiniciar el shell |
| Versión de Node antigua | Instalada otra versión anterior | Instalar la LTS desde nodejs.org (sobreescribe) |
| `psql: command not found` en Apple Silicon | `libpq` no está en el PATH | Agregar `/opt/homebrew/opt/libpq/bin` al PATH en `~/.zshrc` y ejecutar `source ~/.zshrc` |
| `brew: command not found` | Homebrew no instalado | Instalar desde `https://brew.sh` |
| `aws: command not found` | AWS CLI no instalado o PATH | `brew install awscli` y verificar PATH |
| `aws sts get-caller-identity` falla con "InvalidClientTokenId" | Credenciales mal copiadas o región incorrecta | Revisar `~/.aws/credentials` y volver a ejecutar `aws configure` |
| "Permission denied" al hacer `git push` | Autenticación no configurada | Usar HTTPS con token personal (Personal Access Token) o configurar SSH |
| Se commiteó un `.env` por accidente | `.gitignore` creado tarde | Eliminar del historial, **rotar todas las credenciales** expuestas y agregar la regla al `.gitignore` |
| `xcode-select --install` no hace nada | Ya instalado | Verificar con `xcode-select -p` y `git --version` |
| No tengo aún las credenciales de RabbitMQ | Dependencia del curso | Marcar como pendiente en la bitácora; no bloquea los pasos 12–17 |

---

## 12. Checklist de finalización

- [ ] Git instalado y configurado (nombre + email).
- [ ] Node.js LTS y npm funcionando.
- [ ] Docker Desktop instalado y `hello-world` ejecutado con éxito.
- [ ] Editor instalado.
- [ ] `psql`, AWS CLI, `jq` y `curl` funcionando.
- [ ] Versiones registradas en la bitácora.
- [ ] Repositorio GitHub creado y conectado como `origin`.
- [ ] Cuenta AWS con MFA en root y usuario IAM con políticas EC2/RDS.
- [ ] `aws configure` con región `us-east-1` y `aws sts get-caller-identity` correcto.
- [ ] Credenciales de RabbitMQ y cola del observer ubicadas y guardadas de forma segura.
- [ ] Dominio Namecheap adquirido/verificado.
- [ ] Carpetas del monorepo creadas (`apps/`, `infra/nginx/`, `docs/`, `ai_docs/prompts/`).
- [ ] `.gitignore` creado y verificado (sin `.env` ni `*.pem` versionados).
- [ ] README inicial creado.
- [ ] Bitácora `docs/bitacora.md` con primeras entradas.
- [ ] Registro de IA iniciado en `ai_docs/prompts/` (desde la planificación del proyecto).
- [ ] Primer commit pusheado a `main`.

---

## 13. Pruebas locales

| # | Prueba | Resultado esperado |
| --- | --- | --- |
| 1 | Ejecutar todos los comandos de versión | Cada uno imprime una versión |
| 2 | `docker run --rm hello-world` | Mensaje de bienvenida de Docker |
| 3 | `aws sts get-caller-identity` | Identidad del usuario IAM |
| 4 | `git push` de un commit trivial | Commit visible en GitHub |
| 5 | `git ls-files` filtrando `.env` y `.pem` | Sin resultados (nada sensible versionado) |

---

## 14. Pruebas en producción

No aplica en esta etapa: aún no existe infraestructura en AWS. La primera prueba en producción ocurre en la Etapa 7 (EC2) y Etapa 8 (despliegue del MVP).

---

## 15. Registro para la bitácora

Al terminar la etapa, registrar en `docs/bitacora.md`:

- Fecha y objetivo de la etapa.
- Tabla de versiones de todas las herramientas instaladas.
- Cuentas creadas: GitHub (nombre del repo), AWS (usuario IAM, región), dominio elegido (sin secretos).
- Estado de las credenciales de RabbitMQ (obtenidas / pendientes del curso).
- Decisiones técnicas de la tabla de la sección 5.
- Problemas encontrados y cómo se resolvieron (sección 11).
- Registros de IA generados en `ai_docs/prompts/` (nombres de archivo).

---

## 16. Siguiente etapa

**Etapa 2 — Fundamentos teóricos y diseño de arquitectura** (`etapa-02-diseno-arquitectura.md`): persistir el diseño ya desarrollado (arquitectura lógica, modelo de datos, API REST, contrato connector→master, configuración por entorno).
