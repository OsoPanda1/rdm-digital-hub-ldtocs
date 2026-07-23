# ARCHITECTURE OF HYBRID LICENSING — TAMV ONLINE NETWORK™

## Marco de Licenciamiento por Capas

Este documento describe la arquitectura de licenciamiento híbrido del Ecosistema TAMV Online Network™ / RDM Digital Hub, según lo establecido en el [RFC-0001](./RFC-0001-MANIFEST.md).

---

## Tabla de Regímenes

| Capa / Ruta | Régimen | Archivo | Naturaleza |
|---|---|---|---|
| `/src/core/` | **TAMV‑PRCL v1.0** | [LICENSE-PRCL.md](./LICENSE-PRCL.md) | Propietario, reservado, secreto industrial |
| `/src/kernel/`, `/src/quantum/` | **TAMV‑PRCL v1.0** | [LICENSE-PRCL.md](./LICENSE-PRCL.md) | Propietario, reservado, secreto industrial |
| `/src/isabella/` | **TAMV‑EOL v1.0** | [LICENSE-EOL.md](./LICENSE-EOL.md) | Restringido, inviolable, ético-ontológico |
| `src/connect/`, `src/skills/` | **TAMV‑KÓRIMA** | [LICENSE-KORIMA.md](./LICENSE-KORIMA.md) | Abierto con reciprocidad |
| Documentación / DOI / FAIR | **MIT‑0 / FAIR** | [LICENSE](./LICENSE) | Libre para estudio y cita |
| `supabase/`, telemetría, RLS | **DPA / Soberanía de datos** | [DATA-SOVEREIGNTY-DPA.md](./DATA-SOVEREIGNTY-DPA.md) | Confidencial y regulado |

---

## Principios Rectores

1. **Segmentación**: Cada capa tiene su propio régimen. La apertura de una capa no afecta a las demás.
2. **No contaminación**: La documentación científica puede ser auditable sin exponer secretos industriales.
3. **Reciprocidad**: El uso de módulos abiertos obliga a atribución, colaboración y respeto a la sede de origen.
4. **Irrevocabilidad moral**: La violación de la licencia ética (EOL) produce revocación inmediata de todos los accesos.

---

## Vigencia

Este marco sustituye cualquier licencia anterior implícita o explícita para los componentes del ecosistema. La versión canónica es la archivada en este repositorio, firmada digitalmente por el titular del proyecto.

---

**Documento rector:** RFC-0001 [Ver manifiesto completo](./RFC-0001-MANIFEST.md)  
**Fecha:** 22 de julio de 2026  
**Autoría:** Edwin Oswaldo Castillo Trejo — TAMV Online Network™
