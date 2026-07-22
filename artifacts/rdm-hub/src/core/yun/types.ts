/**
 * YUN Architecture — Core Types
 * Real del Monte Digital Hub
 *
 * Immutable types for the YUN governance model.
 * These are constitutional constants, not recommendations.
 *
 * UNIFIED FEDERATION MODEL: Uses Fed1-Fed7 standard (fed1_commerce_local ... fed7_metaverse_xr)
 * This aligns with ADR-004 Heptafederation and the rdmxManifest module registry.
 */

// ============================================================================
// YUN DOMAINS (5 architectural layers)
// ============================================================================

export const YUN_DOMAINS = ['identity', 'commerce', 'knowledge', 'telemetry', 'gameplay'] as const;
export type YunDomain = (typeof YUN_DOMAINS)[number];

// ============================================================================
// YUN FEDERATIONS (7 organizational units) — Canonical Fed1-Fed7
// ============================================================================

export const YUN_FEDERATIONS = [
  'fed1_commerce_local',
  'fed2_tourism_culture',
  'fed3_academia_science',
  'fed4_local_government',
  'fed5_tech_infra',
  'fed6_community_orgs',
  'fed7_metaverse_xr',
] as const;
export type YunFederation = (typeof YUN_FEDERATIONS)[number];

// ============================================================================
// FEDERATION ALIASES (for backwards compatibility with TAMV GEN-7 names)
// ============================================================================

export const FEDERATION_ALIASES: Record<string, YunFederation> = {
  // TAMV GEN-7 names → Fed standard
  'DEKATEOTL': 'fed1_commerce_local',
  'ANUBIS': 'fed2_tourism_culture',
  'BOOKPI_DATAGIT': 'fed3_academia_science',
  'PHOENIX': 'fed4_local_government',
  'MDD_TAMV': 'fed5_tech_infra',
  'KAOS_HYPERRENDER': 'fed6_community_orgs',
  'CHRONOS': 'fed7_metaverse_xr',
  // Spanish names → Fed standard
  'comercio': 'fed1_commerce_local',
  'turismo_cultura': 'fed2_tourism_culture',
  'academia': 'fed3_academia_science',
  'gobierno': 'fed4_local_government',
  'tech_infra': 'fed5_tech_infra',
  'comunidad': 'fed6_community_orgs',
  'metaverso_xr': 'fed7_metaverse_xr',
} as const;

export function resolveFederation(input: string): YunFederation | null {
  return FEDERATION_ALIASES[input as keyof typeof FEDERATION_ALIASES] ?? null;
}

// ============================================================================
// DATA CLASSIFICATION (4 levels)
// ============================================================================

export const DATA_CLASSIFICATIONS = ['public', 'internal', 'confidential', 'restricted'] as const;
export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];

// ============================================================================
// STORAGE ENGINES (5 backends)
// ============================================================================

export const STORAGE_ENGINES = ['supabase', 'neon', 'turso', 'd1', 'redis'] as const;
export type StorageEngine = (typeof STORAGE_ENGINES)[number];

// ============================================================================
// DOMAIN → STORAGE MAPPING
// ============================================================================

export const DOMAIN_STORAGE: Record<YunDomain, StorageEngine> = {
  identity: 'supabase',
  commerce: 'neon',
  knowledge: 'turso',
  telemetry: 'd1',
  gameplay: 'redis',
} as const;

// ============================================================================
// FEDERATION → DOMAIN OWNERSHIP (aligned with Fed1-Fed7)
// ============================================================================

export const FEDERATION_DOMAINS: Record<YunFederation, YunDomain[]> = {
  fed1_commerce_local: ['commerce'],
  fed2_tourism_culture: ['knowledge'],
  fed3_academia_science: ['knowledge'],
  fed4_local_government: ['identity', 'telemetry'],
  fed5_tech_infra: ['telemetry', 'identity'],
  fed6_community_orgs: ['knowledge', 'gameplay'],
  fed7_metaverse_xr: ['gameplay'],
} as const;

// ============================================================================
// YUN EVENT TYPES (Constitutional event naming)
// Pattern: yun.{domain}.{entity}.{action} | yun.{system|federation}.{event}
// ============================================================================

export type YunEventType =
  | `yun.${string}.${string}.created`
  | `yun.${string}.${string}.updated`
  | `yun.${string}.${string}.deleted`
  | `yun.${string}.${string}.archived`
  | `yun.system.health`
  | `yun.system.mode-changed`
  | `yun.system.overload`
  | `yun.federation.degraded`
  | `yun.federation.recovered`
  | `yun.domain.sync`
  | `yun.${string}.federation_intent`
  | `yun.${string}.emotional_insight`
  | `yun.${string}.territorial_data_ingest`
  | `yun.${string}.territorial_heartbeat`
  | `yun.${string}.zone_update`
  | `yun.${string}.phygital_opportunity`
  | `yun.${string}.guardian_action`
  | `yun.${string}.sovereignty_alert`
  | `yun.${string}.yun_domain_event`
  | `yun.isabella.voice.speak`
  | `yun.isabella.voice.log`;

