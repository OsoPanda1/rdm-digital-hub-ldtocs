// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Core Types
// The type system for the entire cognitive operating system.
// ══════════════════════════════════════════════════════════════════════════════

// ── Cognitive Cycle ─────────────────────────────────────────────────────────

export type CognitivePhase =
  | "perceive"
  | "understand"
  | "plan"
  | "execute"
  | "verify"
  | "learn";

export interface CognitiveRequest {
  id: string;
  input: string;
  userId: string;
  sessionId: string;
  context: DynamicContext;
  timestamp: number;
  priority: "low" | "normal" | "high" | "critical";
  securityLevel: SecurityLevel;
}

export interface CognitiveResponse {
  id: string;
  requestId: string;
  output: string;
  phase: CognitivePhase;
  confidence: ConfidenceScore;
  plan: ExecutionPlan | null;
  verification: VerificationResult;
  audit: AuditRecord;
  capabilities: CapabilitySelection[];
  metadata: ResponseMetadata;
  timestamp: number;
}

export interface ResponseMetadata {
  phasesCompleted: CognitivePhase[];
  totalLatencyMs: number;
  capabilitiesUsed: string[];
  agentsInvolved: string[];
  memoryLevelsAccessed: MemoryLevel[];
  securityChecksPassed: number;
  constitutionalPrinciplesChecked: string[];
  simulationScenariosEvaluated: number;
}

// ── Meta-Reasoner ───────────────────────────────────────────────────────────

export interface ThinkingStrategy {
  id: string;
  name: string;
  description: string;
  phases: CognitivePhase[];
  requiredCapabilities: string[];
  estimatedLatencyMs: number;
  estimatedCost: number;
  confidenceThreshold: number;
  maxIterations: number;
}

export interface MetaDecision {
  strategy: ThinkingStrategy;
  reasoning: string;
  alternativeStrategies: ThinkingStrategy[];
  riskAssessment: RiskAssessment;
  timestamp: number;
}

export interface RiskAssessment {
  level: "none" | "low" | "medium" | "high" | "critical";
  factors: string[];
  mitigations: string[];
  requiresHumanReview: boolean;
}

// ── Capability Fabric ───────────────────────────────────────────────────────

export type CapabilityId =
  | "reasoning"
  | "memory"
  | "vision"
  | "planning"
  | "mapping"
  | "tourism"
  | "legal"
  | "architecture"
  | "programming"
  | "security"
  | "research"
  | "negotiation"
  | "synthesis"
  | "verification"
  | "simulation"
  | "translation"
  | "analysis"
  | "creative";

export interface Capability {
  id: CapabilityId;
  name: string;
  description: string;
  costPerInvocation: number;
  averageLatencyMs: number;
  qualityScore: number;      // 0-1
  confidenceThreshold: number; // minimum confidence to activate
  permissions: CapabilityPermission[];
  enabled: boolean;
  version: string;
}

export interface CapabilityPermission {
  resource: string;
  actions: ("read" | "write" | "execute")[];
}

export interface CapabilitySelection {
  capabilityId: CapabilityId;
  reason: string;
  estimatedCost: number;
  estimatedLatencyMs: number;
  confidence: number;
}

export interface CapabilityResult {
  capabilityId: CapabilityId;
  output: unknown;
  latencyMs: number;
  cost: number;
  confidence: number;
  success: boolean;
  error?: string;
}

// ── Hierarchical Memory ─────────────────────────────────────────────────────

export type MemoryLevel =
  | "L0_immediate"    // Current context window
  | "L1_session"      // Current session
  | "L2_project"      // Project-scoped
  | "L3_territory"    // Real del Monte territory
  | "L4_federation"   // TAMV federation-wide
  | "L5_permanent"    // Permanent knowledge
  | "L6_historical";  // Historical archive

export interface MemoryEntry {
  id: string;
  level: MemoryLevel;
  content: string;
  embedding?: number[];
  tags: string[];
  source: string;
  confidence: number;
  accessCount: number;
  lastAccessedAt: number;
  createdAt: number;
  expiresAt: number | null;
  metadata: Record<string, unknown>;
}

