// ────────────────────────────────────────────────────────────────
// F2 — Patrimonio y Memoria
// Ledger de patrimonio, enciclopedia territorial, wiki versionada
// ────────────────────────────────────────────────────────────────

export interface PatrimonioEntry {
  id: string;
  title: string;
  content: string;
  category: "historia" | "gastronomia" | "turismo" | "cultura" | "arquitectura" | "mineria";
  territory: string;
  author: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface PatrimonioLedger {
  create(entry: Omit<PatrimonioEntry, "id" | "version" | "createdAt" | "updatedAt">): Promise<PatrimonioEntry>;
  get(id: string): Promise<PatrimonioEntry | null>;
  update(id: string, updates: Partial<Pick<PatrimonioEntry, "title" | "content" | "category">>): Promise<PatrimonioEntry | null>;
  search(query: string, limit?: number): Promise<PatrimonioEntry[]>;
  byCategory(category: string): Promise<PatrimonioEntry[]>;
  stats(): Promise<{ total: number; byCategory: Record<string, number> }>;
}

export function createPatrimonioLedger(): PatrimonioLedger {
  const entries = new Map<string, PatrimonioEntry>();

  return {
    async create(data) {
      const entry: PatrimonioEntry = {
        ...data,
        id: `pat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      entries.set(entry.id, entry);
      return entry;
    },

    async get(id) { return entries.get(id) ?? null; },

    async update(id, updates) {
      const entry = entries.get(id);
      if (!entry) return null;
      if (updates.title) entry.title = updates.title;
      if (updates.content) entry.content = updates.content;
      if (updates.category) entry.category = updates.category;
      entry.version++;
      entry.updatedAt = new Date().toISOString();
      return entry;
    },

    async search(query, limit = 10) {
      const q = query.toLowerCase();
      return Array.from(entries.values())
        .filter((e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q))
        .slice(0, limit);
    },

    async byCategory(category) {
      return Array.from(entries.values()).filter((e) => e.category === category);
    },

    async stats() {
      const byCategory: Record<string, number> = {};
      for (const [, e] of entries) byCategory[e.category] = (byCategory[e.category] ?? 0) + 1;
      return { total: entries.size, byCategory };
    },
  };
}
