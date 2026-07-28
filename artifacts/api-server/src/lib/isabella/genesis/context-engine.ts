/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Genesis â€” Context Engine
// Memoria jerÃ¡rquica (corto/largo plazo) + enriquecimiento de contexto
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { DecisionContext } from "../types/decision-record";

export interface ShortTermMemoryEvent {
  id: string;
  timestamp: number;
  embedding?: number[];
  payloadHash: string;
  content: string;
}

export interface LongTermMemoryRef {
  nodeId: string;
  lastSeen: number;
  importance: number;
  domain: string;
}

export interface UserProfile {
  profileId: string;
  userId: string;
  preferences: Record<string, unknown>;
  roles: string[];
  trustLevel: number;
  appealsHistory: number;
}

export interface ContextEngineInput {
  query: string;
  userId: string;
  hints?: Record<string, unknown>;
  maxShortTerm?: number;
  maxLongTerm?: number;
}

export interface ContextEngineOutput {
  enrichedContext: string;
  planSteps: string[];
  decisionContext: DecisionContext;
  shortTermHits: ShortTermMemoryEvent[];
  longTermHits: LongTermMemoryRef[];
  userProfile: UserProfile | null;
}

export interface ContextEngine {
  buildContext(input: ContextEngineInput): Promise<ContextEngineOutput>;
  addToShortTerm(event: Omit<ShortTermMemoryEvent, "id" | "timestamp">): ShortTermMemoryEvent;
  getShortTerm(limit?: number): ShortTermMemoryEvent[];
  consolidate(): number;
  stats(): { shortTerm: number; longTerm: number; users: number };
}

export function createContextEngine(): ContextEngine {
  const shortTerm: ShortTermMemoryEvent[] = [];
  const longTerm: LongTermMemoryRef[] = [];
  const profiles = new Map<string, UserProfile>();
  let stCounter = 0;

  return {
    async buildContext(input) {
      const stHits = shortTerm
        .filter((e) => input.query.toLowerCase().includes(e.content.toLowerCase().slice(0, 30)))
        .slice(-(input.maxShortTerm ?? 5));

      const ltHits = longTerm
        .sort((a, b) => b.importance - a.importance)
        .slice(0, input.maxLongTerm ?? 5);

      const profile = profiles.get(input.userId) ?? null;

      const contextParts = [
        `Query: ${input.query}`,
        `User: ${input.userId}`,
        ...stHits.map((h) => `[ShortTerm] ${h.content}`),
        ...ltHits.map((h) => `[LongTerm:${h.domain}] ${h.nodeId} (importance: ${h.importance})`),
      ];

      if (profile) {
        contextParts.push(`UserProfile: trust=${profile.trustLevel}, roles=${profile.roles.join(",")}`);
      }

      const decisionContext: DecisionContext = {
        profileId: profile?.profileId ?? `profile-${input.userId}`,
        memorySnapshotHash: `sha256:${Buffer.from(contextParts.join("|")).toString("base64").slice(0, 32)}`,
        riskScore: profile ? Math.max(0, 1 - profile.trustLevel) : 0.5,
      };

      return {
        enrichedContext: contextParts.join("\n"),
        planSteps: ["retrieve_knowledge", "plan_reasoning", "execute_tools"],
        decisionContext,
        shortTermHits: stHits,
        longTermHits: ltHits,
        userProfile: profile,
      };
    },

    addToShortTerm(event) {
      const entry: ShortTermMemoryEvent = {
        ...event,
        id: `stm-${Date.now()}-${(stCounter++).toString(36)}`,
        timestamp: Date.now(),
      };
      shortTerm.push(entry);
      if (shortTerm.length > 500) shortTerm.shift();
      return entry;
    },

    getShortTerm(limit = 20) {
      return shortTerm.slice(-limit);
    },

    consolidate() {
      const now = Date.now();
      const threshold = 300000; // 5 minutes
      let promoted = 0;
      for (let i = shortTerm.length - 1; i >= 0; i--) {
        const e = shortTerm[i];
        if (now - e.timestamp > threshold) {
          longTerm.push({
            nodeId: e.id,
            lastSeen: e.timestamp,
            importance: 0.5,
            domain: "session",
          });
          shortTerm.splice(i, 1);
          promoted++;
        }
      }
      return promoted;
    },

    stats() {
      return { shortTerm: shortTerm.length, longTerm: longTerm.length, users: profiles.size };
    },
  };
}