export interface MemoryPolicy {
  level: MemoryLevel;
  maxEntries: number;
  ttlMs: number | null;         // null = permanent
  accessPattern: "lru" | "lfu" | "priority" | "permanent";
  encryptionRequired: boolean;
  auditRequired: boolean;
  retentionDays: number;
}

export interface MemoryQuery {
  text: string;
  levels: MemoryLevel[];
  limit: number;
  minConfidence: number;
  tags?: string[];
  timeRange?: { from: number; to: number };
}

// ── Planning Engine ─────────────────────────────────────────────────────────

export interface ExecutionPlan {
  id: string;
  objective: string;
  steps: PlanStep[];
  dependencies: PlanDependency[];
  risks: RiskAssessment;
  estimatedTotalCost: number;
  estimatedTotalLatencyMs: number;
  confidence: number;
  status: "draft" | "approved" | "executing" | "completed" | "failed" | "aborted";
  createdAt: number;
}

export interface PlanStep {
  id: string;
  order: number;
  description: string;
  capabilityId: CapabilityId;
  inputs: Record<string, unknown>;
  expectedOutput: string;
  estimatedCost: number;
  estimatedLatencyMs: number;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  result?: CapabilityResult;
}

export interface PlanDependency {
  stepId: string;
  dependsOn: string[];
  type: "blocks" | "soft" | "data";
}

// ── Knowledge Graph ─────────────────────────────────────────────────────────

export type EntityKind =
  | "territory"
  | "commerce"
  | "person"
  | "building"
  | "route"
  | "event"
  | "document"
  | "project"
  | "organization"
  | "concept"
  | "artifact";

export interface KnowledgeEntity {
  id: string;
  kind: EntityKind;
  name: string;
  description: string;
  properties: Record<string, unknown>;
  embedding?: number[];
  confidence: number;
  source: string;
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  weight: number;
  bidirectional: boolean;
  properties: Record<string, unknown>;
  createdAt: number;
}

export interface GraphQuery {
  startEntityId: string;
  relationTypes?: string[];
  maxDepth: number;
  maxResults: number;
  minWeight: number;
}

// ── Confidence Model ────────────────────────────────────────────────────────

export interface ConfidenceScore {
  overall: number;           // 0-1
  evidenceCount: number;
  sourceCount: number;
  memoryRetrievalCount: number;
  policiesChecked: string[];
  toolsUsed: string[];
  breakdown: {
    factualAccuracy: number;
    relevance: number;
    completeness: number;
    safety: number;
    coherence: number;
  };
}

// ── Dynamic Context ─────────────────────────────────────────────────────────

export interface DynamicContext {
  location?: { lat: number; lng: number; name: string };
  timestamp: number;
  timeOfDay: "dawn" | "morning" | "afternoon" | "evening" | "night";
  season: "spring" | "summer" | "autumn" | "winter";
  weather?: { condition: string; temperature: number; humidity: number };
  events?: ContextEvent[];
  systemState: SystemState;
  userPreferences?: Record<string, unknown>;
}

export interface ContextEvent {
  id: string;
  name: string;
  type: string;
  startDate: number;
  endDate: number;
  location?: { lat: number; lng: number };
}

export interface SystemState {
  mode: "NORMAL" | "SAFE" | "EMERGENCY";
  uptime: number;
  activeUsers: number;
  pendingTasks: number;
  systemLoad: number;
  lastSecurityCheck: number;
}

// ── Verifier ────────────────────────────────────────────────────────────────

export interface VerificationResult {
  passed: boolean;
  checks: VerificationCheck[];
  contradictions: string[];
  hallucinations: string[];
  constitutionalViolations: string[];
  memoryConflicts: string[];
  policyViolations: string[];
  overallScore: number; // 0-1
}

export interface VerificationCheck {
  name: string;
  passed: boolean;
  details: string;
  severity: "info" | "warning" | "error" | "critical";
}

// ── Security Nucleus ────────────────────────────────────────────────────────

export type SecurityLevel = "public" | "internal" | "confidential" | "secret" | "top_secret";

