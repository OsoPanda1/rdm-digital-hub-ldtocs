// ────────────────────────────────────────────────────────────────
// IAM — ITDR Monitor (Identity Threat Detection & Response)
// Monitoreo de amenazas de identidad, detección de anomalías
// ────────────────────────────────────────────────────────────────

export interface ThreatEvent {
  eventId: string;
  userId: string;
  threatType: "brute_force" | "credential_stuffing" | "session_hijack" | "privilege_escalation" | "anomalous_access" | "geo_anomaly";
  severity: "low" | "medium" | "high" | "critical";
  sourceIp: string;
  details: Record<string, unknown>;
  detectedAt: string;
  resolvedAt: string | null;
  action: "alert" | "block" | "revoke_session" | "lock_account" | "none";
}

export interface ThreatSignature {
  signatureId: string;
  pattern: string;
  threatType: ThreatEvent["threatType"];
  severity: ThreatEvent["severity"];
  threshold: number;
  windowMs: number;
  enabled: boolean;
}

export interface ItdrMonitor {
  recordAttempt(userId: string, sourceIp: string, success: boolean): Promise<ThreatEvent | null>;
  getThreats(userId?: string, severity?: ThreatEvent["severity"]): Promise<ThreatEvent[]>;
  resolveThreat(eventId: string): Promise<boolean>;
  addSignature(sig: Omit<ThreatSignature, "signatureId">): Promise<ThreatSignature>;
  getSignatures(): Promise<ThreatSignature[]>;
  stats(): Promise<{ totalThreats: number; bySeverity: Record<string, number>; byType: Record<string, number>; active: number }>;
}

export function createItdrMonitor(): ItdrMonitor {
  const threats = new Map<string, ThreatEvent>();
  const signatures = new Map<string, ThreatSignature>();
  const attempts = new Map<string, { count: number; lastAt: number; failures: number }>();

  const defaultSignatures: ThreatSignature[] = [
    { signatureId: "sig-brute-1", pattern: "brute_force", threatType: "brute_force", severity: "high", threshold: 5, windowMs: 300000, enabled: true },
    { signatureId: "sig-cred-2", pattern: "credential_stuffing", threatType: "credential_stuffing", severity: "critical", threshold: 10, windowMs: 600000, enabled: true },
    { signatureId: "sig-geo-3", pattern: "geo_anomaly", threatType: "geo_anomaly", severity: "medium", threshold: 3, windowMs: 1800000, enabled: true },
    { signatureId: "sig-priv-4", pattern: "privilege_escalation", threatType: "privilege_escalation", severity: "critical", threshold: 1, windowMs: 60000, enabled: true },
  ];
  defaultSignatures.forEach((s) => signatures.set(s.signatureId, s));

  function detectThreat(key: string, now: number): ThreatEvent | null {
    const record = attempts.get(key);
    if (!record) return null;

    for (const sig of signatures.values()) {
      if (!sig.enabled) continue;
      const withinWindow = now - record.lastAt <= sig.windowMs;
      if (withinWindow && record.failures >= sig.threshold) {
        const event: ThreatEvent = {
          eventId: `threat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          userId: key.split(":")[0]!,
          threatType: sig.threatType,
          severity: sig.severity,
          sourceIp: key.split(":")[1] ?? "unknown",
          details: { failures: record.failures, signature: sig.signatureId, threshold: sig.threshold },
          detectedAt: new Date(now).toISOString(),
          resolvedAt: null,
          action: sig.severity === "critical" ? "lock_account" : sig.severity === "high" ? "revoke_session" : "alert",
        };
        threats.set(event.eventId, event);
        return event;
      }
    }
    return null;
  }

  return {
    async recordAttempt(userId, sourceIp, success) {
      const now = Date.now();
      const key = `${userId}:${sourceIp}`;
      const record = attempts.get(key) ?? { count: 0, lastAt: now, failures: 0 };
      record.count += 1;
      record.lastAt = now;
      if (!success) record.failures += 1;
      else record.failures = 0;
      attempts.set(key, record);
      if (!success) return detectThreat(key, now);
      return null;
    },

    async getThreats(userId, severity) {
      return Array.from(threats.values()).filter((t) => {
        if (userId && t.userId !== userId) return false;
        if (severity && t.severity !== severity) return false;
        return true;
      });
    },

    async resolveThreat(eventId) {
      const threat = threats.get(eventId);
      if (!threat) return false;
      threat.resolvedAt = new Date().toISOString();
      return true;
    },

    async addSignature(data) {
      const sig: ThreatSignature = { ...data, signatureId: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
      signatures.set(sig.signatureId, sig);
      return sig;
    },

    async getSignatures() { return Array.from(signatures.values()); },

    async stats() {
      const bySeverity: Record<string, number> = {};
      const byType: Record<string, number> = {};
      let active = 0;
      for (const t of threats.values()) {
        bySeverity[t.severity] = (bySeverity[t.severity] ?? 0) + 1;
        byType[t.threatType] = (byType[t.threatType] ?? 0) + 1;
        if (!t.resolvedAt) active += 1;
      }
      return { totalThreats: threats.size, bySeverity, byType, active };
    },
  };
}
