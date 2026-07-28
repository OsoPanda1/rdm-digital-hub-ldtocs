/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Event Bus â€” Typed pub/sub system (Î©-Core v4.0 Enterprise)
// Sistema nervioso central de la HeptafederaciÃ³n TAMV
// Desacoplamiento total entre mÃ³dulos, trazabilidad con traceId
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type EventSeverity = "info" | "warning" | "critical" | "incident";

export type IsabellaEvent<T = unknown> = {
  type: string;
  payload: T;
  source: string;
  traceId: string;
  timestamp: number;
  severity: EventSeverity;
  federationId?: string;
};

export type EventHandler<T = unknown> = (event: IsabellaEvent<T>) => void | Promise<void>;

export interface EventBus {
  publish<T>(type: string, payload: T, opts?: Partial<Pick<IsabellaEvent<T>, "source" | "severity" | "traceId" | "federationId">>): void;
  subscribe<T>(type: string, handler: EventHandler<T>): () => void;
  subscribeAll(handler: EventHandler): () => void;
  unsubscribe(type: string, handler: EventHandler): void;
  stats(): EventBusStats;
  history(limit?: number): IsabellaEvent[];
  clear(): void;
};

export type EventBusStats = {
  totalPublished: number;
  totalDelivered: number;
  activeSubscriptions: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  errorCount: number;
};

let globalCounter = 0;

function genTraceId(): string {
  return `evt-${Date.now()}-${(globalCounter++).toString(36)}`;
}

export function createEventBus(): EventBus {
  const subscriptions = new Map<string, Set<EventHandler>>();
  const wildcardHandlers = new Set<EventHandler>();
  const eventHistory: IsabellaEvent[] = [];
  const stats: EventBusStats = {
    totalPublished: 0,
    totalDelivered: 0,
    activeSubscriptions: 0,
    byType: {},
    bySeverity: {},
    errorCount: 0,
  };

  async function deliver<T>(event: IsabellaEvent<T>, handler: EventHandler<T>): Promise<void> {
    try {
      await handler(event);
      stats.totalDelivered++;
    } catch (err) {
      stats.errorCount++;
      console.error(`[EventBus] Handler error for ${event.type}:`, err);
    }
  }

  return {
    publish<T>(type, payload, opts) {
      const event: IsabellaEvent<T> = {
        type,
        payload,
        source: opts?.source ?? "system",
        traceId: opts?.traceId ?? genTraceId(),
        timestamp: Date.now(),
        severity: opts?.severity ?? "info",
        federationId: opts?.federationId,
      };

      stats.totalPublished++;
      stats.byType[type] = (stats.byType[type] ?? 0) + 1;
      stats.bySeverity[event.severity] = (stats.bySeverity[event.severity] ?? 0) + 1;

      eventHistory.push(event);
      if (eventHistory.length > 1000) eventHistory.shift();

      const handlers = subscriptions.get(type);
      if (handlers) {
        for (const handler of handlers) deliver(event, handler);
      }

      for (const handler of wildcardHandlers) deliver(event, handler);
    },

    subscribe<T>(type, handler) {
      if (!subscriptions.has(type)) subscriptions.set(type, new Set());
      subscriptions.get(type)!.add(handler as EventHandler);
      stats.activeSubscriptions++;
      return () => {
        subscriptions.get(type)?.delete(handler as EventHandler);
        stats.activeSubscriptions--;
      };
    },

    subscribeAll(handler) {
      wildcardHandlers.add(handler);
      stats.activeSubscriptions++;
      return () => {
        wildcardHandlers.delete(handler);
        stats.activeSubscriptions--;
      };
    },

    unsubscribe(type, handler) {
      subscriptions.get(type)?.delete(handler);
      stats.activeSubscriptions--;
    },

    stats: () => ({ ...stats }),
    history: (limit = 50) => eventHistory.slice(-limit),
    clear: () => { eventHistory.length = 0; },
  };
}
