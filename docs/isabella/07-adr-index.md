# ADR Index (Architecture Decision Records)

**Versión:** 1.0.0
**Formato:** Context → Decision → Consequences → Alternatives → Status

---

## ADRs Activos

### ADR-001: DecisionRecord Schema v1.0
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** Isabella necesita un formato estándar para registrar cada decisión con trazabilidad criptográfica.
- **Decisión:** DecisionRecord con campos: decisionId, timestamp, event, context, plan, decision, signatures, ledgerAnchor.
- **Consecuencias:** Toda operación genera un record. Overhead mínimo (~200 bytes por record).
- **Alternativas descartadas:** Event sourcing genérico (sin firmas), logs planos (sin DAG).

### ADR-002: Neo4j + Milvus for Knowledge Layer
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** Knowledge Layer necesita grafo de relaciones + búsqueda semántica vectorial.
- **Decisión:** Neo4j para grafo de relaciones, Milvus para embeddings vectoriales. RAG híbrido combina ambos.
- **Consecuencias:** Dos bases de datos que mantener. Sin embargo, cada una optimizada para su caso de uso.
- **Alternativas descartadas:** PostgreSQL pgvector (menos escalable para grafo), Pinecone (vendor lock-in).

### ADR-003: BookPI Anchoring on Polygon
- **Fecha:** 2026-07-25
- **Status:** Proposed
- **Contexto:** BookPI necesita anclar AuditBundles en una blockchain para inmutabilidad verificable.
- **Decisión:** Polygon (EVM) para anchoring de txHash. IPFS para almacenamiento de bundles.
- **Consecuencias:** Costo de gas por anchoring. Requiere wallet management.
- **Alternativas descartadas:** Ethereum mainnet (costo alto), Solana (no EVM), sin blockchain (sin inmutabilidad externa).

### ADR-004: Ethical Firewall DSL v1
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** Las políticas éticas necesitan ser ejecutables, no solo documentos.
- **Decisión:** DSL YAML-based con condiciones, acciones y escalation paths. Cuatro niveles: allow, require_consent, escalate, block.
- **Consecuencias:** Las políticas son versionadas en Git. Cambios requieren ADR + quorum.
- **Alternativas descartadas:** Hardcoding en lógica (no auditable), engine de reglas externo (complejidad).

### ADR-005: Provider Failover Multi-Provider
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** Isabella no debe depender de un solo proveedor de modelos LLM.
- **Decisión:** Priority queue: Anthropic → OpenAI → DeepSeek → Local. Solo acepta outputs que cumplen schema Zod del agente.
- **Consecuencias:** Cada provider tiene su propio formato. El validador de schema agrega complejidad.
- **Alternativas descartadas:** Un solo provider (single point of failure), proxy genérico (sin validación de schema).

### ADR-006: TAMV-K5 Dual Runtime
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** El kernel necesita soporte para servicios pesados (jobs, colas) y orquestación ligera (middleware, schemas).
- **Decisión:** PHP/Laravel para backend pesado, TypeScript/Bun para server functions y middleware.
- **Consecuencias:** Dos lenguajes en el proyecto. Requiere bridge entre ambos.
- **Alternativas descartadas:** Solo PHP (menos ágil para prototipos), solo TypeScript (menos maduro para jobs pesados).

### ADR-007: Heptafederated Governance Model
- **Fecha:** 2026-07-25
- **Status:** Accepted
- **Contexto:** Isabella necesita gobernanza distribuida que prevenga concentración de poder.
- **Decisión:** 7 federaciones con dominios independientes, quorum 5/7 para cambios al SOUL, YUN Bus para comunicación.
- **Consecuencias:** Decisiones lentas pero seguras. Overhead de coordinación.
- **Alternativas descartadas:** DAO simple (sin especialización), monarquía técnica (single point of trust).

---

## Plantilla ADR

```markdown
# ADR-XXX: [Título]

- **Fecha:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
- **Contexto:** [¿Qué problema resuelve?]
- **Decisión:** [¿Qué se decidió?]
- **Consecuencias:** [¿Qué impacto tiene?]
- **Alternativas descartadas:** [¿Qué se evaluó y por qué se descartó?]
```
