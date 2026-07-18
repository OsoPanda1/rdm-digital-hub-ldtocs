import type {
  SndtState, ConnectionType, ThreatLevel, MotionType,
  ZoneType, LocationSource, FederationId, SyncMode, TwinType,
  IsabellaDecision, IsabellaVerdict,
} from "../types"
import { buildSndtState, computeMetrics } from "../model/s-ndtm"
import { SpatialRulesEngine, type RuleInput } from "../spatial-rules/policies"
import { resolveZone } from "../spatial-rules/semantic-zones"
import { RdmSceFederationBridge } from "./federation-bus"
import { TerritorialBridge } from "./territorial-bridge"
import { IsolationModeManager } from "../degradation/isolation-mode"
import { YunReconciliator } from "../yun/reconciliation"

export interface IngestTelemetryInput {
  twin_id: string
  twin_type?: TwinType
  lon: number
  lat: number
  altitude?: number
  accuracy?: number
  ip: string
  asn?: number
  isp?: string
  connection_type: ConnectionType
  threat_level?: ThreatLevel
  proxy?: boolean
  motion_type: MotionType
  velocity?: number
  heading?: number
  trajectory_id: string
  neighborhood?: string
  zone_type?: ZoneType
  federation_id?: FederationId
  location_source?: LocationSource
  confidence?: number
  previous_lon?: number
  previous_lat?: number
  previous_alt?: number
  previous_timestamp?: number
}

export interface IngestTelemetryOutput {
  state: SndtState
  rules: ReturnType<SpatialRulesEngine["evaluate"]>
  isabella: IsabellaDecision
  zones: string[]
  federations: FederationId[]
  syncMode: SyncMode
  alerts: string[]
}

export class IsabellaCognitiveInterceptor {
  evaluate(context: {
    twin_type: TwinType
    confidence_score: number
    network_risk_level: ThreatLevel
    requested_accuracy: string
    timestamp: number
  }): IsabellaDecision {
    if (context.network_risk_level === "critical" || context.network_risk_level === "high") {
      return {
        policy_id: this.generatePolicyId("DENY_ANONYMIZE", context.timestamp),
        verdict: "DENY_AND_ANONYMIZE",
        applied_mask_bits: 24,
        required_obfuscation: true,
        rationale: "Riesgo crítico de red detectado. Bloqueo inmediato de coordenadas de alta resolución.",
      }
    }

    if (context.twin_type === "smart_tourism_twin" && context.confidence_score < 0.75) {
      return {
        policy_id: this.generatePolicyId("DEGRADE_SPATIAL", context.timestamp),
        verdict: "DEGRADE_SPATIAL_GRANULARITY",
        applied_mask_bits: 24,
        required_obfuscation: true,
        rationale: "Baja puntuación de confianza de origen para dispositivo turístico. Degradación forzada.",
      }
    }

    return {
      policy_id: this.generatePolicyId("ALLOW", context.timestamp),
      verdict: "ALLOW_PURE_RESOLUTION",
      applied_mask_bits: 0,
      required_obfuscation: false,
      rationale: "Cumplimiento estricto de políticas operativas verificado por el ecosistema.",
    }
  }

  private generatePolicyId(prefix: string, ts: number): string {
    return `ISABELLA-POLICY-${prefix}-${ts.toString(16)}`
  }
}

export class RdmSceApiBridge {
  private rulesEngine: SpatialRulesEngine
  private federationBridge: RdmSceFederationBridge
  private territorialBridge: TerritorialBridge
  private isolationManager: IsolationModeManager
  private reconciliator: YunReconciliator
  private isabella: IsabellaCognitiveInterceptor

  constructor(config: { nodeId: string }) {
    this.rulesEngine = new SpatialRulesEngine()
    this.federationBridge = new RdmSceFederationBridge({
      nodeId: config.nodeId,
      federationCount: 7,
    })
    this.territorialBridge = new TerritorialBridge()
    this.isolationManager = new IsolationModeManager()
    this.reconciliator = new YunReconciliator()
    this.isabella = new IsabellaCognitiveInterceptor()
  }

