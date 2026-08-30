# Etapa 14 — Documentación de uso de IA y bitácora

> **Archivo:** `etapas/etapa-14-documentacion-ia-bitacora.md`
> **Estado:** Completado
> **Checkpoint objetivo:** CP-L7 — Trazabilidad y registro de IA completos (cierre de DOC-1) — **alcanzado**

---

## 1. Objetivo de la etapa

Al terminar esta etapa tendremos el **registro de uso de IA y la bitácora completos**:

1. **`ai_docs/prompts/`** con un registro por cada interacción relevante (prompt, respuesta y uso).
2. **Bitácora técnica** con todas las entradas del proyecto, coherentes y completas.
3. **Verificación final** de que el registro de IA cumple el requisito DOC-1 del enunciado.

**Alcance:** documental (no hay código). Consolida el **CP-L7** iniciado en la Etapa 13.

**Prerrequisitos:** Etapa 13 cerrada (auditoría con matriz de evidencia).

---

## 2. Requisitos del enunciado que cubre

| Requisito | Cómo se cubre |
| --- | --- |
| DOC-1 (documentación de uso de IA en `ai_docs/prompts`) | Registro completo y verificado de todas las interacciones |
| Respecto al uso de AI (enunciado) | Cada consulta/prompt de ChatGPT/Claude/IDE registrado con su respuesta |

---

## 3. Teoría general necesaria

### 3.1 Registro de IA (DOC-1)
- El enunciado exige documentar **todo** el uso de IA: prompts, respuestas y decisiones adoptadas.
- Formato del proyecto (definido en la Etapa 1): fecha, herramienta/modelo, contexto, prompt (resumen fiel), resumen de la respuesta, uso dado y archivos afectados.
- Índice en `ai_docs/README.md` con una fila por registro.

### 3.2 Bitácora técnica
- Registro cronológico del proyecto: decisiones, problemas, soluciones, comandos y resultados de pruebas.
- Formato con plantilla fija (fecha, objetivo, decisiones, problemas, comandos, resultado, registro de IA, estado).

### 3.3 Verificación
- Revisar que **cada registro** de `ai_docs/prompts/` tiene los campos obligatorios y aparece en el índice.
- Revisar que **cada interacción** documentada en la bitácora referencia su registro de IA.

---

## 4. Aplicación específica a EnergyShark

| Elemento | Estado actual |
| --- | --- |
| `ai_docs/prompts/` | 27 registros (uno por etapa/sesión) |
| `ai_docs/README.md` | Índice completo con fecha, archivo y tema |
| `docs/bitacora.md` | 28 entradas (planificación y cierre por etapa) |
| Herramienta/modelo | opencode CLI · deepseek-v4-flash |

Inventario esperado de registros por sesión (orden cronológico): plan maestro, Etapa 1 (3), Etapa 2, Etapa 3 (3), Etapa 4 (3), Etapa 5 (3), Etapa 6 (3), Etapa 7 (2), Etapa 8 (2), Etapa 9 (2), Etapa 10 (2), Etapa 11 (2), Etapa 12 (2), Etapa 13 (2), + esta etapa.

---

## 5. Decisiones técnicas

| # | Decisión | Alternativas | Recomendación y por qué |
| --- | --- | --- | --- |
| 1 | Formato de registro | Texto libre vs plantilla fija | **Plantilla fija** (definida en la Etapa 1): consistente y auditable |
| 2 | Alcance de la verificación | Solo índice vs registro por registro | **Registro por registro** (campos obligatorios) + cruce con la bitácora |
| 3 | Consolidación de la bitácora | Reescribir vs corregir puntual | **Corregir puntual** (formato/redacción) manteniendo el historial |
| 4 | Cierre de DOC-1 | Marcar "Verificado localmente" ahora | **Sí**: la verificación de esta etapa cierra DOC-1 |

---

## 6. Sub-etapas

### 7.1 Sub-etapa 14.1 — Registro en `ai_docs/prompts`
Revisar que cada interacción relevante tenga su registro con los campos completos.

### 7.2 Sub-etapa 14.2 — Bitácora técnica completa
Revisar la bitácora: todas las entradas, formato coherente y referencias a registros de IA.

### 7.3 Sub-etapa 14.3 — Verificación final del registro de IA
Cruzar bitácora ↔ `ai_docs/prompts/` y marcar DOC-1 como verificado.

---

## 8. Pasos concretos — Action Items

