/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Villaseñor AIâ„¢ â€” Unified Library (Î©-Core v4.0 Enterprise)
// Sistema Operativo Cognitivo Soberano del Ecosistema TAMV
//
// Integration: SOUL · Isa API · Mexa API · ClawHub · Library · XRAI · Fair
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export * from "./types";

// Core
export { createCognitiveOrchestrator } from "./core/orchestrator";
export type { CognitiveOrchestrator, OrchestrationResult, OrchestratorStatus } from "./core/orchestrator";
export { createPersonalityEngine } from "./core/personality";
export type { PersonalityEngine } from "./core/personality";

// Soul
export { SOUL, AGENTS, POLICIES, findPolicy, findAgent, policiesByDomain } from "./soul/identity";
export type { SoulIdentity, AgentProfile, EthicalPolicy } from "./soul/identity";

// Memory
export { createMemoryEngine } from "./memory/engine";
export type { MemoryEngine, MemoryEntry, MemoryQuery } from "./memory/engine";
export { createLibrarianMemory } from "./memory/librarian";
export type { LibrarianMemory } from "./memory/librarian";

// Crypto
export { createFederationMask, verifyFederationMask, signPayload, verifySignedPayload, cryptoStatus } from "./crypto/federation";

// Skills
export { createSkillRegistry, registerBuiltinSkills, listApprovedSkills } from "./skills/registry";
export type { SkillRegistry, SkillEntry } from "./skills/registry";

// XRAI
export { createXrRenderer } from "./xrai/renderer";
export type { XrRenderer, SceneManifest, XrFormat, SceneObject } from "./xrai/renderer";

// Fair
export { createFairnessEngine } from "./fair/metrics";
export type { FairnessEngine, BiasReport, GuardrailResult, FairnessMetrics } from "./fair/metrics";

// Evaluation
export { createEvaluationEngine } from "./evaluation/engine";
export type { EvaluationEngine } from "./evaluation/engine";

// â”€â”€ System Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function isabellaVersion(): string {
  return "Isabella Villaseñor AIâ„¢ Î©-Core 4.0.0 Enterprise";
}

export function isabellaOrigin(): { name: string; author: string; origin: string; model: string } {
  return {
    name: "Isabella Villaseñor",
    author: "Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)",
    origin: "Real del Monte, Hidalgo, México",
    model: "SCAO â€” ZT-DCOS",
  };
}

// â”€â”€ THE C.R.O.W.N Integration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export { createCrownSystem } from "../crown";
export type { CrownSystem } from "../crown";
export * from "../crown/types";

// â”€â”€ YUN Constitutional Realm â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export { createYunSystem } from "../yun";
export type { YunSystem } from "../yun";
export * from "../yun/types";
