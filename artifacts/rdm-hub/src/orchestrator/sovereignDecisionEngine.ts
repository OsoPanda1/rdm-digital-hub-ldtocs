/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { logger } from "@/lib/logger";

type SovereigntyRule = {
  id: string;
  condition: (input: unknown) => boolean;
  action: "accept" | "reject" | "escalate" | "defer";
  reason: string;
};

const DEFAULT_RULES: SovereigntyRule[] = [
  { id: "SR-001", condition: (i: unknown) => { const v = i as Record<string, unknown>; return typeof v?.federation === "string" && ["cultural", "economica"].includes(v.federation as string); }, action: "accept", reason: "FederaciÃ³n soberana con autonomÃ­a plena" },
  { id: "SR-002", condition: (i: unknown) => { const v = i as Record<string, unknown>; return typeof v?.critical === "boolean" && v.critical === true; }, action: "escalate", reason: "DecisiÃ³n crÃ­tica requiere consenso humano" },
  { id: "SR-003", condition: (i: unknown) => { const v = i as Record<string, unknown>; return typeof v?.amount === "number" && (v.amount as number) > 1000; }, action: "defer", reason: "TransacciÃ³n de alto valor requiere verificaciÃ³n" },
  { id: "SR-004", condition: (i: unknown) => { const v = i as Record<string, unknown>; if (!v?.source) return false; const s = v.source as string; return s.includes("external") || s.includes("anon"); }, action: "reject", reason: "Origen no federado requiere autenticaciÃ³n" },
];

export class SovereignDecisionEngine {
  private rules: SovereigntyRule[] = DEFAULT_RULES;
  private history: Array<{ input: unknown; decision: { accepted: boolean; payload: unknown; sovereignty: string } }> = [];
  private readonly maxHistory = 100;

  addRule(rule: SovereigntyRule): void { this.rules.push(rule); }

  makeDecision<TInput, TOutput = { accepted: boolean; payload: TInput; sovereignty: string; ruleId?: string }>(input: TInput): TOutput {
    for (const rule of this.rules) {
      if (rule.condition(input)) {
        const accepted = rule.action === "accept";
        const decision = { accepted, payload: input, sovereignty: rule.reason, ruleId: rule.id } as TOutput;
        this.history.push({ input, decision: decision as unknown as { accepted: boolean; payload: unknown; sovereignty: string } });
        if (this.history.length > this.maxHistory) this.history.shift();
        logger.info("[SOVEREIGN] DecisiÃ³n aplicada", { rule: rule.id, action: rule.action, accepted });
        return decision;
      }
    }
    const fallback = { accepted: true, payload: input, sovereignty: "Sin regla especÃ­fica â€” aprobado por defecto", ruleId: "SR-000" } as TOutput;
    this.history.push({ input, decision: fallback as unknown as { accepted: boolean; payload: unknown; sovereignty: string } });
    return fallback;
  }

  getHistory() { return [...this.history]; }
  getRules() { return [...this.rules]; }
  clearHistory() { this.history = []; }
}

export const sovereignDecisionEngine = new SovereignDecisionEngine();