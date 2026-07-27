// ────────────────────────────────────────────────────────────────
// YUN Barrel — Constitutional Realm of TAMV Ecosystem
// ────────────────────────────────────────────────────────────────

// Types & Constitution
export * from "./types";
export * from "./constitution";

// Policy Engine (OPA-style)
export { YunPolicyEngine } from "./engine";
export type { PolicyInput, PolicyEvaluationResult, PolicyViolationEvent } from "./engine";

// Registry (Heptacapa Identity)
export { YunRegistry } from "./registry";
export type { YunAgent, YunService, YunRole, YunIdentityBinding } from "./registry";

// Message Bus
export { YunMessageBus } from "./bus";
export type { BusNode, BusChannel, BusState, EventSubscription, EventPublishResult } from "./bus";

// Resilience Manager
export { YunResilienceManager } from "./resilience";

// Perception Layer
export { YunPerceptionLayer } from "./perception";
export type { PerceptionSignal, YunPerceptionEvent, TechnicalSignal, SocialSignal, TerritorialSignal } from "./perception";

// Governance Console
export { YunGovernanceConsole } from "./governance";
export type { VoteRecord, ADRVote, ADRProposal } from "./governance";

// PQC Hybrid Crypto
export { YunPqcCrypto } from "./pqc/core";
export type { PqcAlgorithm, PqcKeyStatus, PqcKeyMeta, HybridHandshakeResult, HybridSignatureResult, KeyInventoryEntry } from "./pqc/core";

import { YunPolicyEngine } from "./engine";
import { YunRegistry } from "./registry";
import { YunMessageBus } from "./bus";
import { YunResilienceManager } from "./resilience";
import { YunPerceptionLayer } from "./perception";
import { YunGovernanceConsole } from "./governance";
import { YunPqcCrypto } from "./pqc/core";

export interface YunSystem {
  policyEngine: YunPolicyEngine;
  registry: YunRegistry;
  bus: YunMessageBus;
  resilience: YunResilienceManager;
  perception: YunPerceptionLayer;
  governance: YunGovernanceConsole;
  pqc: YunPqcCrypto;
}

export function createYunSystem(signingSecret?: string): YunSystem {
  const secret = signingSecret ?? process.env.YUN_SIGNING_SECRET;
  if (!secret) {
    throw new Error(
      "YUN_SIGNING_SECRET must be set. " +
      "Hardcoded fallback secrets are prohibited (PennyLane security pattern)."
    );
  }

  const policyEngine = new YunPolicyEngine();
  const registry = new YunRegistry();
  const bus = new YunMessageBus(secret);
  const resilience = new YunResilienceManager((transition) => {
    bus.publish({
      eventType: "yun.mode.transition",
      domain: "telemetry",
      topic: "telemetry.events",
      federationId: "FED-3",
      entityId: "system",
      traceId: `transition-${Date.now()}`,
      severity: "warn",
      payload: transition,
    });
  });
  const perception = new YunPerceptionLayer();
  const governance = new YunGovernanceConsole();
  const pqc = new YunPqcCrypto();

  // Wire perception to bus
  perception.setPublisher((event) => {
    bus.publish(event);
  });

  return {
    policyEngine,
    registry,
    bus,
    resilience,
    perception,
    governance,
    pqc,
  };
}
