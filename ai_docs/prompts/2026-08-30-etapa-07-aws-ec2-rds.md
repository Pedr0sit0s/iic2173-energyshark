# Registro de IA — 2026-08-30 — Inicio de la Etapa 7 (Infraestructura AWS: EC2 + RDS)

- **Herramienta:** opencode CLI (agente de asistencia técnica) · modelo deepseek-v4-flash
- **Fecha y hora:** 2026-08-30 (decimocuarta sesión de trabajo)
- **Contexto:** El usuario cerró la Etapa 6 (Dockerización y Compose, CP-L6) y solicitó avanzar a la siguiente etapa del Plan Maestro: **Etapa 7 — AWS EC2 + RDS** (confirmada tras una aclaración del mensaje «vamos al paso 6»), siguiendo el flujo de documentación del proyecto.

## Prompt (resumen fiel)

"vamos al paso 6" → tras aclaración, el objetivo es la Etapa 7 (AWS EC2 + RDS): generar el plan detallado en `etapas/`, actualizar bitácora y registro de IA, sin escribir todavía el código/script de la etapa.

## Resumen de la respuesta

- Documento `etapas/etapa-07-aws-ec2-rds.md` con la estructura de 17 secciones:
  - Sub-etapas 7.1 (teoría AWS) a 7.6 (RDS + prueba con `psql`), alineadas con el plan maestro.
  - Decisiones técnicas: región us-east-1, Ubuntu 24.04 `t2.micro` (Free Tier) con EBS `gp3` 20 GB, key pair `.pem` fuera del repo, SG EC2 (22 solo mi IP + 80 + 443), SG RDS (5432 solo desde el SG de la EC2), RDS PostgreSQL 16 `db.t3.micro` sin Multi-AZ y `public accessibility: false`, Elastic IP asociada, Docker Engine + Compose plugin en la EC2 y hardening básico (usuario `energyshark` con sudo).
  - Comandos AWS CLI (`create-key-pair`, `run-instances`, `authorize-security-group-ingress`, `allocate-address`/`associate-address`, `create-db-instance`, `psql`).
  - Reglas de seguridad irrenunciables (`.pem` y credenciales RDS nunca versionados; mínimo privilegio en SGs) y troubleshooting.
- Actualización de la bitácora (Entrada 15) y del registro de IA (este archivo) + índice.

## Uso dado

- **Adoptado:** el plan detallado de la Etapa 7 como guía de trabajo (archivo `etapas/etapa-07-aws-ec2-rds.md`).
- **Adoptado:** los datos de la bitácora (usuario IAM `energyshark-deploy`, región us-east-1, reglas de secretos) y las imágenes/Compose de la Etapa 6 como prerrequisito.
- **Pendiente de usuario:** ejecutar las sub-etapas 7.1–7.6 (crear recursos AWS y verificar CP-P1).

## Archivos afectados

- `etapas/etapa-07-aws-ec2-rds.md` (creado)
- `docs/bitacora.md` (Entrada 15 agregada + índice)
- `ai_docs/prompts/2026-08-30-etapa-07-aws-ec2-rds.md` (creado)
- `ai_docs/README.md` (índice de registros actualizado)
- `etapas/README.md` (estado de la Etapa 7 y siguiente etapa)
