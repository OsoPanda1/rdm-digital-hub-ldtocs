# ADR-004: Isabella Ω-Core v4.0 Enterprise Architecture

**Status:** ACEPTADO  
**Date:** 2026-07-24  
**Deciders:** Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)

## Context

Isabella Villaseñor AI™ needs a modular, auditable backend architecture that enforces ethical governance, cryptographic sovereignty, and cognitive orchestration across the TAMV ecosystem. The previous v1.0 routes were monolithic and lacked integration with the Ω-Core subsystems.

## Decision

Implement Isabella Ω-Core v4.0 Enterprise as a layered library architecture under `src/lib/isabella/` and `src/lib/ai/` with the following modules:

### Core Layer (`lib/isabella/core/`)
- **Orchestrator** — Cognitive pipeline: sanitize → interpret → policy check → personality → evaluate
- **Personality** — 3S engine (frialdad cognitiva, economía léxica, agresividad analítica) with 5 modes

### SOUL Layer (`lib/isabella/soul/`)
- **Identity** — Isabella's identity, 7 agents, 16 ethical policies, 8 soul values, 7 NEVER rules

### Memory Layer (`lib/isabella/memory/`)
- **Engine** — Multiscalar memory with 7 types (session, persona, ecosystem, cultural, lesson, pattern, incident)
- **Librarian** — Adapter for the bibliographic engine

### Crypto Layer (`lib/isabella/crypto/`)
- **Federation** — SHA-256 federation masks with 5-minute expiry, payload signing/verification

### Skills Layer (`lib/isabella/skills/`)
- **Registry** — ClawHub lifecycle: register → quarantine → approve/reject/deprecate. 7 builtin skills.

### Evaluation Layer (`lib/isabella/evaluation/`)
- **Engine** — 4 metrics: response_quality, hallucination_rate, ethical_alignment, constitutional_compliance

### Fairness Layer (`lib/isabella/fair/`)
- **Metrics** — Bias detection (5 patterns), guardrails (5 rules), fairness metrics tracking

### XRAI Layer (`lib/isabella/xrai/`)
- **Renderer** — XR scene generation for 3D/4D experiences, 5 export formats (GLB, USDZ, PLY, OBJ, glTF)

### AI Layer (`lib/ai/`)
- **Isa API** — Cognitive core: prompt guard, intention parser, structured reasoning
- **Mexa API** — Cryptographic sovereignty: federation masks, payload signing, verification
- **Knowledge Base** — 19 TAMV ecosystem entries across 5 domains

### Route Layer (`routes/isabella.ts`)
- 18 endpoints integrating all Ω-Core subsystems
- Full pipeline: sanitize → interpret → policy → knowledge → personality → evaluate → fairness

## Consequences

### Positive
- Modular architecture allows independent testing and extension of each subsystem
- Cryptographic federation ensures all operations are auditable and attributable
- Ethics-first design with triple sexual block, 16 policies, and 7 NEVER rules
- Knowledge base provides contextual awareness of the TAMV ecosystem
- Fairness engine adds bias detection and guardrails to all responses

### Negative
- In-memory stores (not persistent); need Supabase integration for production
- Evaluation metrics are heuristic-based; real quality requires LLM integration
- XR renderer generates manifests only; real 3D rendering needs a client-side engine

### Risks
- Fork() exhaustion on Windows development; CI/CD should use Linux
- Knowledge base is static; needs automated ingestion pipeline

## References

- `docs/adr/001-rdm-living-world-gamification.md`
- `docs/adr/003-economia-prestigio-territorial.md`
- `src/lib/isabella/` — Full Ω-Core v4.0 implementation
- `src/lib/ai/` — ISA API, Mexa API, Knowledge Base
- `C:\Users\tamvo\litle-trust-fabric\src\lib\isabella\` — Reference implementation
- `C:\Users\tamvo\Downloads\evolucion_isabella.txt.md` — User reference documentation
