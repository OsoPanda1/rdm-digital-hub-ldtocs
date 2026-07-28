/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Meta-Reasoner
// Decides HOW to think before thinking. The brain of the brain.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type {
  CognitiveRequest,
  CognitivePhase,
  MetaDecision,
  ThinkingStrategy,
  RiskAssessment,
  DynamicContext,
} from "./types";
import { logger } from "../../logger";

// â”€â”€ Built-in Strategies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STRATEGIES: ThinkingStrategy[] = [
  {
    id: "quick-response",
    name: "Quick Response",
    description: "Direct answer without planning â€” for simple factual queries",
    phases: ["perceive", "understand", "execute"],
    requiredCapabilities: ["reasoning"],
    estimatedLatencyMs: 200,
    estimatedCost: 0.01,
    confidenceThreshold: 0.7,
    maxIterations: 1,
  },
  {
    id: "standard-reasoning",
    name: "Standard Reasoning",
    description: "Full perceive-understand-plan-execute-verify cycle",
    phases: ["perceive", "understand", "plan", "execute", "verify"],
    requiredCapabilities: ["reasoning", "memory"],
    estimatedLatencyMs: 1500,
    estimatedCost: 0.05,
    confidenceThreshold: 0.8,
    maxIterations: 2,
  },
  {
    id: "deep-analysis",
    name: "Deep Analysis",
    description: "Multi-agent collaboration with simulation and verification",
    phases: ["perceive", "understand", "plan", "execute", "verify", "learn"],
    requiredCapabilities: ["reasoning", "memory", "planning", "verification", "simulation"],
    estimatedLatencyMs: 5000,
    estimatedCost: 0.2,
    confidenceThreshold: 0.9,
    maxIterations: 3,
  },
  {
    id: "territorial-intelligence",
    name: "Territorial Intelligence",
    description: "Context-aware response using territory data, maps, and local knowledge",
    phases: ["perceive", "understand", "plan", "execute", "verify"],
    requiredCapabilities: ["reasoning", "memory", "mapping", "tourism", "synthesis"],
    estimatedLatencyMs: 3000,
    estimatedCost: 0.15,
    confidenceThreshold: 0.85,
    maxIterations: 2,
  },
  {
    id: "emergency-response",
    name: "Emergency Response",
    description: "Rapid response with minimal verification for critical situations",
    phases: ["perceive", "understand", "execute"],
    requiredCapabilities: ["reasoning", "security"],
    estimatedLatencyMs: 100,
    estimatedCost: 0.02,
    confidenceThreshold: 0.6,
    maxIterations: 1,
  },
  {
    id: "creative-synthesis",
    name: "Creative Synthesis",
    description: "Multi-source creative generation with iterative refinement",
    phases: ["perceive", "understand", "plan", "execute", "verify", "learn"],
    requiredCapabilities: ["reasoning", "memory", "creative", "verification"],
    estimatedLatencyMs: 4000,
    estimatedCost: 0.18,
    confidenceThreshold: 0.85,
    maxIterations: 3,
  },
  {
    id: "collaborative-decision",
    name: "Collaborative Decision",
    description: "Multi-agent consensus with voting and conflict resolution",
    phases: ["perceive", "understand", "plan", "execute", "verify", "learn"],
    requiredCapabilities: ["reasoning", "negotiation", "synthesis", "verification"],
    estimatedLatencyMs: 8000,
    estimatedCost: 0.3,
    confidenceThreshold: 0.9,
    maxIterations: 2,
  },
];

// â”€â”€ Signal Patterns for Strategy Selection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SIGNAL_PATTERNS: Record<string, { keywords: string[]; strategy: string; risk: RiskAssessment["level"] }> = {
  simpleQuestion: {
    keywords: ["que es", "como se", "cuando", "donde", "cuanto", "who", "what", "when", "where"],
    strategy: "quick-response",
    risk: "none",
  },
  complexProject: {
    keywords: ["crear", "construir", "desarrollar", "implementar", "plan", "project", "create", "build"],
    strategy: "deep-analysis",
    risk: "medium",
  },
  territorialQuery: {
    keywords: ["territorio", "real del monte", "comercio", "turismo", "mapa", "ruta", "pois"],
    strategy: "territorial-intelligence",
    risk: "low",
  },
  securitySensitive: {
    keywords: ["seguridad", "password", "token", "key", "admin", "delete", "shutdown"],
    strategy: "emergency-response",
    risk: "high",
  },
  creativeTask: {
    keywords: ["escribir", "diseÃ±ar", "crear contenido", "historia", "narrativa", "arte"],
    strategy: "creative-synthesis",
    risk: "low",
  },
  decisionNeeded: {
    keywords: ["decidir", "elegir", "comparar", "evaluar", "opinar", "recomendar"],
    strategy: "collaborative-decision",
    risk: "medium",
  },
};

// â”€â”€ Meta-Reasoner Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface MetaReasoner {
  decide(request: CognitiveRequest): MetaDecision;
  addStrategy(strategy: ThinkingStrategy): void;
  getStrategies(): ThinkingStrategy[];
  getDecisionHistory(limit: number): MetaDecision[];
}

const decisionHistory: MetaDecision[] = [];
const MAX_HISTORY = 1000;

