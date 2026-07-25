// ────────────────────────────────────────────────────────────────
// SKILL 5 — Continuous Learning Engine
// Adaptación en tiempo real de comportamiento del agente basado
// en feedback del usuario, métricas de rendimiento y detección
// de drift de comportamiento
// ────────────────────────────────────────────────────────────────

import type { SkillDefinition } from "../types";

export const ContinuousLearningDefinition: SkillDefinition = {
  skillId: "continuous-learning",
  name: "Continuous Learning Engine",
  description: "Real-time agent behavior adaptation from user feedback, performance metrics, and drift detection",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "kernel",
  inputSchema: "LearningFeedback | AdaptationRequest",
  outputSchema: "LearningResult | AdaptationResult",
};

interface FeedbackEntry {
  id: string;
  type: "positive" | "negative" | "correction";
  context: string;
  expectedBehavior: string;
  actualBehavior: string;
  timestamp: number;
}

interface AdaptationRule {
  id: string;
  trigger: string;
  action: string;
  confidence: number;
  createdAt: number;
  timesApplied: number;
}

interface LearningFeedback {
  type: "positive" | "negative" | "correction";
  context: string;
  expectedBehavior: string;
  actualBehavior: string;
}

interface LearningResult {
  feedbackId: string;
  recorded: boolean;
  currentDriftScore: number;
  adaptationTriggered: boolean;
}

interface AdaptationRequest {
  context: string;
  currentBehavior: string;
}

interface AdaptationResult {
  suggestedBehavior: string;
  confidence: number;
  basedOnRules: number;
}

export interface ContinuousLearningEngine {
  recordFeedback(feedback: LearningFeedback): LearningResult;
  adapt(request: AdaptationRequest): AdaptationResult;
  getDriftScore(): number;
  getRules(): AdaptationRule[];
  getFeedbackHistory(limit?: number): FeedbackEntry[];
  stats(): { totalFeedback: number; positiveRatio: number; driftScore: number; rulesCount: number };
}

export function createContinuousLearningEngine(): ContinuousLearningEngine {
  const feedback: FeedbackEntry[] = [];
  const rules: AdaptationRule[] = [];
  let idCounter = 0;
  let driftScore = 0;

  function computeDrift(): number {
    if (feedback.length < 5) return 0;
    const recent = feedback.slice(-20);
    const negatives = recent.filter((f) => f.type === "negative" || f.type === "correction").length;
    return negatives / recent.length;
  }

  return {
    recordFeedback(f) {
      const id = `fb-${++idCounter}`;
      feedback.push({ id, ...f, timestamp: Date.now() });
      driftScore = computeDrift();
      let adaptationTriggered = false;

      if (f.type === "negative" || f.type === "correction") {
        const existing = rules.find((r) => r.trigger === f.context);
        if (existing) {
          existing.confidence = Math.min(1, existing.confidence + 0.1);
          existing.timesApplied++;
        } else {
          rules.push({ id: `rule-${idCounter}`, trigger: f.context, action: f.expectedBehavior, confidence: 0.3, createdAt: Date.now(), timesApplied: 1 });
          adaptationTriggered = true;
        }
      }

      return { feedbackId: id, recorded: true, currentDriftScore: driftScore, adaptationTriggered };
    },

    adapt(request) {
      const matchingRules = rules.filter((r) => request.context.includes(r.trigger) || r.trigger.includes(request.context));
      if (matchingRules.length === 0) {
        return { suggestedBehavior: request.currentBehavior, confidence: 0, basedOnRules: 0 };
      }
      const best = matchingRules.sort((a, b) => b.confidence - a.confidence)[0]!;
      return { suggestedBehavior: best.action, confidence: best.confidence, basedOnRules: matchingRules.length };
    },

    getDriftScore() { return driftScore; },
    getRules() { return [...rules]; },
    getFeedbackHistory(limit = 50) { return feedback.slice(-limit); },

    stats() {
      const total = feedback.length;
      const positives = feedback.filter((f) => f.type === "positive").length;
      return { totalFeedback: total, positiveRatio: total > 0 ? positives / total : 1, driftScore, rulesCount: rules.length };
    },
  };
}
