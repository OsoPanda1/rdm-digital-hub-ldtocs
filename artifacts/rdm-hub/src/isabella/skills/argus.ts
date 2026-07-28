/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { SkillContext, SimulationResult, RiskProfile } from './types';

interface ArgusSimulationInput {
  scenarioDefinition: {
    action: string;
    domain: string;
    target: string;
    parameters: Record<string, unknown>;
  };
  timeHorizon: 'corto' | 'medio' | 'largo';
  dimensions: string[];
  constraints: {
    budget?: number;
    timeline?: number;
    dependencies?: string[];
    assumptions?: string[];
  };
}

const DIMENSION_WEIGHTS: Record<string, { cultural: number; social: number; economic: number; ethical: number; technical: number }> = {
  'politica_publica': { cultural: 0.3, social: 0.4, economic: 0.4, ethical: 0.5, technical: 0.2 },
  'feature_digital': { cultural: 0.2, social: 0.3, economic: 0.3, ethical: 0.3, technical: 0.6 },
  'campana_turistica': { cultural: 0.5, social: 0.4, economic: 0.6, ethical: 0.2, technical: 0.1 },
  'decision_comunidad': { cultural: 0.4, social: 0.5, economic: 0.3, ethical: 0.6, technical: 0.1 },
};

const TIME_ADJUSTMENT: Record<string, number> = {
  corto: 0.8,
  medio: 1.0,
  largo: 1.3,
};

class ArgusEngine {
  private callCount = 0;
  private totalDurationMs = 0;
  private simulationHistory: Array<{ input: string; outcomes: Record<string, number>; actual: Record<string, number> | null }> = [];

  async simulate(input: ArgusSimulationInput, ctx: SkillContext): Promise<{ simulations: SimulationResult[]; riskProfile: RiskProfile[]; recommendations: string[] }> {
    const start = performance.now();
    this.callCount++;

    const weights = DIMENSION_WEIGHTS[input.scenarioDefinition.domain] ?? { cultural: 0.3, social: 0.3, economic: 0.3, ethical: 0.3, technical: 0.3 };
    const timeFactor = TIME_ADJUSTMENT[input.timeHorizon] ?? 1.0;

    const simulations: SimulationResult[] = [];
    const risks: RiskProfile[] = [];

    for (const dim of input.dimensions) {
      const baseProb = (weights[dim as keyof typeof weights] ?? 0.3) * timeFactor;
      const confidence = 0.6 + (input.constraints.assumptions?.length ?? 0) * 0.05;
      const optimism = 0.5 + Math.random() * 0.2;

      simulations.push({
        scenarioId: `sim-${dim}-${Date.now()}`,
        dimension: dim,
        expectedOutcome: this.generateOutcome(dim, input.scenarioDefinition, baseProb),
        probability: Math.round(Math.min(baseProb + optimism * 0.2, 0.95) * 100) / 100,
        confidence: Math.round(Math.min(confidence, 0.95) * 100) / 100,
      });

      if (baseProb < 0.4) {
        risks.push({
          riskId: `risk-${dim}-${Date.now()}`,
          dimension: dim,
          probability: Math.round((1 - baseProb) * 100) / 100,
          severity: baseProb < 0.2 ? 'high' : 'medium',
          type: this.mapDimToRiskType(dim),
          mitigation: this.generateMitigation(dim, input.scenarioDefinition),
        });
      }
    }

    const recommendations = this.buildRecommendations(simulations, risks, input);

    const duration = performance.now() - start;
    this.totalDurationMs += duration;

    return { simulations, riskProfile: risks, recommendations };
  }

  private generateOutcome(dim: string, scenario: ArgusSimulationInput['scenarioDefinition'], prob: number): string {
    const outcomes: Record<string, string[]> = {
      economia: ['Incremento en flujo econÃ³mico local', 'EstabilizaciÃ³n de ingresos turÃ­sticos', 'Aumento en derrama econÃ³mica'],
      cultura: ['Fortalecimiento de identidad local', 'PreservaciÃ³n de patrimonio cultural', 'RevitalizaciÃ³n de tradiciones'],
      etica: ['Cumplimiento de principios isabellinos', 'Transparencia en procesos', 'ParticipaciÃ³n comunitaria'],
      infraestructura: ['Mejora en capacidad de servicio', 'OptimizaciÃ³n de recursos tÃ©cnicos', 'Escalabilidad del sistema'],
      social: ['CohesiÃ³n comunitaria', 'InclusiÃ³n digital', 'DistribuciÃ³n equitativa de beneficios'],
      technical: ['Estabilidad del sistema', 'Mejora en rendimiento', 'ReducciÃ³n de latencia'],
    };
    const dimOutcomes = outcomes[dim] ?? ['Impacto neutral esperado'];
    return dimOutcomes[Math.floor(prob * dimOutcomes.length) % dimOutcomes.length];
  }

  private mapDimToRiskType(dim: string): RiskProfile['type'] {
    const map: Record<string, RiskProfile['type']> = {
      economia: 'economic',
      cultura: 'cultural',
      etica: 'ethical',
      infraestructura: 'technical',
      social: 'social',
      technical: 'technical',
    };
    return map[dim] ?? 'technical';
  }

  private generateMitigation(dim: string, scenario: ArgusSimulationInput['scenarioDefinition']): string {
    const mitigations: Record<string, string> = {
      economia: 'Implementar monitoreo trimestral de indicadores econÃ³micos locales.',
      cultura: 'Establecer consulta con la comunidad antes de implementar cambios culturales.',
      etica: 'Someter la decisiÃ³n a evaluaciÃ³n de LUMEN con supervisiÃ³n humana.',
      infraestructura: 'Realizar pruebas de carga y tener plan de rollback.',
      social: 'Asegurar canales de retroalimentaciÃ³n comunitaria durante la implementaciÃ³n.',
      technical: 'Tener redundancia operativa y plan de contingencia tÃ©cnica.',
    };
    return mitigations[dim] ?? 'Evaluar riesgos adicionales antes de proceder.';
  }

  private buildRecommendations(sims: SimulationResult[], risks: RiskProfile[], input: ArgusSimulationInput): string[] {
    const recs: string[] = [];
    if (risks.length > 1) {
      recs.push('Se recomienda proceder con precauciÃ³n debido a mÃºltiples riesgos identificados.');
    }
    if (sims.some(s => s.probability > 0.7)) {
      recs.push('Las condiciones son favorables para la implementaciÃ³n en el horizonte temporal definido.');
    }
    if (input.timeHorizon === 'largo') {
      recs.push('Establecer hitos intermedios para validar supuestos en el camino.');
    }
    if (input.constraints.dependencies && input.constraints.dependencies.length > 0) {
      recs.push(`Asegurar que las dependencias (${input.constraints.dependencies.join(', ')}) estÃ©n resueltas antes de iniciar.`);
    }
    return recs;
  }

  getStats() {
    return { totalSimulations: this.callCount, historySize: this.simulationHistory.length, avgResponseMs: this.callCount > 0 ? Math.round(this.totalDurationMs / this.callCount) : 0 };
  }
}

export const argus = new ArgusEngine();
