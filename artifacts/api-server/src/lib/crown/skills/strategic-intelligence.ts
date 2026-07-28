/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 10 â€” Strategic Intelligence Engine
// PlanificaciÃ³n estratÃ©gica con escenarios, anÃ¡lisis de costo,
// priorizaciÃ³n por impacto y plan de acciÃ³n ejecutable
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition, StrategicObjective, StrategicScenario, StrategicPlan } from "../types";

export const StrategicIntelligenceDefinition: SkillDefinition = {
  skillId: "strategic-intelligence",
  name: "Strategic Intelligence Engine",
  description: "Strategic planning with scenarios, cost analysis, impact prioritization, and executable action plans",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "interior",
  inputSchema: "StrategicPlanRequest | ScenarioRequest",
  outputSchema: "StrategicPlan | ScenarioResult",
};

interface StrategicPlanRequest {
  description: string;
  constraints: string[];
  timeline: string;
  priority: number;
}

interface ScenarioRequest {
  objectiveId: string;
  scenarios: { name: string; probability: number; cost: number; impact: number; plan: string[] }[];
}

interface ScenarioResult {
  objectiveId: string;
  scenarios: StrategicScenario[];
  recommended: string;
  expectedROI: number;
  riskAdjustedScore: number;
}

export interface StrategicIntelligenceEngine {
  plan(request: StrategicPlanRequest): StrategicPlan;
  analyzeScenarios(request: ScenarioRequest): ScenarioResult;
  getObjectives(): StrategicObjective[];
  prioritize(): StrategicObjective[];
  getHistory(): StrategicPlan[];
  stats(): { totalPlans: number; totalScenarios: number; avgROI: number };
}

export function createStrategicIntelligenceEngine(): StrategicIntelligenceEngine {
  const objectives = new Map<string, StrategicObjective>();
  const history: StrategicPlan[] = [];
  let idCounter = 0;

  return {
    plan(request) {
      const id = `obj-${++idCounter}`;
      const objective: StrategicObjective = { id, description: request.description, constraints: request.constraints, timeline: request.timeline, priority: request.priority };
      objectives.set(id, objective);

      const scenarios: StrategicScenario[] = [
        { scenarioId: `${id}-s1`, name: "Conservative", probability: 0.7, cost: 100, impact: 60, plan: ["Phase 1: Assessment", "Phase 2: Incremental implementation", "Phase 3: Review and optimize"] },
        { scenarioId: `${id}-s2`, name: "Balanced", probability: 0.5, cost: 250, impact: 80, plan: ["Phase 1: Quick wins", "Phase 2: Core restructuring", "Phase 3: Scale"] },
        { scenarioId: `${id}-s3`, name: "Aggressive", probability: 0.3, cost: 500, impact: 100, plan: ["Phase 1: Full sprint", "Phase 2: Innovation sprint", "Phase 3: Market launch"] },
      ];

      const recommended = scenarios.sort((a, b) => (b.impact * b.probability / b.cost) - (a.impact * a.probability / a.cost))[0]!;
      const plan: StrategicPlan = { objective, scenarios, recommended: recommended.name, reasoning: `Best ROI: ${recommended.name} (${(recommended.impact * recommended.probability / recommended.cost * 100).toFixed(1)}% risk-adjusted return)` };
      history.push(plan);
      return plan;
    },

    analyzeScenarios(request) {
      const scenarios: StrategicScenario[] = request.scenarios.map((s, i) => ({
        scenarioId: `${request.objectiveId}-s${i + 1}`,
        ...s,
      }));

      const scored = scenarios.map((s) => ({ ...s, score: s.impact * s.probability / Math.max(1, s.cost) }));
      const best = scored.sort((a, b) => b.score - a.score)[0]!;
      const avgROI = scored.reduce((s, sc) => s + sc.score, 0) / scored.length;

      return { objectiveId: request.objectiveId, scenarios, recommended: best.name, expectedROI: avgROI, riskAdjustedScore: best.score };
    },

    getObjectives() { return Array.from(objectives.values()); },

    prioritize() { return Array.from(objectives.values()).sort((a, b) => b.priority - a.priority); },

    getHistory() { return [...history]; },

    stats() {
      const totalPlans = history.length;
      const totalScenarios = history.reduce((s, p) => s + p.scenarios.length, 0);
      const avgROI = totalScenarios > 0 ? history.reduce((s, p) => s + p.scenarios.reduce((ss, sc) => ss + sc.impact * sc.probability / Math.max(1, sc.cost), 0), 0) / totalScenarios : 0;
      return { totalPlans, totalScenarios, avgROI };
    },
  };
}
