# Operaciones, Observabilidad y Recuperación

**Versión:** 1.0.0

---

## Observability Stack

| Componente | Herramienta | Propósito |
|-----------|-------------|-----------|
| Metrics | Prometheus + Thanos | Métricas de sistema y negocio |
| Logs | Loki + Promtail | Logs estructurados centralizados |
| Traces | OpenTelemetry → Jaeger | Trazabilidad de requests |
| Dashboards | Grafana | Visualización operativa |
| Alerting | Alertmanager | Notificaciones por SLO breach |

### Dashboards Obligatorios

| Dashboard | Métricas Clave |
|-----------|---------------|
| **Quality** | avg qualityScore, biasDetectionRate, selfEval scores |
| **Safety** | incidents/10k, Triple Bloqueo triggers, ITDR alerts |
| **Usage** | requests/hour, active users, skill distribution |
| **Provenance** | BookPI anchors/hour, signature verification rate |
| **Federation** | events/federation, quorum success rate, YUN Bus throughput |
| **Provider** | failover rate, avg latency by provider, error rate |

---

## Recovery Protocol

### 1. Detección
- Health checks cada 30s
- SLO breach detection (latency p99 > 500ms, error rate > 1%)
- BookPI anchor failure alerting

### 2. Aislamiento
- Circuit breakers en Provider Failover
- Suspender sagas dependientes
- Notificar YUN Bus: `FederationHealthChanged` event

### 3. Diagnóstico
- Telemetry + traces desde BookPI
- Provider stats (cuál falla, cuántos intentos)
- Memory Fabric status (entries, avg confidence)

### 4. Mitigación
- Provider Failover automático (Anthropic → OpenAI → DeepSeek)
- Rollback de última operación si está en Execution Fabric
- Modo degradado: regex + templates sin LLM

### 5. Rehidratación
- Re-sync desde BookPI/events
- Memory Fabric reconstrucción desde Knowledge Fabric
- Knowledge re-ingest si hay corrupción

### 6. Post-mortem
- ADR si el incidente requiere cambio arquitectónico
- Actualizar runbook correspondiente
- Notificar a las federaciones afectadas

---

## Modo Isla

Cuando Isabella pierde conectividad con servicios centrales:

1. **Persistencia local-first** — datos se escriben en SQLite local
2. **Nodos edge** — capacidad de operar sin cloud
3. **Sincronización eventual** — cuando se restaura conectividad, merge con BookPI
4. **Degradación graceful** — Provider Failover cae a local templates
5. **Resolución de conflictos** — last-write-wins con BookPI como autoridad

---

## Health Checks

### Endpoint: GET /api/health
```json
{
  "status": "healthy",
  "version": "4.0.0",
  "uptime": 86400,
  "checks": {
    "crown": { "status": "ok", "skillsRegistered": 10 },
    "memory": { "status": "ok", "totalEntries": 120 },
    "provider": { "status": "ok", "primary": "anthropic" },
    "bookpi": { "status": "ok", "nodesAnchored": 45 },
    "radio": { "status": "ok", "azuracast": "running" }
  }
}
```

### SLO Targets

| SLO | Target | Window |
|-----|--------|--------|
| Availability | 99.9% | 30 días |
| Latency p50 | <100ms | Rolling |
| Latency p99 | <500ms | Rolling |
| Error rate | <1% | 30 días |
| BookPI anchor rate | 100% | Rolling |
| DecisionRecord coverage | ≥95% | Rolling |

---

## Backup Strategy

| Dato | Método | Frecuencia | Retención |
|------|--------|-----------|-----------|
| PostgreSQL (main) | pg_dump | Diario | 30 días |
| Memory Fabric | Snapshot + export | Continuo | 7 días |
| Knowledge Fabric | pg_dump + vector reindex | Semanal | 90 días |
| BookPI Ledger | Append-only (nunca se borra) | Continuo | Permanente |
| Audit Logs | Export JSON/CSV | Semanal | 1 año |
| AzuraCast config | docker-compose.yml + env | Manual | Git |

---

## Daily Operations Checklist

- [ ] Health check: `GET /api/health`
- [ ] Federation health summary: `GET /api/federation/status`
- [ ] BookPI anchor rate: >99%
- [ ] Pending appeals: 0
- [ ] ITDR alerts: review
- [ ] Provider failover events: review
- [ ] AzuraCast status: containers running
- [ ] Database connections: within limits
- [ ] Memory pruning: run if >1000 entries
