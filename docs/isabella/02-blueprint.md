# Blueprint Técnico — Arquitectura y Componentes

**Versión:** 1.0.0
**Estado:** Implementado (Ω-Core v4.0 Enterprise + THE C.R.O.W.N)

---

## 1. Visión General

Isabella es un **sistema distribuido modular** compuesto por:

- **Capability Gateway** — orquestador central
- **TAMV-K5 Kernel** — núcleo de ejecución
- **10 Hyper Skills** — capacidades desacopladas
- **BookPI Telemetry** — DAG de trazabilidad
- **Provider Failover** — multi-proveedor de modelos
- **ISA API** — núcleo cognitivo (Prompt Guard + Intention Parser + Reasoning)
- **Mexa API** — criptografía de soberanía
- **SOUL Kernel** — identidad y ética
- **YUN Bus** — event bus heptafederado
- **7 Federaciones** — gobernanza distribuida

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Runtime Backend | Node.js 20 + TypeScript 5.9 |
| Frontend | React 19 + Vite 7.3.6 |
| ORM | Drizzle ORM (PostgreSQL) |
| UI Components | ShadCN UI (112 componentes) |
| Paquetes | pnpm workspaces (catalog: protocol) |
| Radio | AzuraCast (Docker, WSL) |
| Base de Datos | PostgreSQL (Helium DB) |
| CDN | Replit Object Storage (5 buckets) |
| Auth | Admin auto-role por email |

## 3. Componentes y Responsabilidades

### 3.1 Capability Gateway
- Recibe `CapabilityRequest` con capability, skillId, payload, federationId
- Resuelve qué Skill provee esa capacidad
- Valida permisos contra federación y hexagon zone
- Registra operación en BookPI
- Devuelve `CapabilityResponse` normalizado

### 3.2 TAMV-K5 Kernel
- PHP/Laravel para servicios pesados (jobs, colas, agentes)
- TypeScript/Bun para server functions, middleware, Zod schemas
- Error system: `TAMVKernelError` (TS) / `TAMVKernelException` (PHP)
- Stream engine O(n) con procesamiento single-pass

### 3.3 10 Hyper Skills

| # | Skill | Hexagon Zone | Propósito |
|---|-------|-------------|-----------|
| 1 | Memory Fabric | memory | Multiscale RAG con confianza adaptativa |
| 2 | Execution Fabric | kernel | Tareas largas con rollback y circuit breakers |
| 3 | Knowledge Fabric | memory | Verificación de verdad con fuentes |
| 4 | Massive Context | memory | Chunking adaptativo + priorización |
| 5 | Continuous Learning | kernel | Adaptación por feedback en tiempo real |
| 6 | Self-Evaluation | kernel | Auto-auditoría y detección de sesgo |
| 7 | Multi-Agent | interior | Consenso entre 7 agentes especializados |
| 8 | Digital Twin | exterior | Gemelos digitales de sistemas |
| 9 | Architecture Reasoning | interior | Grafo de dependencias + deuda técnica |
| 10 | Strategic Intelligence | interior | Planeación con escenarios y ROI |

### 3.4 BookPI Telemetry
- Cada operación genera `traceId` único
- Registra: hexagonId, hexagonZone, federationId, skillId, action, durationMs
- Stats por skill, federation y zone

### 3.5 Provider Failover
- Priority 1: Anthropic (Claude Sonnet 4)
- Priority 2: OpenAI (GPT-4o)
- Priority 3: DeepSeek
- Priority 4: Local models
- Solo acepta salidas que cumplen el schema del agente
- Circuit breakers por proveedor

### 3.6 ISA API (Núcleo Cognitivo)
- **Prompt Guard:** 9 categorías de amenaza, 5 niveles de riesgo
- **Intention Parser:** 14 regex → 8 dominios
- **Reasoning Engine:** cadena sanitize → interpret → reason
- 8 procesos cognitivos: Perception, Attention, Memory, Reasoning, Planning, Decision, Verification, Learning

### 3.7 Mexa API (Criptografía)
- **Federation Mask:** SHA-256 sobre {federationId}:{nodeId}:{timestamp}:{secret}, expira en 5min
- **Payload Signing:** JSON + mask + nonce → SHA-256
- **Verification:** re-derivación + validación temporal

### 3.8 YUN Bus
- Event bus tipado entre 7 federaciones
- Cada evento carry: traceId, federationId, type, payload, timestamp
- Routing por federationId

## 4. Data Flow

```
1. Input → Prompt Guard (sanitización)
2. → Intention Parser (clasificación de dominio)
3. → Context Engine (memoria relevante)
4. → Knowledge Layer (consulta semántica)
5. → Capability Gateway (resuelve skill)
6. → Hyper Skill (ejecución)
7. → Ethical Firewall (validación ética)
8. → BookPI (anclaje DAG)
9. → Provider Failover (modelo LLM)
10. → Output + DecisionRecord
```

## 5. Seguridad en 10 Capas

1. Helmet (headers HTTP seguros)
2. RBAC (control de acceso basado en roles)
3. Rate Limiting (limitación de tasa por ruta)
4. ISA Prompt Guard (sanitización de entrada)
5. Mexa Federation Masks (atribución criptográfica)
6. Triple Bloqueo Sexual (protección anti-explotación)
7. Anubis Sentinel (watchdog de integridad)
8. ITDR Monitor (detección de amenazas de identidad)
9. Admin Audit Log (registro de auditoría)
10. BookPI Ledger (DAG con firma)

## 6. Federaciones

| ID | Nombre | Dominio | Alcance |
|----|--------|---------|---------|
| FED-1 | Preservación | Seguridad | DevSecOps, CI/CD, parches |
| FED-2 | Estándares | Calidad | Normas, versiones, compatibilidad |
| FED-3 | Tecnología | Gobernanza | Kernel, skills, quorum |
| FED-4 | Curación | Contenido | Biblioteca, publicación, narrativa |
| FED-5 | Integridad | Verificación | DAG, firmas, trazabilidad |
| FED-6 | Adopción | Educación | UTAMV, tutorías, comunidades |
| FED-7 | Auditoría | Ética | Triple bloqueo, incidentes |

## 7. Infraestructura

- **Replit:** 100% deploy (Node 20, pnpm workspaces)
- **Docker:** AzuraCast radio comunitaria (WSL Ubuntu)
- **PostgreSQL:** Helium DB con Drizzle ORM
- **CDN:** 5 buckets Replit Object Storage
- **Git:** GitHub (OsoPanda1/rdm-digital-hub-ldtocs)
- **AzuraCast:** Puerto 80 (web), 443 (HTTPS), 8000 (stream/API), 8005
