/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 4 â€” Massive Context Processor
// Procesa contextos grandes con chunking adaptativo, priorizaciÃ³n
// por relevancia y ventana de contexto dinÃ¡mica
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition } from "../types";

export const MassiveContextDefinition: SkillDefinition = {
  skillId: "massive-context",
  name: "Massive Context Processor",
  description: "Processes large contexts with adaptive chunking, relevance prioritization, and dynamic context windows",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "memory",
  inputSchema: "ContextProcessRequest",
  outputSchema: "ContextProcessResult",
};

interface ContextChunk {
  id: string;
  content: string;
  relevance: number;
  tokenEstimate: number;
  source: string;
  position: number;
}

interface ContextProcessRequest {
  content: string;
  maxTokens: number;
  query?: string;
  prioritize?: "recency" | "relevance" | "position";
}

interface ContextProcessResult {
  chunks: ContextChunk[];
  totalTokens: number;
  droppedChunks: number;
  fitRatio: number;
}

export interface MassiveContextProcessor {
  process(request: ContextProcessRequest): ContextProcessResult;
  chunkWithOverlap(text: string, chunkSize: number, overlap: number): string[];
  estimateTokens(text: string): number;
  prioritizeChunks(chunks: ContextChunk[], strategy: "recency" | "relevance" | "position"): ContextChunk[];
  stats(): { totalProcessed: number; totalChunks: number; avgFitRatio: number };
}

export function createMassiveContextProcessor(): MassiveContextProcessor {
  let totalProcessed = 0;
  let totalChunks = 0;
  let fitRatioSum = 0;

  function estimateTokens(text: string): number { return Math.ceil(text.length / 4); }

  function textSim(a: string, b: string): number {
    const wa = a.toLowerCase().split(/\s+/).slice(0, 50);
    const wb = b.toLowerCase().split(/\s+/).slice(0, 50);
    const set = new Set([...wa, ...wb]);
    let inter = 0;
    for (const w of wa) if (wb.includes(w)) inter++;
    return set.size > 0 ? inter / set.size : 0;
  }

  return {
    process(request) {
      totalProcessed++;
      const chunks = this.chunkWithOverlap(request.content, 500, 50);
      let position = 0;
      const scored: ContextChunk[] = chunks.map((c) => ({
        id: `ctx-${totalChunks++}`,
        content: c,
        relevance: request.query ? textSim(c, request.query) : 0.5,
        tokenEstimate: estimateTokens(c),
        source: "input",
        position: position++,
      }));

      const prioritized = this.prioritizeChunks(scored, request.prioritize ?? "relevance");
      let tokensUsed = 0;
      const accepted: ContextChunk[] = [];
      let dropped = 0;
      for (const chunk of prioritized) {
        if (tokensUsed + chunk.tokenEstimate <= request.maxTokens) {
          accepted.push(chunk);
          tokensUsed += chunk.tokenEstimate;
        } else { dropped++; }
      }

      const fitRatio = request.content.length > 0 ? accepted.length / scored.length : 1;
      fitRatioSum += fitRatio;

      return { chunks: accepted, totalTokens: tokensUsed, droppedChunks: dropped, fitRatio };
    },

    chunkWithOverlap(text, chunkSize, overlap) {
      const chunks: string[] = [];
      const words = text.split(/\s+/);
      let i = 0;
      while (i < words.length) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
        i += chunkSize - overlap;
      }
      return chunks;
    },

    estimateTokens(text) { return estimateTokens(text); },

    prioritizeChunks(chunks, strategy) {
      if (strategy === "recency") return [...chunks].sort((a, b) => b.position - a.position);
      if (strategy === "position") return [...chunks].sort((a, b) => a.position - b.position);
      return [...chunks].sort((a, b) => b.relevance - a.relevance);
    },

    stats() {
      return {
        totalProcessed,
        totalChunks,
        avgFitRatio: totalProcessed > 0 ? fitRatioSum / totalProcessed : 1,
      };
    },
  };
}
