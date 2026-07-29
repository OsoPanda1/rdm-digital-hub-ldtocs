/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 8 â€” Digital Twin Engine
// Gemelos digitales de repositorios, servicios, infraestructura
// y territorios con simulación de escenarios y monitoring
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition, TwinModel, TwinComponent } from "../types";

export const DigitalTwinDefinition: SkillDefinition = {
  skillId: "digital-twin",
  name: "Digital Twin Engine",
  description: "Repository, service, infrastructure, and territory digital twins with scenario simulation and monitoring",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "exterior",
  inputSchema: "TwinCreateRequest | TwinSimulateRequest | TwinQueryRequest",
  outputSchema: "TwinModel | SimulationResult",
};

interface TwinCreateRequest {
  name: string;
  type: TwinModel["type"];
  components: TwinComponent[];
  dependencies?: string[];
}

interface TwinSimulateRequest {
  modelId: string;
  scenario: string;
  changes: Record<string, unknown>;
}

interface TwinQueryRequest {
  modelId: string;
  componentId?: string;
}

interface SimulationResult {
  modelId: string;
  scenario: string;
  impact: { componentId: string; before: string; after: string; risk: number }[];
  overallRisk: number;
  recommendation: string;
}

export interface DigitalTwinEngine {
  create(request: TwinCreateRequest): TwinModel;
  get(modelId: string): TwinModel | undefined;
  simulate(request: TwinSimulateRequest): SimulationResult;
  query(request: TwinQueryRequest): TwinComponent | TwinComponent[];
  updateMetrics(modelId: string, componentId: string, metrics: Record<string, number>): boolean;
  list(): TwinModel[];
  delete(modelId: string): boolean;
  stats(): { totalTwins: number; byType: Record<string, number>; totalComponents: number };
}

export function createDigitalTwinEngine(): DigitalTwinEngine {
  const twins = new Map<string, TwinModel>();
  let idCounter = 0;

  return {
    create(request) {
      const modelId = `twin-${++idCounter}`;
      const model: TwinModel = {
        modelId,
        name: request.name,
        type: request.type,
        components: request.components.map((c) => ({ ...c })),
        dependencies: request.dependencies ?? [],
        snapshot: { createdAt: Date.now(), lastUpdated: Date.now() },
      };
      twins.set(modelId, model);
      return model;
    },

    get(modelId) { return twins.get(modelId); },

    simulate(request) {
      const model = twins.get(request.modelId);
      if (!model) return { modelId: request.modelId, scenario: request.scenario, impact: [], overallRisk: 0, recommendation: "Twin not found" };

      const impact = model.components.map((comp) => {
        const changeKey = Object.keys(request.changes).find((k) => k === comp.id || k === comp.name);
        const risk = changeKey ? 0.3 + Math.random() * 0.5 : 0.1 + Math.random() * 0.2;
        return {
          componentId: comp.id,
          before: comp.status,
          after: risk > 0.6 ? "degraded" : comp.status,
          risk,
        };
      });

      const overallRisk = impact.length > 0 ? impact.reduce((s, i) => s + i.risk, 0) / impact.length : 0;
      const recommendation = overallRisk > 0.7 ? "High risk â€” deploy with caution" : overallRisk > 0.4 ? "Medium risk â€” test thoroughly" : "Low risk â€” safe to proceed";

      return { modelId: request.modelId, scenario: request.scenario, impact, overallRisk, recommendation };
    },

    query(request) {
      const model = twins.get(request.modelId);
      if (!model) return [];
      if (request.componentId) return model.components.find((c) => c.id === request.componentId) ?? [];
      return model.components;
    },

    updateMetrics(modelId, componentId, metrics) {
      const model = twins.get(modelId);
      if (!model) return false;
      const comp = model.components.find((c) => c.id === componentId);
      if (!comp) return false;
      comp.metrics = { ...comp.metrics, ...metrics };
      model.snapshot = { ...model.snapshot, lastUpdated: Date.now() };
      return true;
    },

    list() { return Array.from(twins.values()); },

    delete(modelId) { return twins.delete(modelId); },

    stats() {
      const total = twins.size;
      const byType: Record<string, number> = {};
      let totalComps = 0;
      for (const t of twins.values()) {
        byType[t.type] = (byType[t.type] ?? 0) + 1;
        totalComps += t.components.length;
      }
      return { totalTwins: total, byType, totalComponents: totalComps };
    },
  };
}
