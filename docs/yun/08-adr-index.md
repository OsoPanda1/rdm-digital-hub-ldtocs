# YUN ADR Index – Registro de decisiones arquitectónicas

Versión: v1.0
Ámbito: TAMV Online, Nodo Cero, RDM Digital, Isabella, 7 Federaciones

---

## 1. Objetivo

Este archivo es el índice maestro de todas las Architecture Decision Records (ADR) de YUN. Cada decisión arquitectónica significativa se documenta como ADR individual en `/docs/yun/adr/`.

---

## 2. Formato ADR

Cada ADR sigue este formato:

- **ID**: Identificador único (ej. ADR-001).
- **Título**: Descripción corta de la decisión.
- **Fecha**: Fecha de creación.
- **Estado**: Proposed | Accepted | Deprecated | Superseded | Excepción.
- **Contexto**: Situación que motivó la decisión.
- **Decisión**: Qué se decidió.
- **Alternativas consideradas**: Opciones evaluadas.
- **Consecuencias**: Impacto de la decisión.

---

## 3. Índice de ADRs

| ID | Título | Fecha | Estado | Archivo |
|---|---|---|---|---|
| ADR-001 | Supabase para Identity | 2026-07-01 | Accepted | [ADR-001-supabase.md](adr/ADR-001-supabase.md) |
| ADR-002 | Arquitectura event-driven | 2026-07-01 | Accepted | [ADR-002-event-driven.md](adr/ADR-002-event-driven.md) |
| ADR-003 | YUN como base fundacional | 2026-07-01 | Accepted | [ADR-003-yun-architecture.md](adr/ADR-003-yun-architecture.md) |
| ADR-004 | Modelo heptafederado | 2026-07-01 | Accepted | [ADR-004-heptafederation.md](adr/ADR-004-heptafederation.md) |
| ADR-005 | Motor de voz Isabella | 2026-07-01 | Accepted | [ADR-005-voice-engine.md](adr/ADR-005-voice-engine.md) |

---

## 4. Creación de nuevos ADRs

1. Crear un issue proponiendo la decisión.
2. Crear el archivo ADR en `/docs/yun/adr/ADR-XXX-descripcion.md`.
3. Actualizar este índice con el nuevo ADR.
4. Solicitar revisión del Architecture Board.
5. Merge solo tras aprobación.

---

## 5. Estados de ADRs

- **Proposed**: La decisión está propuesta, aún no revisada.
- **Accepted**: La decisión fue aprobada y está en vigor.
- **Deprecated**: La decisión fue reemplazada por una nueva.
- **Superseded**: La decisión fue reemplazada formalmente por otra ADR.
- **Excepción**: La decisión es una excepción a la Constitución YUN, con fecha de revisión.
