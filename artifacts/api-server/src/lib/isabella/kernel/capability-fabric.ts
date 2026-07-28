/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Capability Fabric
// Dynamic capability selection with cost/latency/quality/confidence/permissions.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type {
  Capability,
  CapabilityId,
  CapabilityPermission,
  CapabilityResult,
  CapabilitySelection,
} from "./types";
import { logger } from "../../logger";

// â”€â”€ Built-in Capabilities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const BUILTIN_CAPABILITIES: Capability[] = [
  {
    id: "reasoning", name: "Logical Reasoning",
    description: "Deductive, inductive, and abductive reasoning",
    costPerInvocation: 0.01, averageLatencyMs: 200, qualityScore: 0.85,
    confidenceThreshold: 0.6, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "memory", name: "Memory Retrieval",
    description: "Hierarchical memory search and retrieval",
    costPerInvocation: 0.005, averageLatencyMs: 100, qualityScore: 0.8,
    confidenceThreshold: 0.5, permissions: [{ resource: "memory", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "vision", name: "Visual Analysis",
    description: "Image and spatial analysis",
    costPerInvocation: 0.03, averageLatencyMs: 500, qualityScore: 0.75,
    confidenceThreshold: 0.7, permissions: [{ resource: "vision", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "planning", name: "Strategic Planning",
    description: "Multi-step plan generation and decomposition",
    costPerInvocation: 0.02, averageLatencyMs: 300, qualityScore: 0.8,
    confidenceThreshold: 0.7, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "mapping", name: "Geospatial Intelligence",
    description: "Map analysis, POI clustering, route optimization",
    costPerInvocation: 0.01, averageLatencyMs: 150, qualityScore: 0.85,
    confidenceThreshold: 0.6, permissions: [{ resource: "territory", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "tourism", name: "Tourism Intelligence",
    description: "Tourist experience optimization and recommendations",
    costPerInvocation: 0.01, averageLatencyMs: 200, qualityScore: 0.8,
    confidenceThreshold: 0.6, permissions: [{ resource: "territory", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "legal", name: "Legal Analysis",
    description: "Regulatory compliance and legal reasoning",
    costPerInvocation: 0.04, averageLatencyMs: 400, qualityScore: 0.7,
    confidenceThreshold: 0.8, permissions: [{ resource: "legal", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "architecture", name: "Architecture Design",
    description: "Software and systems architecture analysis",
    costPerInvocation: 0.03, averageLatencyMs: 350, qualityScore: 0.85,
    confidenceThreshold: 0.7, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "programming", name: "Code Generation",
    description: "Code generation, review, and refactoring",
    costPerInvocation: 0.02, averageLatencyMs: 250, qualityScore: 0.8,
    confidenceThreshold: 0.7, permissions: [{ resource: "code", actions: ["read", "write"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "security", name: "Security Analysis",
    description: "Threat detection, vulnerability assessment, hardening",
    costPerInvocation: 0.05, averageLatencyMs: 500, qualityScore: 0.9,
    confidenceThreshold: 0.85, permissions: [{ resource: "security", actions: ["read", "execute"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "research", name: "Research Synthesis",
    description: "Multi-source research and synthesis",
    costPerInvocation: 0.02, averageLatencyMs: 300, qualityScore: 0.8,
    confidenceThreshold: 0.7, permissions: [{ resource: "knowledge", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "negotiation", name: "Negotiation Engine",
    description: "Multi-party negotiation and consensus building",
    costPerInvocation: 0.03, averageLatencyMs: 400, qualityScore: 0.75,
    confidenceThreshold: 0.75, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "synthesis", name: "Information Synthesis",
    description: "Merge multiple information sources into coherent output",
    costPerInvocation: 0.015, averageLatencyMs: 200, qualityScore: 0.85,
    confidenceThreshold: 0.65, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "verification", name: "Output Verification",
    description: "Independent verification of reasoning outputs",
    costPerInvocation: 0.02, averageLatencyMs: 250, qualityScore: 0.9,
    confidenceThreshold: 0.8, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "simulation", name: "Scenario Simulation",
    description: "Multi-scenario what-if analysis",
    costPerInvocation: 0.04, averageLatencyMs: 600, qualityScore: 0.75,
    confidenceThreshold: 0.7, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "translation", name: "Translation",
    description: "Multi-language translation with cultural context",
    costPerInvocation: 0.01, averageLatencyMs: 150, qualityScore: 0.85,
    confidenceThreshold: 0.7, permissions: [], enabled: true, version: "1.0.0",
  },
  {
    id: "analysis", name: "Data Analysis",
    description: "Statistical and trend analysis",
    costPerInvocation: 0.02, averageLatencyMs: 250, qualityScore: 0.8,
    confidenceThreshold: 0.7, permissions: [{ resource: "data", actions: ["read"] }],
    enabled: true, version: "1.0.0",
  },
  {
    id: "creative", name: "Creative Generation",
    description: "Narrative, artistic, and creative content generation",
    costPerInvocation: 0.03, averageLatencyMs: 400, qualityScore: 0.75,
    confidenceThreshold: 0.6, permissions: [], enabled: true, version: "1.0.0",
  },
];

// â”€â”€ Capability Fabric Engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CapabilityFabric {
  select(requiredCapabilities: CapabilityId[]): CapabilitySelection[];
  execute(capabilityId: CapabilityId, input: unknown): Promise<CapabilityResult>;
  getCapability(id: CapabilityId): Capability | undefined;
  getAllCapabilities(): Capability[];
  enableCapability(id: CapabilityId, enabled: boolean): void;
  getMetrics(capabilityId: CapabilityId): CapabilityMetrics;
}

export interface CapabilityMetrics {
  totalInvocations: number;
  averageLatencyMs: number;
  averageCost: number;
  successRate: number;
  averageConfidence: number;
}

const metrics = new Map<CapabilityId, {
  invocations: number;
  totalLatencyMs: number;
  totalCost: number;
  successes: number;
  totalConfidence: number;
}>();

function updateMetrics(capabilityId: CapabilityId, result: CapabilityResult) {
  const m = metrics.get(capabilityId) ?? {
    invocations: 0, totalLatencyMs: 0, totalCost: 0, successes: 0, totalConfidence: 0,
  };
  m.invocations++;
  m.totalLatencyMs += result.latencyMs;
  m.totalCost += result.cost;
  if (result.success) m.successes++;
  m.totalConfidence += result.confidence;
  metrics.set(capabilityId, m);
}

export function createCapabilityFabric(): CapabilityFabric {
  const capabilities = new Map<CapabilityId, Capability>(
    BUILTIN_CAPABILITIES.map((c) => [c.id, { ...c }]),
  );

  return {
    select(requiredCapabilities: CapabilityId[]): CapabilitySelection[] {
      return requiredCapabilities
        .filter((id) => capabilities.has(id))
        .filter((id) => capabilities.get(id)!.enabled)
        .map((id) => {
          const cap = capabilities.get(id)!;
          return {
            capabilityId: id,
            reason: `Required for current cognitive phase`,
            estimatedCost: cap.costPerInvocation,
            estimatedLatencyMs: cap.averageLatencyMs,
            confidence: cap.qualityScore,
          };
        });
    },

    async execute(capabilityId: CapabilityId, input: unknown): Promise<CapabilityResult> {
      const cap = capabilities.get(capabilityId);
      if (!cap) {
        return {
          capabilityId, output: null, latencyMs: 0, cost: 0,
          confidence: 0, success: false, error: `Unknown capability: ${capabilityId}`,
        };
      }
      if (!cap.enabled) {
        return {
          capabilityId, output: null, latencyMs: 0, cost: 0,
          confidence: 0, success: false, error: `Capability disabled: ${capabilityId}`,
        };
      }

      const start = Date.now();
      // In production, this dispatches to the actual capability implementation.
      // For now, return a simulated result with the capability's known metrics.
      const result: CapabilityResult = {
        capabilityId,
        output: input,
        latencyMs: cap.averageLatencyMs + Math.random() * 100,
        cost: cap.costPerInvocation,
        confidence: cap.qualityScore,
        success: true,
      };

      updateMetrics(capabilityId, result);

      logger.debug({
        capabilityId,
        latencyMs: result.latencyMs,
        cost: result.cost,
        confidence: result.confidence,
      }, "Capability executed");

      return result;
    },

    getCapability(id: CapabilityId): Capability | undefined {
      return capabilities.get(id);
    },

    getAllCapabilities(): Capability[] {
      return Array.from(capabilities.values());
    },

    enableCapability(id: CapabilityId, enabled: boolean): void {
      const cap = capabilities.get(id);
      if (cap) {
        cap.enabled = enabled;
        logger.info({ capabilityId: id, enabled }, "Capability toggled");
      }
    },

    getMetrics(capabilityId: CapabilityId): CapabilityMetrics {
      const m = metrics.get(capabilityId);
      if (!m || m.invocations === 0) {
        return {
          totalInvocations: 0, averageLatencyMs: 0, averageCost: 0,
          successRate: 0, averageConfidence: 0,
        };
      }
      return {
        totalInvocations: m.invocations,
        averageLatencyMs: m.totalLatencyMs / m.invocations,
        averageCost: m.totalCost / m.invocations,
        successRate: m.successes / m.invocations,
        averageConfidence: m.totalConfidence / m.invocations,
      };
    },
  };
}
