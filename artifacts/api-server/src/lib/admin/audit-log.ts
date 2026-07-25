// ────────────────────────────────────────────────────────────────
// Admin Audit Log — Registro de auditoría del ecosistema RDM
// Trazabilidad de acciones administrativas y de sistema
// ────────────────────────────────────────────────────────────────

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

export function createAdminAuditLog(): AdminAuditLog {
  const entries = new Map<string, AuditEntry>();

  return {
    async record(data) {
      const entry: AuditEntry = {
        ...data,
        entryId: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
      };
      entries.set(entry.entryId, entry);
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
        const rows = entries.map((e) => `${e.entryId},${e.timestamp},${e.actor},${e.actorRole},${e.action},${e.target},${e.severity},${e.sourceIp}`);
        return [header, ...rows].join("\n");
      }
      return JSON.stringify(entries, null, 2);
    },
  };
}
