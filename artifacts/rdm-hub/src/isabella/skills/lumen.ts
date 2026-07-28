/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { SkillContext, LumenDecision, LumenLogEntry, PolicyViolation } from './types';

interface LumenEvaluateInput {
  actionRequest: {
    actionId: string;
    actionType: string;
    target: string;
    payload: Record<string, unknown>;
    initiatedBy: string;
    federationId?: string;
  };
  policyContext: {
    applicablePolicies: string[];
    riskLevel: 'bajo' | 'medio' | 'alto';
  };
}

interface ConstitutionalRule {
  ruleId: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  check: (action: LumenEvaluateInput['actionRequest']) => { violated: boolean; reason: string };
}

const CONSTITUTION: ConstitutionalRule[] = [
  {
    ruleId: 'lumen-001',
    name: 'Amor Computacional',
    description: 'Toda acciÃ³n debe estar alineada con el principio de amor computacional: beneficio para la comunidad y el ecosistema.',
    severity: 'critical',
    check: (action) => {
      const harmful = ['delete', 'destroy', 'ban_all', 'purge_data', 'silence_community'];
      const isHarmful = harmful.some(h => action.actionType.toLowerCase().includes(h));
      return { violated: isHarmful, reason: isHarmful ? 'La acciÃ³n viola el principio de Amor Computacional.' : '' };
    },
  },
  {
    ruleId: 'lumen-002',
    name: 'Dignidad Humana',
    description: 'Ninguna acciÃ³n puede comprometer la dignidad, privacidad o autonomÃ­a de las personas.',
    severity: 'critical',
    check: (action) => {
      const exposes = ['expose_user', 'leak_data', 'track_without_consent'];
      const isExposing = exposes.some(e => action.actionType.toLowerCase().includes(e));
      return { violated: isExposing, reason: isExposing ? 'La acciÃ³n compromete la dignidad humana.' : '' };
    },
  },
  {
    ruleId: 'lumen-003',
    name: 'No Maleficencia',
    description: 'No causar daÃ±o directo o indirecto al ecosistema, la comunidad o los datos.',
    severity: 'critical',
    check: (action) => {
      const harmfulTargets = ['infrastructure:core', 'database:primary', 'identity:root'];
      const isHarmful = harmfulTargets.some(t => action.target.toLowerCase().includes(t));
      return { violated: isHarmful, reason: isHarmful ? 'La acciÃ³n afecta un componente crÃ­tico del ecosistema.' : '' };
    },
  },
  {
    ruleId: 'lumen-004',
    name: 'SoberanÃ­a de Datos',
    description: 'Los datos territoriales no pueden salir del ecosistema TAMV sin consentimiento explÃ­cito.',
    severity: 'high',
    check: (action) => {
      const exportsData = ['export_to_external', 'share_data', 'sync_third_party'];
      const isExport = exportsData.some(e => action.actionType.toLowerCase().includes(e));
      return { violated: isExport, reason: isExport ? 'La acciÃ³n podrÃ­a violar la soberanÃ­a de datos territoriales.' : '' };
    },
  },
  {
    ruleId: 'lumen-005',
    name: 'Consentimiento Territorial',
    description: 'Acciones sobre territorio requieren validaciÃ³n de la federaciÃ³n territorial correspondiente.',
    severity: 'high',
    check: (action) => {
      const territorialActions = ['modify_zone', 'update_heatmap', 'change_geofence', 'broadcast_territorial'];
      const isTerritorial = territorialActions.some(t => action.actionType.toLowerCase().includes(t));
      return { violated: isTerritorial, reason: isTerritorial ? 'Las acciones territoriales requieren consentimiento federado.' : '' };
    },
  },
  {
    ruleId: 'lumen-006',
    name: 'Transparencia',
    description: 'Toda acciÃ³n debe ser registrada y trazable para auditorÃ­a.',
    severity: 'medium',
    check: () => ({ violated: false, reason: '' }),
  },
  {
    ruleId: 'lumen-007',
    name: 'Proporcionalidad',
    description: 'La severidad de la acciÃ³n debe ser proporcional al problema que resuelve.',
    severity: 'medium',
    check: (action) => {
      const drasticActions = ['reset_system', 'disable_federation', 'revoke_all_access'];
      const isDrastic = drasticActions.some(d => action.actionType.toLowerCase().includes(d));
      return { violated: isDrastic, reason: isDrastic ? 'La acciÃ³n parece desproporcionada para la mayorÃ­a de los casos.' : '' };
    },
  },
];

