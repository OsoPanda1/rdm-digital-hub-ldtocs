/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-KORIMA
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella.Skills â€” ClawHub Skill Registry (Î©-Core v4.0 Enterprise)
// Registro descentralizado, ciclo de vida y manifiestos
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillManifest, SkillStatus, FederationId } from "../types";

export interface SkillRegistry {
  register(manifest: SkillManifest): SkillEntry;
  approve(name: string): SkillEntry | null;
  reject(name: string): SkillEntry | null;
  deprecate(name: string): SkillEntry | null;
  get(name: string): SkillEntry | undefined;
  list(status?: SkillStatus): SkillEntry[];
  status(): { total: number; byStatus: Record<SkillStatus, number> };
}

export type SkillEntry = {
  manifest: SkillManifest;
  status: SkillStatus;
  signature: string;
  registeredAt: number;
  approvedAt?: number;
};

const STORE: Map<string, SkillEntry> = new Map();

export function createSkillRegistry(): SkillRegistry {
  return {
    register(manifest: SkillManifest): SkillEntry {
      const entry: SkillEntry = {
        manifest,
        status: "quarantine",
        signature: `sig-${Date.now()}-${manifest.name}`,
        registeredAt: Date.now(),
      };
      STORE.set(manifest.name, entry);
      return entry;
    },

    approve(name: string): SkillEntry | null {
      const entry = STORE.get(name);
      if (!entry || entry.status !== "quarantine") return entry ?? null;
      entry.status = "approved";
      entry.approvedAt = Date.now();
      return entry;
    },

    reject(name: string): SkillEntry | null {
      const entry = STORE.get(name);
      if (!entry) return null;
      entry.status = "rejected";
      return entry;
    },

    deprecate(name: string): SkillEntry | null {
      const entry = STORE.get(name);
      if (!entry) return null;
      entry.status = "deprecated";
      return entry;
    },

    get(name: string): SkillEntry | undefined {
      return STORE.get(name);
    },

    list(status?: SkillStatus): SkillEntry[] {
      const all = Array.from(STORE.values());
      return status ? all.filter((s) => s.status === status) : all;
    },

    status() {
      const byStatus: Record<SkillStatus, number> = { registered: 0, quarantine: 0, approved: 0, rejected: 0, deprecated: 0 };
      for (const s of STORE.values()) byStatus[s.status]++;
      return { total: STORE.size, byStatus };
    },
  };
}

