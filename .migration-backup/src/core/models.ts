/**
 * RDM Digital - Core Models GEN-7+
 * Sistema de Inteligencia Territorial en Tiempo Real
 * Unificado desde: rdm-smart-city-os, citemesh-roots, RDM-Digital-X
 */

// ============================================================================
// TIPOS BASE GEOESPACIALES
// ============================================================================

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// ============================================================================
// ESTADO DEL TURISTA
// ============================================================================

export interface TuristaEstado {
  id: string;
  territory?: string;
  coords: Coordenadas;
  prevCoords?: Coordenadas;
  stayTimeHours: number;
  activityTimestamps: {
    lastInteractionAt: Date;
    firstSeenAt?: Date;
    lastMovementAt?: Date;
  };
  metadata?: {
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    referrer?: string;
    sessionId?: string;
  };
}

// ============================================================================
// DECISIONES ISABELLA
// ============================================================================

export type DecisionLevel = 'CRITICO' | 'ALERTA' | 'INFO' | 'SUGERENCIA';
export type RetentionIntent = 'SAFE_EXIT' | 'UPSELL' | 'DISCOVERY' | 'RETENTION' | 'ENGAGEMENT';
export type TouristPattern = 'EXPLORING' | 'EXITING' | 'IDLE' | 'RETURNING' | 'LINGERING';

export interface ScoreBreakdown {
  total: number;
  factors: Record<string, number>;
  confidence: number;
}

export interface IsabellaDecision {
  traceId: string;
  territory: string;
  level: DecisionLevel;
  retentionIntent: RetentionIntent;
  score: ScoreBreakdown;
  pattern: TouristPattern;
  distanceToExit: number;
  speedMps: number;
  coords: Coordenadas;
  timestamp: Date;
  payload: {
    titulo: string;
    mensaje: string;
    ruta_ar_activada: boolean;
    experiencia_sugerida?: string;
    federacion_destino?: string;
  };
}

// Alias de compatibilidad
export type Decision = IsabellaDecision;

// ============================================================================
// PUNTOS DE INTERES (POI)
// ============================================================================

export type POICategory = 
  | 'historia' 
  | 'cultura' 
  | 'gastronomia' 
  | 'aventura' 
  | 'hospedaje' 
  | 'comercio' 
  | 'servicios';

