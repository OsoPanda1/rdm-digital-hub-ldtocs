/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// YUN Bus â€” Federation Event Bus
// Sistema nervioso central de las 7 federaciones TAMV
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type FederationId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7";

export interface YunEvent {
  federation: FederationId;
  type: string;
  payload: unknown;
  timestamp: string;
  traceId: string;
  source: string;
}

export type YunEventHandler = (event: YunEvent) => void | Promise<void>;

export interface YunBus {
  publish(event: Omit<YunEvent, "traceId" | "timestamp">): void;
  subscribe(federation: FederationId | "*", handler: YunEventHandler): () => void;
  unsubscribe(federation: FederationId | "*", handler: YunEventHandler): void;
  history(limit?: number): YunEvent[];
  stats(): { totalPublished: number; byFederation: Record<string, number>; byType: Record<string, number> };
}

let busCounter = 0;

export function createYunBus(): YunBus {
  const subscriptions = new Map<string, Set<YunEventHandler>>();
  const eventHistory: YunEvent[] = [];
  let totalPublished = 0;
  const byFederation: Record<string, number> = {};
  const byType: Record<string, number> = {};

  function deliver(event: YunEvent, handler: YunEventHandler) {
    try { handler(event); } catch (err) { console.error(`[YunBus] Handler error:`, err); }
  }

  return {
    publish(event) {
      const full: YunEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        traceId: `yun-${Date.now()}-${(busCounter++).toString(36)}`,
      };
      totalPublished++;
      byFederation[full.federation] = (byFederation[full.federation] ?? 0) + 1;
      byType[full.type] = (byType[full.type] ?? 0) + 1;
      eventHistory.push(full);
      if (eventHistory.length > 2000) eventHistory.shift();

      const handlers = subscriptions.get(full.federation);
      if (handlers) for (const h of handlers) deliver(full, h);
      const wildcards = subscriptions.get("*");
      if (wildcards) for (const h of wildcards) deliver(full, h);
    },

    subscribe(federation, handler) {
      if (!subscriptions.has(federation)) subscriptions.set(federation, new Set());
      subscriptions.get(federation)!.add(handler);
      return () => subscriptions.get(federation)?.delete(handler);
    },

    unsubscribe(federation, handler) {
      subscriptions.get(federation)?.delete(handler);
    },

    history: (limit = 100) => eventHistory.slice(-limit),
    stats: () => ({ totalPublished, byFederation: { ...byFederation }, byType: { ...byType } }),
  };
}
