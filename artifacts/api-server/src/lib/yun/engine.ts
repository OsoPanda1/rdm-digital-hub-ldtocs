// ────────────────────────────────────────────────────────────────
// YUN Policy Engine — OPA-style Decision Evaluator
// The "executable" part of ADR-YUN-0001.
// YUN never makes a significant decision without consulting OPA.
// ────────────────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";
import { CONSTITUTION_PRINCIPLES, DEFAULT_POLICIES } from "./constitution";
import type {
  YunDomain,
  FederationId,
  YunMode,
  PolicyRule,
  PolicyDecision,
  PolicyCondition,
} from "./types";

// ── Types ──────────────────────────────────────────────────────

export interface PolicyInput {
  principal: {
    id: string;
    roles: string[];
    federation?: FederationId;
    verified: boolean;
  };
  action: string;
  resource: {
    domain: YunDomain;
    eventType?: string;
    sensitivity?: string;
    data?: Record<string, unknown>;
  };
  context: {
    mode: YunMode;
    licenses: string[];
    adr: string[];
    sessionId?: string;
    traceId?: string;
  };
}

export interface PolicyEvaluationResult {
  decisionId: string;
  allowed: boolean;
  effect: "allow" | "deny" | "escalate" | "degrade";
  ruleId: string | null;
  reason: string;
  principalId: string;
  action: string;
  domain: YunDomain;
  matchedPrinciples: string[];
  timestamp: number;
  traceId: string;
}

export interface PolicyViolationEvent {
  decisionId: string;
  policy: string;
  timestamp: string;
  input: PolicyInput;
  result: PolicyEvaluationResult;
}

// ── Operator Evaluators ────────────────────────────────────────

function evaluateCondition(condition: PolicyCondition, context: Record<string, unknown>): boolean {
  const fieldValue = resolveField(condition.field, context);
  switch (condition.operator) {
    case "eq":
      return fieldValue === condition.value;
    case "neq":
      return fieldValue !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(fieldValue);
    case "gt":
      return Number(fieldValue) > Number(condition.value);
    case "lt":
      return Number(fieldValue) < Number(condition.value);
    case "contains":
      return String(fieldValue).includes(String(condition.value));
    case "matches": {
      const pattern = String(condition.value);
      // Anchor and timeout-guard against ReDoS
      if (pattern.length > 256) return false;
      try {
        return new RegExp(pattern).test(String(fieldValue));
      } catch {
        return false;
      }
    }
    default:
      return false;
  }
}

