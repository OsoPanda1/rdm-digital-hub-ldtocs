// ────────────────────────────────────────────────────────────────
// Isabella.Memory — Librarian Memory Adapter (Ω-Core v4.0 Enterprise)
// Adaptador de memoria para el motor bibliotecario
// ────────────────────────────────────────────────────────────────

import type { MemoryEngine, MemoryEntry, MemoryType } from "./engine";

export interface LibrarianMemory {
  storeDocument(doc: { title: string; content: string; source: string; domain: string }): MemoryEntry;
  recallDocuments(domain?: string, limit?: number): MemoryEntry[];
  storeLesson(lesson: { content: string; source: string; tags: string[] }): MemoryEntry;
  recallLessons(limit?: number): MemoryEntry[];
  search(query: string, limit?: number): MemoryEntry[];
}

export function createLibrarianMemory(memoryEngine: MemoryEngine): LibrarianMemory {
  return {
    storeDocument(doc): MemoryEntry {
      return memoryEngine.store({
        type: "ecosystem" as MemoryType,
        content: `[${doc.domain}] ${doc.title}: ${doc.content}`,
        tags: [doc.domain, doc.title.toLowerCase().slice(0, 50)],
        source: doc.source,
        ttl: 0,
        confidence: 0.9,
      });
    },

    recallDocuments(domain?: string, limit?: number): MemoryEntry[] {
      return memoryEngine.recall({
        types: ["ecosystem"],
        tags: domain ? [domain] : undefined,
        limit: limit ?? 50,
      });
    },

    storeLesson(lesson): MemoryEntry {
      return memoryEngine.store({
        type: "lesson" as MemoryType,
        content: lesson.content,
        tags: lesson.tags,
        source: lesson.source,
        ttl: 0,
        confidence: 0.85,
      });
    },

    recallLessons(limit?: number): MemoryEntry[] {
      return memoryEngine.recall({
        types: ["lesson"],
        limit: limit ?? 30,
      });
    },

    search(query: string, limit?: number): MemoryEntry[] {
      return memoryEngine.searchByContent(query, limit);
    },
  };
}
