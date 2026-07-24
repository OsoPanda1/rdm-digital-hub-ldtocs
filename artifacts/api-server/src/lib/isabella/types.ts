// ────────────────────────────────────────────────────────────────
// Isabella Villaseñor AI™ — Shared Types (Ω-Core v4.0 Enterprise)
// Sistema Operativo Cognitivo Soberano del Ecosistema TAMV
// ────────────────────────────────────────────────────────────────

// ── Core Types ──────────────────────────────────────────────────

export type CognitiveProcess =
  | "perception" | "attention" | "memory" | "reasoning"
  | "planning" | "decision" | "verification" | "learning";

export type PersonalityMode =
  | "analytical" | "pedagogical" | "executive" | "ceremonial" | "librarian";

export type PersonalityConfig = {
  frialdad_cognitiva: number;
  economia_lexica: number;
  agresividad_analitica: number;
  tolerancia_ambiguedad: number;
  uso_evidencia: number;
  confianza_limite: number;
  modo: PersonalityMode;
};

// ── SOUL Types ──────────────────────────────────────────────────

export type SoulValue =
  | "soberania_tecnologica" | "dignidad_humana" | "neutralidad_epistemica"
  | "transparencia_radical" | "cuidado_territorial" | "educacion_liberadora"
  | "memoria_viva" | "cero_confianza";

export type AgentAutonomy = "full" | "supervised" | "readonly";

export type PolicySeverity = "critical" | "high" | "medium" | "low";
export type PolicyAction = "block" | "flag" | "log" | "redirect";

// ── Federation Types ────────────────────────────────────────────

export type FederationId = "FED-1" | "FED-2" | "FED-3" | "FED-4" | "FED-5" | "FED-6" | "FED-7";

export type FederationMask = {
  federationId: FederationId;
  nodeId: string;
  timestamp: number;
  signature: string;
};

// ── Cryptography Types ──────────────────────────────────────────

export type SignedPayload = {
  payload: unknown;
  federationMask: FederationMask;
  hash: string;
  nonce: string;
};

export type VerificationResult = {
  valid: boolean;
  federation: string;
  node: string;
  reason?: string;
};

// ── Skill Types ─────────────────────────────────────────────────

export type SkillLicense = "MIT-0" | "MIT" | "Apache-2.0" | "GPL-3.0" | "AGPL-3.0";
export type SkillStatus = "registered" | "quarantine" | "approved" | "rejected" | "deprecated";

export type SkillManifest = {
  name: string;
  description: string;
  version: string;
  author: string;
  federation: FederationId;
  license: SkillLicense;
  requires: { env: string[]; bins: string[]; systems: string[] };
  primaryEnv: string;
  emoji: string;
  homepage: string;
  ethicalBoundaries: string[];
  supportedIntents: string[];
};

// ── Library Types ───────────────────────────────────────────────

export type FileFormat = "pdf" | "docx" | "txt" | "md" | "html";

export type DocumentMeta = {
  path: string;
  format: FileFormat;
  size: number;
  created: Date;
  modified: Date;
  title?: string;
  author?: string;
  checksum: string;
};

export type Chapter = {
  number: number;
  title: string;
  documents: DocumentMeta[];
  content?: string;
};

export type BookStructure = {
  title: string;
  author: string;
  abstract: string;
  chapters: Chapter[];
  coverDescription?: string;
};

export type CompilationJob = {
  id: string;
  status: "pending" | "scanning" | "ingesting" | "organizing" | "compiling" | "cover" | "ready" | "error";
  progress: number;
  book?: BookStructure;
  error?: string;
};

// ── Evaluation Types ────────────────────────────────────────────

export type EvaluationMetric =
  | "response_quality" | "hallucination_rate" | "ethical_alignment"
  | "constitutional_compliance" | "latency" | "user_satisfaction";

export type EvaluationResult = {
  metric: EvaluationMetric;
  score: number;
  threshold: number;
  passed: boolean;
  details: string;
  timestamp: number;
};

// ── Chat Types ──────────────────────────────────────────────────

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// ── Response Types ──────────────────────────────────────────────

export type ChatResponse = { success: boolean; reply?: string; error?: string };
export type Intention = { domain: string; action: string; confidence: number; entities: Record<string, string>; raw: string };
export type SanitizationResult = { safe: boolean; risk: "none" | "low" | "medium" | "high" | "critical"; flags: string[]; sanitized: string };

// ── Emotional Engine Types ──────────────────────────────────────

export type PrimaryEmotion =
  | "alegria" | "tristeza" | "enfado" | "miedo" | "sorpresa" | "asco";

export type EmotionalState = {
  primary: PrimaryEmotion;
  intensity: number;       // 0.0 – 1.0
  valence: number;         // -1.0 (negative) to +1.0 (positive)
  arousal: number;         // 0.0 (calm) to 1.0 (excited)
  timestamp: number;
  context?: string;
};

export type EmotionalBlend = {
  emotions: EmotionalState[];
  dominant: PrimaryEmotion;
  overallValence: number;
  overallArousal: number;
};

// ── Crisis Detection Types ──────────────────────────────────────

export type CrisisLevel = "none" | "watch" | "elevated" | "high" | "critical";

export type CrisisIndicator = {
  type: string;
  severity: CrisisLevel;
  pattern: RegExp;
  message: string;
  redirect?: string;
};

// ── Guardian Types ──────────────────────────────────────────────

export type GuardianVerdict = {
  approved: boolean;
  guardian: string;
  reason: string;
  severity: PolicySeverity;
  policies: string[];
  trace: string[];
};

// ── Session Types ───────────────────────────────────────────────

export type IsabellaSession = {
  id: string;
  playerId: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  status: "active" | "closed";
  emotionalBaseline: EmotionalBlend | null;
};

// ── Decision Types ──────────────────────────────────────────────

export type IsabellaDecision = {
  id: string;
  playerId: string;
  type: string;
  confidence: number;
  territoryId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  mode: "NORMAL" | "SAFE" | "EMERGENCY";
  guardianVerdict?: GuardianVerdict;
  emotionalState?: EmotionalBlend;
  evaluationResults?: EvaluationResult[];
};

// ── Feedback Types ──────────────────────────────────────────────

export type IsabellaFeedback = {
  id: string;
  playerId: string;
  decisionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
};

// ── Knowledge Types ─────────────────────────────────────────────

export type KnowledgeEntry = {
  id: string;
  domain: string;
  topic: string;
  content: string;
  category: string;
  keywords: string[];
  priority: number;
  source: string;
  confidence: number;
  createdAt: string;
};

// ── TAMV Federation Map ─────────────────────────────────────────

export const TAMV_FEDERATIONS: Record<FederationId, { name: string; domain: string; scope: string }> = {
  "FED-1": { name: "Preservación",     domain: "seguridad",   scope: "DevSecOps, CI/CD, parches" },
  "FED-2": { name: "Estándares",       domain: "calidad",     scope: "Normas, versiones, compatibilidad" },
  "FED-3": { name: "Tecnología",       domain: "gobernanza",  scope: "Kernel, skills, quorum, auditoría" },
  "FED-4": { name: "Curación",         domain: "contenido",   scope: "Biblioteca, publicación, XR" },
  "FED-5": { name: "Integridad",       domain: "verificación", scope: "DAG, firmas, trazabilidad" },
  "FED-6": { name: "Adopción",         domain: "educación",   scope: "UTAMV, tutorías, comunidades" },
  "FED-7": { name: "Auditoría",        domain: "ética",       scope: "Triple bloqueo, incidentes, gobernanza" },
};
