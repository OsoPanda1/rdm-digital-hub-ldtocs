import type { GeoPoint, ThreatLevel, ConnectionType, TwinType, ComputedMetrics } from "../types"

export interface RegoRule {
  name: string
  description: string
  evaluate(input: RuleInput): boolean
}

export interface RuleInput {
  twin_type: TwinType
  spatial_state: {
    current_position: GeoPoint
    accuracy_radius_meters: number
    altitude_meters: number
    current_geofences: string[]
  }
  network_state: {
    connection_type: ConnectionType
    threat_level: ThreatLevel
    proxy_detected: boolean
  }
  data_origin: {
    confidence_score: number
    location_source: string
  }
  computed_metrics?: ComputedMetrics
  timestamp: number
}

export interface RuleOutput {
  allow: boolean
  alarm_triggered: boolean
  enforce_anonymization: boolean
  violations: string[]
  matched_rules: string[]
}

export const DEFAULT_RULES: RegoRule[] = [
  {
    name: "permitir_comercio_fijo_centro",
    description: "Autorización de nodos comerciales fijos dentro del perímetro histórico validado",
    evaluate: (input) =>
      input.twin_type === "merchant_node" &&
      input.spatial_state.current_geofences.some(z => z === "MX-HGO-RDM-CENTRO") &&
      input.network_state.threat_level === "low" &&
      !input.network_state.proxy_detected,
  },
  {
    name: "permitir_infraestructura_critica_resguardo",
    description: "Flujo crítico de infraestructura autorizado exclusivamente en zonas de resguardo minero",
    evaluate: (input) =>
      input.twin_type === "critical_infrastructure" &&
      input.spatial_state.current_geofences.some(z => z === "MX-HGO-RDM-MINAS") &&
      input.data_origin.confidence_score >= 0.95,
  },
  {
    name: "alarma_violacion_geofencing_critico",
    description: "Disparo de alarma por violación de geofencing crítico (escape o abandono de activo)",
    evaluate: (input) =>
      input.twin_type === "critical_infrastructure" &&
      input.spatial_state.current_geofences.length > 0 &&
      !input.spatial_state.current_geofences.some(z => z === "MX-HGO-RDM-MINAS"),
  },
  {
    name: "anomalia_cinetica_teletransportacion",
    description: "Detección de anomalía cinética por velocidad imposible (>41.6 m/s = 150 km/h)",
    evaluate: (input) => {
      if (!input.computed_metrics) return false
      const { calculated_velocity_mps, time_delta_seconds } = input.computed_metrics
      return time_delta_seconds > 0 && calculated_velocity_mps > 41.6
    },
  },
  {
    name: "anonimizacion_obligatoria_confianza_baja",
    description: "Anonimización obligatoria por confianza baja en dispositivo turístico",
    evaluate: (input) =>
      input.twin_type === "smart_tourism_twin" &&
      input.data_origin.confidence_score < 0.70,
  },
  {
    name: "anonimizacion_obligatoria_amenaza_red",
    description: "Anonimización obligatoria por nivel de amenaza de red alto o crítico",
    evaluate: (input) =>
      input.network_state.threat_level === "high" || input.network_state.threat_level === "critical",
  },
]

export class SpatialRulesEngine {
  private rules: RegoRule[] = []

  constructor(rules: RegoRule[] = DEFAULT_RULES) {
    this.rules = rules
  }

  evaluate(input: RuleInput): RuleOutput {
    const output: RuleOutput = {
      allow: false,
      alarm_triggered: false,
      enforce_anonymization: false,
      violations: [],
      matched_rules: [],
    }

    for (const rule of this.rules) {
      try {
        const matched = rule.evaluate(input)
        if (matched) {
          output.matched_rules.push(rule.name)

          if (rule.name.startsWith("permitir")) {
            output.allow = true
          }
          if (rule.name.startsWith("alarma") || rule.name.startsWith("anomalia")) {
            output.alarm_triggered = true
            output.violations.push(`Regla "${rule.name}" activada: ${rule.description}`)
          }
          if (rule.name.startsWith("anonimizacion")) {
            output.enforce_anonymization = true
          }
        }
      } catch {
        continue
      }
    }

    return output
  }

  addRule(rule: RegoRule): void {
    this.rules.push(rule)
  }

  removeRule(name: string): void {
    this.rules = this.rules.filter(r => r.name !== name)
  }

  getRules(): RegoRule[] {
    return [...this.rules]
  }
}
