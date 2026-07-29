/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// YUN â€” Core Types & Constitution
// Constitutional Realm of the TAMV Ecosystem
// ADR-YUN-0001: Immutable Architectural Constitution
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// â”€â”€ Domains â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type YunDomain =
  | "identity"
  | "commerce"
  | "knowledge"
  | "telemetry"
  | "gameplay"
  | "territorial"
  | "media"
  | "cognitive";

// â”€â”€ Federations (Heptafederation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type FederationId =
  | "FED-1" | "FED-2" | "FED-3" | "FED-4"
  | "FED-5" | "FED-6" | "FED-7";

export interface FederationDef {
  id: FederationId;
  name: string;
  domain: YunDomain;
  description: string;
}

export const FEDERATIONS: FederationDef[] = [
  { id: "FED-1", name: "Preservación",   domain: "identity",    description: "Seguridad, DevSecOps, CI/CD" },
  { id: "FED-2", name: "Estándares",     domain: "knowledge",   description: "Calidad, normas, versiones" },
  { id: "FED-3", name: "Tecnología",     domain: "telemetry",   description: "Kernel, skills, quorum" },
  { id: "FED-4", name: "Curación",       domain: "media",       description: "Contenido, biblioteca, narrativa" },
  { id: "FED-5", name: "Integridad",     domain: "territorial", description: "DAG, firmas, trazabilidad" },
  { id: "FED-6", name: "Adopción",       domain: "gameplay",    description: "Educación, comunidades, tutorías" },
  { id: "FED-7", name: "Auditoría",      domain: "cognitive",   description: "Ã‰tica, incidentes, veto" },
];

// â”€â”€ Resilience Modes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type YunMode = "NORMAL" | "SAFE" | "EMERGENCY";

export interface ModeTransition {
  from: YunMode;
  to: YunMode;
  trigger: string;
  timestamp: number;
}

// â”€â”€ Event Standard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type EventSeverity = "info" | "warn" | "error" | "critical";
export type EventTopic =
  | "identity.events"
  | "commerce.events"
  | "knowledge.events"
  | "telemetry.events"
  | "gameplay.events"
  | "federations.events"
  | "security.events"
  | "territorial.events"
  | "media.events"
  | "cognitive.events";

export interface YunEvent<T = unknown> {
  eventId: string;
  eventType: string;
  domain: YunDomain;
  topic: EventTopic;
  federationId: FederationId;
  entityId: string;
  traceId: string;
  timestamp: number;
  severity: EventSeverity;
  payload: T;
  signature?: string;
  pqSignature?: string;
}

// â”€â”€ Node / Actor Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type NodeType = "territorial" | "service" | "agent-human" | "agent-ai" | "external";
export type NodeStatus = "registered" | "active" | "suspended" | "revoked";

export interface YunNode {
  nodeId: string;
  name: string;
  type: NodeType;
  domain: YunDomain;
  federationId: FederationId;
  status: NodeStatus;
  publicKey: string;
  pqPublicKey?: string;
  registeredAt: number;
  lastSeenAt: number;
  metadata: Record<string, unknown>;
}

// â”€â”€ License Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type LicenseType = "TAMV-PRCL" | "TAMV-EOL" | "TAMV-KORIMA" | "TAMV-HYBRID";

export interface YunLicense {
  licenseId: string;
  type: LicenseType;
  domain: YunDomain;
  grantedTo: string;
  permissions: string[];
  restrictions: string[];
  validFrom: number;
  validUntil: number;
  issuedBy: FederationId;
}

// â”€â”€ Policy Engine Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type PolicyEffect = "allow" | "deny" | "escalate" | "degrade";

export interface PolicyRule {
  ruleId: string;
  name: string;
  domain: YunDomain;
  effect: PolicyEffect;
  conditions: PolicyCondition[];
  escalationTarget?: FederationId;
  priority: number;
}

export interface PolicyCondition {
  field: string;
  operator: "eq" | "neq" | "in" | "gt" | "lt" | "contains" | "matches";
  value: unknown;
}

export interface PolicyDecision {
  ruleId: string;
  effect: PolicyEffect;
  reason: string;
  traceId: string;
  timestamp: number;
}

// â”€â”€ Data Sensitivity â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type SensitivityLevel = "P0" | "P1" | "P2";

export interface DataCatalogEntry {
  entity: string;
  domain: YunDomain;
  federationScope: FederationId;
  tableOrKey: string;
  sensitivity: SensitivityLevel;
  description: string;
}

// â”€â”€ ADR Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type ADRStatus = "Proposed" | "Accepted" | "Deprecated" | "Superseded";

export interface ADR {
  adrId: string;
  title: string;
  status: ADRStatus;
  date: string;
  authors: string[];
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
  supersededBy?: string;
}

// â”€â”€ Perception Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type PerceptionSource = "technical" | "social" | "territorial" | "cognitive";

export interface PerceptionSignal {
  signalId: string;
  source: PerceptionSource;
  domain: YunDomain;
  content: string;
  confidence: number;
  timestamp: number;
  metadata: Record<string, unknown>;
}

// â”€â”€ YUN System State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface YunSystemState {
  mode: YunMode;
  registeredNodes: number;
  activeEvents: number;
  policiesActive: number;
  lastModeTransition: ModeTransition | null;
  uptime: number;
  startedAt: number;
}
