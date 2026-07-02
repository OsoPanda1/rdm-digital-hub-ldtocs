# YUN Architecture Governance – Marco de decisión y control

Versión: v1.0
Ámbito: TAMV Online, Nodo Cero, RDM Digital, Isabella, 7 Federaciones

---

## 1. Objetivo

Este documento define el marco de gobernanza arquitectónica de YUN: quién decide, cómo se decide y qué registro deja cada decisión significativa.

---

## 2. YUN Architecture Board

### 2.1 Composición

- Responsables técnicos de TAMV Online.
- Responsables del Nodo Cero.
- Representantes de federaciones clave.
- Responsable de seguridad.

### 2.2 Funciones

- Definir principios y estándares.
- Revisar propuestas de cambio arquitectónico.
- Aprobar o rechazar nuevos dominios.
- Gestionar excepciones.
- Mantener el roadmap de YUN.

---

## 3. Procesos formales

### 3.1 Creación de nuevo dominio

1. Propuesta formal.
2. Evaluación de impacto en datos, seguridad y federaciones.
3. ADR asociado.
4. Aprobación del Architecture Board.

### 3.2 Cambio mayor en arquitectura

1. Evaluación contra la Constitución YUN.
2. Clasificación:
   - Aprobado.
   - Aprobado con condiciones.
   - Rechazado.
   - Excepción justificada.
3. ADR obligatorio.

### 3.3 Aceptación de excepción

- Debe tener motivo claro.
- Debe tener fecha de revisión.
- Debe quedar registrada como ADR con estado "Excepción".

### 3.4 Deprecación de servicio

- Plan de migración.
- Ventana de convivencia.
- Comunicación a todas las federaciones afectadas.
- Registro en ADR como "Superseded".

### 3.5 Versionado de decisiones

- Cada decisión significativa se documenta como ADR con estado:
  - Proposed.
  - Accepted.
  - Deprecated.
  - Superseded.

---

## 4. Flujos de aprobación

```
Propuesta → Revisión → Decisión → ADR
```

1. **Propuesta**: Se genera un issue o PR con la propuesta de cambio.
2. **Revisión**: El Architecture Board revisa contra la Constitución YUN.
3. **Decisión**: Se clasifica (aprobado, condicionado, rechazado, excepción).
4. **ADR**: Se documenta la decisión con contexto, alternativas y consecuencias.

---

## 5. Trazabilidad

- Cada cambio arquitectónico se versiona en Git.
- Los ADR se mantienen en `/docs/yun/adr/`.
- El Architecture Board mantiene el roadmap actualizado en `/docs/yun/`.
