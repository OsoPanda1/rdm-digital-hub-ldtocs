# Roadmap Prioritario

**Versión:** 1.0.0
**Estado actual:** Sprint 2 completado (Batch 1-7 + C.R.O.W.N + Foundational Document)

---

## Estado de Implementación

| Componente | Estado | Archivos |
|-----------|--------|----------|
| Foundational Document | ✅ Canonizado | `docs/foundational/ISABELLA-FOUNDATIONAL-DOCUMENT.md` |
| ISA API (Prompt Guard + Intention Parser + Reasoning) | ✅ Implementado | `lib/isabella/genesis/`, `lib/isabella/core/` |
| Mexa API (Federation Masks + Signing + Verification) | ✅ Implementado | `lib/isabella/crypto/` |
| SOUL Kernel (Identidad + 13+ políticas) | ✅ Implementado | `lib/isabella/soul/` |
| Memory Engine (7 tipos de memoria) | ✅ Implementado | `lib/isabella/memory/` |
| Skill Registry + 7 Agentes | ✅ Implementado | `lib/isabella/skills/` |
| Fairness Engine | ✅ Implementado | `lib/isabella/fair/` |
| XRAI Renderer | ✅ Implementado | `lib/isabella/xrai/` |
| THE C.R.O.W.N (10 Skills + Gateway + BookPI + Failover) | ✅ Implementado | `lib/crown/` (15 archivos) |
| Genesis Core (Context, Knowledge, Reasoner, Ethics, BookPI, Interpretability) | ✅ Implementado | `lib/isabella/genesis/` |
| Security (PQC, Anubis Sentinel, Dual-Layer) | ✅ Implementado | `lib/isabella/security/` |
| Federation (YUN Bus, Router, F1-F5, Agents Registry) | ✅ Implementado | `lib/federation/` |
| Infrastructure (Gamification, Search, Audit Log, Wiki, ITDR, Passkeys, Vault) | ✅ Implementado | `lib/gamification/`, `lib/search/`, `lib/admin/`, `lib/wiki/`, `lib/iam/` |
| Routes Batch 5 (12 rutas) | ✅ Implementado | `routes/federation.ts` ... `routes/wiki-editor.ts` |
| Routes Batch 7 (wired in index.ts) | ✅ Implementado | `routes/index.ts` |
| DB Schema Extensions | ✅ Implementado | `db/schema.ts`, `lib/db-client.ts` |
| Atlas Master Integration | ✅ Implementado | `lib/atlas.ts` |
| Documentation (/docs/isabella/) | ✅ Implementado | 15 archivos |
| AzuraCast Radio | ✅ Running | Docker WSL, puerto 80/443/8000 |

---

## Roadmap Futuro

### Sprint 3: Persistencia y Tests (2 semanas)
- [ ] Migrar módulos in-memory a PostgreSQL (Drizzle ORM)
- [ ] Tests unitarios para los 10 Hyper Skills
- [ ] Tests de integración para Capability Gateway
- [ ] Tests del Intention Parser (100 queries ground-truth)
- [ ] Coverage >85%
- [ ] Configurar CI/CD con GitHub Actions

### Sprint 4: Observabilidad y BookPI (2 semanas)
- [ ] OpenTelemetry integration
- [ ] Grafana dashboards (Quality, Safety, Usage, Provenance)
- [ ] BookPI IPFS anchoring
- [ ] Export AuditBundle (JSON/CSV/PDF)
- [ ] Alertmanager rules para SLO breaches

### Sprint 5: Production Hardening (3 semanas)
- [ ] Rate limiting por federación
- [ ] Circuit breaker tuning
- [ ] PQC real con HSM (o mock certificado)
- [ ] Secret rotation con Vault
- [ ] Load testing (concurrent dispatches)
- [ ] Security audit interno

### Sprint 6: Integraciones Territoriales (3 semanas)
- [ ] AzuraCast API key + integración completa
- [ ] AzuraCast radio stream embed en frontend
- [ ] Turismo F3: POIs reales de Real del Monte
- [ ] Patrimonio F2: Documentos de patrimonio indexados
- [ ] Economía F4: Ledger económico funcional
- [ ] Digital Twins F5: Escena de Real del Monte

### Sprint 7: Expansión (ongoing)
- [ ] Entrenar Intention Parser con ML
- [ ] Expandir knowledge base (100+ entradas)
- [ ] Multi-idioma (español, inglés, portugués)
- [ ] XRAI experiences reales
- [ ] Paper académico para CITIS 2026
- [ ] Despliegue Nodo Cero completo

---

## Hitos Clave

| Hito | Fecha Target | Dependencias |
|------|-------------|-------------|
| Sprint 3 completo | Ago 2026 | Tests + persistencia DB |
| Sprint 4 completo | Ago 2026 | Observabilidad + BookPI |
| Sprint 5 completo | Sep 2026 | Production ready |
| Sprint 6 completo | Oct 2026 | Integraciones territoriales |
| Nodo Cero Real del Monte | Nov 2026 | Sprint 6 + infraestructura |
| CITIS 2026 paper | Dic 2026 | Resultados de Nodo Cero |
| Expansión territorial | 2027 | Nodo Cero validado |
