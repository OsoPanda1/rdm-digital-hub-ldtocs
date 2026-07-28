// ────────────────────────────────────────────────────────────────
// Admin Audit Log — Registro de auditoría del ecosistema RDM
// Trazabilidad de acciones administrativas y de sistema
// ────────────────────────────────────────────────────────────────

import { logger } from "../logger";

const MAX_AUDIT_ENTRIES = Number(process.env.RDM_AUDIT_MAX_ENTRIES ?? 10_000);
const ENTRY_TTL_MS = Number(process.env.RDM_AUDIT_TTL_MS ?? 7 * 24 * 60 * 60 * 1000); // 7 days

export interface AuditEntry {
  entryId: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  details: Record<string, unknown>;
  sourceIp: string;
  severity: "info" | "warn" | "critical";
}

export interface AuditQuery {
  actor?: string;
  action?: string;
  severity?: AuditEntry["severity"];
  since?: string;
  until?: string;
  limit?: number;
}

export interface AdminAuditLog {
  record(entry: Omit<AuditEntry, "entryId" | "timestamp">): Promise<AuditEntry>;
  query(filters: AuditQuery): Promise<AuditEntry[]>;
  getEntry(entryId: string): Promise<AuditEntry | null>;
  getStats(since?: string): Promise<{ total: number; bySeverity: Record<string, number>; byAction: Record<string, number>; byActor: Record<string, number> }>;
  exportEntries(format: "json" | "csv", filters?: AuditQuery): Promise<string>;
}

function sanitizeCsvCell(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

export function createAdminAuditLog(): AdminAuditLog {
  const entries = new Map<string, AuditEntry>();

  function evictExpired(): void {
    const cutoff = Date.now() - ENTRY_TTL_MS;
    for (const [id, entry] of entries) {
      if (new Date(entry.timestamp).getTime() < cutoff) {
        entries.delete(id);
      }
    }
  }

  function evictOldest(): void {
    if (entries.size <= MAX_AUDIT_ENTRIES) return;
    let oldestKey: string | null = null;
    let oldestTs = Infinity;
    for (const [id, entry] of entries) {
      const ts = new Date(entry.timestamp).getTime();
      if (ts < oldestTs) { oldestTs = ts; oldestKey = id; }
    }
    if (oldestKey) entries.delete(oldestKey);
  }

  return {
    async record(data) {
      evictExpired();

      const entry: AuditEntry = {
        ...data,
        entryId: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
      };
      entries.set(entry.entryId, entry);
      evictOldest();
      return entry;
    },

    async query(filters) {
      const limit = filters.limit ?? 100;
      const results: AuditEntry[] = [];
      for (const entry of entries.values()) {
        if (filters.actor && entry.actor !== filters.actor) continue;
        if (filters.action && entry.action !== filters.action) continue;
        if (filters.severity && entry.severity !== filters.severity) continue;
        if (filters.since && entry.timestamp < filters.since) continue;
        if (filters.until && entry.timestamp > filters.until) continue;
        results.push(entry);
      }
      return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
    },

    async getEntry(entryId) { return entries.get(entryId) ?? null; },

    async getStats(since) {
      const bySeverity: Record<string, number> = {};
      const byAction: Record<string, number> = {};
      const byActor: Record<string, number> = {};
      let total = 0;
      for (const entry of entries.values()) {
        if (since && entry.timestamp < since) continue;
        bySeverity[entry.severity] = (bySeverity[entry.severity] ?? 0) + 1;
        byAction[entry.action] = (byAction[entry.action] ?? 0) + 1;
        byActor[entry.actor] = (byActor[entry.actor] ?? 0) + 1;
        total += 1;
      }
      return { total, bySeverity, byAction, byActor };
    },

    async exportEntries(format, filters) {
      const entries = await this.query(filters ?? {});
      if (format === "csv") {
        const header = "entryId,timestamp,actor,actorRole,action,target,severity,sourceIp";
        const rows = entries.map((e) => [
          sanitizeCsvCell(e.entryId),
          sanitizeCsvCell(e.timestamp),
          sanitizeCsvCell(e.actor),
          sanitizeCsvCell(e.actorRole),
          sanitizeCsvCell(e.action),
          sanitizeCsvCell(e.target),
          sanitizeCsvCell(e.severity),
          sanitizeCsvCell(e.sourceIp),
        ].join(","));
        return [header, ...rows].join("\n");
      }
      return JSON.stringify(entries, null, 2);
    },
  };
}
