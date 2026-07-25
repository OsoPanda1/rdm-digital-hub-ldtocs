// ────────────────────────────────────────────────────────────────
// SKILL 3 — Knowledge Fabric
// Capa de conocimiento semántico con verificación de verdad,
// ingestión de documentos y grafo de dependencias
// ────────────────────────────────────────────────────────────────

import type { SkillDefinition, KnowledgeIngestRequest, KnowledgeQueryRequest, TruthVerification } from "../types";

export const KnowledgeFabricDefinition: SkillDefinition = {
  skillId: "knowledge",
  name: "Knowledge Fabric",
  description: "Semantic knowledge layer with truth verification, document ingestion, and dependency graphs",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "memory",
  inputSchema: "KnowledgeIngestRequest | KnowledgeQueryRequest",
  outputSchema: "KnowledgeIngestResult | KnowledgeQueryResult",
};

interface KnowledgeDoc {
  id: string;
  source: string;
  content: string;
  format: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  ingestedAt: number;
  confidence: number;
}

interface KnowledgeIngestResult {
  docId: string;
  ingested: boolean;
  conflicts: string[];
}

interface KnowledgeQueryResult {
  results: { doc: KnowledgeDoc; relevance: number }[];
  total: number;
}

export interface KnowledgeFabric {
  ingest(request: KnowledgeIngestRequest): KnowledgeIngestResult;
  query(request: KnowledgeQueryRequest): KnowledgeQueryResult;
  verifyTruth(claim: string, sourceUrls?: string[]): TruthVerification;
  getDoc(id: string): KnowledgeDoc | undefined;
  deleteDoc(id: string): boolean;
  stats(): { totalDocs: number; bySource: Record<string, number>; byFormat: Record<string, number> };
}

export function createKnowledgeFabric(): KnowledgeFabric {
  const docs = new Map<string, KnowledgeDoc>();
  let idCounter = 0;

  function textSim(a: string, b: string): number {
    const wa = a.toLowerCase().split(/\s+/);
    const wb = b.toLowerCase().split(/\s+/);
    const set = new Set([...wa, ...wb]);
    let inter = 0;
    for (const w of wa) if (wb.includes(w)) inter++;
    return set.size > 0 ? inter / set.size : 0;
  }

  return {
    ingest(request) {
      const id = `kdoc-${++idCounter}`;
      const conflicts: string[] = [];
      for (const [, d] of docs) {
        if (d.source === request.source && textSim(d.content, request.content) > 0.85) conflicts.push(d.id);
      }
      docs.set(id, { id, source: request.source, content: request.content, format: request.format, metadata: request.metadata, ingestedAt: Date.now(), confidence: 0.8 });
      return { docId: id, ingested: true, conflicts };
    },

    query(request) {
      let results = Array.from(docs.values())
        .filter((d) => !request.sources || request.sources.length === 0 || request.sources.includes(d.source))
        .map((doc) => ({ doc, relevance: textSim(doc.content, request.query) }))
        .filter((r) => r.relevance >= (request.minConfidence ?? 0))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, request.maxResults);
      return { results, total: results.length };
    },

    verifyTruth(claim, sourceUrls) {
      const sources: TruthVerification["sources"] = [];
      const contradictions: string[] = [];
      for (const doc of docs.values()) {
        if (sourceUrls && !sourceUrls.includes(doc.source)) continue;
        const sim = textSim(doc.content, claim);
        if (sim > 0.3) sources.push({ url: doc.source, confidence: sim, summary: doc.content.slice(0, 200) });
        if (sim > 0.5 && doc.content.toLowerCase().includes("not") && claim.toLowerCase().includes(doc.content.split(/\s+/)[0] ?? "")) {
          contradictions.push(doc.content.slice(0, 100));
        }
      }
      const confidence = sources.length > 0 ? sources.reduce((s, src) => s + src.confidence, 0) / sources.length : 0;
      return { claim, confidence, sources, contradictions, verified: confidence > 0.5 && contradictions.length === 0 };
    },

    getDoc(id) { return docs.get(id); },

    deleteDoc(id) { return docs.delete(id); },

    stats() {
      const total = docs.size;
      const bySource: Record<string, number> = {};
      const byFormat: Record<string, number> = {};
      for (const d of docs.values()) {
        bySource[d.source] = (bySource[d.source] ?? 0) + 1;
        byFormat[d.format] = (byFormat[d.format] ?? 0) + 1;
      }
      return { totalDocs: total, bySource, byFormat };
    },
  };
}
