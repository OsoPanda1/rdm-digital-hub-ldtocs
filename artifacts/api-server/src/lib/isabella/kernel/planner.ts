/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Planning Engine
// Objective â†’ Decomposition â†’ Dependencies â†’ Risks â†’ Estimation â†’ Plan â†’ Exec
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type {
  ExecutionPlan,
  PlanStep,
  PlanDependency,
  CapabilityId,
  RiskAssessment,
} from "./types";
import { logger } from "../../logger";

export interface Planner {
  createPlan(objective: string, context?: Record<string, unknown>): ExecutionPlan;
  decomposeObjective(objective: string): PlanStep[];
  estimateRisks(steps: PlanStep[]): RiskAssessment;
  approvePlan(planId: string): boolean;
  abortPlan(planId: string): boolean;
  getPlan(planId: string): ExecutionPlan | undefined;
  listPlans(): ExecutionPlan[];
}

const plans = new Map<string, ExecutionPlan>();

// â”€â”€ Objective Decomposition Patterns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DecompositionPattern {
  keywords: string[];
  steps: Array<{ description: string; capability: CapabilityId; cost: number; latencyMs: number }>;
}

const DECOMPOSITION_PATTERNS: DecompositionPattern[] = [
  {
    keywords: ["crear", "construir", "desarrollar", "implementar"],
    steps: [
      { description: "Analyze requirements and constraints", capability: "reasoning", cost: 0.01, latencyMs: 200 },
      { description: "Research existing solutions and patterns", capability: "research", cost: 0.02, latencyMs: 300 },
      { description: "Design architecture and component structure", capability: "architecture", cost: 0.03, latencyMs: 350 },
      { description: "Plan implementation steps with dependencies", capability: "planning", cost: 0.02, latencyMs: 300 },
      { description: "Execute implementation", capability: "programming", cost: 0.02, latencyMs: 250 },
      { description: "Verify and validate results", capability: "verification", cost: 0.02, latencyMs: 250 },
    ],
  },
  {
    keywords: ["analizar", "evaluar", "estudiar", "examinar"],
    steps: [
      { description: "Identify analysis objectives", capability: "reasoning", cost: 0.01, latencyMs: 150 },
      { description: "Gather relevant data", capability: "research", cost: 0.02, latencyMs: 300 },
      { description: "Apply analytical framework", capability: "analysis", cost: 0.02, latencyMs: 250 },
      { description: "Synthesize findings", capability: "synthesis", cost: 0.015, latencyMs: 200 },
      { description: "Verify conclusions", capability: "verification", cost: 0.02, latencyMs: 250 },
    ],
  },
  {
    keywords: ["turismo", "ruta", "visitar", "explorar", "recomendar"],
    steps: [
      { description: "Understand user preferences and constraints", capability: "reasoning", cost: 0.01, latencyMs: 150 },
      { description: "Retrieve territorial knowledge", capability: "mapping", cost: 0.01, latencyMs: 150 },
      { description: "Generate tourism recommendations", capability: "tourism", cost: 0.01, latencyMs: 200 },
      { description: "Optimize route and schedule", capability: "planning", cost: 0.02, latencyMs: 300 },
      { description: "Verify recommendations", capability: "verification", cost: 0.02, latencyMs: 250 },
    ],
  },
  {
    keywords: ["seguridad", "proteger", "defender", "auditar"],
    steps: [
      { description: "Assess threat landscape", capability: "security", cost: 0.05, latencyMs: 500 },
      { description: "Identify vulnerabilities", capability: "security", cost: 0.05, latencyMs: 500 },
      { description: "Design countermeasures", capability: "reasoning", cost: 0.01, latencyMs: 200 },
      { description: "Implement hardening", capability: "programming", cost: 0.02, latencyMs: 250 },
      { description: "Verify security posture", capability: "verification", cost: 0.02, latencyMs: 250 },
    ],
  },
  {
    keywords: ["escribir", "crear contenido", "narrativa", "historia"],
    steps: [
      { description: "Understand creative brief", capability: "reasoning", cost: 0.01, latencyMs: 150 },
      { description: "Research context and references", capability: "research", cost: 0.02, latencyMs: 300 },
      { description: "Generate creative content", capability: "creative", cost: 0.03, latencyMs: 400 },
      { description: "Review and refine", capability: "verification", cost: 0.02, latencyMs: 250 },
    ],
  },
];

