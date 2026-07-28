/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================================
// YUN Manifest Validator â€” aplica principios de ConstituciÃ³n YUN
// ============================================================================

import {
  RDMX_MODULES,
  type RepoModule,
  type FederationId,
} from "./rdmxManifest";

export type Severity = "P0" | "P1" | "P2";

export interface ValidationIssue {
  severity: Severity;
  moduleId: string | null;
  code: string;
  message: string;
}

const REQUIRED_FEDERATIONS: FederationId[] = [
  "fed1_commerce_local",
  "fed2_tourism_culture",
  "fed3_academia_science",
  "fed4_local_government",
  "fed5_tech_infra",
  "fed6_community_orgs",
  "fed7_metaverse_xr",
];

export const validateYunManifest = (
  modules: RepoModule[],
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  // 1. Cada mÃ³dulo con dominio YUN debe producir al menos un evento
  for (const m of modules) {
    if (m.yun.domain && m.yun.events.produces.length === 0) {
      issues.push({
        severity: "P1",
        moduleId: m.id,
        code: "YUN_EVT_NO_PRODUCES",
        message:
          "MÃ³dulo con dominio YUN debe producir al menos un evento relevante (evento antes que acoplamiento).",
      });
    }
  }

  // 2. Core + commerce/identity no pueden ser P2
  for (const m of modules) {
    if (
      m.criticality === "core" &&
      (m.yun.domain === "commerce" || m.yun.domain === "identity") &&
      m.yun.sensitivity === "P2"
    ) {
      issues.push({
        severity: "P0",
        moduleId: m.id,
        code: "YUN_SENS_INVALID",
        message:
          "MÃ³dulo core de dominio identity/commerce no puede tener sensibilidad P2; debe ser P0 o P1.",
      });
    }
  }

  // 3. MÃ³dulos core deben soportar resiliencia degradable
  for (const m of modules) {
    if (
      m.criticality === "core" &&
      !m.yun.resilience.supportedModes.includes("degraded-domain") &&
      !m.yun.resilience.supportedModes.includes("degraded-federation")
    ) {
      issues.push({
        severity: "P0",
        moduleId: m.id,
        code: "YUN_RESILIENCE_MISSING",
        message:
          "MÃ³dulo core debe soportar al menos un modo degradado (dominio o federaciÃ³n) para resiliencia.",
      });
    }
  }

  // 4. Todo mÃ³dulo con dominio YUN debe vincularse a ConstituciÃ³n y al menos un ADR
  for (const m of modules) {
    if (m.yun.domain) {
      if (!m.yun.governance.constitutionVersion) {
        issues.push({
          severity: "P1",
          moduleId: m.id,
          code: "YUN_GOV_NO_CONST",
          message:
            "MÃ³dulo con dominio YUN debe indicar versiÃ³n de ConstituciÃ³n YUN aplicada.",
        });
      }
      if (m.yun.governance.adrRefs.length === 0) {
        issues.push({
          severity: "P1",
          moduleId: m.id,
          code: "YUN_GOV_NO_ADR",
          message:
            "MÃ³dulo con dominio YUN debe referenciar al menos un ADR en su gobernanza.",
        });
      }
    }
  }

  // 5. Cada federaciÃ³n debe tener al menos un mÃ³dulo con modo degradado
  for (const fed of REQUIRED_FEDERATIONS) {
    const fedModules = modules.filter((m) => m.yun.federation === fed);
    if (fedModules.length === 0) {
      issues.push({
        severity: "P2",
        moduleId: null,
        code: "YUN_FED_EMPTY",
        message: `FederaciÃ³n ${fed} no tiene ningÃºn mÃ³dulo declarado en el manifiesto.`,
      });
      continue;
    }

    const hasDegradedSupport = fedModules.some((m) =>
      m.yun.resilience.supportedModes.includes("degraded-federation"),
    );

    if (!hasDegradedSupport) {
      issues.push({
        severity: "P1",
        moduleId: null,
        code: "YUN_FED_NO_DEGRADED",
        message: `FederaciÃ³n ${fed} no tiene ningÃºn mÃ³dulo que soporte modo degradado-federation.`,
      });
    }
  }

  // 6. Grafo de dependencias (ciclos simples)
  const idSet = new Set(modules.map((m) => m.id));
  for (const m of modules) {
    for (const dep of m.dependencies) {
      if (!idSet.has(dep)) {
        issues.push({
          severity: "P1",
          moduleId: m.id,
          code: "YUN_DEP_MISSING",
          message: `Dependencia ${dep} declarada en mÃ³dulo ${m.id} no existe en el manifiesto.`,
        });
      }
    }
  }

  return issues;
};

// CLI para CI/CD o bootstrap
if (typeof require !== "undefined" && require.main === module) {
  const issues = validateYunManifest(RDMX_MODULES);
  if (issues.length === 0) {
    console.log("YUN manifest validation: OK");
    process.exit(0);
  }

  for (const issue of issues) {
    const prefix = `[${issue.severity}]`;
    const modPart = issue.moduleId ? `[${issue.moduleId}]` : "[GLOBAL]";
    console.error(`${prefix}${modPart} ${issue.code} :: ${issue.message}`);
  }

  if (issues.some((i) => i.severity === "P0")) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
