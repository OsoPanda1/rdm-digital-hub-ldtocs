/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { DomainSummary, ModuleState } from "@/lib/types/operativo";

export const OPERATIVE_MODULES: ModuleState[] = [
  {
    id: "fusion-ecosystem",
    name: "FusiÃ³n funcional RDMÂ·X",
    domain: "frontend",
    status: "done",
    completion: 96,
    route: "/fusion",
    spec: "RDM-Digital-X/src/data/fusion-repos.ts",
    notes:
      "La pÃ¡gina /fusion lista repos fuente, mejoras absorbidas, capacidades y rutas ejecutables.",
  },
  {
    id: "node-zero-command",
    name: "Command Center Nodo Cero",
    domain: "frontend",
    status: "done",
    completion: 94,
    route: "/",
    spec: "src/components/NodoCeroCommandCenter.tsx",
    notes:
      "Se renderiza en home y en Fusion con KPIs, protocolo y bitÃ¡cora de absorciÃ³n.",
  },
  {
    id: "tamv-status",
    name: "Estado MSR / Nodo Cero",
    domain: "tamv",
    status: "done",
    completion: 90,
    route: "/tamv/status",
    spec: "RDM-Digital-X/src/pages/TAMVStatus.tsx",
    notes:
      "Consulta /api/tamv/msr/status y cae a snapshot soberano si el backend estÃ¡ offline.",
  },
  {
    id: "tamv-api-explorer",
    name: "Explorador de API TAMV",
    domain: "tamv",
    status: "done",
    completion: 88,
    route: "/tamv/api",
    spec: "RDM-Digital-X/src/pages/TAMVApiExplorer.tsx",
    notes:
      "Prueba endpoints de identidad, gobernanza, economÃ­a, IA y MSR con fallback auditable.",
  },
  {
    id: "tamv-thesis",
    name: "Tesis soberana TAMV",
    domain: "knowledge",
    status: "done",
    completion: 92,
    route: "/tamv/thesis",
    spec: "RDM-Digital-X/src/data/tamv-thesis.ts",
    notes:
      "Integra anclajes, pilares, federaciones, capas, RFCs y madurez del Nodo Cero.",
  },
  {
    id: "territorial-twin",
    name: "Gemelo territorial y mapa vivo",
    domain: "geointel",
    status: "in-progress",
    completion: 82,
    route: "/mapa",
    spec: "real-del-monte-twin",
    notes:
      "POIs, riesgos, rutas y telemetrÃ­a se exponen en mapa, dashboard y capa soberana.",
  },
  {
    id: "commerce-phoenix",
    name: "EconomÃ­a Phoenix 20/30/50",
    domain: "economy",
    status: "in-progress",
    completion: 78,
    route: "/negocios",
    spec: "tamv-sovereign-hub + rdm-turismodigital",
    notes:
      "Onboarding, catÃ¡logo, tiers y donativos listos para proveedores transaccionales reales.",
  },
  {
    id: "isabella-realito",
    name: "Isabella / REALITO contextual",
    domain: "ai",
    status: "done",
    completion: 89,
    route: "/admin/isabella",
    spec: "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
    notes:
      "Asistente flotante, corpus RDM y motor Isabella conectan memoria cultural con recomendaciones.",
  },
  {
    id: "smart-city-os",
    name: "Smart City OS / telemetrÃ­a",
    domain: "platform",
    status: "in-progress",
    completion: 72,
    route: "/admin/telemetry",
    spec: "rdm-smart-city-os",
    notes:
      "Fases de conectividad, sensores, saturaciÃ³n y cuidado patrimonial preparadas para operaciÃ³n municipal.",
  },
  {
    id: "federated-memory",
    name: "Memoria federada auditable",
    domain: "knowledge",
    status: "done",
    completion: 93,
    route: "/corpus",
    spec: "citemesh-roots + BookPI",
    notes:
      "El corpus, la enciclopedia y la bitÃ¡cora de repos reducen dispersiÃ³n entre repositorios.",
  },
];

export function summarizeByDomain(
  modules: ModuleState[] = OPERATIVE_MODULES,
): DomainSummary[] {
  const map = new Map<string, DomainSummary>();

  for (const module of modules) {
    const current = map.get(module.domain) ?? {
      domain: module.domain,
      total: 0,
      done: 0,
      inProgress: 0,
      design: 0,
      completion: 0,
    };

    current.total += 1;
    if (module.status === "done") current.done += 1;
    if (module.status === "in-progress") current.inProgress += 1;
    if (module.status === "design") current.design += 1;
    current.completion += module.completion;
    map.set(module.domain, current);
  }

  return Array.from(map.values()).map((domain) => ({
    ...domain,
    completion: Math.round(domain.completion / Math.max(1, domain.total)),
  }));
}

export function overallCompletion(
  modules: ModuleState[] = OPERATIVE_MODULES,
): number {
  if (!modules.length) return 0;
  return Math.round(
    modules.reduce((sum, module) => sum + module.completion, 0) /
      modules.length,
  );
}