  getFederationBridge(): RdmSceFederationBridge { return this.federationBridge }
  getTerritorialBridge(): TerritorialBridge { return this.territorialBridge }
  getRulesEngine(): SpatialRulesEngine { return this.rulesEngine }
  getIsolationManager(): IsolationModeManager { return this.isolationManager }
  getReconciliator(): YunReconciliator { return this.reconciliator }
  getIsabella(): IsabellaCognitiveInterceptor { return this.isabella }

  ingestTelemetry(input: IngestTelemetryInput): IngestTelemetryOutput {
    const fid = input.federation_id ?? this.resolveFederation(input.lon, input.lat)
    const twinType = input.twin_type ?? "smart_tourism_twin"

    const zones = resolveZone(input.lon, input.lat, input.altitude)
      .map(z => z.id)

    const previousState = input.previous_lon !== undefined && input.previous_timestamp
      ? { lon: input.previous_lon, lat: input.previous_lat, alt: input.previous_alt ?? 0, timestamp: input.previous_timestamp }
      : undefined

    const state = buildSndtState({
      twin_id: input.twin_id,
      twin_type: twinType,
      lon: input.lon,
      lat: input.lat,
      altitude: input.altitude ?? 0,
      accuracy: input.accuracy ?? 50,
      geofences: zones,
      ip: input.ip,
      asn: input.asn ?? 0,
      isp: input.isp ?? "desconocido",
      connection_type: input.connection_type,
      threat_level: input.threat_level ?? "low",
      proxy: input.proxy ?? false,
      motion_type: input.motion_type,
      velocity: input.velocity ?? 0,
      heading: input.heading ?? 0,
      trajectory_id: input.trajectory_id,
      neighborhood: input.neighborhood ?? "No especificado",
      zone_type: input.zone_type ?? "urban",
      federation_id: fid,
      node_id: `rdm-sce-${fid}`,
      sync_mode: this.isolationManager.currentMode,
      federation_nodes: [`rdm-sce-1`, `rdm-sce-2`, `rdm-sce-3`, `rdm-sce-4`, `rdm-sce-5`, `rdm-sce-6`, `rdm-sce-7`],
      location_source: input.location_source ?? "ip_core_resolver",
      confidence: input.confidence ?? 0.5,
      isabella_policy_id: "isabella-policy-v1alpha",
      signature: `rdm-sce-${Date.now()}`,
      previous_state: previousState,
    })

    const isabellaDecision = this.isabella.evaluate({
      twin_type: twinType,
      confidence_score: input.confidence ?? 0.5,
      network_risk_level: input.threat_level ?? "low",
      requested_accuracy: state.spatial_state.accuracy_radius_meters <= 10 ? "high_precision" : "approximate",
      timestamp: state.timestamp,
    })

    const ruleInput: RuleInput = {
      twin_type: twinType,
      spatial_state: state.spatial_state,
      network_state: state.network_state,
      data_origin: state.data_origin,
      computed_metrics: state.computed_metrics,
      timestamp: state.timestamp,
    }

    const ruleOutput = this.rulesEngine.evaluate(ruleInput)

    this.federationBridge.feedSndtToFederation(state)
    this.territorialBridge.processSndtState(state)

    const alerts: string[] = []
    if (ruleOutput.alarm_triggered) {
      alerts.push(...ruleOutput.violations)
    }
    if (isabellaDecision.verdict !== "ALLOW_PURE_RESOLUTION") {
      alerts.push(`Isabella AI: ${isabellaDecision.rationale}`)
    }

    return {
      state,
      rules: ruleOutput,
      isabella: isabellaDecision,
      zones,
      federations: zones.length > 0
        ? (resolveZone(input.lon, input.lat, input.altitude)
            .flatMap(z => z.federationIds) as FederationId[])
        : [fid],
      syncMode: this.isolationManager.currentMode,
      alerts,
    }
  }

  private resolveFederation(lon: number, lat: number): FederationId {
    const zones = resolveZone(lon, lat)
    if (zones.length > 0) {
      const primaryFed = zones[0].federationIds[0]
      return (primaryFed >= 1 && primaryFed <= 7 ? primaryFed : 3) as FederationId
    }
    return 3 as FederationId
  }
}