function resolveField(field: string, context: Record<string, unknown>): unknown {
  const parts = field.split(".");
  let current: unknown = context;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// ── Core Engine ────────────────────────────────────────────────

export class YunPolicyEngine {
  private rules: PolicyRule[];
  private customRules: PolicyRule[] = [];
  private decisionHistory: PolicyEvaluationResult[] = [];
  private readonly maxHistory = 10_000;

  constructor(additionalRules: PolicyRule[] = []) {
    this.rules = [...DEFAULT_POLICIES, ...additionalRules];
  }

  evaluate(input: PolicyInput): PolicyEvaluationResult {
    const traceId = input.context.traceId || randomUUID();
    const decisionId = randomUUID();

    // 1. Check constitution principles (hardcoded prohibitions)
    const principleViolation = this.checkConstitutionPrinciples(input);
    if (principleViolation) {
      return this.buildResult(decisionId, false, "deny", null, principleViolation, input, traceId, []);
    }

    // 2. Evaluate policy rules against context
    const context = this.buildContext(input);
    const matchedRules: PolicyRule[] = [];

    for (const rule of this.rules) {
      // Domain filter
      if (rule.domain !== input.resource.domain) continue;

      // All conditions must match
      const allMatch = rule.conditions.every((c) => evaluateCondition(c, context));
      if (allMatch) matchedRules.push(rule);
    }

    // 3. Sort by priority (lower = higher priority)
    matchedRules.sort((a, b) => a.priority - b.priority);
    const bestRule = matchedRules[0] ?? null;

    // 4. Collect matched constitutional principles
    const matchedPrinciples = this.getMatchedPrinciples(input);

    // 5. Build result
    if (bestRule) {
      const effect = this.applyModeOverride(bestRule, input);
      const result = this.buildResult(
        decisionId,
        effect === "allow",
        effect,
        bestRule.ruleId,
        `Rule "${bestRule.name}" matched: ${effect}`,
        input,
        traceId,
        matchedPrinciples,
      );
      this.recordDecision(result);
      return result;
    }

    // 6. Default deny (Zero Trust)
    const result = this.buildResult(
      decisionId,
      false,
      "deny",
      null,
      "No matching policy rule. Default deny (Zero Trust principle).",
      input,
      traceId,
      matchedPrinciples,
    );
    this.recordDecision(result);
    return result;
  }

  addRule(rule: PolicyRule): void {
    this.customRules.push(rule);
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter((r) => r.ruleId !== ruleId);
    this.customRules = this.customRules.filter((r) => r.ruleId !== ruleId);
  }

  getDecisionHistory(limit = 50): PolicyEvaluationResult[] {
    return this.decisionHistory.slice(-limit);
  }

  getViolations(): PolicyEvaluationResult[] {
    return this.decisionHistory.filter((d) => !d.allowed);
  }

  getStats(): { total: number; allowed: number; denied: number; escalated: number; degraded: number } {
    const total = this.decisionHistory.length;
    const allowed = this.decisionHistory.filter((d) => d.effect === "allow").length;
    const denied = this.decisionHistory.filter((d) => d.effect === "deny").length;
    const escalated = this.decisionHistory.filter((d) => d.effect === "escalate").length;
    const degraded = this.decisionHistory.filter((d) => d.effect === "degrade").length;
    return { total, allowed, denied, escalated, degraded };
  }

  // ── Private Helpers ──────────────────────────────────────────

  private checkConstitutionPrinciples(input: PolicyInput): string | null {
    // CP-003: Zero Trust — unverified principals denied
    if (input.action.startsWith("yun.") && !input.principal.verified) {
      return "CP-003: Zero Trust — unverified principal denied all YUN actions.";
    }

    // CP-002: Desacoplamiento reactivo — direct calls blocked unless EMERGENCY
    if (input.action === "service.direct.call" && input.context.mode !== "EMERGENCY") {
      return "CP-002: Desacoplamiento reactivo — direct service calls prohibited outside EMERGENCY mode.";
    }

    // CP-007: Soul modification requires FED-7
    if (input.action === "yun.soul.modify" && input.principal.federation !== "FED-7") {
      return "CP-007: Gobernanza federada — soul modification only by FED-7 (Auditoría).";
    }

    // CP-005: No architectural changes without ADR
    if (input.action === "yun.architecture.change" && !input.context.adr.includes("ADR-YUN-0001")) {
      return "CP-005: Gobernanza documentada — architecture changes require ADR.";
    }

    return null;
  }

  private buildContext(input: PolicyInput): Record<string, unknown> {
    return {
      auth: { verified: input.principal.verified },
      data: { sensitivity: input.resource.sensitivity },
      operation: { type: input.action.split(".").pop() },
      event: {
        traceId: input.context.traceId,
        federationId: input.principal.federation,
        signature: input.principal.id ? "present" : null,
      },
      yun: { mode: input.context.mode },
      service: {
        critical: ["identity", "telemetry"].includes(input.resource.domain),
      },
      principal: input.principal,
      licenses: input.context.licenses,
    };
  }

  private applyModeOverride(rule: PolicyRule, input: PolicyInput): "allow" | "deny" | "escalate" | "degrade" {
    // In EMERGENCY mode, non-critical services are degraded
    if (input.context.mode === "EMERGENCY" && !["identity", "telemetry"].includes(input.resource.domain)) {
      if (rule.effect === "allow" && input.action !== "yun.identity.read") {
        return "degrade";
      }
    }
    return rule.effect;
  }

  private getMatchedPrinciples(input: PolicyInput): string[] {
    const matched: string[] = [];

    if (input.action.startsWith("yun.data.") && input.resource.domain === "territory") {
      matched.push("CP-001");
    }
    if (input.action === "service.direct.call") {
      matched.push("CP-002");
    }
    if (!input.principal.verified) {
      matched.push("CP-003");
    }
    if (input.context.mode !== "NORMAL") {
      matched.push("CP-004");
    }
    if (input.action.startsWith("yun.architecture.") || input.action.startsWith("yun.soul.")) {
      matched.push("CP-005");
    }
    if (input.action.startsWith("yun.events.") || input.action.startsWith("yun.telemetry.")) {
      matched.push("CP-006");
    }
    if (input.action === "yun.soul.modify" || input.action === "yun.policy.change") {
      matched.push("CP-007");
    }
    if (input.action.startsWith("yun.narrative.") || input.action.startsWith("yun.interpret.")) {
      matched.push("CP-008");
    }

    return matched;
  }

  private buildResult(
    decisionId: string,
    allowed: boolean,
    effect: "allow" | "deny" | "escalate" | "degrade",
    ruleId: string | null,
    reason: string,
    input: PolicyInput,
    traceId: string,
    matchedPrinciples: string[],
  ): PolicyEvaluationResult {
    return {
      decisionId,
      allowed,
      effect,
      ruleId,
      reason,
      principalId: input.principal.id,
      action: input.action,
      domain: input.resource.domain,
      matchedPrinciples,
      timestamp: Date.now(),
      traceId,
    };
  }

  private recordDecision(result: PolicyEvaluationResult): void {
    this.decisionHistory.push(result);
    if (this.decisionHistory.length > this.maxHistory) {
      this.decisionHistory = this.decisionHistory.slice(-this.maxHistory);
    }
  }
}