export interface SecurityDecision {
  authorized: boolean;
  level: SecurityLevel;
  classification: string;
  sensitivity: number; // 0-1
  auditRequired: boolean;
  signingRequired: boolean;
  immutableRecord: boolean;
  reasons: string[];
}

export interface AuditRecord {
  id: string;
  requestId: string;
  userId: string;
  action: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  securityDecision: SecurityDecision;
  constitutionalCompliance: string[];
  timestamp: number;
  integrityHash: string;
}

// ── Emergency Protocols ─────────────────────────────────────────────────────

export type EmergencyLevel = "none" | "watch" | "alert" | "critical" | "shutdown";

export interface EmergencyState {
  level: EmergencyLevel;
  triggeredAt: number | null;
  reason: string | null;
  actions: EmergencyAction[];
  rollbackAvailable: boolean;
  systemIntegrity: number; // 0-1
}

export interface EmergencyAction {
  type: "degrade" | "isolate" | "shutdown" | "alert" | "rollback" | "freeze";
  target: string;
  timestamp: number;
  executedBy: string;
  reversible: boolean;
}

// ── Simulation Engine ───────────────────────────────────────────────────────

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  variables: Record<string, unknown>;
  estimatedOutcome: string;
  riskLevel: "low" | "medium" | "high";
}

export interface SimulationResult {
  scenarioId: string;
  outcome: string;
  confidence: number;
  sideEffects: string[];
  cost: number;
  latencyMs: number;
}

export interface SimulationComparison {
  scenarios: SimulationResult[];
  recommended: string;
  reasoning: string;
}

// ── Continuous Learning ─────────────────────────────────────────────────────

export interface LearningCycle {
  id: string;
  trigger: "feedback" | "evaluation" | "error" | "periodic";
  input: string;
  expectedOutput?: string;
  actualOutput: string;
  errorType?: string;
  corrections: LearningCorrection[];
  memoryUpdates: MemoryUpdate[];
  knowledgeUpdates: KnowledgeUpdate[];
  ruleChanges: RuleChange[];
  timestamp: number;
}

export interface LearningCorrection {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  reason: string;
  confidence: number;
}

export interface MemoryUpdate {
  entryId: string;
  action: "create" | "update" | "delete" | "promote" | "demote";
  level: MemoryLevel;
  content?: string;
}

export interface KnowledgeUpdate {
  entityId: string;
  action: "create" | "update" | "delete";
  properties?: Record<string, unknown>;
}

export interface RuleChange {
  ruleId: string;
  action: "create" | "update" | "disable";
  rule: Record<string, unknown>;
  reason: string;
}

// ── Evaluator ───────────────────────────────────────────────────────────────

export interface EvaluationMetrics {
  precision: number;
  latencyMs: number;
  cost: number;
  utility: number;
  satisfaction: number;
  correctionRate: number;
  coherence: number;
  memoryRetrievalRate: number;
  constitutionalCompliance: number;
  securityScore: number;
  timestamp: number;
}

export interface EvaluationTrend {
  metric: string;
  values: { timestamp: number; value: number }[];
  trend: "improving" | "stable" | "declining";
  changeRate: number;
}

// ── Multi-Agent Coordination ────────────────────────────────────────────────

export interface AgentTeam {
  id: string;
  name: string;
  members: AgentRole[];
  objective: string;
  synthesisStrategy: "merge" | "vote" | "hierarchy" | "consensus";
  status: "forming" | "active" | "synthesizing" | "completed" | "disbanded";
  createdAt: number;
}

export interface AgentRole {
  agentId: string;
  role: string;
  capabilities: CapabilityId[];
  autonomyLevel: number; // 0-5
  status: "idle" | "working" | "done" | "error";
}

export interface AgentContribution {
  agentId: string;
  role: string;
  output: unknown;
  confidence: number;
  dissent?: string;
  timestamp: number;
}

export interface SynthesisResult {
  teamId: string;
  contributions: AgentContribution[];
  mergedOutput: string;
  disagreements: string[];
  consensusScore: number; // 0-1
  resolutionStrategy: string;
}
