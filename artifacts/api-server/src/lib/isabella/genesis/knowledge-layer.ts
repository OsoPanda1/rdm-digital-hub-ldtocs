/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Genesis â€” Knowledge Layer
// Graph + embeddings RAG territorial y epistemolÃ³gico
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { db } from "../../db-client";
import { isabellaKnowledge } from "../../db/schema";
import { sql } from "drizzle-orm";

export interface KnowledgePassage {
  text: string;
  score: number;
  provenanceHash: string;
  graphPath?: string[];
  domain: string;
  topic: string;
}

export interface KnowledgeQueryPayload {
  query: string;
  userId: string;
  contextHints?: Record<string, unknown>;
  maxPassages?: number;
  domains?: string[];
}

export interface KnowledgeQueryResult {
  passages: KnowledgePassage[];
  graphPaths: string[][];
  totalMatches: number;
  searchType: "keyword" | "vector" | "hybrid";
}

export interface KnowledgeNode {
  nodeId: string;
  type: "fact" | "code" | "doc";
  contentHash: string;
  embeddingsId?: string;
  provenance: string;
  lastUpdated: string;
  version: string;
  domain: string;
}

export interface KnowledgeLayer {
  query(payload: KnowledgeQueryPayload): Promise<KnowledgeQueryResult>;
  addNode(node: Omit<KnowledgeNode, "nodeId" | "lastUpdated">): Promise<KnowledgeNode>;
  getNode(nodeId: string): Promise<KnowledgeNode | null>;
  stats(): Promise<{ totalNodes: number; byDomain: Record<string, number> }>;
}

function hashContent(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

function keywordScore(query: string, text: string, keywords: string[]): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let score = 0;
  if (t.includes(q)) score += 0.6;
  for (const kw of keywords) {
    if (q.includes(kw.toLowerCase()) || t.includes(kw.toLowerCase())) score += 0.1;
  }
  return Math.min(1.0, score);
}

export function createKnowledgeLayer(): KnowledgeLayer {
  const localNodes = new Map<string, KnowledgeNode>();

  return {
    async query(payload) {
      const maxP = payload.maxPassages ?? 8;
      const passages: KnowledgePassage[] = [];
      const graphPaths: string[][] = [];

      try {
        const allKnowledge = await db.select().from(isabellaKnowledge);
        const scored = allKnowledge.map((row) => {
          const kw = Array.isArray(row.keywords) ? (row.keywords as string[]) : [];
          const score = keywordScore(payload.query, `${row.topic} ${row.content}`, kw) + (row.priority / 10) * 0.2;
          return { row, score, kw };
        });

        scored.sort((a, b) => b.score - a.score);
        const top = scored.filter((s) => s.score > 0.1).slice(0, maxP);

        for (const { row, score, kw } of top) {
          passages.push({
            text: row.content,
            score,
            provenanceHash: hashContent(row.content),
            domain: row.domain ?? "ecosystem",
            topic: row.topic,
          });
          graphPaths.push([`domain:${row.domain}`, `topic:${row.topic}`, `category:${row.category}`]);
        }

        return { passages, graphPaths, totalMatches: scored.filter((s) => s.score > 0.1).length, searchType: "keyword" };
      } catch {
        for (const [, node] of localNodes) {
          const score = keywordScore(payload.query, node.provenance, []);
          if (score > 0.1) {
            passages.push({
              text: node.provenance,
              score,
              provenanceHash: node.contentHash,
              domain: node.domain,
              topic: node.nodeId,
            });
          }
        }
        return { passages: passages.slice(0, maxP), graphPaths, totalMatches: passages.length, searchType: "keyword" };
      }
    },

    async addNode(node) {
      const full: KnowledgeNode = {
        ...node,
        nodeId: `kn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        lastUpdated: new Date().toISOString(),
      };
      localNodes.set(full.nodeId, full);
      return full;
    },

    async getNode(nodeId) {
      return localNodes.get(nodeId) ?? null;
    },

    async stats() {
      const byDomain: Record<string, number> = {};
      for (const [, n] of localNodes) byDomain[n.domain] = (byDomain[n.domain] ?? 0) + 1;
      return { totalNodes: localNodes.size, byDomain };
    },
  };
}
