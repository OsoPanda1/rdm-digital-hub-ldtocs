# Esquemas de Datos Clave

**Versión:** 1.0.0
**Estado:** Implementado

---

## DecisionRecord

Unidad fundamental de trazabilidad. Cada decisión de Isabella produce un DecisionRecord firmado.

```json
{
  "decisionId": "uuid",
  "timestamp": "2026-07-25T12:00:00Z",
  "event": {
    "type": "query",
    "actorId": "user-123",
    "payloadHash": "sha256:abc123..."
  },
  "context": {
    "profileId": "p-1",
    "memorySnapshot": "hash",
    "riskScore": 0.87,
    "federationId": "FED-3",
    "hexagonZone": "kernel"
  },
  "plan": [
    {
      "stepId": "s1",
      "skillId": "memory",
      "tool": "memory-fabric",
      "inputHash": "sha256:def456..."
    },
    {
      "stepId": "s2",
      "skillId": "self-evaluation",
      "tool": "self-evaluation-engine",
      "inputHash": "sha256:ghi789..."
    }
  ],
  "decision": {
    "action": "respond",
    "confidence": 0.92,
    "explanation": "Response based on 3 knowledge passages with high relevance"
  },
  "signatures": {
    "isabella": "dilithium:base64...",
    "bookpi": "sha256:nodeHash"
  },
  "ledgerAnchor": {
    "blockchain": "polygon",
    "txHash": "0x...",
    "bookpiNodeId": "node-1234",
    "timestamp": 1721900000000
  }
}
```

### Campos Obligatorios
- `decisionId` — UUID único
- `timestamp` — ISO 8601
- `event.type` — tipo de evento
- `decision.action` — acción tomada
- `decision.confidence` — 0.0 a 1.0
- `signatures` — firma de Isabella + BookPI

---

## Knowledge Node

Nodo del grafo de conocimiento.

```json
{
  "nodeId": "n-uuid",
  "type": "fact",
  "content": "Real del Monte fue fundado en 1779 por mineros ingleses",
  "contentHash": "sha256:...",
  "embeddingsId": "vec-123",
  "provenance": "bookpi://entry/xyz",
  "sources": [
    { "url": "https://...", "confidence": 0.95, "summary": "..." }
  ],
  "lastUpdated": "2026-07-25T00:00:00Z",
  "version": "v1.2",
  "federationId": "FED-4"
}
```

### Tipos de Nodo
- `fact` —hecho verificable
- `code` — fragmento de código
- `doc` — documento completo
- `lesson` — lección aprendida
- `pattern` — patrón detectado

---

## AuditBundle

Paquete completo de auditoría para una operación.

```json
{
  "bundleId": "ab-uuid",
  "decisionRecord": { "...DecisionRecord..." },
  "siemLogs": [
    { "timestamp": "...", "level": "info", "message": "..." }
  ],
  "bookpiEnvelope": {
    "nodeId": "node-1234",
    "hash": "0x...",
    "prevHash": "0x...",
    "timestamp": 1721900000000,
    "federationId": "FED-5"
  },
  "signatures": {
    "dilithium": "base64...",
    "sha256": "hex..."
  },
  "exportFormats": ["json", "csv", "pdf"]
}
```

---

## CapabilityRequest / Response

```typescript
// Request
interface CapabilityRequest<T = unknown> {
  capability: string;        // "memory.store" | "execution.run" | ...
  skillId: SkillId;          // "memory" | "execution" | ... | "strategic-intelligence"
  payload: T;
  federationId: FederationId; // "FED-1" | ... | "FED-7"
  hexagonZone: HexagonZone;  // "interior" | "exterior"
  traceId: string;
  hexagonId: string;
  requestedBy: string;
  timestamp: number;
}

// Response
interface CapabilityResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  traceId: string;
  bookpi: BookPiAnchor;
  durationMs: number;
}

interface BookPiAnchor {
  nodeId: string;
  hash: string;           // "0x" + hex
  timestamp: number;
  federationId: FederationId;
}
```

---

## Federation Mask (Mexa API)

```json
{
  "federationId": "FED-3",
  "nodeId": "node-abc123",
  "timestamp": 1721900000000,
  "signature": "sha256:FED-3:node-abc123:1721900000000:secret",
  "expiresAt": 1721900300000
}
```

---

## Telemetry Record

```json
{
  "traceId": "trace-uuid",
  "hexagonId": "hex-1",
  "hexagonZone": "kernel",
  "federationId": "FED-3",
  "skillId": "memory",
  "action": "store",
  "timestamp": 1721900000000,
  "durationMs": 45,
  "success": true,
  "metadata": { "entryType": "experience", "confidence": 0.85 }
}
```

---

## Hexagon Zones

### Interior
- `identity` — autenticación, passkeys, roles
- `kernel` — ejecución, learning, evaluation
- `memory` — knowledge, RAG, context
- `governance` — federaciones, quorum
- `audit` — BookPI, logs, export

### Exterior
- `interoperability` — APIs externas, webhooks
- `signal` — eventos, YUN Bus
- `territorial` — turismo, economía, twins

---

## Tipos TypeScript Exportados

Todos los tipos están definidos en `lib/crown/types.ts` y exportados a través de `lib/crown/index.ts`:

- `FederationId`, `HexagonLayer`, `HexagonZone`
- `SkillId`, `SkillStatus`, `SkillDefinition`, `SkillInstance`
- `CapabilityRequest`, `CapabilityResponse`, `BookPiAnchor`
- `TraceSeverity`, `TAMVKernelErrorData`
- `TelemetryRecord`, `TelemetryStats`
- `ProviderId`, `ProviderConfig`, `ProviderResponse`
- `MemoryStoreRequest`, `MemoryRecallRequest`
- `TaskRequest`, `TaskResult`, `TaskStatus`
- `KnowledgeIngestRequest`, `KnowledgeQueryRequest`, `TruthVerification`
- `AgentOpinion`, `ConsensusResult`, `AgentRole`
- `TwinModel`, `TwinComponent`
- `StrategicObjective`, `StrategicScenario`, `StrategicPlan`
