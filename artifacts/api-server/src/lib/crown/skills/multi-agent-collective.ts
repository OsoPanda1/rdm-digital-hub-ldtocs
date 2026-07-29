/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 7 â€” Multi-Agent Collective
// Consenso distribuido entre agentes especializados (arquitecto,
// seguridad, económico, ético, UX, legal, documentación)
// con mecanismo de consenso ponderado
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition, AgentRole, AgentOpinion, ConsensusResult } from "../types";

export const MultiAgentDefinition: SkillDefinition = {
  skillId: "multi-agent",
  name: "Multi-Agent Collective",
  description: "Distributed consensus among specialized agents with weighted voting and dissent tracking",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "interior",
  inputSchema: "ConsensusRequest",
  outputSchema: "ConsensusResult",
};

interface Agent {
  role: AgentRole;
  name: string;
  weight: number;
  active: boolean;
  lastResponse: string | null;
}

interface ConsensusRequest {
  topic: string;
  context: string;
  requiredRoles?: AgentRole[];
}

const DEFAULT_AGENTS: Agent[] = [
  { role: "architect", name: "Arquitecto", weight: 1.2, active: true, lastResponse: null },
  { role: "security", name: "Seguridad", weight: 1.5, active: true, lastResponse: null },
  { role: "economic", name: "Económico", weight: 1.0, active: true, lastResponse: null },
  { role: "ethical", name: "Ã‰tico", weight: 1.3, active: true, lastResponse: null },
  { role: "ux", name: "UX", weight: 0.9, active: true, lastResponse: null },
  { role: "legal", name: "Legal", weight: 1.1, active: true, lastResponse: null },
  { role: "documentation", name: "Documentación", weight: 0.8, active: true, lastResponse: null },
];

export interface MultiAgentCollective {
  requestConsensus(request: ConsensusRequest): ConsensusResult;
  getAgent(role: AgentRole): Agent | undefined;
  setAgentActive(role: AgentRole, active: boolean): void;
  getAgents(): Agent[];
  stats(): { totalConsensus: number; avgConfidence: number; agreementRate: number };
}

export function createMultiAgentCollective(): MultiAgentCollective {
  const agents = DEFAULT_AGENTS.map((a) => ({ ...a }));
  let consensusHistory: ConsensusResult[] = [];

  function simulateOpinion(agent: Agent, topic: string, context: string): AgentOpinion {
    const opinions: Record<AgentRole, string[]> = {
      architect: [`Modular approach recommended for: ${topic}`, "Consider scalability implications", "Follow hexagonal architecture"],
      security: [`Security review for: ${topic}`, "Check for injection vulnerabilities", "Ensure RBAC compliance"],
      economic: [`Cost-benefit analysis for: ${topic}`, "Consider operational overhead", "ROI projection needed"],
      ethical: [`Ethical review for: ${topic}`, "Check for bias in data handling", "Ensure user consent mechanisms"],
      ux: [`UX impact assessment for: ${topic}`, "Consider mobile responsiveness", "Ensure accessibility compliance"],
      legal: [`Legal compliance check for: ${topic}`, "GDPR implications", "Terms of service alignment"],
      documentation: [`Documentation requirements for: ${topic}`, "API docs needed", "User guide update required"],
    };
    const roleOpinions = opinions[agent.role] ?? [`General review for: ${topic}`];
    const opinion = roleOpinions[Math.floor(Math.random() * roleOpinions.length)]!;
    const confidence = 0.5 + Math.random() * 0.5;
    const reasoning = [`${agent.name} weighs in`, `Confidence: ${(confidence * 100).toFixed(0)}%`];
    return { agentRole: agent.role, opinion, confidence, reasoning };
  }

  return {
    requestConsensus(request) {
      const requiredRoles = request.requiredRoles ?? agents.filter((a) => a.active).map((a) => a.role);
      const opinions: AgentOpinion[] = [];

      for (const agent of agents) {
        if (!requiredRoles.includes(agent.role) || !agent.active) continue;
        const opinion = simulateOpinion(agent, request.topic, request.context);
        agent.lastResponse = opinion.opinion;
        opinions.push(opinion);
      }

      const weightedSum = opinions.reduce((s, o) => s + o.confidence * (agents.find((a) => a.role === o.agentRole)?.weight ?? 1), 0);
      const weightTotal = opinions.reduce((s, o) => s + (agents.find((a) => a.role === o.agentRole)?.weight ?? 1), 0);
      const overallConfidence = weightTotal > 0 ? weightedSum / weightTotal : 0;

      const consensus = overallConfidence > 0.6 ? "approve" : overallConfidence > 0.4 ? "conditional" : "reject";
      const dissent = opinions.filter((o) => o.confidence < 0.5).map((o) => `${o.agentRole}: ${o.opinion}`);

      const result: ConsensusResult = { topic: request.topic, opinions, consensus, overallConfidence, dissent };
      consensusHistory.push(result);
      return result;
    },

    getAgent(role) { return agents.find((a) => a.role === role); },
    setAgentActive(role, active) { const a = agents.find((a) => a.role === role); if (a) a.active = active; },
    getAgents() { return [...agents]; },

    stats() {
      const total = consensusHistory.length;
      const avgConf = total > 0 ? consensusHistory.reduce((s, c) => s + c.overallConfidence, 0) / total : 0;
      const agreed = consensusHistory.filter((c) => c.consensus === "approve").length;
      return { totalConsensus: total, avgConfidence: avgConf, agreementRate: total > 0 ? agreed / total : 1 };
    },
  };
}
