/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// OpenTelemetry Basics (PennyLane pattern: observability from start)
// Lightweight tracing without external dependencies.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { randomUUID } from "node:crypto";
import { logger } from "./logger";

// â”€â”€ Trace Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operation: string;
  startTime: number;
  attributes: Record<string, unknown>;
}

// â”€â”€ Tracer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export class Tracer {
  private activeSpans = new Map<string, TraceContext>();
  private completedSpans: TraceContext[] = [];
  private readonly maxCompleted = 1000;

  startSpan(operation: string, attributes: Record<string, unknown> = {}): TraceContext {
    const span: TraceContext = {
      traceId: randomUUID(),
      spanId: randomUUID().slice(0, 8),
      operation,
      startTime: Date.now(),
      attributes,
    };
    this.activeSpans.set(span.spanId, span);
    return span;
  }

  endSpan(spanId: string, status: "ok" | "error" = "ok", errorMessage?: string): void {
    const span = this.activeSpans.get(spanId);
    if (!span) return;

    const duration = Date.now() - span.startTime;
    const completed = {
      ...span,
      attributes: {
        ...span.attributes,
        "duration_ms": duration,
        "status": status,
        ...(errorMessage ? { "error.message": errorMessage } : {}),
      },
    };

    this.activeSpans.delete(spanId);
    this.completedSpans.push(completed);

    if (this.completedSpans.length > this.maxCompleted) {
      this.completedSpans = this.completedSpans.slice(-this.maxCompleted);
    }

    // Log slow spans (> 1000ms) or errors
    if (duration > 1000 || status === "error") {
      logger.warn(
        {
          traceId: span.traceId,
          operation: span.operation,
          duration_ms: duration,
          status,
          errorMessage,
        },
        "Slow or error span",
      );
    }
  }

  getStats(): {
    activeSpans: number;
    completedSpans: number;
    avgDurationMs: number;
    errorRate: number;
  } {
    const completed = this.completedSpans;
    const avgDuration =
      completed.length > 0
        ? completed.reduce((sum, s) => sum + ((s.attributes.duration_ms as number) || 0), 0) / completed.length
        : 0;
    const errorCount = completed.filter((s) => s.attributes.status === "error").length;

    return {
      activeSpans: this.activeSpans.size,
      completedSpans: completed.length,
      avgDurationMs: Math.round(avgDuration),
      errorRate: completed.length > 0 ? errorCount / completed.length : 0,
    };
  }
}

// â”€â”€ Singleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const tracer = new Tracer();

// â”€â”€ Express Middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function tracingMiddleware(req: any, res: any, next: () => void) {
  const span = tracer.startSpan(`${req.method} ${req.route?.path || req.path}`, {
    "http.method": req.method,
    "http.url": req.url?.split("?")[0],
    "http.user_agent": req.headers["user-agent"],
  });

  // Attach trace ID to request for downstream use
  req.traceId = span.traceId;
  req.spanId = span.spanId;

  // Expose trace ID to clients for correlation
  res.setHeader("X-Request-Id", span.traceId);

  // Hook into response finish
  res.on("finish", () => {
    const status = res.statusCode < 400 ? "ok" : "error";
    tracer.endSpan(span.spanId, status);
  });

  next();
}
