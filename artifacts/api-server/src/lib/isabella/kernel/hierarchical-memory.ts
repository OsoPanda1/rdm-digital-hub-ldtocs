// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Hierarchical Memory
// 7-level memory with policies, persistence, access control, and TTL.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  MemoryLevel,
  MemoryEntry,
  MemoryPolicy,
  MemoryQuery,
} from "./types";
import { logger } from "../../logger";
import { createHmac, randomBytes } from "crypto";

// ── Memory Policies per Level ───────────────────────────────────────────────

const MEMORY_POLICIES: Record<MemoryLevel, MemoryPolicy> = {
  L0_immediate: {
    level: "L0_immediate", maxEntries: 50, ttlMs: 30_000,
    accessPattern: "lru", encryptionRequired: false, auditRequired: false, retentionDays: 0,
  },
  L1_session: {
    level: "L1_session", maxEntries: 500, ttlMs: 3_600_000,
    accessPattern: "lru", encryptionRequired: false, auditRequired: false, retentionDays: 1,
  },
  L2_project: {
    level: "L2_project", maxEntries: 5_000, ttlMs: 604_800_000, // 7 days
    accessPattern: "lfu", encryptionRequired: false, auditRequired: true, retentionDays: 90,
  },
  L3_territory: {
    level: "L3_territory", maxEntries: 50_000, ttlMs: null, // permanent
    accessPattern: "priority", encryptionRequired: true, auditRequired: true, retentionDays: 365,
  },
  L4_federation: {
    level: "L4_federation", maxEntries: 100_000, ttlMs: null,
    accessPattern: "priority", encryptionRequired: true, auditRequired: true, retentionDays: 730,
  },
  L5_permanent: {
    level: "L5_permanent", maxEntries: 500_000, ttlMs: null,
    accessPattern: "permanent", encryptionRequired: true, auditRequired: true, retentionDays: -1,
  },
  L6_historical: {
    level: "L6_historical", maxEntries: 1_000_000, ttlMs: null,
    accessPattern: "permanent", encryptionRequired: true, auditRequired: true, retentionDays: -1,
  },
};

// ── Memory Engine ───────────────────────────────────────────────────────────

export interface HierarchicalMemory {
  store(entry: Omit<MemoryEntry, "id" | "createdAt" | "accessCount" | "lastAccessedAt">): MemoryEntry;
  query(q: MemoryQuery): MemoryEntry[];
  promote(entryId: string, toLevel: MemoryLevel): boolean;
  demote(entryId: string, toLevel: MemoryLevel): boolean;
  delete(entryId: string): boolean;
  getEntry(entryId: string): MemoryEntry | undefined;
  getStats(): Record<MemoryLevel, { count: number; avgConfidence: number }>;
  prune(): number; // returns count of pruned entries
  getPolicy(level: MemoryLevel): MemoryPolicy;
}

const integritySecret = randomBytes(32).toString("hex");

function computeIntegrityHash(content: string, level: MemoryLevel): string {
  return createHmac("sha256", integritySecret)
    .update(`${level}:${content}`)
    .digest("hex");
}

function isExpired(entry: MemoryEntry): boolean {
  if (entry.expiresAt === null) return false;
  return Date.now() > entry.expiresAt;
}

// In-memory store (replace with Supabase in production)
const stores = new Map<MemoryLevel, Map<string, MemoryEntry>>();

function getStore(level: MemoryLevel): Map<string, MemoryEntry> {
  if (!stores.has(level)) stores.set(level, new Map());
  return stores.get(level)!;
}