// ============================================================================
// YUN EVENT STANDARD (per 06-event-standard.md & ADR-002)
// Canonical event shape: event_type, domain, federation_id, entity_id, trace_id, timestamp, severity, payload
// ============================================================================

export type YunEventSeverity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface YunEventPayload {
  // Payload MUST be controlled, no raw PII.
  // Use small objects with specific fields.
  [key: string]: unknown;
}

/**
 * Canonical YUN Event — the nervous system standard.
 * All domain events, federation events, and system events MUST conform to this shape.
 */
export interface YunEvent {
  event_type: string;          // e.g., "commerce.payment.initiated"
  domain: YunDomain;           // identity, commerce, knowledge, telemetry, gameplay
  federation_id: YunFederation | null; // Fed1–Fed7 or null for cross-cutting
  entity_id: string;           // Logical ID of affected entity
  trace_id: string;            // Cross-service traceability
  timestamp: string;           // ISO 8601 with ms precision
  severity: YunEventSeverity;
  payload: YunEventPayload;
}

/**
 * Creates a YUN-compliant event with timestamp auto-filled.
 */
export function createYunEvent(params: Omit<YunEvent, 'timestamp'>): YunEvent {
  return {
    ...params,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates a YUN event from a domain/entity action.
 */
export function createDomainEvent(
  domain: YunDomain,
  entity: string,
  action: 'created' | 'updated' | 'deleted' | 'archived',
  entityId: string,
  traceId: string,
  payload: YunEventPayload,
  options: {
    federation?: YunFederation | null;
    severity?: YunEventSeverity;
  } = {}
): YunEvent {
  return createYunEvent({
    event_type: `${domain}.events.${entity}_${action}`,
    domain,
    federation_id: options.federation ?? null,
    entity_id: entityId,
    trace_id: traceId,
    severity: options.severity ?? 'INFO',
    payload,
  });
}

// ============================================================================
// YUN EVENT ENVELOPE (internal bus transport wrapper)
// ============================================================================

export interface YunEventEnvelope<T = unknown> {
  id: string;
  type: YunEventType;
  source: string;
  timestamp: string;
  data: T;
  metadata: {
    version: string;
    correlationId?: string;
    causationId?: string;
    federation?: YunFederation;
    domain?: YunDomain;
    classification?: DataClassification;
  };
}

// ============================================================================
// YUN DATA CATALOG ENTRY
// ============================================================================

export interface YunDataCatalogEntry {
  domain: YunDomain;
  entity: string;
  owner_federation: YunFederation;
  data_class: DataClassification;
  storage: StorageEngine;
  retention_days: number;
  pii_fields: string[];
  created_at: string;
}

// ============================================================================
// YUN GATEWAY CONFIG
// ============================================================================

export interface YunGatewayConfig {
  rateLimit: {
    windowMs: number;
    maxPerWindow: number;
    maxPerUser: number;
  };
  circuitBreaker: {
    failureThreshold: number;
    resetTimeoutMs: number;
    halfOpenMax: number;
  };
  tls: {
    minVersion: 'TLSv1.2' | 'TLSv1.3';
    ciphers: string[];
  };
}

// ============================================================================
// YUN FEDERATION HEALTH
// ============================================================================

export interface YunFederationHealth {
  federation: YunFederation;
  status: 'healthy' | 'degraded' | 'critical' | 'offline';
  health_score: number;
  last_heartbeat: string;
  active_domains: YunDomain[];
  error_rate: number;
  p99_latency_ms: number;
}

// ============================================================================
// YUN OBSERVABILITY
// ============================================================================

export interface YunMetric {
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: string;
}

export interface YunLogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context: Record<string, unknown>;
  timestamp: string;
  trace_id?: string;
  span_id?: string;
}

export interface YunTraceSpan {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  name: string;
  start_time: string;
  end_time?: string;
  status: 'ok' | 'error' | 'unset';
  attributes: Record<string, string>;
}

// ============================================================================
// YUN ADR (Architecture Decision Record)
// ============================================================================

export interface YunADR {
  id: string;
  title: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  date: string;
  authors: string[];
  context: string;
  decision: string;
  consequences: string[];
  superseded_by?: string;
}

// ============================================================================
// YUN RESILIENCE MODES
// ============================================================================

export type ResilienceMode = 'normal' | 'degraded-domain' | 'degraded-federation';

export interface YunResilienceConfig {
  supportedModes: ResilienceMode[];
  degradedBehavior: string;
}

// ============================================================================
// YUN GOVERNANCE
// ============================================================================

export interface YunGovernanceConfig {
  constitutionVersion: string;
  adrRefs: string[];
}

// ============================================================================
// YUN BINDING (module → domain/federation/events)
// ============================================================================

export interface YunBinding {
  domain: YunDomain | null;
  federation: YunFederation | null;
  events: {
    produces: string[];
    consumes: string[];
  };
  sensitivity: 'P0' | 'P1' | 'P2';
  resilience: YunResilienceConfig;
  governance: YunGovernanceConfig;
}
