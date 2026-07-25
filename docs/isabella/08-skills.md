# Skills Registry — Isabella Villaseñor AI™

**Versión:** 1.0.0
**Total Skills:** 10 (Hyper Skill Fabric) + 7 (Agent Skills)

---

## Hyper Skill Fabric (Core)

Cada skill es un módulo independiente registrado en el Capability Gateway.

### Skill Contract
```typescript
interface SkillContract {
  skillId: SkillId;
  name: string;
  version: string;
  federationRequired: FederationId[];
  hexagonZone: HexagonZone;
  inputSchema: string;   // Zod schema name
  outputSchema: string;  // Zod schema name
}
```

### Obligaciones por Skill
1. Registrar en Capability Gateway al inicio.
2. Validar input/output con Zod schemas.
3. Generar `traceId` por cada operación.
4. Registrar en BookPI Telemetry.
5. Exponer `stats()` para monitoreo.

---

## Hyper Skills (implementados en `lib/crown/skills/`)

### Skill 1: Memory Fabric
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/memory-fabric.ts` |
| **Zone** | memory |
| **Operaciones** | `store()`, `recall()`, `getEntry()`, `prune()`, `stats()` |
| **Capacidades** | Multiscale RAG, confianza adaptativa, TTL, relaciones, prevención de alucinaciones |
| **Tipos** | experience, embedding, relation, decision, lesson |

### Skill 2: Execution Fabric
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/execution-fabric.ts` |
| **Zone** | kernel |
| **Operaciones** | `submit()`, `getTask()`, `cancel()`, `rollback()`, `tick()` |
| **Capacidades** | Tareas largas, rollback, circuit breakers, cola determinista |
| **Estados** | pending, running, completed, failed, rolled_back |

### Skill 3: Knowledge Fabric
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/knowledge-fabric.ts` |
| **Zone** | memory |
| **Operaciones** | `ingest()`, `query()`, `verifyTruth()`, `getDoc()`, `deleteDoc()` |
| **Capacidades** | Ingesta de documentos, verificación de verdad, fuentes citadas, detección de contradicciones |

### Skill 4: Massive Context Processor
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/massive-context.ts` |
| **Zone** | memory |
| **Operaciones** | `process()`, `chunkWithOverlap()`, `estimateTokens()`, `prioritizeChunks()` |
| **Capacidades** | Chunking adaptativo, priorización por relevancia/recencia/posición, ventana dinámica |

### Skill 5: Continuous Learning Engine
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/continuous-learning.ts` |
| **Zone** | kernel |
| **Operaciones** | `recordFeedback()`, `adapt()`, `getDriftScore()`, `getRules()` |
| **Capacidades** | Feedback-driven adaptation, drift detection, rule generation, sin re-entrenamiento |

### Skill 6: Self-Evaluation Engine
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/self-evaluation.ts` |
| **Zone** | kernel |
| **Operaciones** | `evaluate()`, `benchmark()`, `getBiasDetection()` |
| **Métricas** | relevance, completeness, structure, bias, safety |
| **Capacidades** | Auto-auditoría, detección de sesgo, benchmarking contra estándares |

### Skill 7: Multi-Agent Collective
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/multi-agent-collective.ts` |
| **Zone** | interior |
| **Agentes** | architect, security, economic, ethical, ux, legal, documentation |
| **Operaciones** | `requestConsensus()`, `getAgent()`, `setAgentActive()` |
| **Capacidades** | Consenso ponderado, detección de disenso, quorum configurable |

### Skill 8: Digital Twin Engine
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/digital-twin.ts` |
| **Zone** | exterior |
| **Tipos** | repository, service, infrastructure, territory |
| **Operaciones** | `create()`, `simulate()`, `query()`, `updateMetrics()` |
| **Capacidades** | Gemelos digitales, simulación de escenarios, risk assessment |

### Skill 9: Architecture Reasoning Engine
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/architecture-reasoning.ts` |
| **Zone** | interior |
| **Operaciones** | `addNode()`, `addEdge()`, `analyze()`, `query()`, `getCircularDeps()` |
| **Capacidades** | Grafo semántico, detección de dependencias circulares, debt scoring |

### Skill 10: Strategic Intelligence Engine
| Campo | Valor |
|-------|-------|
| **Archivo** | `crown/skills/strategic-intelligence.ts` |
| **Zone** | interior |
| **Operaciones** | `plan()`, `analyzeScenarios()`, `prioritize()` |
| **Capacidades** | Planeación con escenarios, ROI, probabilidades, costos, plan ejecutable |

---

## Agent Skills (SOUL)

| Agente | Rol | Federación | Autonomía |
|--------|-----|------------|-----------|
| Isabella Kernel | Núcleo maestro de gobernanza | FED-3 | Supervised |
| Voice Tutor | Tutor de voz bidireccional | FED-6 | Supervised |
| Edu Mentor | Tutor cognitivo adaptativo | FED-6 | Supervised |
| RDM Guide | Guía contextual territorial | FED-4 | Full |
| DevSecOps | Auditoría y seguridad | FED-1 | Supervised |
| Ethics Guardian | Monitoreo ético + triple bloqueo | FED-7 | Supervised |
| Librarian | Motor bibliotecario AI | FED-4 | Supervised |

---

## Registro en Capability Gateway

```typescript
import { createCrownSystem } from "./lib/crown";

const crown = createCrownSystem();

// Todas las skills se registran automáticamente en createCrownSystem()
console.log(crown.gateway.listSkills().length); // 10

// Dispatch de una capacidad
const result = await crown.gateway.dispatch({
  capability: "memory.store",
  skillId: "memory",
  payload: { content: "...", type: "experience", confidence: 0.8 },
  federationId: "FED-3",
  hexagonZone: "memory",
  traceId: "trace-123",
  hexagonId: "hex-1",
  requestedBy: "user-123",
  timestamp: Date.now(),
});
```
