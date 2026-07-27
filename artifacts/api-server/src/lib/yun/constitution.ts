// ────────────────────────────────────────────────────────────────
// YUN Constitution — Immutable Principles (ADR-YUN-0001)
// These rules are enforced at runtime by the Policy Engine
// ────────────────────────────────────────────────────────────────

import type { YunDomain, FederationId, PolicyRule, SensitivityLevel } from "./types";

// ── 8 Constitutional Principles ────────────────────────────────
export const CONSTITUTION_PRINCIPLES = [
  {
    id: "CP-001",
    name: "Soberanía del Dato",
    rule: "Una sola verdad coherente por dominio. Replicación nunca contradice la verdad local.",
    prohibit: ["Ningún dominio puede ser escrito por otro dominio sin explícita autorización.", "No existen verdades paralelas por dominio."],
  },
  {
    id: "CP-002",
    name: "Desacoplamiento Reactivo",
    rule: "Eventos primero. Acoplamiento directo solo si es inevitable y documentado en ADR.",
    prohibit: ["No se hacen llamadas directas entre dominios sin pasar por el bus de eventos.", "No se ocultan dependencias."],
  },
  {
    id: "CP-003",
    name: "Seguridad Transparente (Zero Trust)",
    rule: "Secretos fuera del código. Cada interacción se valida por identidad, contexto y política.",
    prohibit: ["No se almacenan secretos en código fuente.", "No se asume confianza sin evidencia."],
  },
  {
    id: "CP-004",
    name: "Resiliencia Degradable",
    rule: "El sistema no colapsa completamente. Se degrada preservando identidad, memoria y señal mínima.",
    prohibit: ["No se apaga todo el sistema.", "No se pierde identidad o memoria en degradación."],
  },
  {
    id: "CP-005",
    name: "Gobernanza Documentada",
    rule: "Toda decisión relevante se registra como ADR. YUN las lee como parte de su modelo de mundo.",
    prohibit: ["No se hacen cambios arquitectónicos sin ADR.", "No se ignoran ADRs fundacionales."],
  },
  {
    id: "CP-006",
    name: "Observabilidad Obligatoria",
    rule: "Ningún servicio es desplegable sin instrumentación. Toda operación registra telemetría.",
    prohibit: ["No se despliegan servicios sin trazabilidad.", "No se eliminan logs de auditoría."],
  },
  {
    id: "CP-007",
    name: "Gobernanza Federada",
    rule: "Cambios al SOUL requieren quorum 5/7. Skills nuevos en cuarentena hasta aprobación FED-3.",
    prohibit: ["No se modifica el SOUL sin quorum.", "No se activan skills sin aprobación."],
  },
  {
    id: "CP-008",
    name: "Neutralidad Epistémica",
    rule: "Isabella no impone verdades. Presenta evidencias, señala contradicciones, deja juicio humano.",
    prohibit: ["Isabella no declara verdades absolutas.", "No sustituye juicio humano vinculante."],
  },
];

// ── Data Sensitivity Rules ─────────────────────────────────────
export const SENSITIVITY_RULES: Record<SensitivityLevel, { description: string; replication: string; encryption: string }> = {
  P0: { description: "Identity/Financial — datos sensibles", replication: "never_raw", encryption: "AES-256-GCM + PQC" },
  P1: { description: "Audit/Reputation — datos operativos", replication: "aggregated_only", encryption: "AES-256-GCM" },
  P2: { description: "Public/Ephemeral — datos públicos", replication: "unrestricted", encryption: "optional" },
};

// ── Domain-to-Database Mapping ─────────────────────────────────
export const DOMAIN_STORAGE: Record<YunDomain, string> = {
  identity: "supabase",
  commerce: "neon",
  knowledge: "turso",
  telemetry: "postgresql",
  gameplay: "redis",
  territorial: "postgresql",
  media: "postgresql",
  cognitive: "postgresql",
};

// ── Default Policy Rules ───────────────────────────────────────
export const DEFAULT_POLICIES: PolicyRule[] = [
  {
    ruleId: "POL-YUN-001",
    name: "Zero Trust Identity",
    domain: "identity",
    effect: "deny",
    conditions: [{ field: "auth.verified", operator: "eq", value: false }],
    priority: 1,
  },
  {
    ruleId: "POL-YUN-002",
    name: "P0 Data No Raw Replication",
    domain: "identity",
    effect: "deny",
    conditions: [{ field: "data.sensitivity", operator: "eq", value: "P0" }, { field: "operation.type", operator: "eq", value: "replicate_raw" }],
    priority: 1,
  },
  {
    ruleId: "POL-YUN-003",
    name: "Constitutional Change Requires Quorum",
    domain: "cognitive",
    effect: "escalate",
    conditions: [{ field: "change.type", operator: "eq", value: "soul_modification" }],
    escalationTarget: "FED-7",
    priority: 1,
  },
  {
    ruleId: "POL-YUN-004",
    name: "New Skills Quarantine",
    domain: "telemetry",
    effect: "escalate",
    conditions: [{ field: "skill.status", operator: "eq", value: "new" }],
    escalationTarget: "FED-3",
    priority: 2,
  },
  {
    ruleId: "POL-YUN-005",
    name: "Emergency Mode Core Preservation",
    domain: "telemetry",
    effect: "allow",
    conditions: [{ field: "yun.mode", operator: "eq", value: "EMERGENCY" }, { field: "service.critical", operator: "eq", value: true }],
    priority: 1,
  },
  {
    ruleId: "POL-YUN-006",
    name: "Emergency Mode Non-Essential Shutdown",
    domain: "telemetry",
    effect: "degrade",
    conditions: [{ field: "yun.mode", operator: "eq", value: "EMERGENCY" }, { field: "service.critical", operator: "eq", value: false }],
    priority: 1,
  },
  {
    ruleId: "POL-YUN-007",
    name: "No Anonymous Events",
    domain: "cognitive",
    effect: "deny",
    conditions: [{ field: "event.traceId", operator: "eq", value: null }],
    priority: 1,
  },
  {
    ruleId: "POL-YUN-008",
    name: "Federation Event Routing",
    domain: "cognitive",
    effect: "allow",
    conditions: [{ field: "event.federationId", operator: "neq", value: null }, { field: "event.signature", operator: "neq", value: null }],
    priority: 2,
  },
];

// ── Quorum Rules ───────────────────────────────────────────────
export const QUORUM_RULES = {
  soulModification: 5,    // 5/7 federaciones
  newSkillApproval: 4,    // 4/7 federaciones
  policyChange: 3,        // 3/7 federaciones
  emergencyAction: 2,     // 2/7 federaciones
  日常Operations: 1,        // 1 federación
  dailyOperations: 1,       // alias (ASCII)
};
