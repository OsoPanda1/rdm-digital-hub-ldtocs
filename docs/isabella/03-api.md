# API Pública y Contratos Internos

**Versión:** 1.0.0
**Formato:** REST + JSON over HTTPS
**Auth:** Bearer token / WebAuthn / mTLS service-to-service
**Base URL:** `https://api.tamv.net/v1` (producción) / `http://localhost:3000/api` (desarrollo)

---

## Autenticación y Autorización

| Método | Alcance | Detalles |
|--------|---------|----------|
| WebAuthn/Passkeys | Usuarios finales | FIDO2, challenge-response |
| Bearer Token | API pública | JWT territorial con federationId |
| mTLS | Service-to-service | Certificados por Vault/HSM |
| Admin auto-role | `tamvonlinenetwork@outlook.es` | RBAC automático en login |

---

## Endpoints Principales

### POST /v1/knowledge/query
Consulta semántica RAG híbrida.

**Request:**
```json
{
  "query": "string",
  "userId": "uuid",
  "contextHints": { "topic": "string" },
  "maxPassages": 5
}
```

**Response 200:**
```json
{
  "passages": [
    { "text": "...", "score": 0.92, "provenanceHash": "sha256:..." }
  ],
  "graphPaths": [],
  "traceId": "uuid"
}
```

**Auth:** Bearer token, rate-limited, consent check.

---

### POST /v1/events
Ingesta de eventos tipados al Knowledge Bus.

**Request:**
```json
{
  "type": "knowledge.update",
  "domain": "string",
  "federationId": "FED-1",
  "source": "repo",
  "payload": {},
  "timestamp": "2026-07-25T00:00:00Z"
}
```

**Response 201:** `{ "eventId": "uuid", "status": "accepted" }`

---

### GET /v1/decisions/{decisionId}
Devuelve DecisionRecord completo.

**Response 200:** DecisionRecord JSON completo (ver `04-schemas.md`).
**Response 403:** Redacted per policy unless auditor role.
**Auth:** RBAC; auditors can request full bundle.

---

### GET /v1/decisions/{decisionId}/explain
Explicación en 3 niveles:
1. **Resumen humano** — plain text, sin jerga técnica.
2. **Trazado técnico** — traceId, skillId, durationMs, provider.
3. **Artefactos** — AuditBundle download, BookPI anchor link.

---

### POST /v1/persona/set
Configura persona por sesión/proyecto.

**Request:**
```json
{
  "personaId": "isabella-analytical",
  "scope": "session"
}
```

**Efecto:** Establece perfil de voz, tono, verbosidad dentro de restricciones de política.

---

### POST /v1/appeals
Iniciar apelación humana sobre decisión.

**Request:**
```json
{
  "decisionId": "uuid",
  "actorId": "uuid",
  "reason": "string",
  "evidence": []
}
```

**Efecto:** Crea workflow de apelación, escala a human guardian si es necesario.

---

### POST /v1/knowledge/ingest
Ingesta de documentos al Knowledge Fabric.

**Request:**
```json
{
  "source": "https://...",
  "content": "string",
  "format": "markdown",
  "metadata": { "author": "string", "tags": [] }
}
```

**Response 201:** `{ "docId": "kdoc-1", "ingested": true, "conflicts": [] }`

---

### GET /v1/federation/status
Estado del YUN Bus y las 7 federaciones.

**Response 200:**
```json
{
  "bus": { "status": "active", "eventsProcessed": 1234 },
  "federations": [
    { "id": "FED-1", "name": "Preservación", "status": "active", "lastEvent": "..." }
  ]
}
```

---

### POST /v1/memory/store
Almacenar en Memory Fabric.

**Request:**
```json
{
  "content": "string",
  "type": "experience",
  "confidence": 0.85,
  "relations": [{ "targetId": "mem-1", "relation": "related_to" }]
}
```

---

### POST /v1/memory/recall
Recuperar de Memory Fabric.

**Request:**
```json
{
  "query": "string",
  "types": ["experience", "lesson"],
  "limit": 10,
  "minConfidence": 0.5
}
```

---

### GET /v1/crown/stats
Estadísticas del sistema C.R.O.W.N.

**Response 200:**
```json
{
  "gateway": { "totalDispatches": 500, "successRate": 0.98, "bySkill": {} },
  "memory": { "totalEntries": 120, "avgConfidence": 0.78 },
  "execution": { "totalTasks": 45, "avgDurationMs": 120 },
  "selfEvaluation": { "avgScore": 0.82, "biasDetectionRate": 0.05 }
}
```

---

### GET /api/radio/now-playing
Estado actual de TAMV 92.5 FM (proxy AzuraCast).

**Response:** AzuraCast nowplaying JSON.
**Backend:** `http://localhost:8000/api/nowplaying/tamv925`

---

### GET /api/radio/stream-url
URL del stream de audio.

---

## Contratos Internos

### Agent Capability Contract
```typescript
interface AgentCapability {
  capabilities: string[];
  costModel: { tokensPerRequest: number; maxTokens: number };
  timeout: number;
  authRequirements: string[];
}
```

### Policy DSL (YAML)
```yaml
policy:
  id: POL-SEX-001
  domain: ethics
  severity: block
  conditions:
    - type: sexualization_detection
      confidence: > 0.3
  actions:
    - block_response
    - log_incident
    - escalate: FED-7
```

---

## Seguridad API

| Control | Implementación |
|---------|---------------|
| TLS 1.3 | Obligatorio en todos los endpoints |
| Rate Limiting | Por usuario, por ruta, por federación |
| Payload encryption | Campos sensibles cifrados antes de respuesta |
| Redaction | PII redacted unless auditor role + consent |
| Audit | Cada llamada API emite evento a BookPI |
| CORS | `ALLOWED_ORIGINS` desde `.env` |