export function createHierarchicalMemory(): HierarchicalMemory {
  return {
    store(partial) {
      const policy = MEMORY_POLICIES[partial.level];
      const store = getStore(partial.level);

      // Enforce max entries (evict LRU/LFU if needed)
      if (store.size >= policy.maxEntries) {
        const entries = Array.from(store.values());
        if (policy.accessPattern === "lru") {
          entries.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);
          store.delete(entries[0].id);
        } else if (policy.accessPattern === "lfu") {
          entries.sort((a, b) => a.accessCount - b.accessCount);
          store.delete(entries[0].id);
        }
      }

      const now = Date.now();
      const entry: MemoryEntry = {
        id: `mem-${partial.level}-${now}-${Math.random().toString(36).slice(2, 8)}`,
        level: partial.level,
        content: partial.content,
        tags: partial.tags,
        source: partial.source,
        confidence: Math.max(0, Math.min(1, partial.confidence)),
        accessCount: 0,
        lastAccessedAt: now,
        createdAt: now,
        expiresAt: policy.ttlMs !== null ? now + policy.ttlMs : null,
        metadata: {
          ...partial.metadata,
          integrityHash: computeIntegrityHash(partial.content, partial.level),
        },
      };

      store.set(entry.id, entry);

      if (policy.auditRequired) {
        logger.info({ entryId: entry.id, level: partial.level }, "Memory stored (audited)");
      }

      return entry;
    },

    query(q) {
      const results: MemoryEntry[] = [];

      for (const level of q.levels) {
        const store = getStore(level);
        for (const entry of store.values()) {
          if (isExpired(entry)) continue;
          if (entry.confidence < q.minConfidence) continue;

          // Tag filter
          if (q.tags && q.tags.length > 0) {
            if (!q.tags.some((t) => entry.tags.includes(t))) continue;
          }

          // Time range filter
          if (q.timeRange) {
            if (entry.createdAt < q.timeRange.from || entry.createdAt > q.timeRange.to) continue;
          }

          // Simple text match (in production, use embedding similarity)
          if (q.text) {
            const lower = q.text.toLowerCase();
            if (
              !entry.content.toLowerCase().includes(lower) &&
              !entry.tags.some((t) => t.toLowerCase().includes(lower))
            ) continue;
          }

          // Update access stats
          entry.accessCount++;
          entry.lastAccessedAt = Date.now();

          results.push(entry);
        }
      }

      // Sort by confidence * recency
      results.sort((a, b) => {
        const scoreA = a.confidence * (1 / (1 + (Date.now() - a.lastAccessedAt) / 3600000));
        const scoreB = b.confidence * (1 / (1 + (Date.now() - b.lastAccessedAt) / 3600000));
        return scoreB - scoreA;
      });

      return results.slice(0, q.limit);
    },

    promote(entryId, toLevel) {
      for (const [level, store] of stores) {
        const entry = store.get(entryId);
        if (entry) {
          store.delete(entryId);
          entry.level = toLevel;
          entry.expiresAt = MEMORY_POLICIES[toLevel].ttlMs !== null
            ? Date.now() + MEMORY_POLICIES[toLevel].ttlMs!
            : null;
          getStore(toLevel).set(entryId, entry);
          logger.info({ entryId, from: level, to: toLevel }, "Memory promoted");
          return true;
        }
      }
      return false;
    },

    demote(entryId, toLevel) {
      for (const [level, store] of stores) {
        const entry = store.get(entryId);
        if (entry) {
          store.delete(entryId);
          entry.level = toLevel;
          entry.expiresAt = MEMORY_POLICIES[toLevel].ttlMs !== null
            ? Date.now() + MEMORY_POLICIES[toLevel].ttlMs!
            : null;
          getStore(toLevel).set(entryId, entry);
          logger.info({ entryId, from: level, to: toLevel }, "Memory demoted");
          return true;
        }
      }
      return false;
    },

    delete(entryId) {
      for (const [, store] of stores) {
        if (store.delete(entryId)) {
          logger.info({ entryId }, "Memory deleted");
          return true;
        }
      }
      return false;
    },

    getEntry(entryId) {
      for (const [, store] of stores) {
        const entry = store.get(entryId);
        if (entry && !isExpired(entry)) return entry;
      }
      return undefined;
    },

    getStats() {
      const stats = {} as Record<MemoryLevel, { count: number; avgConfidence: number }>;
      for (const level of Object.keys(MEMORY_POLICIES) as MemoryLevel[]) {
        const store = getStore(level);
        const entries = Array.from(store.values()).filter((e) => !isExpired(e));
        stats[level] = {
          count: entries.length,
          avgConfidence: entries.length > 0
            ? entries.reduce((s, e) => s + e.confidence, 0) / entries.length
            : 0,
        };
      }
      return stats;
    },

    prune() {
      let pruned = 0;
      for (const [, store] of stores) {
        for (const [id, entry] of store) {
          if (isExpired(entry)) {
            store.delete(id);
            pruned++;
          }
        }
      }
      if (pruned > 0) {
        logger.info({ pruned }, "Memory pruning completed");
      }
      return pruned;
    },

    getPolicy(level) {
      return { ...MEMORY_POLICIES[level] };
    },
  };
}
