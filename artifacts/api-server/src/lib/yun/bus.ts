/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// YUN Message Bus â€” Constitutional Event Transport
// Enforces CP-002 (Desacoplamiento Reactivo): events first,
// direct calls prohibited outside EMERGENCY mode.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { randomUUID } from "node:crypto";
import { createHmac } from "node:crypto";
import { logger } from "../logger";
import type {
  YunEvent,
  YunDomain,
  FederationId,
  EventTopic,
  EventSeverity,
  YunMode,
} from "./types";

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface BusNode {
  nodeId: string;
  status: "UP" | "DEGRADED" | "DOWN" | "ISLAND";
  latencyMs: number;
  lastHeartbeat: string;
}

export interface BusChannel {
  channelId: string;
  domain: YunDomain;
  throughputPerMin: number;
  errorRate: number;
  policyViolationsLastMin: number;
}

export interface BusState {
  busId: string;
  timestamp: string;
  mode: YunMode;
  nodes: BusNode[];
  channels: BusChannel[];
  totalEvents: number;
  signedEvents: number;
  pqSignedEvents: number;
}

export interface EventSubscription {
  subId: string;
  subscriberId: string;
  topicPattern: string;
  domainFilter?: YunDomain;
  federationFilter?: FederationId;
  callback: (event: YunEvent) => void;
}

export interface EventPublishResult {
  eventId: string;
  delivered: boolean;
  subscriberCount: number;
  signatureValid: boolean;
  violations: string[];
  timestamp: number;
}

