# ADR-004: Modelo heptafederado

Fecha: 2026-07-01
Estado: Accepted

---

## Contexto

El ecosistema RDM Digital requiere representar múltiples sectores: gobierno local, academia, industria, ciudadanía, infraestructura, comunidad y metaverso. Cada sector tiene necesidades distintas de datos, seguridad y operación.

La alternativa era un modelo monolítico sin separación por sectores, o un modelo de pocos módulos grandes.

## Decisión

Organizar el sistema en 7 federaciones coordinadas:

| Federación | Sector |
|---|---|
| Fed1 | Comercio local |
| Fed2 | Turismo y cultura |
| Fed3 | Academia y ciencia |
| Fed4 | Gobierno local |
| Fed5 | Tecnología e infraestructura |
| Fed6 | Comunidad y organizaciones |
| Fed7 | Metaverso y XR |

Cada federación:
- Se coordina a través del Data Fabric.
- Tiene su propio Federation Coordinator.
- Puede degradarse independientemente de las demás.
- Se comunica mediante eventos estándar.

## Alternativas consideradas

- **Modelo monolítico**: Un solo sistema para todo (rechazado por acoplamiento excesivo).
- **3-4 módulos grandes**: Menor granularidad, mayor riesgo de fallo en cascada.
- **Federaciones ilimitadas**: Complejidad excesiva de gobernanza.

## Consecuencias

- Distribución de responsabilidades por sector.
- Aislamiento de fallos: una federación en fallo no derriba a las demás.
- Incorporación de nuevas federaciones con proceso de gobernanza.
- Modelo extensible (Fed8, Fed9, etc.) según necesidad futura.
