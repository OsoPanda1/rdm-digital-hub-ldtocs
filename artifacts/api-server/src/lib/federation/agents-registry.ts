/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// F6 â€” Agent Workforce Registry
// CatÃ¡logo de agentes, permisos, triggers HITL
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface AgentDefinition {
  agentId: string;
  name: string;
  domain: string;
  capabilities: string[];
  permissions: string[];
  autonomyLevel: "full" | "supervised" | "readonly";
  status: "active" | "inactive" | "quarantine";
  registeredAt: string;
}

export interface HitlTrigger {
  triggerId: string;
  agentId: string;
  condition: string;
  action: "notify" | "pause" | "escalate";
}

export interface AgentRegistry {
  register(agent: Omit<AgentDefinition, "agentId" | "registeredAt">): Promise<AgentDefinition>;
  get(agentId: string): Promise<AgentDefinition | null>;
  list(status?: string): Promise<AgentDefinition[]>;
  updatePermissions(agentId: string, permissions: string[]): Promise<boolean>;
  addTrigger(trigger: Omit<HitlTrigger, "triggerId">): Promise<HitlTrigger>;
  getTriggers(agentId: string): Promise<HitlTrigger[]>;
  stats(): Promise<{ total: number; byStatus: Record<string, number>; byDomain: Record<string, number> }>;
}

export function createAgentRegistry(): AgentRegistry {
  const agents = new Map<string, AgentDefinition>();
  const triggers = new Map<string, HitlTrigger[]>();

  return {
    async register(data) {
      const agent: AgentDefinition = {
        ...data,
        agentId: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        registeredAt: new Date().toISOString(),
      };
      agents.set(agent.agentId, agent);
      return agent;
    },

    async get(agentId) { return agents.get(agentId) ?? null; },

    async list(status) {
      const all = Array.from(agents.values());
      return status ? all.filter((a) => a.status === status) : all;
    },

    async updatePermissions(agentId, permissions) {
      const agent = agents.get(agentId);
      if (!agent) return false;
      agent.permissions = permissions;
      return true;
    },

    async addTrigger(trigger) {
      const full: HitlTrigger = { ...trigger, triggerId: `trg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
      const existing = triggers.get(trigger.agentId) ?? [];
      existing.push(full);
      triggers.set(trigger.agentId, existing);
      return full;
    },

    async getTriggers(agentId) { return triggers.get(agentId) ?? []; },

    async stats() {
      const byStatus: Record<string, number> = {};
      const byDomain: Record<string, number> = {};
      for (const [, a] of agents) {
        byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
        byDomain[a.domain] = (byDomain[a.domain] ?? 0) + 1;
      }
      return { total: agents.size, byStatus, byDomain };
    },
  };
}
