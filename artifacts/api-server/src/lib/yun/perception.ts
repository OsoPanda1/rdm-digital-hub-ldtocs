/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// YUN Perception Layer â€” Sensory System
// Normalizes signals from technical, social, territorial,
// and cognitive sources into standardized YUN events.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { randomUUID } from "node:crypto";
import type {
  YunEvent,
  YunDomain,
  FederationId,
  PerceptionSource,
  EventTopic,
} from "./types";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface PerceptionSignal {
  signalId?: string;
  source: PerceptionSource;
  domain: YunDomain;
  content: string;
  confidence: number;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface YunPerceptionEvent {
  id: string;
  type: PerceptionSource;
  source: string;
  nodeId: string;
  federationId: FederationId;
  timestamp: string;
  payload: unknown;
}

export interface TechnicalSignal {
  cpuUsage?: number;
  memoryUsage?: number;
  errorRate?: number;
  responseTimeMs?: number;
  serviceId?: string;
  status?: string;
}

export interface SocialSignal {
  sentiment?: number;
  topic?: string;
  source?: string;
  engagement?: number;
  community?: string;
}

export interface TerritorialSignal {
  latitude?: number;
  longitude?: number;
  region?: string;
  festival?: string;
  economicIndicator?: number;
  population?: number;
}

// â”€â”€ Normalization Pipelines â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function normalizeTechnicalSignal(signal: PerceptionSignal): YunPerceptionEvent {
  const payload = signal.metadata as TechnicalSignal;
  return {
    id: signal.signalId || randomUUID(),
    type: "technical",
    source: signal.source,
    nodeId: signal.metadata.nodeId as string || "unknown",
    federationId: (signal.metadata.federationId as FederationId) || "FED-3",
    timestamp: new Date(signal.timestamp).toISOString(),
    payload: {
      service: payload.serviceId || signal.metadata.service,
      status: payload.status || "unknown",
      metrics: {
        cpu: payload.cpuUsage,
        memory: payload.memoryUsage,
        errorRate: payload.errorRate,
        responseTimeMs: payload.responseTimeMs,
      },
      raw: signal.content,
    },
  };
}

function normalizeSocialSignal(signal: PerceptionSignal): YunPerceptionEvent {
  const payload = signal.metadata as SocialSignal;
  return {
    id: signal.signalId || randomUUID(),
    type: "social",
    source: signal.source,
    nodeId: signal.metadata.nodeId as string || "unknown",
    federationId: (signal.metadata.federationId as FederationId) || "FED-6",
    timestamp: new Date(signal.timestamp).toISOString(),
    payload: {
      sentiment: payload.sentiment ?? 0,
      topic: payload.topic,
      source: payload.source,
      engagement: payload.engagement ?? 0,
      community: payload.community,
      raw: signal.content,
    },
  };
}

function normalizeTerritorialSignal(signal: PerceptionSignal): YunPerceptionEvent {
  const payload = signal.metadata as TerritorialSignal;
  return {
    id: signal.signalId || randomUUID(),
    type: "territorial",
    source: signal.source,
    nodeId: signal.metadata.nodeId as string || "unknown",
    federationId: (signal.metadata.federationId as FederationId) || "FED-5",
    timestamp: new Date(signal.timestamp).toISOString(),
    payload: {
      location: {
        latitude: payload.latitude,
        longitude: payload.longitude,
        region: payload.region,
      },
      events: {
        festival: payload.festival,
        economicIndicator: payload.economicIndicator,
        population: payload.population,
      },
      raw: signal.content,
    },
  };
}

function normalizeCognitiveSignal(signal: PerceptionSignal): YunPerceptionEvent {
  return {
    id: signal.signalId || randomUUID(),
    type: "cognitive",
    source: signal.source,
    nodeId: signal.metadata.nodeId as string || "unknown",
    federationId: (signal.metadata.federationId as FederationId) || "FED-7",
    timestamp: new Date(signal.timestamp).toISOString(),
    payload: {
      reasoning: signal.content,
      confidence: signal.confidence,
      raw: signal.metadata,
    },
  };
}

// â”€â”€ Enrichment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function enrichWithContext(event: YunPerceptionEvent): YunPerceptionEvent {
  return {
    ...event,
    payload: {
      ...(typeof event.payload === "object" && event.payload !== null ? event.payload : {}),
      enriched: {
        processedAt: new Date().toISOString(),
        version: "1.0.0",
        pipeline: "yun-perception",
      },
    },
  };
}

