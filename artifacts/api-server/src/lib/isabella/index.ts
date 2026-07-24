// ────────────────────────────────────────────────────────────────
// Isabella Villaseñor AI™ — Unified Library (Ω-Core v4.0 Enterprise)
// Sistema Operativo Cognitivo Soberano del Ecosistema TAMV
//
// Integration: SOUL · Isa API · Mexa API · ClawHub · Library · XRAI · Fair
// ────────────────────────────────────────────────────────────────

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

// ── System Info ─────────────────────────────────────────────────

export function isabellaVersion(): string {
  return "Isabella Villaseñor AI™ Ω-Core 4.0.0 Enterprise";
}

export function isabellaOrigin(): { name: string; author: string; origin: string; model: string } {
  return {
    name: "Isabella Villaseñor",
    author: "Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)",
    origin: "Real del Monte, Hidalgo, México",
    model: "SCAO — ZT-DCOS",
  };
}
