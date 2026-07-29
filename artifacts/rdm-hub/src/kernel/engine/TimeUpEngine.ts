/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
import { logger } from "@/lib/logger";
import type {
  TimeUpPolicy,
  TimeUpVerdict,
  MDX5Intent,
  FederationId,
} from "@/core/models";

interface PolicyResult {
  verdict: TimeUpVerdict;
  policy: TimeUpPolicy;
  reason: string;
}

const TIME_UP_POLICIES: TimeUpPolicy[] = [
  {
    id: "TUP-001",
    name: "No destrucción de memoria civilizatoria",
    description: "F1 (DATA) no puede eliminar físicamente registros históricos. Solo archive lógico.",
    federation: "DEKATEOTL",
    rule: "f1_no_physical_delete",
    severity: "CRITICO",
  },
  {
    id: "TUP-002",
    name: "Toda escritura crítica deja traza en ledger",
    description: "Cada acción crítica debe registrar entrada inmutable en el ledger.",
    federation: "BOOKPI_DATAGIT",
    rule: "every_critical_write_leaves_trace",
    severity: "CRITICO",
  },
  {
    id: "TUP-003",
    name: "No ejecución sin aprobación TIME UP",
    description: "Ninguna federación puede ejecutar acción crítica sin evaluación TIME UP.",
    federation: "PHOENIX",
    rule: "no_execute_without_timeup_approval",
    severity: "CRITICO",
  },
  {
    id: "TUP-004",
    name: "Todo intent debe terminar en commit/reject/abort",
    description: "Cada ciclo MD-X5 debe finalizar con un estado terminal.",
    federation: "PHOENIX",
    rule: "intent_must_terminate",
    severity: "ALERTA",
  },
  {
    id: "TUP-005",
    name: "Control dual en acciones críticas",
    description: "Acciones críticas requieren aprobación de al menos dos federaciones o Isabella + humana.",
    federation: "PHOENIX",
    rule: "dual_control_critical_actions",
    severity: "CRITICO",
  },
  {
    id: "TUP-006",
    name: "No minería de datos personales sin consentimiento",
    description: "F1 no puede extraer datos personales para perfilamiento no consentido.",
    federation: "DEKATEOTL",
    rule: "no_personal_data_mining_without_consent",
    severity: "CRITICO",
  },
  {
    id: "TUP-007",
    name: "Isabella como guardiana cognitiva",
    description: "Decisiones que afectan bienestar humano requieren validación de Isabella AI.",
    federation: "ANUBIS",
    rule: "isabella_cognitive_guardian",
    severity: "CRITICO",
  },
  {
    id: "TUP-008",
    name: "Transparencia económica",
    description: "F5 (ECON) debe registrar toda transacción con trazabilidad completa.",
    federation: "MDD_TAMV",
    rule: "economic_transparency",
    severity: "ALERTA",
  },
  {
    id: "TUP-009",
    name: "Territorio físico no reemplazable por virtual",
    description: "F7 (TERRITORY) no puede aprobar acciones que pongan en riesgo el territorio físico real.",
    federation: "CHRONOS",
    rule: "physical_territory_supremacy",
    severity: "CRITICO",
  },
  {
    id: "TUP-010",
    name: "Visualización ética",
    description: "F6 (VIS) no puede renderizar representaciones que degraden dignidad humana.",
    federation: "KAOS_HYPERRENDER",
    rule: "ethical_visualization",
    severity: "ALERTA",
  },
];

export class TimeUpEngine {
  evaluate(intent: MDX5Intent): PolicyResult[] {
    const results: PolicyResult[] = [];
    const federation = intent.federation;

    for (const policy of TIME_UP_POLICIES) {
      // Las políticas CRITICO siempre aplican; las de federación se filtran.
      if (policy.federation === federation || policy.severity === "CRITICO") {
        const result = this.evaluatePolicy(policy, intent);
        results.push(result);
      }
    }

    return results;
  }

  private evaluatePolicy(policy: TimeUpPolicy, intent: MDX5Intent): PolicyResult {
    const verdict = this.applyRule(policy.rule, intent);

    logger.info("[TIME-UP] Evaluando política", {
      policy: policy.id,
      intent: intent.id,
      federation: intent.federation,
      operation: intent.operation,
      critical: intent.critical,
      verdict,
    });

    return { verdict, policy, reason: this.getReason(verdict, policy) };
  }

