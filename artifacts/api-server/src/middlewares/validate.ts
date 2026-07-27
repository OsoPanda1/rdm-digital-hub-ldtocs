// ────────────────────────────────────────────────────────────────
// Zod Validation Middleware (PennyLane pattern: validate at boundary)
// All request bodies are validated before reaching route handlers.
// ────────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from "express";

// ── Minimal Zod-like validator (no external dependency needed) ──

interface FieldRule {
  type: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: unknown[];
  custom?: (value: unknown) => boolean;
}

type Schema = Record<string, FieldRule>;

interface ValidationError {
  field: string;
  message: string;
}

function validateField(value: unknown, rule: FieldRule, field: string): ValidationError | null {
  // Required check
  if (value === undefined || value === null || value === "") {
    if (rule.required !== false) {
      return { field, message: `${field} is required.` };
    }
    return null; // Optional field, skip further validation
  }

  // Type check
  switch (rule.type) {
    case "string":
      if (typeof value !== "string") return { field, message: `${field} must be a string.` };
      if (rule.min !== undefined && value.length < rule.min)
        return { field, message: `${field} must be at least ${rule.min} characters.` };
      if (rule.max !== undefined && value.length > rule.max)
        return { field, message: `${field} must be at most ${rule.max} characters.` };
      if (rule.pattern && !rule.pattern.test(value))
        return { field, message: `${field} format is invalid.` };
      break;

    case "number":
      const num = typeof value === "number" ? value : Number(value);
      if (isNaN(num)) return { field, message: `${field} must be a number.` };
      if (rule.min !== undefined && num < rule.min)
        return { field, message: `${field} must be at least ${rule.min}.` };
      if (rule.max !== undefined && num > rule.max)
        return { field, message: `${field} must be at most ${rule.max}.` };
      break;

    case "boolean":
      if (typeof value !== "boolean" && value !== "true" && value !== "false")
        return { field, message: `${field} must be a boolean.` };
      break;

    case "object":
      if (typeof value !== "object" || Array.isArray(value))
        return { field, message: `${field} must be an object.` };
      break;

    case "array":
      if (!Array.isArray(value))
        return { field, message: `${field} must be an array.` };
      break;
  }

  // Enum check
  if (rule.enum && !rule.enum.includes(value))
    return { field, message: `${field} must be one of: ${rule.enum.join(", ")}.` };

  // Custom validation
  if (rule.custom && !rule.custom(value))
    return { field, message: `${field} failed custom validation.` };

  return null;
}

function validateBody(body: unknown, schema: Schema): ValidationError[] {
  if (typeof body !== "object" || body === null) {
    return [{ field: "body", message: "Request body must be a JSON object." }];
  }

  const errors: ValidationError[] = [];
  const obj = body as Record<string, unknown>;

  for (const [field, rule] of Object.entries(schema)) {
    const error = validateField(obj[field], rule, field);
    if (error) errors.push(error);
  }

  return errors;
}

// ── Middleware Factory ──────────────────────────────────────────

export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validateBody(req.body, schema);
    if (errors.length > 0) {
      res.status(400).json({
        error: "Validation Error",
        details: errors,
      });
      return;
    }
    next();
  };
}

// ── Common Schemas ─────────────────────────────────────────────

