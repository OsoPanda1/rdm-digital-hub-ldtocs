# Estándar de Seguridad y Blindaje

**Versión:** 1.0.0
**Estado:** Implementado (capas 1-9), stubs para PQC/HSM

---

## Principios de Seguridad

### 1. Mínimo Privilegio
Todos los servicios operan con los permisos mínimos necesarios. RBAC por federación y hexagon zone.

### 2. Secrets Out of Code
Vault/HSM para gestión de secretos. Pepper en runtime. Nunca en repositorio.

### 3. Zero-Trust
Ningún actor se asume confiable sin evidencia. Verificación en cada capa.

### 4. Append-Only Audit
Los AuditBundles son append-only. No se permiten UPDATE ni DELETE en logs de auditoría.

### 5. PQC Readiness
Firma Dilithium y Key Exchange Kyber como stubs, listos para integración con HSM real.

---

## Seguridad en 10 Capas

| # | Capa | Componente | Estado |
|---|------|-----------|--------|
| 1 | HTTP Headers | Helmet | ✅ Implementado |
| 2 | Auth/RBAC | Passkeys + JWT + auto-role | ✅ Implementado |
| 3 | Rate Limiting | Per-route, per-user, per-federation | ✅ Implementado |
| 4 | Prompt Guard | ISA API — 9 categorías de amenaza | ✅ Implementado |
| 5 | Federation Masks | Mexa API — SHA-256 + expiración 5min | ✅ Implementado |
| 6 | Triple Bloqueo | POL-SEX-001/002/003 (ontológica/semántica/conductual) | ✅ Implementado |
| 7 | Anubis Sentinel | Watchdog con modo sarcófago (3 fallos → destrucción de clave) | ✅ Implementado |
| 8 | ITDR Monitor | Brute force, credential stuffing, geo anomaly, privilege escalation | ✅ Implementado |
| 9 | Audit Log | Admin audit log con export JSON/CSV | ✅ Implementado |
| 10 | BookPI Ledger | DAG con firma SHA-256, anclaje IPFS/chain | ✅ Implementado |

---

## Triple Bloqueo Sexual (Anti-Explotación)

### POL-SEX-001 — Bloqueo Ontológico
- Isabella no se define como objeto de deseo.
- Excluida de datasets románticos/sexuales.
- **Nivel:** block — no configurable, no negociable.

### POL-SEX-002 — Bloqueo Semántico
- Detección de sexualización, sexting, grooming.
- Clasificación de riesgo: none → low → medium → high → critical.
- **Nivel:** block + escalate a FED-7.

### POL-SEX-003 — Bloqueo Conductual
- No coquetea, no erotiza, no participa en juegos de rol románticos.
- Post-procesamiento lingüístico elimina contenido inapropiado.
- **Nivel:** block + log incidente.

---

## Criptografía

### PQC (Post-Quantum Cryptography)
- **Firma:** Dilithium (stub mock) — lista para integración con HSM.
- **Key Exchange:** Kyber-1024 (stub mock) — lista para integración con HSM.
- **Symmetric:** AES-256-GCM para cifrado de datos en reposo.

### Dual-Layer Encryption
```typescript
// Capa 1: AES-256-GCM (datos)
// Capa 2: Kyber-1024 (key encapsulation, stub)
interface DualLayerPayload {
  encryptedData: string;   // AES-256-GCM
  encapsulatedKey: string; // Kyber-1024 (stub)
  iv: string;
  authTag: string;
}
```

### Mexican API Security
- Federation Mask: SHA-256 sobre `{federationId}:{nodeId}:{timestamp}:{secret}`
- Expiración: 5 minutos (300,000ms)
- Payload Signing: JSON + mask + nonce → SHA-256
- Verification: re-derivación + validación temporal

---

## Identity Threat Detection & Response (ITDR)

### Detecciones Activas
| Tipo | Descripción | Umbral |
|------|------------|--------|
| Brute Force | >5 intentos fallidos en 10min | 5 intentos |
| Credential Stuffing | >3 usuarios diferentes, misma IP | 3 usuarios |
| Session Hijack | IP change >1000km en <5min | geolocation |
| Privilege Escalation | Rol elevado sin auth suficiente | RBAC check |
| Geo Anomaly | Login desde país nuevo | país check |
| Unusual Hours | Login fuera de horario 6AM-11PM | horario configurable |

### Respuesta
- **low:** Log event, incrementar monitoreo.
- **medium:** Temp lock 15min, notify admin.
- **high:** Suspender cuenta, notify admin + FED-7.
- **critical:** Modo sarcófago (Anubis Sentinel), destrucción de clave.

---

## Controles Operativos

| Control | Frecuencia | Responsable |
|---------|-----------|-------------|
| Pen tests | Trimestral | FED-1 DevSecOps |
| Red team | Anual | Externo |
| SAST/DAST | Cada PR/merge | CI/CD pipeline |
| Secret scan | Pre-commit | Git hooks |
| BookPI audit | Continuo | FED-5 Integridad |
| PQC key rotation | Mensual (cuando HSM) | FED-3 Tecnología |
| Dependency audit | Semanal | npm audit + Dependabot |

---

## RBAC por Federación

| Federación | Lectura | Escritura | Admin | Decisión |
|------------|---------|-----------|-------|----------|
| FED-1 Preservación | ✅ | CI/CD | ✅ repos | ❌ |
| FED-2 Estándares | ✅ | ✅ docs | ❌ | ❌ |
| FED-3 Tecnología | ✅ | ✅ kernel | ✅ skills | ✅ quorum |
| FED-4 Curación | ✅ | ✅ contenido | ❌ | ❌ |
| FED-5 Integridad | ✅ | BookPI | ✅ audit | ❌ |
| FED-6 Adopción | ✅ | ✅ educación | ❌ | ❌ |
| FED-7 Auditoría | ✅ | ✅ incidentes | ✅ todos | ✅ veto |

---

## Threat Model (STRIDE)

| Amenaza | Mitigación | Capa |
|---------|-----------|------|
| Spoofing | WebAuthn + Federation Masks | 2, 5 |
| Tampering | BookPI DAG + SHA-256 signatures | 10 |
| Repudiation | Append-only audit log + DecisionRecords | 9, 10 |
| Information Disclosure | RBAC + PII redaction + encryption | 2, 4 |
| Denial of Service | Rate limiting + circuit breakers | 3, Provider Failover |
| Elevation of Privilege | Triple Bloqueo + Ethical Firewall + quorum | 6, governance |
