// ────────────────────────────────────────────────────────────────
// Isabella Genesis — Interpretability
// Explicabilidad de cada DecisionRecord
// ────────────────────────────────────────────────────────────────

import type { DecisionRecord } from "../types/decision-record";

export interface ExplanationResult {
  summary: string;
  technicalTrace: {
    stepId: string;
    tool: string;
    inputHash: string;
  }[];
  artifacts: {
    ledgerAnchor: unknown;
    signatures: unknown;
    context: unknown;
  };
  riskAssessment: {
    level: "low" | "medium" | "high";
    score: number;
    factors: string[];
  };
}

export interface Interpretability {
  explain(decision: DecisionRecord): ExplanationResult;
  batchExplain(decisions: DecisionRecord[]): ExplanationResult[];
}

export function createInterpretability(): Interpretability {
  return {
    explain(decision) {
      const riskLevel = decision.context.riskScore > 0.7 ? "high" : decision.context.riskScore > 0.3 ? "medium" : "low";
      const factors: string[] = [];
      if (decision.context.riskScore > 0.7) factors.push("high_risk_score");
      if (decision.decision.confidence < 0.3) factors.push("low_confidence");
      if (decision.plan.length > 5) factors.push("complex_plan");
      if (decision.signatures.isabella) factors.push("signed_isabella");
      if (decision.ledgerAnchor) factors.push("anchored_ledger");

      return {
        summary: `Decisión ${decision.decisionId}: ${decision.decision.action} (confianza: ${(decision.decision.confidence * 100).toFixed(0)}%)`,
        technicalTrace: decision.plan.map((step) => ({
          stepId: step.stepId,
          tool: step.tool,
          inputHash: step.inputHash,
        })),
        artifacts: {
          ledgerAnchor: decision.ledgerAnchor,
          signatures: decision.signatures,
          context: decision.context,
        },
        riskAssessment: { level: riskLevel, score: decision.context.riskScore, factors },
      };
    },

    batchExplain(decisions) {
      return decisions.map((d) => this.explain(d));
    },
  };
}