  /**
   * Reglas TIME UP basadas en el contexto del intent:
   * - intent.operation: "READ" | "WRITE" | "DELETE" | "EXECUTE" | ...
   * - intent.critical: boolean
   * - intent.affectsHumans: boolean
   * - intent.usesPersonalData: boolean
   * - intent.involvedFederations: FederationId[]
   * - intent.hasLedgerEntry: boolean
   * - intent.requiresHumanApproval: boolean
   * - intent.requiresIsabellaApproval: boolean
   */
  private applyRule(rule: string, intent: MDX5Intent): TimeUpVerdict {
    const {
      operation,
      critical,
      affectsHumans,
      usesPersonalData,
      involvedFederations,
      hasLedgerEntry,
      requiresHumanApproval,
      requiresIsabellaApproval,
    } = intent;

    switch (rule) {
      case "f1_no_physical_delete": {
        if (operation === "DELETE" && critical) {
          // Borrado físico de datos históricos: bloquear salvo excepción explícita.
          return "REJECTED";
        }
        return "APPROVED";
      }

      case "every_critical_write_leaves_trace": {
        if (critical && operation === "WRITE" && !hasLedgerEntry) {
          // Escritura crítica sin traza en ledger: pendiente de humano.
          return "PENDING_HUMAN";
        }
        return "APPROVED";
      }

      case "no_execute_without_timeup_approval": {
        if (operation === "EXECUTE" && critical) {
          // Cualquier ejecución crítica pasa primero por TIME UP: exige al menos
          // un camino de aprobación (Isabella y/o humano).
          if (requiresHumanApproval || requiresIsabellaApproval) {
            return "PENDING_ISABELLA";
          }
          return "REJECTED";
        }
        return "APPROVED";
      }

      case "intent_must_terminate": {
        // Si el intent ya está en estado terminal, aprobamos; si está en ciclo infinito, pendiente.
        if (intent.state === "TERMINAL_COMMIT" || intent.state === "TERMINAL_ABORT" || intent.state === "TERMINAL_REJECT") {
          return "APPROVED";
        }
        return "PENDING_HUMAN";
      }

      case "dual_control_critical_actions": {
        if (critical) {
          const uniqueFeds = new Set<FederationId>(involvedFederations || []);
          const hasDual = uniqueFeds.size >= 2;
          const hasIsabellaAndHuman = requiresHumanApproval && requiresIsabellaApproval;

          if (hasDual || hasIsabellaAndHuman) {
            return "APPROVED";
          }
          return "PENDING_HUMAN";
        }
        return "APPROVED";
      }

      case "no_personal_data_mining_without_consent": {
        if (usesPersonalData && intent.consent !== true) {
          // Minería de datos personales sin consentimiento explícito: bloqueo.
          return "REJECTED";
        }
        return "APPROVED";
      }

      case "isabella_cognitive_guardian": {
        if (affectsHumans && critical) {
          // Decisión que afecta bienestar humano: Isabella debe pronunciarse.
          if (!requiresIsabellaApproval) {
            return "PENDING_ISABELLA";
          }
          // Si Isabella ya aprobó, todavía podemos requerir humano según contexto.
          return requiresHumanApproval ? "PENDING_HUMAN" : "APPROVED";
        }
        return "APPROVED";
      }

      case "economic_transparency": {
        if (intent.federation === "MDD_TAMV" && operation === "WRITE" && critical) {
          // Transacción económica crítica: debe tener ledger y trazabilidad.
          if (!hasLedgerEntry) return "PENDING_HUMAN";
        }
        return "APPROVED";
      }

      case "physical_territory_supremacy": {
        if (intent.federation === "CHRONOS" && affectsHumans && intent.affectsPhysicalTerritory) {
          // Cualquier acción que pueda degradar territorio físico real: escalamos.
          return "PENDING_HUMAN";
        }
        return "APPROVED";
      }

      case "ethical_visualization": {
        if (intent.federation === "KAOS_HYPERRENDER" && intent.visualizationCategory === "DEGRADING") {
          // Render que degrada dignidad humana: bloqueo directo.
          return "REJECTED";
        }
        return "APPROVED";
      }

      default:
        // Por defecto, aprobado pero auditado.
        return "APPROVED";
    }
  }

  getGlobalVerdict(results: PolicyResult[]): TimeUpVerdict {
    if (results.some(r => r.verdict === "REJECTED")) return "REJECTED";
    if (results.some(r => r.verdict === "PENDING_HUMAN")) return "PENDING_HUMAN";
    if (results.some(r => r.verdict === "PENDING_ISABELLA")) return "PENDING_ISABELLA";
    return "APPROVED";
  }

  private getReason(verdict: TimeUpVerdict, policy: TimeUpPolicy): string {
    if (verdict === "APPROVED") return `TIME UP: ${policy.name} aprobada`;
    if (verdict === "PENDING_ISABELLA") return `TIME UP: ${policy.name} requiere validación de Isabella`;
    if (verdict === "PENDING_HUMAN") return `TIME UP: ${policy.name} requiere intervención humana`;
    return `TIME UP: ${policy.name} rechazada`;
  }
}

export const timeUpEngine = new TimeUpEngine();
