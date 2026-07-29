/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// THE C.R.O.W.N â€” BookPI Telemetry Middleware
// Registra cada operación en el DAG con trazabilidad completa
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { TelemetryRecord, TelemetryStats, FederationId, SkillId, HexagonZone } from "./types";

export interface BookPiTelemetry {
  record(entry: Omit<TelemetryRecord, "timestamp">): void;
  query(filters: { skillId?: SkillId; federationId?: FederationId; since?: number; limit?: number }): TelemetryRecord[];
  stats(): TelemetryStats;
}

export function createBookPiTelemetry(): BookPiTelemetry {
  const records: TelemetryRecord[] = [];

  return {
    record(entry) {
      records.push({ ...entry, timestamp: Date.now() });
    },

    query(filters) {
      let results = records;
      if (filters.skillId) results = results.filter((r) => r.skillId === filters.skillId);
      if (filters.federationId) results = results.filter((r) => r.federationId === filters.federationId);
      if (filters.since) results = results.filter((r) => r.timestamp >= filters.since!);
      return results.slice(0, filters.limit ?? 100);
    },

    stats() {
      const totalCalls = records.length;
      const successCount = records.filter((r) => r.success).length;
      const avgDurationMs = totalCalls > 0 ? records.reduce((s, r) => s + r.durationMs, 0) / totalCalls : 0;
      const bySkill: Record<string, number> = {};
      const byFederation: Record<string, number> = {};
      const byZone: Record<string, number> = {};
      for (const r of records) {
        bySkill[r.skillId] = (bySkill[r.skillId] ?? 0) + 1;
        byFederation[r.federationId] = (byFederation[r.federationId] ?? 0) + 1;
        byZone[r.hexagonZone] = (byZone[r.hexagonZone] ?? 0) + 1;
      }
      return { totalCalls, successRate: totalCalls > 0 ? successCount / totalCalls : 1, avgDurationMs, bySkill, byFederation, byZone };
    },
  };
}