function matchDecompositionPattern(objective: string): DecompositionPattern | null {
  const lower = objective.toLowerCase();
  for (const pattern of DECOMPOSITION_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern;
    }
  }
  return null;
}

export function createPlanner(): Planner {
  return {
    createPlan(objective, _context) {
      const steps = this.decomposeObjective(objective);
      const risks = this.estimateRisks(steps);

      const dependencies: PlanDependency[] = steps.map((step, i) => ({
        stepId: step.id,
        dependsOn: i > 0 ? [steps[i - 1].id] : [],
        type: i > 0 ? "blocks" as const : "soft" as const,
      }));

      const plan: ExecutionPlan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        objective,
        steps,
        dependencies,
        risks,
        estimatedTotalCost: steps.reduce((s, st) => s + st.estimatedCost, 0),
        estimatedTotalLatencyMs: steps.reduce((s, st) => s + st.estimatedLatencyMs, 0),
        confidence: 0.8,
        status: "draft",
        createdAt: Date.now(),
      };

      plans.set(plan.id, plan);
      logger.info({ planId: plan.id, steps: steps.length, riskLevel: risks.level }, "Plan created");
      return plan;
    },

    decomposeObjective(objective) {
      const pattern = matchDecompositionPattern(objective);
      if (pattern) {
        return pattern.steps.map((s, i) => ({
          id: `step-${Date.now()}-${i}`,
          order: i,
          description: s.description,
          capabilityId: s.capability,
          inputs: { objective },
          expectedOutput: `Output of: ${s.description}`,
          estimatedCost: s.cost,
          estimatedLatencyMs: s.latencyMs,
          status: "pending" as const,
        }));
      }

      // Default decomposition: single reasoning step
      return [{
        id: `step-${Date.now()}-0`,
        order: 0,
        description: `Process objective: ${objective}`,
        capabilityId: "reasoning" as CapabilityId,
        inputs: { objective },
        expectedOutput: "Direct response",
        estimatedCost: 0.01,
        estimatedLatencyMs: 200,
        status: "pending",
      }];
    },

    estimateRisks(steps) {
      const totalCost = steps.reduce((s, st) => s + st.estimatedCost, 0);
      const totalLatency = steps.reduce((s, st) => s + st.estimatedLatencyMs, 0);
      const hasSecurity = steps.some((s) => s.capabilityId === "security");
      const hasProgramming = steps.some((s) => s.capabilityId === "programming");

      let level: RiskAssessment["level"] = "none";
      const factors: string[] = [];
      const mitigations: string[] = [];

      if (totalCost > 0.2) {
        level = "medium";
        factors.push(`High estimated cost: ${totalCost.toFixed(3)}`);
        mitigations.push("Break into smaller phases");
      }
      if (totalLatency > 5000) {
        if (level === "none") level = "low";
        factors.push(`Long estimated latency: ${totalLatency}ms`);
        mitigations.push("Consider parallel execution");
      }
      if (hasSecurity) {
        if (level === "none") level = "low";
        factors.push("Security operations involved");
        mitigations.push("Apply strict audit logging");
      }
      if (hasProgramming) {
        if (level === "none") level = "low";
        factors.push("Code generation involved");
        mitigations.push("Verify output with tests");
      }

      return {
        level,
        factors,
        mitigations,
        requiresHumanReview: level === "high" || level === "critical",
      };
    },

    approvePlan(planId) {
      const plan = plans.get(planId);
      if (!plan || plan.status !== "draft") return false;
      plan.status = "approved";
      logger.info({ planId }, "Plan approved");
      return true;
    },

    abortPlan(planId) {
      const plan = plans.get(planId);
      if (!plan || plan.status === "completed" || plan.status === "aborted") return false;
      plan.status = "aborted";
      logger.info({ planId }, "Plan aborted");
      return true;
    },

    getPlan(planId) {
      return plans.get(planId);
    },

    listPlans() {
      return Array.from(plans.values());
    },
  };
}
