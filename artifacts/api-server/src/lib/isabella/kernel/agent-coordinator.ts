// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Multi-Agent Coordinator
// Dynamic team formation, synthesis, discrepancy resolution.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  AgentTeam,
  AgentRole,
  AgentContribution,
  SynthesisResult,
  CapabilityId,
} from "./types";
import { logger } from "../../logger";

export interface AgentCoordinator {
  formTeam(params: {
    objective: string;
    requiredCapabilities: CapabilityId[];
    synthesisStrategy?: AgentTeam["synthesisStrategy"];
  }): AgentTeam;
  addContribution(teamId: string, contribution: AgentContribution): boolean;
  synthesize(teamId: string): SynthesisResult | null;
  getTeam(teamId: string): AgentTeam | undefined;
  disbandTeam(teamId: string): boolean;
  listTeams(): AgentTeam[];
}

const teams = new Map<string, AgentTeam>();
const contributions = new Map<string, AgentContribution[]>();

// ── Role Templates ──────────────────────────────────────────────────────────

const ROLE_TEMPLATES: Array<{
  role: string;
  capabilities: CapabilityId[];
  autonomy: number;
}> = [
  { role: "analyst", capabilities: ["reasoning", "analysis"], autonomy: 3 },
  { role: "researcher", capabilities: ["research", "synthesis"], autonomy: 3 },
  { role: "architect", capabilities: ["architecture", "programming"], autonomy: 4 },
  { role: "security-expert", capabilities: ["security", "verification"], autonomy: 4 },
  { role: "creative", capabilities: ["creative", "synthesis"], autonomy: 3 },
  { role: "territory-specialist", capabilities: ["mapping", "tourism"], autonomy: 3 },
  { role: "legal-advisor", capabilities: ["legal", "research"], autonomy: 2 },
  { role: "negotiator", capabilities: ["negotiation", "synthesis"], autonomy: 3 },
  { role: "verifier", capabilities: ["verification", "security"], autonomy: 4 },
  { role: "planner", capabilities: ["planning", "reasoning"], autonomy: 3 },
];

function selectRoles(requiredCapabilities: CapabilityId[]): AgentRole[] {
  const selected: AgentRole[] = [];
  const coveredCapabilities = new Set<CapabilityId>();

  // Sort templates by how many required capabilities they cover
  const scored = ROLE_TEMPLATES.map((t) => ({
    ...t,
    score: t.capabilities.filter((c) => requiredCapabilities.includes(c)).length,
  })).filter((t) => t.score > 0).sort((a, b) => b.score - a.score);

  for (const template of scored) {
    const uncoveredCaps = template.capabilities.filter(
      (c) => requiredCapabilities.includes(c) && !coveredCapabilities.has(c),
    );
    if (uncoveredCaps.length > 0) {
      selected.push({
        agentId: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: template.role,
        capabilities: template.capabilities,
        autonomyLevel: template.autonomy,
        status: "idle",
      });
      template.capabilities.forEach((c) => coveredCapabilities.add(c));
    }
  }

  return selected;
}

function mergeContributions(contribs: AgentContribution[]): {
  merged: string;
  disagreements: string[];
  consensus: number;
} {
  if (contribs.length === 0) return { merged: "", disagreements: [], consensus: 0 };
  if (contribs.length === 1) {
    return {
      merged: String(contribs[0].output),
      disagreements: [],
      consensus: contribs[0].confidence,
    };
  }

  // Simple merge: combine outputs, flag disagreements
  const outputs = contribs.map((c) => ({
    text: String(c.output),
    confidence: c.confidence,
    dissent: c.dissent,
  }));

  const dissents = outputs.filter((o) => o.dissent).map((o) => o.dissent!);
  const avgConfidence = outputs.reduce((s, o) => s + o.confidence, 0) / outputs.length;

  // Weighted merge by confidence
  const sorted = [...outputs].sort((a, b) => b.confidence - a.confidence);
  const merged = sorted.map((o) => o.text).join("\n\n---\n\n");

  return {
    merged,
    disagreements: dissents,
    consensus: dissents.length === 0 ? avgConfidence : avgConfidence * 0.7,
  };
}

export function createAgentCoordinator(): AgentCoordinator {
  return {
    formTeam({ objective, requiredCapabilities, synthesisStrategy = "consensus" }) {
      const members = selectRoles(requiredCapabilities);
      const team: AgentTeam = {
        id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: `Team for: ${objective.slice(0, 50)}`,
        members,
        objective,
        synthesisStrategy,
        status: "forming",
        createdAt: Date.now(),
      };

      teams.set(team.id, team);
      contributions.set(team.id, []);

      logger.info({
        teamId: team.id,
        members: members.length,
        objective: objective.slice(0, 100),
      }, "Agent team formed");

      return team;
    },

    addContribution(teamId, contribution) {
      const team = teams.get(teamId);
      if (!team || team.status === "completed" || team.status === "disbanded") return false;

      const teamContribs = contributions.get(teamId);
      if (!teamContribs) return false;

      teamContribs.push(contribution);

      // Update agent status
      const member = team.members.find((m) => m.agentId === contribution.agentId);
      if (member) member.status = "done";

      // Check if all members have contributed
      const allDone = team.members.every(
        (m) => teamContribs.some((c) => c.agentId === m.agentId),
      );
      if (allDone) team.status = "synthesizing";

      return true;
    },

    synthesize(teamId) {
      const team = teams.get(teamId);
      const teamContribs = contributions.get(teamId);
      if (!team || !teamContribs || teamContribs.length === 0) return null;

      const { merged, disagreements, consensus } = mergeContributions(teamContribs);

      const result: SynthesisResult = {
        teamId,
        contributions: teamContribs,
        mergedOutput: merged,
        disagreements,
        consensusScore: consensus,
        resolutionStrategy: team.synthesisStrategy,
      };

      team.status = "completed";

      logger.info({
        teamId,
        contributionsCount: teamContribs.length,
        consensusScore: consensus,
        disagreementsCount: disagreements.length,
      }, "Team synthesis completed");

      return result;
    },

    getTeam(teamId) {
      return teams.get(teamId);
    },

    disbandTeam(teamId) {
      const team = teams.get(teamId);
      if (!team) return false;
      team.status = "disbanded";
      contributions.delete(teamId);
      return true;
    },

    listTeams() {
      return Array.from(teams.values());
    },
  };
}