### Paso 0 — Inventario
1. Listar registros: `ls ai_docs/prompts/` (deben ser ~28 tras esta etapa).
2. Listar entradas de la bitácora: índice de `docs/bitacora.md`.
3. **Verificar:** el inventario es completo y ordenado.

### Paso 1 — 14.1 Registros de `ai_docs/prompts`
1. Revisar cada registro: fecha, herramienta/modelo, contexto, prompt, respuesta, uso dado, archivos afectados.
2. Completar/corregir cualquier registro incompleto y **añadir el de esta etapa** (14).
3. **Verificar:** todos los campos presentes y el índice actualizado.

### Paso 2 — 14.2 Bitácora técnica completa
1. Revisar todas las entradas (1–30): formato y coherencia.
2. Corregir redacción/ortografía si hace falta (sin cambiar el contenido histórico).
3. **Verificar:** la bitácora es coherente y profesional.

### Paso 3 — 14.3 Verificación final (DOC-1)
1. Cruzar: cada entrada de la bitácora referencia su registro de IA, y viceversa.
2. Marcar **DOC-1 → Verificado localmente** en la matriz del plan maestro (Etapa 13 lo dejó así).
3. Registrar en la bitácora (Entrada 31) y en `ai_docs/prompts/`.
4. Commits: `docs(ai)` y `docs(bitacora)`.
5. **Verificar:** DOC-1 cerrado y CP-L7 consolidado.

---

## 9. Comandos necesarios

```bash
ls ai_docs/prompts/ | wc -l        # nº de registros
ls ai_docs/prompts/
grep -c "^## Entrada" docs/bitacora.md
```

---

## 10. Resultados esperados

- `ai_docs/prompts/` completo y con formato verificado.
- Bitácora completa y coherente (Entradas 1–31).
- DOC-1 → Verificado localmente; CP-L7 consolidado.
- Commits realizados y pusheados.

---

## 11. Métodos de verificación

| Verificación | Cómo realizarla |
| --- | --- |
| Registros completos | Cada archivo de `ai_docs/prompts/` con los 7 campos |
| Índice al día | `ai_docs/README.md` lista todos los registros |
| Bitácora coherente | Entradas numeradas con la plantilla |
| Cruce bitácora ↔ registros | Cada entrada referencia su registro de IA |
| DOC-1 cerrado | Matriz: DOC-1 → Verificado localmente |

---

## 12. Errores comunes y troubleshooting

| Problema probable | Cómo diagnosticarlo / evitarlo |
| --- | --- |
| Registro sin campos | Revisar contra la plantilla de `ai_docs/README.md` |
| Registro sin referencia en la bitácora | Cruzar índice de bitácora ↔ `ai_docs/prompts/` |
| Índice desactualizado | Añadir la fila al añadir el registro |

---

## 13. Checklist de finalización

- [x] Inventario de registros completo.
- [x] Cada registro con los campos obligatorios.
- [x] Registro de esta etapa añadido.
- [x] Índice de `ai_docs/README.md` actualizado.
- [x] Bitácora revisada (Entradas 1–31).
- [x] Cruce bitácora ↔ registros de IA verificado.
- [x] DOC-1 → Verificado localmente en la matriz.
- [x] Bitácora (Entrada 31) y registros de IA actualizados.
- [x] Estado en `etapas/README.md` (Etapa 14 → Completado).
- [x] Commits realizados y pusheados.

---

## 14. Pruebas locales

| # | Prueba | Resultado esperado |
| --- | --- | --- |
| 1 | `ls ai_docs/prompts/ | wc -l` | ~28 registros |
| 2 | `grep -c "^## Entrada" docs/bitacora.md` | 31 entradas |
| 3 | Índice de `ai_docs/README.md` | Todas las filas sin duplicados |

---

## 15. Pruebas en producción

No aplica (etapa puramente documental).

---

## 16. Registro para la bitácora

Al terminar la etapa, registrar en `docs/bitacora.md`:

- Fecha y objetivo de la etapa (Entrada 31).
- Inventario final de registros de IA y entradas de bitácora.
- Resultado de la verificación (campos, cruce, DOC-1).

---

## 17. Siguiente etapa

**Etapa 15 — Preparación de la entrega final** (`etapa-15-entrega-final.md`): README completo (arquitectura, despliegue, logrados/no logrados), checklist final de producción, accesos para Canvas + `.pem` (nunca en GitHub) y verificación end-to-end final.
