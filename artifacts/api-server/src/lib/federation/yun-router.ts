// ────────────────────────────────────────────────────────────────
// YUN Router — Federation Event Routing
// Orquesta entrada/salida de eventos entre federaciones
// ────────────────────────────────────────────────────────────────

import { type YunEvent, type FederationId, createYunBus } from "./yun-bus";

export interface RoutingRule {
  eventType: string;
  targetFederation: FederationId;
  transform?: (event: YunEvent) => YunEvent;
}

export interface YunRouter {
  addRule(rule: RoutingRule): void;
  routeEvent(event: YunEvent): YunEvent[];
  getRules(): RoutingRule[];
  stats(): { totalRouted: number; rules: number };
}

export function createYunRouter(): YunRouter {
  const rules: RoutingRule[] = [];
  let totalRouted = 0;

  return {
    addRule(rule) { rules.push(rule); },

    routeEvent(event) {
      const routed: YunEvent[] = [];
      for (const rule of rules) {
        if (rule.eventType === event.type || rule.eventType === "*") {
          const transformed = rule.transform ? rule.transform(event) : { ...event, federation: rule.targetFederation };
          routed.push(transformed);
          totalRouted++;
        }
      }
      return routed;
    },

    getRules: () => [...rules],
    stats: () => ({ totalRouted, rules: rules.length }),
  };
}
