/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Confidence Model
// Every response gets a confidence score with evidence tracking.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type { ConfidenceScore } from "./types";

export interface ConfidenceModel {
  calculate(params: {
    sources: number;
    memories: number;
    policies: string[];
    tools: string[];
    factualSignals?: number;
    relevanceSignals?: number;
    safetySignals?: number;
  }): ConfidenceScore;
  aggregate(scores: ConfidenceScore[]): ConfidenceScore;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function createConfidenceModel(): ConfidenceModel {
  return {
    calculate(params) {
      const sourceScore = clamp(params.sources / 5); // more sources = higher confidence
      const memoryScore = clamp(params.memories / 3);
      const factualScore = clamp((params.factualSignals ?? 3) / 5);
      const relevanceScore = clamp((params.relevanceSignals ?? 3) / 5);
      const safetyScore = params.policies.length > 0 ? 0.9 : 0.5;

      const overall = clamp(
        factualScore * 0.25 +
        relevanceScore * 0.2 +
        sourceScore * 0.2 +
        memoryScore * 0.15 +
        safetyScore * 0.2,
      );

      return {
        overall,
        evidenceCount: params.sources + params.memories,
        sourceCount: params.sources,
        memoryRetrievalCount: params.memories,
        policiesChecked: params.policies,
        toolsUsed: params.tools,
        breakdown: {
          factualAccuracy: factualScore,
          relevance: relevanceScore,
          completeness: clamp((sourceScore + memoryScore) / 2),
          safety: safetyScore,
          coherence: clamp((factualScore + relevanceScore) / 2),
        },
      };
    },

    aggregate(scores) {
      if (scores.length === 0) {
        return {
          overall: 0, evidenceCount: 0, sourceCount: 0, memoryRetrievalCount: 0,
          policiesChecked: [], toolsUsed: [],
          breakdown: { factualAccuracy: 0, relevance: 0, completeness: 0, safety: 0, coherence: 0 },
        };
      }

      const avg = (field: keyof ConfidenceScore["breakdown"]) =>
        scores.reduce((s, sc) => s + sc.breakdown[field], 0) / scores.length;

      return {
        overall: clamp(scores.reduce((s, sc) => s + sc.overall, 0) / scores.length),
        evidenceCount: scores.reduce((s, sc) => s + sc.evidenceCount, 0),
        sourceCount: scores.reduce((s, sc) => s + sc.sourceCount, 0),
        memoryRetrievalCount: scores.reduce((s, sc) => s + sc.memoryRetrievalCount, 0),
        policiesChecked: [...new Set(scores.flatMap((sc) => sc.policiesChecked))],
        toolsUsed: [...new Set(scores.flatMap((sc) => sc.toolsUsed))],
        breakdown: {
          factualAccuracy: avg("factualAccuracy"),
          relevance: avg("relevance"),
          completeness: avg("completeness"),
          safety: avg("safety"),
          coherence: avg("coherence"),
        },
      };
    },
  };
}