export interface PointOfInterest {
  id: string;
  name: string;
  category: POICategory;
  coords: Coordenadas;
  /** Coordenadas planas derivadas para compatibilidad con componentes de mapa. */
  lat?: number;
  lng?: number;
  rating: number;
  description: string;
  federacion?: string;
  precioEstimado?: {
    min: number;
    max: number;
    moneda: 'MXN' | 'USD';
  };
  horario?: {
    apertura: string;
    cierre: string;
    diasOperacion: number[];
  };
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ZONAS DE SALIDA (EXIT POINTS)
// ============================================================================

export interface ExitPoint {
  id: string;
  name: string;
  coords: Coordenadas;
  type: 'main' | 'secondary' | 'emergency';
  boundingBox: BoundingBox;
  capacity?: number;
}

// ============================================================================
// SISTEMA HEPTAFEDERADO — YUN Canonical (Fed1–Fed7)
// ============================================================================

/**
 * YUN Canonical Federation IDs (Fed1–Fed7)
 * This is the authoritative federation model per ADR-004.
 * TAMV GEN-7 names are maintained as legacy aliases for backwards compatibility.
 */
export type FederationId =
  | 'fed1_commerce_local'
  | 'fed2_tourism_culture'
  | 'fed3_academia_science'
  | 'fed4_local_government'
  | 'fed5_tech_infra'
  | 'fed6_community_orgs'
  | 'fed7_metaverse_xr';

export type FederationNumber = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';

/**
 * Maps FederationNumber to canonical YUN FederationId
 */
export const FEDERATION_MAP: Record<FederationNumber, FederationId> = {
  F1: 'fed1_commerce_local',
  F2: 'fed2_tourism_culture',
  F3: 'fed3_academia_science',
  F4: 'fed4_local_government',
  F5: 'fed5_tech_infra',
  F6: 'fed6_community_orgs',
  F7: 'fed7_metaverse_xr',
};

/**
 * Canonical domain mapping per YUN Federation
 */
export const FEDERATION_DOMAIN: Record<FederationId, string> = {
  fed1_commerce_local: 'commerce.rdm.tamv',
  fed2_tourism_culture: 'knowledge.rdm.tamv',
  fed3_academia_science: 'knowledge.rdm.tamv',
  fed4_local_government: 'identity.rdm.tamv',
  fed5_tech_infra: 'telemetry.rdm.tamv',
  fed6_community_orgs: 'knowledge.rdm.tamv',
  fed7_metaverse_xr: 'gameplay.rdm.tamv',
};

/**
 * Human-readable names for each federation
 */
export const FEDERATION_NAMES: Record<FederationId, string> = {
  fed1_commerce_local: 'Federación de Comercio Local (Fed1)',
  fed2_tourism_culture: 'Federación de Turismo y Cultura (Fed2)',
  fed3_academia_science: 'Federación de Academia y Ciencia (Fed3)',
  fed4_local_government: 'Federación de Gobierno Local (Fed4)',
  fed5_tech_infra: 'Federación de Tecnología e Infraestructura (Fed5)',
  fed6_community_orgs: 'Federación de Comunidad y Organizaciones (Fed6)',
  fed7_metaverse_xr: 'Federación de Metaverso y XR (Fed7)',
};

/**
 * TAMV GEN-7 Legacy Federation IDs (backwards compatibility)
 * @deprecated Use FederationId (Fed1–Fed7) instead
 */
export type TamvFederationId =
  | 'DEKATEOTL'
  | 'ANUBIS'
  | 'BOOKPI_DATAGIT'
  | 'PHOENIX'
  | 'MDD_TAMV'
  | 'KAOS_HYPERRENDER'
  | 'CHRONOS';

/**
 * Maps TAMV GEN-7 legacy IDs to YUN canonical Fed1–Fed7
 */
export const TAMV_TO_YUN_FEDERATION: Record<TamvFederationId, FederationId> = {
  DEKATEOTL: 'fed1_commerce_local',
  ANUBIS: 'fed2_tourism_culture',
  BOOKPI_DATAGIT: 'fed3_academia_science',
  PHOENIX: 'fed4_local_government',
  MDD_TAMV: 'fed5_tech_infra',
  KAOS_HYPERRENDER: 'fed6_community_orgs',
  CHRONOS: 'fed7_metaverse_xr',
};

/**
 * Maps YUN canonical Fed1–Fed7 to TAMV GEN-7 legacy IDs
 */
export const YUN_TO_TAMV_FEDERATION: Record<FederationId, TamvFederationId> = {
  fed1_commerce_local: 'DEKATEOTL',
  fed2_tourism_culture: 'ANUBIS',
  fed3_academia_science: 'BOOKPI_DATAGIT',
  fed4_local_government: 'PHOENIX',
  fed5_tech_infra: 'MDD_TAMV',
  fed6_community_orgs: 'KAOS_HYPERRENDER',
  fed7_metaverse_xr: 'CHRONOS',
};

/**
 * TAMV GEN-7 legacy names (for display/compatibility)
 * @deprecated Use FEDERATION_NAMES with FederationId instead
 */
export const TAMV_FEDERATION_NAMES: Record<TamvFederationId, string> = {
  DEKATEOTL: 'Federación de Datos (DATA)',
  ANUBIS: 'Federación de Inteligencia (INTEL)',
  BOOKPI_DATAGIT: 'Federación de Seguridad (SEC)',
  PHOENIX: 'Federación de Gobernanza (GOV)',
  MDD_TAMV: 'Federación Económica (ECON)',
  KAOS_HYPERRENDER: 'Federación Visual (VIS)',
  CHRONOS: 'Federación Territorial (TERRITORY)',
};

/**
 * Resolves a federation identifier (legacy or canonical) to canonical YUN FederationId
 */
export function resolveFederationId(input: FederationId | TamvFederationId): FederationId {
  if (input in FEDERATION_DOMAIN) return input as FederationId;
  if (input in TAMV_TO_YUN_FEDERATION) return TAMV_TO_YUN_FEDERATION[input as TamvFederationId];
  return 'fed4_local_government'; // fallback
}

export type FederationStatus = 'ACTIVE' | 'IDLE' | 'DEGRADED' | 'OFFLINE';

export interface FederationModule {
  id: FederationId;
  federationNumber: FederationNumber;
  name: string;
  specialty: string;
  stack: string[];
  role: string;
  status: FederationStatus;
  health: number;
  operationalScore: number;
  lastHeartbeat?: Date;
}

// ============================================================================
// TIPOS DEL CICLO MD-X5
// ============================================================================

export type MDX5Phase = 'RECEIVE' | 'EVALUATE' | 'PLAN' | 'EXECUTE' | 'COMMIT' | 'RECONCILE';

export interface MDX5Intent {
  id: string;
  type: string;
  payload: unknown;
  source: string;
  federation?: FederationId;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
  traceId: string;
}

export interface MDX5Decision {
  intentId: string;
  phase: MDX5Phase;
  approved: boolean;
  timeupVerdict?: TimeUpVerdict;
  reason?: string;
  timestamp: Date;
  traceId: string;
}

// ============================================================================
// TIME UP - GOBERNANZA ÉTICA
// ============================================================================

export type TimeUpVerdict = 'APPROVED' | 'REJECTED' | 'PENDING_HUMAN' | 'PENDING_ISABELLA';

export interface TimeUpPolicy {
  id: string;
  name: string;
  description: string;
  federation: FederationId;
  rule: string;
  severity: 'INFO' | 'ALERTA' | 'CRITICO';
}

export interface LedgerEntry {
  id: string;
  action: string;
  intentId: string;
  federation: FederationId;
  decision: MDX5Decision;
  timestamp: Date;
  traceId: string;
  hash: string;
  prevHash: string;
}

// ============================================================================
// METRICAS Y TELEMETRIA
// ============================================================================

export interface SystemMetrics {
  activeUsers: number;
  placesIndexed: number;
  kernelLatency: number;
  uptime: number;
  intentsProcessed: number;
  decisionsEmitted: number;
  sseConnections: number;
  geoLruSize: number;
  eventsDropped: number;
}

export interface TelemetryEntry {
  id: string;
  label: string;
  status: number;
  specialty: string;
  statusLabel: FederationStatus;
  timestamp: Date;
}

// ============================================================================
// EVENTOS DEL BUS
// ============================================================================

export interface BusEvent<T = unknown> {
  id: string;
  channel: string;
  payload: T;
  timestamp: Date;
  traceId?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

// ============================================================================
// REGLAS DE SCORING
// ============================================================================

export interface ScoreRule {
  id: string;
  name: string;
  weight: number;
  evaluate: (state: TuristaEstado, context: ScoringContext) => number;
}

export interface ScoringContext {
  distanceToNearestExit: number;
  speedMps: number;
  inactivityMinutes: number;
  visitDurationHours: number;
  nearbyPOIs: PointOfInterest[];
  currentZoneSaturation: number;
}

export interface ThresholdConfig {
  critical: number;
  alert: number;
  info: number;
}

// ============================================================================
// CACHE GEOESPACIAL
// ============================================================================

export interface GeoCacheEntry {
  key: string;
  distance: number;
  calculatedAt: Date;
  expiresAt: Date;
}

export interface LRUCacheConfig {
  maxSize: number;
  ttlMs: number;
}

// ============================================================================
// CONTEXTO CIVILIZATORIO (Chronus Engine)
// ============================================================================

export interface ContextoCivilizatorio {
  clima: 'despejado' | 'lluvia' | 'niebla_densa' | 'nublado';
  eventos_activos: string[];
  turistas_concurrentes: number;
  saturacion_zonas: Record<string, number>;
  alertas_activas: string[];
}

// ============================================================================
// CONFIGURACION DEL ORQUESTADOR
// ============================================================================

export interface OrchestratorConfig {
  throttleWindowMs: number;
  minScoreThreshold: number;
  maxQueueSize: number;
  heartbeatIntervalMs: number;
  enableSSE: boolean;
  enableMetrics: boolean;
}

// ============================================================================
// KERNEL OUTPUT
// ============================================================================

export type Intent = 'gastronomia' | 'hospedaje' | 'historia' | 'aventura' | 'cultura' | 'comercio';

export interface KernelOutput {
  intent: Intent;
  recommendations: PointOfInterest[];
  narrative: string;
  confidence: number;
  destinationBrief: string[];
  sources: readonly string[];
  decision?: IsabellaDecision;
}

// ============================================================================
// IDENTIDAD SOBERANA (SSI)
// ============================================================================

export type IdentityStatus = 'PENDING' | 'ACTIVE' | 'REVOKED' | 'RECOVERING' | 'FROZEN';
export type SovereigntyLevel = 'INDIVIDUAL' | 'COMMUNITY' | 'INSTITUTIONAL' | 'FEDERAL';

export interface SovereignIdentity {
  id: string;
  did: string;
  publicKey: string;
  recoveryKeys: string[];
  sovereigntyLevel: SovereigntyLevel;
  status: IdentityStatus;
  nodeId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// NODOS CIVILES (Federacion)
// ============================================================================

export type NodeStatus = 'PROVISIONING' | 'ACTIVE' | 'SUSPENDED' | 'DECOMMISSIONED' | 'QUARANTINED';
export type CertificationLevel = 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4';

export interface CivilNode {
  id: string;
  name: string;
  region: string;
  trustScore: number;
  certificationLevel: CertificationLevel;
  status: NodeStatus;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CONTRATOS SOCIO-TECNICOS
// ============================================================================

export type ContractType = 
  | 'MEMBERSHIP' 
  | 'SERVICE_AGREEMENT' 
  | 'DATA_SHARING' 
  | 'RESOURCE_POOLING' 
  | 'GOVERNANCE' 
  | 'ECONOMIC' 
  | 'SECURITY';

export type ContractStatus = 
  | 'DRAFT' 
  | 'NEGOTIATING' 
  | 'PENDING' 
  | 'ACTIVE' 
  | 'EXPIRED' 
  | 'TERMINATED' 
  | 'DISPUTED';

export interface SocioTechnicalContract {
  id: string;
  type: ContractType;
  title: string;
  description?: string;
  terms: Record<string, unknown>;
  status: ContractStatus;
  partyAId: string;
  partyBId: string;
  validFrom?: Date;
  validUntil?: Date;
  signatures: Array<{
    identityId: string;
    signedAt: Date;
    signature: string;
  }>;
}
