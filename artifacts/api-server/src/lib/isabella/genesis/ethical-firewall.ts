/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Genesis â€” Ethical Firewall
// PolÃ­ticas Ã©ticas aplicadas a cada DecisionRecord
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { DecisionRecord, FirewallAction } from "../types/decision-record";
import { POLICIES } from "../soul/identity";

export interface FirewallPolicy {
  policyId: string;
  conditions: Record<string, unknown>;
  actions: FirewallAction[];
  severity: "critical" | "high" | "medium" | "low";
}

export interface FirewallResult {
  decision: DecisionRecord;
  appliedPolicies: string[];
  overriddenAction: boolean;
}

export interface EthicalFirewall {
  registerPolicy(policy: FirewallPolicy): void;
  applyPolicies(decision: DecisionRecord): Promise<DecisionRecord>;
  getPolicies(): FirewallPolicy[];
  stats(): { totalPolicies: number; bySeverity: Record<string, number> };
}

function matchesCondition(decision: DecisionRecord, conditions: Record<string, unknown>): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    if (key === "action" && decision.decision.action !== value) return false;
    if (key === "minConfidence" && decision.decision.confidence < (value as number)) return false;
    if (key === "maxRisk" && decision.context.riskScore > (value as number)) return false;
  }
  return true;
}

export function createEthicalFirewall(): EthicalFirewall {
  const customPolicies: FirewallPolicy[] = [];

  const builtInPolicies: FirewallPolicy[] = [
    {
      policyId: "FW-001-critical-risk",
      conditions: { maxRisk: 0.8 },
      actions: ["block"],
      severity: "critical",
    },
    {
      policyId: "FW-002-low-confidence",
      conditions: { minConfidence: 0.2, action: "respond" },
      actions: ["defer"],
      severity: "medium",
    },
    {
      policyId: "FW-003-high-risk-escalate",
      conditions: { maxRisk: 0.6 },
      actions: ["requireConsent"],
      severity: "high",
    },
  ];

  const allPolicies = () => [...builtInPolicies, ...customPolicies];

  return {
    registerPolicy(policy) {
      customPolicies.push(policy);
    },

    async applyPolicies(decision) {
      let result = { ...decision, decision: { ...decision.decision } };
      const _applied: string[] = [];

      for (const policy of allPolicies()) {
        if (matchesCondition(result, policy.conditions)) {
          _applied.push(policy.policyId);
          for (const action of policy.actions) {
            if (action === "block") {
              result.decision.action = "block";
              result.decision.explanation += ` [Firewall: ${policy.policyId} bloqueado]`;
            } else if (action === "defer") {
              result.decision.action = "defer";
              result.decision.explanation += ` [Firewall: ${policy.policyId} diferido]`;
            } else if (action === "requireConsent") {
              result.decision.explanation += ` [Firewall: ${policy.policyId} requiere consentimiento]`;
            } else if (action === "escalate") {
              result.decision.action = "escalate";
              result.decision.explanation += ` [Firewall: ${policy.policyId} escalado]`;
            }
          }
        }
      }

      const soulPolicyCount = POLICIES.length;
      result.decision.explanation += ` [SOUL: ${soulPolicyCount} polÃ­ticas activas]`;

      return result;
    },

    getPolicies: allPolicies,

    stats() {
      const policies = allPolicies();
      const bySeverity: Record<string, number> = {};
      for (const p of policies) bySeverity[p.severity] = (bySeverity[p.severity] ?? 0) + 1;
      return { totalPolicies: policies.length, bySeverity };
    },
  };
}