class LumenEngine {
  private log: LumenLogEntry[] = [];
  private callCount = 0;
  private totalDurationMs = 0;
  private blockedCount = 0;
  private escalatedCount = 0;

  async evaluate(input: LumenEvaluateInput, ctx: SkillContext): Promise<LumenDecision> {
    const start = performance.now();
    this.callCount++;

    const violations: PolicyViolation[] = [];
    let maxSeverity: PolicyViolation['severity'] = 'low';

    for (const rule of CONSTITUTION) {
      const result = rule.check(input.actionRequest);
      if (result.violated) {
        violations.push({
          ruleId: rule.ruleId,
          ruleName: rule.name,
          severity: rule.severity,
          description: result.reason,
        });
        const sevOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        if (sevOrder[rule.severity] > sevOrder[maxSeverity]) {
          maxSeverity = rule.severity;
        }
      }
    }

    const decision = this.resolveDecision(maxSeverity, violations.length, input.policyContext.riskLevel);
    const rationale = this.buildRationale(decision, violations, maxSeverity);

    const logEntry: LumenLogEntry = {
      logId: `lumen-${Date.now()}-${ctx.traceId.slice(0, 8)}`,
      actionRequest: input.actionRequest.actionType,
      decision: decision,
      timestamp: ctx.timestamp,
      reviewerId: decision === 'escalar_a_humano' ? null : ctx.userId,
      durationMs: Math.round(performance.now() - start),
    };
    this.log.push(logEntry);

    if (decision === 'bloquear') this.blockedCount++;
    if (decision === 'escalar_a_humano') this.escalatedCount++;

    this.totalDurationMs += performance.now() - start;

    return { decision, rationale, logEntry, violations };
  }

  private resolveDecision(maxSeverity: PolicyViolation['severity'], violationCount: number, riskLevel: string): LumenDecision['decision'] {
    if (maxSeverity === 'critical') return 'bloquear';
    if (maxSeverity === 'high' && violationCount > 1) return 'escalar_a_humano';
    if (maxSeverity === 'high') return 'restringir';
    if (riskLevel === 'alto' && violationCount > 0) return 'escalar_a_humano';
    if (maxSeverity === 'medium' && violationCount > 2) return 'restringir';
    return 'permitir';
  }

  private buildRationale(decision: string, violations: PolicyViolation[], maxSeverity: string): string {
    const parts: string[] = [];
    if (violations.length === 0) {
      parts.push('No se detectaron violaciones a la constituciÃ³n isabellina. AcciÃ³n permitida.');
    } else {
      parts.push(`Se detectaron ${violations.length} violacion(es) de nivel mÃ¡ximo: ${maxSeverity}.`);
      for (const v of violations) {
        parts.push(`- [${v.severity}] ${v.ruleName}: ${v.description}`);
      }
    }
    parts.push(`DecisiÃ³n final: ${decision}.`);
    return parts.join('\n');
  }

  getStats() {
    return {
      totalEvaluations: this.callCount,
      blockedActions: this.blockedCount,
      escalatedActions: this.escalatedCount,
      logSize: this.log.length,
      avgResponseMs: this.callCount > 0 ? Math.round(this.totalDurationMs / this.callCount) : 0,
    };
  }

  getConstitution() {
    return CONSTITUTION.map(r => ({
      ruleId: r.ruleId,
      name: r.name,
      description: r.description,
      severity: r.severity,
    }));
  }
}

export const lumen = new LumenEngine();
