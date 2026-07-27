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
};
