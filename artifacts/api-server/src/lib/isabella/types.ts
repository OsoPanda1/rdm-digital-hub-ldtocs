/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella VillaseÃ±or AIâ„¢ â€” Shared Types (Î©-Core v4.0 Enterprise)
// Sistema Operativo Cognitivo Soberano del Ecosistema TAMV
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€ Core Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ SOUL Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type SoulValue =
  | "soberania_tecnologica" | "dignidad_humana" | "neutralidad_epistemica"
  | "transparencia_radical" | "cuidado_territorial" | "educacion_liberadora"
  | "memoria_viva" | "cero_confianza";

export type AgentAutonomy = "full" | "supervised" | "readonly";

export type PolicySeverity = "critical" | "high" | "medium" | "low";
export type PolicyAction = "block" | "flag" | "log" | "redirect";

// â”€â”€ Federation Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type FederationId = "FED-1" | "FED-2" | "FED-3" | "FED-4" | "FED-5" | "FED-6" | "FED-7";

export type FederationMask = {
  federationId: FederationId;
  nodeId: string;
  timestamp: number;
  signature: string;
};

// â”€â”€ Cryptography Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Skill Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Library Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Evaluation Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Chat Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// â”€â”€ Response Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type ChatResponse = { success: boolean; reply?: string; error?: string };
export type Intention = { domain: string; action: string; confidence: number; entities: Record<string, string>; raw: string };
export type SanitizationResult = { safe: boolean; risk: "none" | "low" | "medium" | "high" | "critical"; flags: string[]; sanitized: string };

// â”€â”€ Emotional Engine Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type PrimaryEmotion =
  | "alegria" | "tristeza" | "enfado" | "miedo" | "sorpresa" | "asco";

export type EmotionalState = {
  primary: PrimaryEmotion;
  intensity: number;       // 0.0 â€“ 1.0
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

// â”€â”€ Crisis Detection Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type CrisisLevel = "none" | "watch" | "elevated" | "high" | "critical";

export type CrisisIndicator = {
  type: string;
  severity: CrisisLevel;
  pattern: RegExp;
  message: string;
  redirect?: string;
};

// â”€â”€ Guardian Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type GuardianVerdict = {
  approved: boolean;
  guardian: string;
  reason: string;
  severity: PolicySeverity;
  policies: string[];
  trace: string[];
};

// â”€â”€ Session Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type IsabellaSession = {
  id: string;
  playerId: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  status: "active" | "closed";
  emotionalBaseline: EmotionalBlend | null;
};

// â”€â”€ Decision Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Feedback Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type IsabellaFeedback = {
  id: string;
  playerId: string;
  decisionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
};

// â”€â”€ Knowledge Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ TAMV Federation Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const TAMV_FEDERATIONS: Record<FederationId, { name: string; domain: string; scope: string }> = {
  "FED-1": { name: "PreservaciÃ³n",     domain: "seguridad",   scope: "DevSecOps, CI/CD, parches" },
  "FED-2": { name: "EstÃ¡ndares",       domain: "calidad",     scope: "Normas, versiones, compatibilidad" },
  "FED-3": { name: "TecnologÃ­a",       domain: "gobernanza",  scope: "Kernel, skills, quorum, auditorÃ­a" },
  "FED-4": { name: "CuraciÃ³n",         domain: "contenido",   scope: "Biblioteca, publicaciÃ³n, XR" },
  "FED-5": { name: "Integridad",       domain: "verificaciÃ³n", scope: "DAG, firmas, trazabilidad" },
  "FED-6": { name: "AdopciÃ³n",         domain: "educaciÃ³n",   scope: "UTAMV, tutorÃ­as, comunidades" },
  "FED-7": { name: "AuditorÃ­a",        domain: "Ã©tica",       scope: "Triple bloqueo, incidentes, gobernanza" },
};
