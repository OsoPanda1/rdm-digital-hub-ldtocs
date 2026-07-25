// ────────────────────────────────────────────────────────────────
// Isabella Genesis — Canonical Types
// DecisionRecord, KnowledgeNode, Policy, Firewall
// ────────────────────────────────────────────────────────────────

export interface DecisionEvent {
  type: "query" | "tool" | "system" | "incident";
  actorId: string;
  payloadHash: string;
}

export interface DecisionContext {
  profileId: string;
  memorySnapshotHash: string;
  riskScore: number;
}

export interface DecisionPlanStep {
  stepId: string;
  tool: string;
  inputHash: string;
}

export interface DecisionAction {
  action: "respond" | "defer" | "block" | "escalate";
  confidence: number;
  explanation: string;
}

export interface DecisionSignatures {
  isabella: string;
  bookpi: string;
}

export interface DecisionLedgerAnchor {
  blockchain: string;
  txHash: string;
}

export interface DecisionRecord {
  decisionId: string;
  timestamp: string;
  event: DecisionEvent;
  context: DecisionContext;
  plan: DecisionPlanStep[];
  decision: DecisionAction;
  signatures: DecisionSignatures;
  ledgerAnchor?: DecisionLedgerAnchor;
}

export type FirewallAction = "allow" | "requireConsent" | "defer" | "block" | "escalate";

export interface KnowledgeNode {
  nodeId: string;
  type: "fact" | "code" | "doc";
  contentHash: string;
  embeddingsId?: string;
  provenance: string;
  lastUpdated: string;
  version: string;
}
