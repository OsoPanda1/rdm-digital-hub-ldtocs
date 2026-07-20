# ADR-004 – Heptafederation Model for Civilizational Coordination

Status: Accepted
Date: 2026-07-05
Authors: YUN Architecture Board

---

## Context

TAMV Online, Nodo Cero, RDM Digital e Isabella operan sobre un territorio y una civilización digital:

- Gobierno local,
- comercio y turismo,
- academia y ciencia,
- tecnología e infraestructura,
- comunidad y organizaciones,
- metaverso y XR.

Se requiere representar estos actores y sus responsabilidades de forma explícita para:

- diseñar políticas y flujos de datos,
- coordinar continuidad operativa,
- gestionar incidentes y degradaciones sin colapso total.

---

## Decision

Definir un modelo **heptafederado** compuesto por 7 federaciones:

- **Fed1 – Comercio local**
- **Fed2 – Turismo y cultura**
- **Fed3 – Academia y ciencia**
- **Fed4 – Gobierno local**
- **Fed5 – Tecnología e infraestructura**
- **Fed6 – Comunidad y organizaciones**
- **Fed7 – Metaverso y XR**

Cada módulo YUN declara:

- `yun.federation` principal.
- Su comportamiento en modos degradados (degradado por dominio, degradado por federación).
- Sus eventos relacionados con salud y operación federada (`FederationHealthChanged`, `FederationIncident`, `FederationPolicyUpdated`).

El fabric de datos y eventos trata las federaciones como entidades gobernables, con reglas de continuidad:

- Si una federación falla, se marca como degradada.
- Las demás federaciones ajustan su comportamiento.
- Las operaciones críticas se suspenden en la federación afectada.
- Las operaciones seguras se mantienen donde sea posible.

---

## Consequences

- **Positivas**:

  - Visibilidad de cuál federación está detrás de cada módulo y operación.
  - Capacidad de degradar operaciones por federación sin detener todo el sistema.
  - Mejor alineación con actores reales (gobierno, comercio, comunidad, academia, etc.).
  - Base clara para configurar políticas de datos y seguridad según federación.

- **Negativas**:

  - Mayor complejidad conceptual (los equipos deben entender federaciones y su impacto).
  - Necesidad de definir coordinadores por federación y roles (Data Steward, Coordinator).

---

## Alternatives Considered

1. Modelo de federación simple (2–3 federaciones amplias).
   - Rechazado por baja granularidad y poca capacidad de representar actores específicos.

2. Modelo sin federaciones (todos los servicios en un único espacio).
   - Rechazado por falta de claridad en gobernanza y continuidad.

3. Modelo con más de 7 federaciones desde el inicio.
   - Rechazado por complejidad excesiva inicial; el diseño actual permite extensión futura (Fed8, Fed9, etc.).

---

## Links

- `/docs/yun/03-blueprint.md` (sección Federaciones y continuidad)
- `/docs/yun/06-event-standard.md` (eventos federados)
- `/docs/yun/07-operations-manual.md` (modos degradados y recuperación)