export const schemas = {
  // Isabella chat
  isabellaChat: {
    message: { type: "string" as const, required: true, min: 1, max: 4000 },
    sessionId: { type: "string" as const, required: false, max: 100 },
  },

  // YUN policy evaluation
  yunPolicyEvaluate: {
    principal: { type: "object" as const, required: true },
    action: { type: "string" as const, required: true, min: 1, max: 200 },
    resource: { type: "object" as const, required: true },
    context: { type: "object" as const, required: true },
  },

  // YUN bus publish
  yunBusPublish: {
    eventType: { type: "string" as const, required: true, min: 1, max: 200 },
    domain: { type: "string" as const, required: true },
    topic: { type: "string" as const, required: true },
    federationId: { type: "string" as const, required: true },
    entityId: { type: "string" as const, required: true },
    severity: { type: "string" as const, required: true, enum: ["info", "warn", "error", "critical"] },
    payload: { type: "object" as const, required: false },
  },

  // YUN perception ingest
  yunPerceptionIngest: {
    source: { type: "string" as const, required: true, enum: ["technical", "social", "territorial", "cognitive"] },
    domain: { type: "string" as const, required: true },
    content: { type: "string" as const, required: true, min: 1, max: 10000 },
    confidence: { type: "number" as const, required: true, min: 0, max: 1 },
    timestamp: { type: "number" as const, required: true },
    metadata: { type: "object" as const, required: false },
  },

  // Gamification XP award
  awardXp: {
    playerId: { type: "string" as const, required: true, min: 1 },
    amount: { type: "number" as const, required: true, min: 1, max: 250 },
    reason: { type: "string" as const, required: true, min: 1, max: 500 },
  },

  // Territory ask
  territoryAsk: {
    question: { type: "string" as const, required: true, min: 1, max: 2000 },
  },

  // ── Isabella Extended ──────────────────────────────────────────

  isabellaFeedback: {
    playerId: { type: "string" as const, required: true, min: 1 },
    decisionId: { type: "string" as const, required: true, min: 1 },
    rating: { type: "number" as const, required: true, min: 1, max: 5 },
    comment: { type: "string" as const, required: false, max: 2000 },
  },

  isabellaKnowledge: {
    topic: { type: "string" as const, required: true, min: 1, max: 200 },
    content: { type: "string" as const, required: true, min: 1, max: 10000 },
    category: { type: "string" as const, required: true, min: 1, max: 100 },
    source: { type: "string" as const, required: false, max: 200 },
    domain: { type: "string" as const, required: false, max: 100 },
  },

  ttsIsabella: {
    text: { type: "string" as const, required: true, min: 1, max: 5000 },
    emotion: { type: "string" as const, required: false, enum: ["neutral", "happy", "sad", "excited", "calm"] },
    speed: { type: "number" as const, required: false, min: 0.5, max: 2.0 },
  },

  isabellaCryptoSign: {
    federationId: { type: "string" as const, required: true, min: 1 },
    nodeId: { type: "string" as const, required: true, min: 1 },
    payload: { type: "object" as const, required: true },
  },

  isabellaCryptoVerify: {
    federationMask: { type: "string" as const, required: true, min: 1 },
    hash: { type: "string" as const, required: true, min: 1 },
    nonce: { type: "string" as const, required: true, min: 1 },
  },

  isabellaXrScene: {
    description: { type: "string" as const, required: true, min: 1, max: 5000 },
    options: { type: "object" as const, required: false },
  },

  isabellaIsaReason: {
    query: { type: "string" as const, required: true, min: 1, max: 4000 },
    context: { type: "object" as const, required: false },
    knowledgeGraph: { type: "object" as const, required: false },
    maxDepth: { type: "number" as const, required: false, min: 1, max: 10 },
  },

  isabellaFairnessEvaluate: {
    text: { type: "string" as const, required: true, min: 1, max: 10000 },
    context: { type: "object" as const, required: false },
  },

  // ── Narrative ─────────────────────────────────────────────────

  narrativeFeed: {
    playerId: { type: "string" as const, required: true, min: 1 },
    limit: { type: "number" as const, required: false, min: 1, max: 50 },
  },

  narrativeTrigger: {
    playerId: { type: "string" as const, required: true, min: 1 },
    actionType: { type: "string" as const, required: true, min: 1, max: 100 },
    poiName: { type: "string" as const, required: false, max: 200 },
    eventName: { type: "string" as const, required: false, max: 200 },
    itemId: { type: "string" as const, required: false, max: 100 },
  },

  narrativeSuggest: {
    playerId: { type: "string" as const, required: true, min: 1 },
  },

  // ── Territory ─────────────────────────────────────────────────

  territoryAiAsk: {
    message: { type: "string" as const, required: true, min: 1, max: 4000 },
  },

  // ── Federation ────────────────────────────────────────────────

  federationEmit: {
    federationId: { type: "string" as const, required: true, min: 1 },
    type: { type: "string" as const, required: true, min: 1, max: 100 },
    payload: { type: "object" as const, required: false },
  },

  // ── Admin ─────────────────────────────────────────────────────

  adminAuditRecord: {
    actor: { type: "string" as const, required: true, min: 1, max: 200 },
    actorRole: { type: "string" as const, required: true, min: 1, max: 50 },
    action: { type: "string" as const, required: true, min: 1, max: 200 },
    target: { type: "string" as const, required: false, max: 200 },
    details: { type: "object" as const, required: false },
    sourceIp: { type: "string" as const, required: false, max: 50 },
    severity: { type: "string" as const, required: false, enum: ["info", "warn", "error", "critical"] },
  },

  // ── Identity ──────────────────────────────────────────────────

  identityCitizen: {
    name: { type: "string" as const, required: true, min: 1, max: 200 },
    email: { type: "string" as const, required: true, min: 1, max: 200 },
    role: { type: "string" as const, required: false, enum: ["user", "operator", "admin"] },
  },

  identityAssignRole: {
    citizenId: { type: "string" as const, required: true, min: 1 },
    role: { type: "string" as const, required: true, enum: ["user", "operator", "admin", "federation_auditor"] },
  },

  // ── Agents ────────────────────────────────────────────────────

  agentRegister: {
    name: { type: "string" as const, required: true, min: 1, max: 200 },
    domain: { type: "string" as const, required: true, min: 1, max: 100 },
    capabilities: { type: "array" as const, required: false },
    permissions: { type: "array" as const, required: false },
    autonomyLevel: { type: "number" as const, required: false, min: 0, max: 5 },
  },

  agentTrigger: {
    condition: { type: "string" as const, required: true, min: 1, max: 500 },
    action: { type: "string" as const, required: true, min: 1, max: 500 },
  },

  // ── IAM / Passkeys ───────────────────────────────────────────

  iamPasskeyChallenge: {
    userId: { type: "string" as const, required: true, min: 1 },
  },

  iamPasskeyRegister: {
    userId: { type: "string" as const, required: true, min: 1 },
    publicKey: { type: "string" as const, required: true, min: 1 },
    counter: { type: "number" as const, required: false, min: 0 },
  },

  iamVaultWrite: {
    key: { type: "string" as const, required: true, min: 1, max: 200 },
    value: { type: "string" as const, required: true, min: 1 },
    ttl: { type: "number" as const, required: false, min: 1 },
  },

  // ── Memory ────────────────────────────────────────────────────

  memoryRagQuery: {
    query: { type: "string" as const, required: true, min: 1, max: 4000 },
    types: { type: "array" as const, required: false },
    limit: { type: "number" as const, required: false, min: 1, max: 100 },
  },

  memoryStore: {
    type: { type: "string" as const, required: true, min: 1, max: 50 },
    content: { type: "string" as const, required: true, min: 1, max: 50000 },
    tags: { type: "array" as const, required: false },
    source: { type: "string" as const, required: false, max: 200 },
    ttl: { type: "number" as const, required: false, min: 1 },
    confidence: { type: "number" as const, required: false, min: 0, max: 1 },
  },

  memoryPraScore: {
    contentId: { type: "string" as const, required: true, min: 1 },
    timestamp: { type: "number" as const, required: true },
    frequency: { type: "number" as const, required: false, min: 0 },
  },

  // ── Maps ──────────────────────────────────────────────────────

  mapsPoi: {
    name: { type: "string" as const, required: true, min: 1, max: 200 },
    description: { type: "string" as const, required: false, max: 2000 },
    lat: { type: "number" as const, required: true, min: -90, max: 90 },
    lng: { type: "number" as const, required: true, min: -180, max: 180 },
    category: { type: "string" as const, required: true, min: 1, max: 100 },
  },

  // ── Search ────────────────────────────────────────────────────

  searchIndex: {
    type: { type: "string" as const, required: true, min: 1, max: 50 },
    title: { type: "string" as const, required: true, min: 1, max: 500 },
    content: { type: "string" as const, required: true, min: 1, max: 50000 },
    tags: { type: "array" as const, required: false },
    metadata: { type: "object" as const, required: false },
  },

  // ── Telemetry ─────────────────────────────────────────────────

  telemetryEvent: {
    type: { type: "string" as const, required: true, min: 1, max: 100 },
    source: { type: "string" as const, required: false, max: 100 },
    severity: { type: "string" as const, required: false, enum: ["info", "warn", "error", "critical"] },
    metadata: { type: "object" as const, required: false },
  },

  // ── Wiki Editor ──────────────────────────────────────────────

  wikiArticleCreate: {
    slug: { type: "string" as const, required: true, min: 1, max: 200, pattern: /^[a-z0-9-]+$/ },
    title: { type: "string" as const, required: true, min: 1, max: 300 },
    content: { type: "string" as const, required: true, min: 1, max: 100000 },
    category: { type: "string" as const, required: false, max: 100 },
    authorId: { type: "string" as const, required: true, min: 1 },
    tags: { type: "array" as const, required: false },
    status: { type: "string" as const, required: false, enum: ["draft", "published", "archived"] },
  },

  wikiArticleUpdate: {
    content: { type: "string" as const, required: true, min: 1, max: 100000 },
    authorId: { type: "string" as const, required: true, min: 1 },
    message: { type: "string" as const, required: false, max: 500 },
  },

  // ── Digital Twins ────────────────────────────────────────────

  twinsSceneCreate: {
    name: { type: "string" as const, required: true, min: 1, max: 200 },
    description: { type: "string" as const, required: false, max: 2000 },
    territoryId: { type: "string" as const, required: false, max: 100 },
  },

  twinsSensorAdd: {
    sensorType: { type: "string" as const, required: true, min: 1, max: 100 },
    value: { type: "number" as const, required: true },
    unit: { type: "string" as const, required: false, max: 50 },
  },

  // ── Economia ──────────────────────────────────────────────────

  economiaTransaction: {
    fromId: { type: "string" as const, required: true, min: 1 },
    toId: { type: "string" as const, required: true, min: 1 },
    amount: { type: "number" as const, required: true, min: 0.01 },
    type: { type: "string" as const, required: true, min: 1, max: 50 },
    description: { type: "string" as const, required: false, max: 500 },
  },

  // ── YUN Extended ──────────────────────────────────────────────

  yunRegistryNode: {
    nodeId: { type: "string" as const, required: true, min: 1 },
    name: { type: "string" as const, required: true, min: 1, max: 200 },
    domain: { type: "string" as const, required: true, min: 1, max: 100 },
    endpoint: { type: "string" as const, required: false, max: 500 },
  },

  yunResilienceTransition: {
    to: { type: "string" as const, required: true, enum: ["normal", "safe", "emergency"] },
    trigger: { type: "string" as const, required: true, min: 1, max: 500 },
  },

  yunResilienceIsland: {
    enter: { type: "boolean" as const, required: true },
  },

  yunGovernanceAdr: {
    title: { type: "string" as const, required: true, min: 1, max: 300 },
    description: { type: "string" as const, required: true, min: 1, max: 5000 },
    domain: { type: "string" as const, required: true, min: 1, max: 100 },
    author: { type: "string" as const, required: true, min: 1 },
  },

  yunGovernanceVote: {
    adrId: { type: "string" as const, required: true, min: 1 },
    voterId: { type: "string" as const, required: true, min: 1 },
    vote: { type: "string" as const, required: true, enum: ["approve", "reject", "abstain"] },
  },
};
