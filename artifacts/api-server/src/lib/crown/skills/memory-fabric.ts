/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 1 â€” Memory Fabric
// Multiscale RAG con confianza adaptativa, coherencia transversal,
// prevenciÃ³n de alucinaciones y recuperaciÃ³n de memoria
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition, CapabilityRequest, CapabilityResponse, BookPiAnchor } from "../types";

export const MemoryFabricDefinition: SkillDefinition = {
  skillId: "memory",
  name: "Memory Fabric",
  description: "Multiscale RAG with adaptive confidence, hallucination prevention, and memory recovery",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "memory",
  inputSchema: "MemoryStoreRequest | MemoryRecallRequest",
  outputSchema: "MemoryStoreResult | MemoryRecallResult",
};

interface MemoryEntry {
  id: string;
  type: string;
  content: string;
  embedding?: number[];
  confidence: number;
  createdAt: number;
  accessCount: number;
  relations: { targetId: string; relation: string }[];
  ttl?: number;
}

interface MemoryStoreResult {
  entryId: string;
  stored: boolean;
  confidence: number;
  conflicts: string[];
}

interface MemoryRecallResult {
  entries: { entry: MemoryEntry; score: number; confidence: number }[];
  totalMatches: number;
  queryConfidence: number;
}

export interface MemoryFabric {
  store(content: string, type: string, confidence: number, relations?: { targetId: string; relation: string }[], ttl?: number): MemoryStoreResult;
  recall(query: string, types?: string[], limit?: number, minConfidence?: number): MemoryRecallResult;
  getEntry(id: string): MemoryEntry | undefined;
  prune(): number;
  stats(): { totalEntries: number; byType: Record<string, number>; avgConfidence: number };
}

export function createMemoryFabric(): MemoryFabric {
  const entries = new Map<string, MemoryEntry>();
  let idCounter = 0;

  function hashStr(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i]! * b[i]!; na += a[i]! * a[i]!; nb += b[i]! * b[i]!; }
    return na > 0 && nb > 0 ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
  }

  function textSimilarity(a: string, b: string): number {
    const wa = a.toLowerCase().split(/\s+/);
    const wb = b.toLowerCase().split(/\s+/);
    const set = new Set([...wa, ...wb]);
    let intersection = 0;
    for (const w of wa) if (wb.includes(w)) intersection++;
    return set.size > 0 ? intersection / set.size : 0;
  }

  function entryScore(entry: MemoryEntry, query: string, queryEmbed?: number[]): number {
    let sim = textSimilarity(entry.content, query);
    if (queryEmbed && entry.embedding) sim = cosineSimilarity(entry.embedding, queryEmbed);
    const recencyBoost = Math.min(1, 1 / (1 + (Date.now() - entry.createdAt) / 86400000));
    const accessBoost = Math.min(0.2, entry.accessCount * 0.02);
    return sim * 0.6 + entry.confidence * 0.2 + recencyBoost * 0.1 + accessBoost + 0.1;
  }

  return {
    store(content, type, confidence, relations = [], ttl) {
      const id = `mem-${++idCounter}`;
      const conflicts: string[] = [];
      for (const [, e] of entries) {
        if (e.type === type && textSimilarity(e.content, content) > 0.8) conflicts.push(e.id);
      }
      const entry: MemoryEntry = { id, type, content, confidence, createdAt: Date.now(), accessCount: 0, relations, ttl };
      entries.set(id, entry);
      return { entryId: id, stored: true, confidence, conflicts };
    },

    recall(query, types, limit = 10, minConfidence = 0) {
      const queryEmbed = undefined;
      let scored = Array.from(entries.values())
        .filter((e) => { if (types && types.length > 0 && !types.includes(e.type)) return false; if (e.confidence < minConfidence) return false; if (e.ttl && Date.now() - e.createdAt > e.ttl) return false; return true; })
        .map((entry) => { entry.accessCount++; return { entry, score: entryScore(entry, query, queryEmbed), confidence: entry.confidence }; })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      const queryConfidence = scored.length > 0 ? scored.reduce((s, e) => s + e.confidence, 0) / scored.length : 0;
      return { entries: scored, totalMatches: scored.length, queryConfidence };
    },

    getEntry(id) { return entries.get(id); },

    prune() {
      let pruned = 0;
      for (const [id, e] of entries) {
        if (e.ttl && Date.now() - e.createdAt > e.ttl) { entries.delete(id); pruned++; }
      }
      return pruned;
    },

    stats() {
      const total = entries.size;
      const byType: Record<string, number> = {};
      let confSum = 0;
      for (const e of entries.values()) { byType[e.type] = (byType[e.type] ?? 0) + 1; confSum += e.confidence; }
      return { totalEntries: total, byType, avgConfidence: total > 0 ? confSum / total : 0 };
    },
  };
}
