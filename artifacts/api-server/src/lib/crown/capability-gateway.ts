/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// THE C.R.O.W.N â€” Capability Gateway
// Orquestador central: resuelve quÃ© Skill usar, valida permisos,
// registra en BookPI, devuelve respuesta normalizada
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type {
  CapabilityRequest, CapabilityResponse, BookPiAnchor,
  FederationId, HexagonZone, SkillId, SkillDefinition, SkillInstance,
} from "./types";
import { createBookPiTelemetry } from "./bookpi-telemetry";
import { createHash } from "node:crypto";

export interface CapabilityGateway {
  dispatch<TReq, TRes>(req: CapabilityRequest<TReq>): Promise<CapabilityResponse<TRes>>;
  dispatchBatch<TReq, TRes>(reqs: CapabilityRequest<TReq>[]): Promise<CapabilityResponse<TRes>[]>;
  registerSkill(def: SkillDefinition): SkillInstance;
  getSkill(skillId: SkillId): SkillInstance | undefined;
  listSkills(): SkillInstance[];
  validatePermissions(skillId: SkillId, federationId: FederationId, hexagonZone: HexagonZone): boolean;
  stats(): { totalDispatches: number; successRate: number; bySkill: Record<string, number> };
}

export function createCapabilityGateway(): CapabilityGateway {
  const skills = new Map<SkillId, SkillInstance>();
  const telemetry = createBookPiTelemetry();
  let totalDispatches = 0;
  let successCount = 0;
  const bySkill: Record<string, number> = {};

  function generateNodeId(): string {
    return `node-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function signBookPi(federationId: FederationId): BookPiAnchor {
    const timestamp = Date.now();
    const nodeId = generateNodeId();
    const data = `${nodeId}:${federationId}:${timestamp}`;
    const hash = createHash("sha256").update(data).digest("hex").slice(0, 16);
    return { nodeId, hash: `0x${hash}`, timestamp, federationId };
  }

  return {
    async dispatch<TReq, TRes>(req: CapabilityRequest<TReq>): Promise<CapabilityResponse<TRes>> {
      const start = Date.now();
      totalDispatches++;
      bySkill[req.skillId] = (bySkill[req.skillId] ?? 0) + 1;

      const skill = skills.get(req.skillId);
      if (!skill) {
        return { ok: false, error: `skill_not_found: ${req.skillId}`, traceId: req.traceId, bookpi: signBookPi(req.federationId), durationMs: Date.now() - start };
      }

      if (skill.status !== "active") {
        return { ok: false, error: `skill_not_active: ${req.skillId} (${skill.status})`, traceId: req.traceId, bookpi: signBookPi(req.federationId), durationMs: Date.now() - start };
      }

      if (!this.validatePermissions(req.skillId, req.federationId, req.hexagonZone)) {
        return { ok: false, error: `permission_denied: federation ${req.federationId} zone ${req.hexagonZone}`, traceId: req.traceId, bookpi: signBookPi(req.federationId), durationMs: Date.now() - start };
      }

      skill.lastCallAt = new Date().toISOString();
      skill.totalCalls++;

      telemetry.record({
        traceId: req.traceId, hexagonId: req.hexagonId, hexagonZone: req.hexagonZone,
        federationId: req.federationId, skillId: req.skillId, action: "dispatch",
        timestamp: Date.now(), durationMs: Date.now() - start, success: true, metadata: { capability: req.capability },
      });

      successCount++;
      return {
        ok: true,
        traceId: req.traceId,
        bookpi: signBookPi(req.federationId),
        durationMs: Date.now() - start,
      } as CapabilityResponse<TRes>;
    },

    async dispatchBatch<TReq, TRes>(reqs: CapabilityRequest<TReq>[]): Promise<CapabilityResponse<TRes>[]> {
      return Promise.all(reqs.map((r) => this.dispatch<TReq, TRes>(r)));
    },

    registerSkill(def) {
      const instance: SkillInstance = {
        definition: def,
        status: "active",
        registeredAt: new Date().toISOString(),
        lastCallAt: null,
        totalCalls: 0,
        errorCount: 0,
      };
      skills.set(def.skillId, instance);
      return instance;
    },

    getSkill(skillId) { return skills.get(skillId); },

    listSkills() { return Array.from(skills.values()); },

    validatePermissions(skillId, federationId, hexagonZone) {
      const skill = skills.get(skillId);
      if (!skill) return false;
      const required = skill.definition.federationRequired;
      if (required.length > 0 && !required.includes(federationId)) return false;
      if (skill.definition.hexagonZone !== hexagonZone) return false;
      return true;
    },

    stats() {
      return {
        totalDispatches,
        successRate: totalDispatches > 0 ? successCount / totalDispatches : 1,
        bySkill: { ...bySkill },
      };
    },
  };
}
