export type IsabellaPerception = {
  sessionId?: string;
  actorId?: string;
  territoryId?: string;
  inputType: "chat" | "event" | "signal" | "api" | "ui";
  payload: Record<string, unknown>;
  timestamp: string; // ISO
  metadata?: Record<string, unknown>;
};

export type IsabellaDecisionToolCall = {
  toolName: string;
  arguments: Record<string, unknown>;
};

export type IsabellaDecision = {
  decisionId: string;
  sessionId?: string;
  summary: string;
  confidence: number; // 0..1
  riskLevel: "low" | "medium" | "high";
  policyStatus: "allowed" | "denied" | "requires_approval";
  toolCalls?: IsabellaDecisionToolCall[];
  details?: Record<string, unknown>;
  createdAt?: string;
};

export type IsabellaMemoryItem = {
  memoryId: string;
  scope: "immediate" | "session" | "project" | "territorial" | "historical";
  content: string;
  contentJson?: Record<string, unknown>;
  sourceType: "user" | "system" | "event" | "summary";
  relevance: number;
  expiresAt?: string;
  checksum: string;
  createdAt?: string;
};
