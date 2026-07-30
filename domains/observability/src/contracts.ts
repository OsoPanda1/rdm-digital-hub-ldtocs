export type HealthCheck = {
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  uptime: number;
  region: string;
  checks: Array<{ name: string; status: string; latency: number }>;
};

export type Metric = {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  tags?: Record<string, string>;
};

export type AuditEvent = {
  id: string;
  eventType: string;
  actorId?: string;
  resource: string;
  payload: Record<string, unknown>;
  traceId: string;
  createdAt: string;
};
