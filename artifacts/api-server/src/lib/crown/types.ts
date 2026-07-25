// ────────────────────────────────────────────────────────────────
// THE C.R.O.W.N — Core Types & Contracts (TAMV-K5)
// Constitutional Realm of Omniscient Wise Nexus
// Todos los contratos de entrada/salida del sistema
// ────────────────────────────────────────────────────────────────

export type FederationId = "FED-1" | "FED-2" | "FED-3" | "FED-4" | "FED-5" | "FED-6" | "FED-7";

export type HexagonLayer = "interior" | "exterior";

export type HexagonZone =
  | "identity" | "kernel" | "memory" | "governance" | "audit"       // interior
  | "interoperability" | "signal" | "territorial";                   // exterior

export type SkillId =
  | "memory" | "execution" | "knowledge" | "massive-context"
  | "continuous-learning" | "self-evaluation" | "multi-agent"
  | "digital-twin" | "architecture-reasoning" | "strategic-intelligence";

export type SkillStatus = "registered" | "active" | "error" | "deprecated";

export type TraceSeverity = "info" | "warn" | "error" | "critical";

// ── Capability Gateway Contracts ────────────────────────────────

export interface CapabilityRequest<T = unknown> {
  capability: string;
  skillId: SkillId;
  payload: T;
  federationId: FederationId;
  hexagonZone: HexagonZone;
  traceId: string;
  hexagonId: string;
  requestedBy: string;
  timestamp: number;
}

export interface CapabilityResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  traceId: string;
  bookpi: BookPiAnchor;
  durationMs: number;
}

export interface BookPiAnchor {
  nodeId: string;
  hash: string;
  timestamp: number;
  federationId: FederationId;
}

// ── TAMV-K5 Error Contract ─────────────────────────────────────

export interface TAMVKernelErrorData {
  code: string;
  status: number;
  message: string;
  metadata: Record<string, unknown>;
  trace: string[];
}

// ── Telemetry Contracts ────────────────────────────────────────

export interface TelemetryRecord {
  traceId: string;
  hexagonId: string;
  hexagonZone: HexagonZone;
  federationId: FederationId;
  skillId: SkillId | "gateway" | "failover" | "middleware";
  action: string;
  timestamp: number;
  durationMs: number;
  success: boolean;
  metadata: Record<string, unknown>;
}

export interface TelemetryStats {
  totalCalls: number;
  successRate: number;
  avgDurationMs: number;
  bySkill: Record<string, number>;
  byFederation: Record<string, number>;
  byZone: Record<string, number>;
}

// ── Provider Failover Contracts ────────────────────────────────

export type ProviderId = "anthropic" | "openai" | "deepseek" | "local";

export interface ProviderConfig {
  id: ProviderId;
  priority: number;
  model: string;
  maxTokens: number;
  timeout: number;
  enabled: boolean;
}

export interface ProviderResponse<T = unknown> {
  providerId: ProviderId;
  model: string;
  data: T;
  latencyMs: number;
}

// ── Skill Registry Contracts ────────────────────────────────────

export interface SkillDefinition {
  skillId: SkillId;
  name: string;
  description: string;
  version: string;
  federationRequired: FederationId[];
  hexagonZone: HexagonZone;
  inputSchema: string;
  outputSchema: string;
}

export interface SkillInstance {
  definition: SkillDefinition;
  status: SkillStatus;
  registeredAt: string;
  lastCallAt: string | null;
  totalCalls: number;
  errorCount: number;
}

// ── Memory Fabric Contracts ─────────────────────────────────────

export interface MemoryStoreRequest {
  type: "experience" | "embedding" | "relation" | "decision" | "lesson";
  content: string;
  embedding?: number[];
  relations?: { targetId: string; relation: string }[];
  ttl?: number;
  confidence: number;
}

export interface MemoryRecallRequest {
  query: string;
  embedding?: number[];
  types?: string[];
  limit: number;
  minConfidence: number;
}

// ── Execution Fabric Contracts ──────────────────────────────────

export type TaskStatus = "pending" | "running" | "completed" | "failed" | "rolled_back";

export interface TaskRequest {
  type: string;
  payload: unknown;
  timeout: number;
  retryCount: number;
  federationId: FederationId;
}

export interface TaskResult {
  taskId: string;
  status: TaskStatus;
  result?: unknown;
  error?: string;
  startedAt: string;
  completedAt: string | null;
}

// ── Knowledge Fabric Contracts ──────────────────────────────────

export interface KnowledgeIngestRequest {
  source: string;
  content: string;
  format: "text" | "json" | "markdown" | "pdf";
  metadata: Record<string, unknown>;
}

export interface KnowledgeQueryRequest {
  query: string;
  sources?: string[];
  maxResults: number;
  minConfidence: number;
}

export interface TruthVerification {
  claim: string;
  confidence: number;
  sources: { url: string; confidence: number; summary: string }[];
  contradictions: string[];
  verified: boolean;
}

// ── Multi-Agent Contracts ───────────────────────────────────────

export type AgentRole =
  | "architect" | "security" | "economic" | "ethical"
  | "ux" | "legal" | "documentation" | "consensus";

export interface AgentOpinion {
  agentRole: AgentRole;
  opinion: string;
  confidence: number;
  reasoning: string[];
}

export interface ConsensusResult {
  topic: string;
  opinions: AgentOpinion[];
  consensus: string;
  overallConfidence: number;
  dissent: string[];
}

// ── Digital Twin Contracts ──────────────────────────────────────

export interface TwinModel {
  modelId: string;
  name: string;
  type: "repository" | "service" | "infrastructure" | "territory";
  components: TwinComponent[];
  dependencies: string[];
  snapshot: Record<string, unknown>;
}

export interface TwinComponent {
  id: string;
  type: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  metrics: Record<string, number>;
}

// ── Strategic Intelligence Contracts ────────────────────────────

export interface StrategicObjective {
  id: string;
  description: string;
  constraints: string[];
  timeline: string;
  priority: number;
}

export interface StrategicScenario {
  scenarioId: string;
  name: string;
  probability: number;
  cost: number;
  impact: number;
  plan: string[];
}

export interface StrategicPlan {
  objective: StrategicObjective;
  scenarios: StrategicScenario[];
  recommended: string;
  reasoning: string;
}
