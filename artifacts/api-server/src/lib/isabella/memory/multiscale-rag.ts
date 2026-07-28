/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Memory â€” Multiscale RAG
// RecuperaciÃ³n desde isabella_knowledge + Wiki + Living World
// segÃºn 7 tipos de memoria: session, persona, ecosystem, cultural, lesson, pattern, incident
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { db } from "../../../db-client";
import { isabellaKnowledge, isabellaMemory } from "../../../db/schema";
import { sql } from "drizzle-orm";
import type { MemoryType } from "../memory/engine";

export interface MultiscaleQuery {
  text: string;
  types?: MemoryType[];
  domains?: string[];
  minConfidence?: number;
  maxResults?: number;
  includeWiki?: boolean;
  includeLivingWorld?: boolean;
}

export interface MultiscaleResult {
  entries: Array<{
    id: string;
    type: string;
    content: string;
    score: number;
    source: string;
    domain?: string;
  }>;
  totalMatches: number;
  sourcesQueried: string[];
  latencyMs: number;
}

export interface MultiscaleRAG {
  query(q: MultiscaleQuery): Promise<MultiscaleResult>;
  ingestFromKnowledge(): Promise<number>;
  stats(): Promise<{ totalMemory: number; totalKnowledge: number; byType: Record<string, number> }>;
}

function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  let intersection = 0;
  for (const w of wordsA) if (wordsB.has(w)) intersection++;
  return intersection / Math.max(wordsA.size, wordsB.size, 1);
}

export function createMultiscaleRAG(): MultiscaleRAG {
  let lastIngestCount = 0;

  return {
    async query(q) {
      const start = Date.now();
      const entries: MultiscaleResult["entries"] = [];
      const sourcesQueried: string[] = [];

      try {
        sourcesQueried.push("isabella_memory");
        const memRows = await db.select().from(isabellaMemory);
        for (const row of memRows) {
          if (q.types?.length && !q.types.includes(row.type as MemoryType)) continue;
          if (q.minConfidence && row.confidence < q.minConfidence) continue;
          const score = textSimilarity(q.text, row.content);
          if (score > 0.05) {
            entries.push({ id: row.id, type: row.type, content: row.content, score, source: "memory", domain: undefined });
          }
        }
      } catch { /* DB not available */ }

      try {
        sourcesQueried.push("isabella_knowledge");
        const kbRows = await db.select().from(isabellaKnowledge);
        for (const row of kbRows) {
          if (q.domains?.length && !q.domains.includes(row.domain ?? "ecosystem")) continue;
          const score = textSimilarity(q.text, `${row.topic} ${row.content}`);
          if (score > 0.05) {
            entries.push({ id: row.id, type: "ecosystem", content: row.content, score, source: "knowledge", domain: row.domain ?? undefined });
          }
        }
      } catch { /* DB not available */ }

      entries.sort((a, b) => b.score - a.score);
      const maxR = q.maxResults ?? 10;

      return {
        entries: entries.slice(0, maxR),
        totalMatches: entries.length,
        sourcesQueried,
        latencyMs: Date.now() - start,
      };
    },

    async ingestFromKnowledge() {
      try {
        const kbRows = await db.select().from(isabellaKnowledge);
        let count = 0;
        for (const row of kbRows) {
          await db.insert(isabellaMemory).values({
            id: `mem-kb-${row.id}`,
            type: "ecosystem",
            content: `[${row.domain}] ${row.topic}: ${row.content}`,
            tags: JSON.stringify([row.domain, row.category]),
            source: "knowledge-ingest",
            ttl: 0,
            confidence: row.confidence,
          }).onConflictDoNothing();
          count++;
        }
        lastIngestCount = count;
        return count;
      } catch {
        return 0;
      }
    },

    async stats() {
      try {
        const memRows = await db.select().from(isabellaMemory);
        const kbRows = await db.select().from(isabellaKnowledge);
        const byType: Record<string, number> = {};
        for (const r of memRows) byType[r.type] = (byType[r.type] ?? 0) + 1;
        return { totalMemory: memRows.length, totalKnowledge: kbRows.length, byType };
      } catch {
        return { totalMemory: lastIngestCount, totalKnowledge: 0, byType: {} };
      }
    },
  };
}
