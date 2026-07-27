import type { Router, Request, Response } from "express";
import { logger } from "../lib/logger";
import { rateLimitByRoute, requireRdmRole } from "../lib/security";

type TelemetryEvent = {
  id: string;
  type: string;
  source: "frontend" | "podcast" | "isabella" | "gamification" | "system";
  severity: "info" | "warning" | "critical";
  timestamp: string;
  metadata: Record<string, unknown>;
};

const events: TelemetryEvent[] = [];
const MAX_EVENTS = Number(process.env.RDM_TELEMETRY_BUFFER_SIZE ?? 500);

function record(event: Omit<TelemetryEvent, "id" | "timestamp">) {
  const entry = { ...event, id: `tel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: new Date().toISOString() };
  events.push(entry);
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
  logger.info({ telemetry: entry }, "RDM telemetry event");
  return entry;
}

export function telemetrySnapshot() {
  const since = Date.now() - 60_000;
  const lastMinute = events.filter((e) => Date.parse(e.timestamp) >= since);
  return {
    status: lastMinute.some((e) => e.severity === "critical") ? "degraded" : "ok",
    bufferedEvents: events.length,
    lastMinute: lastMinute.length,
    criticalLastMinute: lastMinute.filter((e) => e.severity === "critical").length,
    warningLastMinute: lastMinute.filter((e) => e.severity === "warning").length,
  };
}

export function registerTelemetryRoutes(router: Router) {
  router.post("/telemetry/events", rateLimitByRoute({ name: "telemetry-events", limit: 120 }), (req: Request, res: Response) => {
    const { type = "unknown", source = "frontend", severity = "info", metadata = {} } = req.body ?? {};
    const allowedSources = new Set(["frontend", "podcast", "isabella", "gamification", "system"]);
    const allowedSeverities = new Set(["info", "warning", "critical"]);
    const entry = record({
      type: String(type).slice(0, 100),
      source: allowedSources.has(source) ? source : "frontend",
      severity: allowedSeverities.has(severity) ? severity : "info",
      metadata: typeof metadata === "object" && metadata !== null ? metadata : {},
    });
    res.status(202).json({ ok: true, data: entry });
  });

  router.get("/telemetry/status", requireRdmRole("operator"), (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: telemetrySnapshot() });
  });
}