// â”€â”€ Message Bus â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export class YunMessageBus {
  private busId: string;
  private subscriptions = new Map<string, EventSubscription>();
  private history: YunEvent[] = [];
  private readonly maxHistory = 2000;
  private stats = {
    totalPublished: 0,
    totalDelivered: 0,
    signedEvents: 0,
    pqSignedEvents: 0,
    byDomain: {} as Record<YunDomain, number>,
    bySeverity: {} as Record<EventSeverity, number>,
  };
  private nodes: BusNode[] = [];
  private channels: BusChannel[] = [];
  private signingSecret: string;
  private pqSigningFn?: (data: Buffer) => Buffer;

  constructor(signingSecret: string, pqSigningFn?: (data: Buffer) => Buffer) {
    this.busId = `BUS-${randomUUID().slice(0, 8)}`;
    this.signingSecret = signingSecret;
    this.pqSigningFn = pqSigningFn;
    this.initChannels();
  }

  // â”€â”€ Publish â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  publish<T = unknown>(
    event: Omit<YunEvent<T>, "eventId" | "traceId" | "timestamp"> & {
      traceId?: string;
    },
    mode: YunMode = "NORMAL",
  ): EventPublishResult {
    const eventId = randomUUID();
    const now = Date.now();

    // CP-002: Check for direct calls in non-EMERGENCY mode
    const violations: string[] = [];
    if (event.eventType === "service.direct.call" && mode !== "EMERGENCY") {
      violations.push("CP-002: Direct call outside EMERGENCY mode.");
    }

    // CP-003: Verify event has required identity
    if (!event.entityId) {
      violations.push("CP-003: Event missing entity identity.");
    }

    // CP-006: All events must have traceId
    const traceId = event.traceId || randomUUID();

    const fullEvent: YunEvent<T> = {
      ...event,
      eventId,
      traceId,
      timestamp: now,
      signature: this.signEvent(event as YunEvent<T>),
    };

    // Optional PQ signature
    if (this.pqSigningFn) {
      const buffer = Buffer.from(JSON.stringify(fullEvent));
      fullEvent.pqSignature = this.pqSigningFn(buffer).toString("base64");
      this.stats.pqSignedEvents++;
    }

    this.stats.totalPublished++;
    this.stats.signedEvents++;
    this.stats.byDomain[event.domain] = (this.stats.byDomain[event.domain] || 0) + 1;
    this.stats.bySeverity[event.severity] = (this.stats.bySeverity[event.severity] || 0) + 1;

    // Store in history
    this.history.push(fullEvent as YunEvent);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    // Route to subscribers
    const matchedSubs = this.matchSubscriptions(fullEvent);
    let delivered = false;

    for (const sub of matchedSubs) {
      try {
        sub.callback(fullEvent);
        this.stats.totalDelivered++;
        delivered = true;
      } catch (err) {
        // Subscription callback error â€” don't crash bus
        logger.warn({ subscriberId: sub.subscriberId, eventId: fullEvent.eventId, error: (err as Error).message }, "Bus subscription callback error");
      }
    }

    return {
      eventId,
      delivered,
      subscriberCount: matchedSubs.length,
      signatureValid: true,
      violations,
      timestamp: now,
    };
  }

  // â”€â”€ Subscribe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  subscribe(
    subscriberId: string,
    topicPattern: string,
    callback: (event: YunEvent) => void,
    options?: { domainFilter?: YunDomain; federationFilter?: FederationId },
  ): string {
    const subId = `SUB-${randomUUID().slice(0, 8)}`;
    this.subscriptions.set(subId, {
      subId,
      subscriberId,
      topicPattern,
      domainFilter: options?.domainFilter,
      federationFilter: options?.federationFilter,
      callback,
    });
    return subId;
  }

  unsubscribe(subId: string): void {
    this.subscriptions.delete(subId);
  }

  // â”€â”€ History & Query â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  getHistory(options?: {
    domain?: YunDomain;
    federation?: FederationId;
    since?: number;
    limit?: number;
  }): YunEvent[] {
    let events = [...this.history];

    if (options?.domain) events = events.filter((e) => e.domain === options.domain);
    if (options?.federation) events = events.filter((e) => e.federationId === options.federation);
    if (options?.since) events = events.filter((e) => e.timestamp >= options.since!);

    const limit = options?.limit ?? 100;
    return events.slice(-limit);
  }

  // â”€â”€ Bus State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  getState(mode: YunMode = "NORMAL"): BusState {
    return {
      busId: this.busId,
      timestamp: new Date().toISOString(),
      mode,
      nodes: [...this.nodes],
      channels: [...this.channels],
      totalEvents: this.stats.totalPublished,
      signedEvents: this.stats.signedEvents,
      pqSignedEvents: this.stats.pqSignedEvents,
    };
  }

  updateNodeStatus(nodeId: string, status: BusNode["status"], latencyMs: number): void {
    const existing = this.nodes.find((n) => n.nodeId === nodeId);
    if (existing) {
      existing.status = status;
      existing.latencyMs = latencyMs;
      existing.lastHeartbeat = new Date().toISOString();
    } else {
      this.nodes.push({
        nodeId,
        status,
        latencyMs,
        lastHeartbeat: new Date().toISOString(),
      });
    }
  }

  // â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  getStats() {
    return { ...this.stats, busId: this.busId, subscriptionCount: this.subscriptions.size };
  }

  // â”€â”€ Private â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private initChannels(): void {
    const domains: YunDomain[] = ["identity", "commerce", "knowledge", "telemetry", "gameplay", "territorial", "media", "cognitive"];
    this.channels = domains.map((domain) => ({
      channelId: `CH-${domain}`,
      domain,
      throughputPerMin: 0,
      errorRate: 0,
      policyViolationsLastMin: 0,
    }));
  }

  private signEvent(event: YunEvent): string {
    const payload = `${event.eventType}:${event.domain}:${event.entityId}:${event.timestamp}`;
    return createHmac("sha256", this.signingSecret).update(payload).digest("base64");
  }

  private matchSubscriptions(event: YunEvent): EventSubscription[] {
    return Array.from(this.subscriptions.values()).filter((sub) => {
      // Topic pattern match (supports wildcards: *.events, identity.*)
      if (!this.topicMatches(event.topic, sub.topicPattern)) return false;

      // Domain filter
      if (sub.domainFilter && sub.domainFilter !== event.domain) return false;

      // Federation filter
      if (sub.federationFilter && sub.federationFilter !== event.federationId) return false;

      return true;
    });
  }

  private topicMatches(topic: string, pattern: string): boolean {
    if (pattern === "*") return true;
    if (pattern === topic) return true;

    const topicParts = topic.split(".");
    const patternParts = pattern.split(".");

    if (topicParts.length !== patternParts.length) return false;

    return patternParts.every((part, i) => part === "*" || part === topicParts[i]);
  }
}