export function registerBuiltinSkills(registry: SkillRegistry): SkillEntry[] {
  const BUILTIN: SkillManifest[] = [
    {
      name: "isabella-voice-tutor", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-6" as FederationId, license: "MIT-0",
      description: "Voz bidireccional para clases, lectura guiada, evaluaciÃ³n oral y coaching educativo",
      requires: { env: ["ISA_API_TOKEN", "OPENAI_API_KEY"], bins: [], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸŽ™ï¸",
      homepage: "https://tamv.network/skills/isabella-voice-tutor",
      ethicalBoundaries: ["No almacena grabaciones sin consentimiento", "No evalÃºa menores sin supervisiÃ³n docente"],
      supportedIntents: ["voice_class", "reading_guidance", "oral_evaluation", "pronunciation_coaching"],
    },
    {
      name: "isabella-edu-mentor", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-6" as FederationId, license: "MIT-0",
      description: "Tutor cognitivo adaptativo con GraphRAG para rutas de aprendizaje",
      requires: { env: ["ISA_API_TOKEN", "GRAPH_DB_URL"], bins: [], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸ“š",
      homepage: "https://tamv.network/skills/isabella-edu-mentor",
      ethicalBoundaries: ["No sustituye juicio pedagÃ³gico humano", "Rutas trazables a fuentes verificables"],
      supportedIntents: ["learning_path", "concept_explanation", "knowledge_gap", "media_literacy"],
    },
    {
      name: "isabella-rdm-guide", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-4" as FederationId, license: "MIT-0",
      description: "GuÃ­a turÃ­stica y cultural con soporte XR/3D y narrativa territorial",
      requires: { env: ["ISA_API_TOKEN", "MAPS_API_KEY"], bins: ["curl"], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸ”ï¸",
      homepage: "https://tamv.network/skills/isabella-rdm-guide",
      ethicalBoundaries: ["No promueve turismo extractivo", "Solo recomienda establecimientos verificados"],
      supportedIntents: ["cultural_route", "historical_context", "local_commerce", "xr_experience"],
    },
    {
      name: "isabella-devsecops", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-1" as FederationId, license: "MIT-0",
      description: "Agente de auditorÃ­a de repositorios, CI/CD, gateway y despliegues TAMV",
      requires: { env: ["GITHUB_TOKEN", "CLAWHUB_API_KEY", "MEXA_API_SECURE_KEY"], bins: ["git", "gh"], systems: ["Linux", "Darwin"] },
      primaryEnv: "CLAWHUB_API_KEY", emoji: "ðŸ”’",
      homepage: "https://tamv.network/skills/isabella-devsecops",
      ethicalBoundaries: ["No aplica parches en producciÃ³n sin aprobaciÃ³n", "No modifica polÃ­ticas sin registro DAG"],
      supportedIntents: ["sast_audit", "ci_cd_review", "dependency_check", "security_patch"],
    },
    {
      name: "isabella-ethics-guardian", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-7" as FederationId, license: "MIT-0",
      description: "Monitor de cumplimiento Ã©tico con triple bloqueo sexual y registro en DAG",
      requires: { env: ["ISA_API_TOKEN", "MEXA_API_SECURE_KEY", "DAG_ENDPOINT"], bins: ["curl", "openssl"], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸ›¡ï¸",
      homepage: "https://tamv.network/skills/isabella-ethics-guardian",
      ethicalBoundaries: ["No bloquea contenido sin contexto", "No escala sanciones sin revisiÃ³n humana"],
      supportedIntents: ["policy_check", "incident_report", "ethics_audit", "triple_block_eval"],
    },
    {
      name: "isabella-heptafederated-maestro", version: "2.0.0", author: "TAMV Online Network",
      federation: "FED-3" as FederationId, license: "MIT-0",
      description: "NÃºcleo maestro de ejecuciÃ³n cognitiva, auditorÃ­a criptogrÃ¡fica y gobernanza de automatizaciones",
      requires: { env: ["CLAWHUB_API_KEY", "ISA_API_TOKEN", "MEXA_API_SECURE_KEY"], bins: ["curl", "jq", "openssl"], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸ§¬",
      homepage: "https://github.com/openclaw/isabella-heptafederated",
      ethicalBoundaries: ["No ejecuta acciones sin supervisiÃ³n en canales juveniles", "No modifica SOUL sin quorum 5/7"],
      supportedIntents: ["cognitive_orchestration", "federation_governance", "skill_audit", "crypto_verify"],
    },
    {
      name: "isabella-librarian", version: "1.0.0", author: "TAMV Online Network",
      federation: "FED-4" as FederationId, license: "MIT-0",
      description: "Motor bibliotecario AI â€” ingesta, organizaciÃ³n semÃ¡ntica, compilaciÃ³n de libros y publicaciÃ³n",
      requires: { env: ["ISA_API_TOKEN", "OPENAI_API_KEY", "VECTOR_DB_URL"], bins: ["curl"], systems: ["Linux", "Darwin"] },
      primaryEnv: "ISA_API_TOKEN", emoji: "ðŸ“–",
      homepage: "https://tamv.network/skills/isabella-librarian",
      ethicalBoundaries: ["No publica sin verificaciÃ³n de derechos", "No compila informaciÃ³n contradictoria sin seÃ±alarla"],
      supportedIntents: ["file_ingestion", "semantic_organization", "book_compilation", "cover_generation", "marketplace_publish"],
    },
  ];

  return BUILTIN.map((manifest) => registry.register(manifest));
}

export function listApprovedSkills(registry: SkillRegistry): SkillEntry[] {
  return registry.list("approved");
}
