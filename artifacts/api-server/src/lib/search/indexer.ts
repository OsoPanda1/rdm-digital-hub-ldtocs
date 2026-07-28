/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Search Indexer â€” IndexaciÃ³n de contenido del ecosistema RDM
// BÃºsqueda full-text sobre patrimonio, wiki, POIs, agentes
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface SearchableDocument {
  docId: string;
  type: "patrimonio" | "wiki" | "poi" | "agent" | "event" | "article";
  title: string;
  content: string;
  tags: string[];
  metadata: Record<string, unknown>;
  indexedAt: string;
  updatedAt: string;
}

export interface SearchResult {
  docId: string;
  type: string;
  title: string;
  snippet: string;
  score: number;
  tags: string[];
}

export interface SearchIndexer {
  index(doc: Omit<SearchableDocument, "docId" | "indexedAt" | "updatedAt">): Promise<SearchableDocument>;
  search(query: string, type?: string, limit?: number): Promise<SearchResult[]>;
  getDocument(docId: string): Promise<SearchableDocument | null>;
  removeDocument(docId: string): Promise<boolean>;
  reindex(): Promise<{ reindexed: number }>;
  stats(): Promise<{ totalDocuments: number; byType: Record<string, number>; lastIndexedAt: string | null }>;
}

export function createSearchIndexer(): SearchIndexer {
  const documents = new Map<string, SearchableDocument>();
  let lastIndexedAt: string | null = null;

  function tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  }

  function score(doc: SearchableDocument, queryTokens: string[]): number {
    const docTokens = tokenize(`${doc.title} ${doc.content} ${doc.tags.join(" ")}`);
    let matches = 0;
    for (const qt of queryTokens) {
      for (const dt of docTokens) {
        if (dt === qt) matches += 2;
        else if (dt.includes(qt) || qt.includes(dt)) matches += 1;
      }
    }
    const titleBoost = queryTokens.some((t) => doc.title.toLowerCase().includes(t)) ? 5 : 0;
    return matches + titleBoost;
  }

  function snippet(doc: SearchableDocument, queryTokens: string[], maxLen = 200): string {
    const words = doc.content.split(/\s+/);
    let bestIdx = 0;
    let bestScore = 0;
    for (let i = 0; i < words.length; i++) {
      const windowScore = queryTokens.filter((t) => words.slice(i, i + 10).some((w) => w.toLowerCase().includes(t))).length;
      if (windowScore > bestScore) { bestScore = windowScore; bestIdx = i; }
    }
    return words.slice(bestIdx, bestIdx + 30).join(" ").slice(0, maxLen) + (words.length > bestIdx + 30 ? "..." : "");
  }

  return {
    async index(data) {
      const now = new Date().toISOString();
      const doc: SearchableDocument = {
        ...data,
        docId: `${data.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        indexedAt: now,
        updatedAt: now,
      };
      documents.set(doc.docId, doc);
      lastIndexedAt = now;
      return doc;
    },

    async search(query, type, limit = 20) {
      const queryTokens = tokenize(query);
      if (queryTokens.length === 0) return [];
      const results: SearchResult[] = [];
      for (const doc of documents.values()) {
        if (type && doc.type !== type) continue;
        const s = score(doc, queryTokens);
        if (s > 0) {
          results.push({ docId: doc.docId, type: doc.type, title: doc.title, snippet: snippet(doc, queryTokens), score: s, tags: doc.tags });
        }
      }
      return results.sort((a, b) => b.score - a.score).slice(0, limit);
    },

    async getDocument(docId) { return documents.get(docId) ?? null; },

    async removeDocument(docId) { return documents.delete(docId); },

    async reindex() {
      lastIndexedAt = new Date().toISOString();
      return { reindexed: documents.size };
    },

    async stats() {
      const byType: Record<string, number> = {};
      for (const doc of documents.values()) {
        byType[doc.type] = (byType[doc.type] ?? 0) + 1;
      }
      return { totalDocuments: documents.size, byType, lastIndexedAt };
    },
  };
}