// â”€â”€ Perception Layer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export class YunPerceptionLayer {
  private signals: YunPerceptionEvent[] = [];
  private readonly maxSignals = 5000;
  private publishFn?: (event: YunEvent) => void;

  setPublisher(publishFn: (event: YunEvent) => void): void {
    this.publishFn = publishFn;
  }

  // â”€â”€ Ingest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  ingestSignal(signal: PerceptionSignal): YunPerceptionEvent {
    const normalized = this.normalize(signal);
    const enriched = enrichWithContext(normalized);

    // Store
    this.signals.push(enriched);
    if (this.signals.length > this.maxSignals) {
      this.signals = this.signals.slice(-this.maxSignals);
    }

    // Publish to YUN bus if available
    if (this.publishFn) {
      this.publishFn({
        eventId: enriched.id,
        eventType: `perception.${enriched.type}`,
        domain: signal.domain,
        topic: `${signal.domain}.events` as EventTopic,
        federationId: enriched.federationId,
        entityId: enriched.nodeId,
        traceId: randomUUID(),
        timestamp: Date.now(),
        severity: signal.confidence > 0.8 ? "info" : signal.confidence > 0.5 ? "warn" : "error",
        payload: enriched.payload,
      });
    }

    return enriched;
  }

  // â”€â”€ OPA Decision Log Adapter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  ingestOpaDecisionLog(log: {
    decision_id: string;
    policy: string;
    timestamp: string;
    input: unknown;
    result: { allow: boolean; reasons?: string[] };
  }): YunPerceptionEvent {
    const isViolation = !log.result.allow;
    const signal: PerceptionSignal = {
      signalId: log.decision_id,
      source: isViolation ? "technical" : "cognitive",
      domain: "cognitive",
      content: isViolation
        ? `Policy violation: ${log.result.reasons?.join(", ") || "unknown"}`
        : `Policy decision: allowed`,
      confidence: 1.0,
      timestamp: Date.parse(log.timestamp) || Date.now(),
      metadata: {
        decisionId: log.decision_id,
        policy: log.policy,
        reasons: log.result.reasons || [],
        input: log.input,
        source: "opa-decision-log",
      },
    };

    return this.ingestSignal(signal);
  }

  // â”€â”€ Query â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  getRecentSignals(limit = 50, source?: PerceptionSource): YunPerceptionEvent[] {
    let filtered = [...this.signals];
    if (source) filtered = filtered.filter((s) => s.type === source);
    return filtered.slice(-limit);
  }

  getSignalsByDomain(domain: YunDomain, limit = 50): YunPerceptionEvent[] {
    return this.signals.filter((s) => {
      const eventDomain = (s.payload as Record<string, unknown>)?.domain;
      return eventDomain === domain;
    }).slice(-limit);
  }

  getSignalCount(): number {
    return this.signals.length;
  }

  // â”€â”€ Contracts: YunInferenceEngine Interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async ingestPerception(event: YunPerceptionEvent): Promise<void> {
    this.signals.push(event);
    if (this.signals.length > this.maxSignals) {
      this.signals = this.signals.slice(-this.maxSignals);
    }
  }

  async getCurrentNarrative(): Promise<string> {
    const recent = this.signals.slice(-10);
    if (recent.length === 0) return "No perception data available.";

    const byType = { technical: 0, social: 0, territorial: 0, cognitive: 0 };
    recent.forEach((s) => { byType[s.type]++; });

    return `Perception narrative: ${byType.technical} technical, ${byType.social} social, ${byType.territorial} territorial signals processed. System stable.`;
  }

  async getRiskAssessment(): Promise<{ level: string; factors: string[] }> {
    const recent = this.signals.slice(-50);
    const factors: string[] = [];
    let level = "low";

    const violations = recent.filter((s) =>
      s.type === "technical" && (s.payload as Record<string, unknown>)?.status === "error",
    );
    if (violations.length > 10) {
      level = "high";
      factors.push("High error rate in technical signals.");
    } else if (violations.length > 5) {
      level = "medium";
      factors.push("Moderate error rate in technical signals.");
    }

    return { level, factors };
  }

  // â”€â”€ Private â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private normalize(signal: PerceptionSignal): YunPerceptionEvent {
    switch (signal.source) {
      case "technical": return normalizeTechnicalSignal(signal);
      case "social": return normalizeSocialSignal(signal);
      case "territorial": return normalizeTerritorialSignal(signal);
      case "cognitive": return normalizeCognitiveSignal(signal);
      default: return normalizeCognitiveSignal(signal);
    }
  }
}