function analyzeSignals(input: string, context: DynamicContext): {
  matchedPatterns: string[];
  complexityScore: number; // 0-1
  urgencyScore: number;    // 0-1
  riskIndicators: string[];
} {
  const lower = input.toLowerCase();
  const matchedPatterns: string[] = [];
  const riskIndicators: string[] = [];
  let complexityScore = 0.3; // baseline
  let urgencyScore = 0.2;

  for (const [patternId, pattern] of Object.entries(SIGNAL_PATTERNS)) {
    const matchCount = pattern.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > 0) {
      matchedPatterns.push(patternId);
      complexityScore += matchCount * 0.1;
      if (pattern.risk === "high" || pattern.risk === "critical") {
        riskIndicators.push(patternId);
        urgencyScore += 0.3;
      }
    }
  }

  // Input length as complexity signal
  if (input.length > 500) complexityScore += 0.1;
  if (input.length > 2000) complexityScore += 0.2;

  // System state as urgency signal
  if (context.systemState.mode === "EMERGENCY") {
    urgencyScore = 1.0;
    riskIndicators.push("system-emergency");
  } else if (context.systemState.mode === "SAFE") {
    urgencyScore += 0.2;
  }

  // Time of day adjustments
  if (context.timeOfDay === "night") {
    complexityScore *= 0.9; // simpler responses at night
  }

  return {
    matchedPatterns,
    complexityScore: Math.min(1, complexityScore),
    urgencyScore: Math.min(1, urgencyScore),
    riskIndicators,
  };
}

function assessRisk(
  input: string,
  context: DynamicContext,
  riskIndicators: string[],
): RiskAssessment {
  const factors: string[] = [];
  const mitigations: string[] = [];
  let level: RiskAssessment["level"] = "none";

  // Security-related requests
  if (riskIndicators.includes("security-sensitive")) {
    factors.push("Security-sensitive operation requested");
    mitigations.push("Apply strict authorization checks");
    mitigations.push("Log all inputs and outputs");
    mitigations.push("Require human review for destructive actions");
    level = "high";
  }

  // System emergency
  if (context.systemState.mode === "EMERGENCY") {
    factors.push("System in EMERGENCY mode");
    mitigations.push("Use emergency-response strategy");
    mitigations.push("Minimize external API calls");
    level = "critical";
  }

  // High complexity
  if (riskIndicators.includes("complexProject")) {
    factors.push("Complex multi-step project requested");
    mitigations.push("Use deep-analysis strategy");
    mitigations.push("Break into smaller verifiable steps");
    if (level === "none") level = "medium";
  }

  return {
    level,
    factors,
    mitigations,
    requiresHumanReview: level === "high" || level === "critical",
  };
}

function selectStrategy(
  matchedPatterns: string[],
  complexityScore: number,
  urgencyScore: number,
  riskLevel: RiskAssessment["level"],
): { primary: ThinkingStrategy; alternatives: ThinkingStrategy[] } {
  // Priority: urgency > complexity > pattern match
  let strategyId = "standard-reasoning"; // default

  if (riskLevel === "critical") {
    strategyId = "emergency-response";
  } else if (urgencyScore > 0.8) {
    strategyId = "emergency-response";
  } else if (matchedPatterns.includes("complexProject") || complexityScore > 0.7) {
    strategyId = "deep-analysis";
  } else if (matchedPatterns.includes("territorialQuery")) {
    strategyId = "territorial-intelligence";
  } else if (matchedPatterns.includes("creativeTask")) {
    strategyId = "creative-synthesis";
  } else if (matchedPatterns.includes("decisionNeeded")) {
    strategyId = "collaborative-decision";
  } else if (matchedPatterns.includes("simpleQuestion") && complexityScore < 0.4) {
    strategyId = "quick-response";
  }

  const primary = STRATEGIES.find((s) => s.id === strategyId)!;
  const alternatives = STRATEGIES.filter((s) => s.id !== strategyId);

  return { primary, alternatives };
}

export function createMetaReasoner(): MetaReasoner {
  return {
    decide(request: CognitiveRequest): MetaDecision {
      const { matchedPatterns, complexityScore, urgencyScore, riskIndicators } =
        analyzeSignals(request.input, request.context);

      const riskAssessment = assessRisk(request.input, request.context, riskIndicators);

      const { primary, alternatives } = selectStrategy(
        matchedPatterns,
        complexityScore,
        urgencyScore,
        riskAssessment.level,
      );

      const decision: MetaDecision = {
        strategy: primary,
        reasoning: `Analyzed ${matchedPatterns.length} signal patterns. ` +
          `Complexity: ${complexityScore.toFixed(2)}, Urgency: ${urgencyScore.toFixed(2)}. ` +
          `Risk: ${riskAssessment.level}. ` +
          `Selected strategy: ${primary.name} for optimal processing.`,
        alternativeStrategies: alternatives,
        riskAssessment,
        timestamp: Date.now(),
      };

      decisionHistory.push(decision);
      if (decisionHistory.length > MAX_HISTORY) {
        decisionHistory.shift();
      }

      logger.info({
        requestId: request.id,
        strategyId: primary.id,
        riskLevel: riskAssessment.level,
        complexity: complexityScore,
        urgency: urgencyScore,
      }, "Meta-Reasoner: strategy selected");

      return decision;
    },

    addStrategy(strategy: ThinkingStrategy) {
      const idx = STRATEGIES.findIndex((s) => s.id === strategy.id);
      if (idx >= 0) {
        STRATEGIES[idx] = strategy;
      } else {
        STRATEGIES.push(strategy);
      }
    },

    getStrategies(): ThinkingStrategy[] {
      return [...STRATEGIES];
    },

    getDecisionHistory(limit: number): MetaDecision[] {
      return decisionHistory.slice(-limit);
    },
  };
}
