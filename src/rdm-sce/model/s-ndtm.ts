import type {
  SndtState, SpatialState, NetworkState, MobilityState,
  TerritorialState, FederationState, DataOrigin,
  GeoPoint, ConnectionType, ThreatLevel, MotionType,
  ZoneType, LocationSource, SyncMode, FederationId, VectorClock, TwinType,
  ComputedMetrics,
} from "../types"

const FEDERATION_MAX = 7
const MUNICIPALITY_INEGI = "039"
const STATE_INEGI = "13"
const COUNTRY_MX = "MX"

export function createGeoPoint(lon: number, lat: number, alt?: number): GeoPoint {
  const coords: [number, number] | [number, number, number] =
    alt !== undefined ? [lon, lat, alt] : [lon, lat]
  return { type: "Point", coordinates: coords }
}

export function createVectorClock(nodes: string[]): VectorClock {
  const clock: VectorClock = {}
  for (const node of nodes) clock[node] = 0
  return clock
}

export function tickVectorClock(clock: VectorClock, nodeId: string): VectorClock {
  return { ...clock, [nodeId]: (clock[nodeId] || 0) + 1 }
}

export function mergeVectorClocks(local: VectorClock, remote: VectorClock): VectorClock {
  const merged: VectorClock = { ...local }
  for (const [node, ts] of Object.entries(remote)) {
    merged[node] = Math.max(merged[node] || 0, ts)
  }
  return merged
}

export function compareVectorClocks(
  a: VectorClock, b: VectorClock
): "before" | "after" | "concurrent" {
  let aLtB = true, bLtA = true
  const allNodes = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const node of allNodes) {
    const va = a[node] || 0
    const vb = b[node] || 0
    if (va > vb) bLtA = false
    if (vb > va) aLtB = false
  }
  if (aLtB && !bLtA) return "before"
  if (bLtA && !aLtB) return "after"
  return "concurrent"
}

export function validateCoordinates(lon: number, lat: number): boolean {
  return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
}

export function validateConfidence(score: number): boolean {
  return score >= 0.0 && score <= 1.0
}

export function validateFederationId(id: number): id is FederationId {
  return Number.isInteger(id) && id >= 1 && id <= FEDERATION_MAX
}

export function validateHeading(degrees: number): boolean {
  return degrees >= 0 && degrees <= 360
}

export function buildTerritorialState(
  neighborhood: string,
  zoneType: ZoneType,
  localityCode = "0001",
): TerritorialState {
  return {
    country_code: COUNTRY_MX,
    state_code: STATE_INEGI,
    municipality_code: MUNICIPALITY_INEGI,
    locality_code: localityCode,
    neighborhood,
    zone_type: zoneType,
  }
}

export function buildFederationState(
  federationId: FederationId,
  nodeId: string,
  syncMode: SyncMode,
  nodes: string[],
): FederationState {
  return {
    federation_id: federationId,
    node_id: nodeId,
    sync_mode: syncMode,
    vector_clock: createVectorClock(nodes),
  }
}

export function computeMetrics(
  current: { lon: number; lat: number; alt: number; timestamp: number },
  previous?: { lon: number; lat: number; alt: number; timestamp: number },
): ComputedMetrics | undefined {
  if (!previous) return undefined
  const timeDelta = (current.timestamp - previous.timestamp) / 1000
  if (timeDelta <= 0) return undefined
  const dist = haversineDistance(
    [previous.lon, previous.lat],
    [current.lon, current.lat],
  )
  return {
    delta_distance_meters: dist,
    delta_altitude_meters: current.alt - previous.alt,
    calculated_velocity_mps: dist / timeDelta,
    time_delta_seconds: timeDelta,
  }
}

function haversineDistance(a: number[], b: number[]): number {
  const R = 6371000
  const dLat = toRad(b[1] - a[1])
  const dLon = toRad(b[0] - a[0])
  const lat1 = toRad(a[1])
  const lat2 = toRad(b[1])
  const s = Math.sin(dLat / 2)
  const s2 = Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(s * s + Math.cos(lat1) * Math.cos(lat2) * s2 * s2), Math.sqrt(1 - (s * s + Math.cos(lat1) * Math.cos(lat2) * s2 * s2)))
}

function toRad(deg: number): number { return (deg * Math.PI) / 180 }

export function buildSndtState(params: {
  twin_id: string
  twin_type?: TwinType
  lon: number
  lat: number
  altitude?: number
  accuracy?: number
  geofences?: string[]
  ip: string
  asn: number
  isp: string
  connection_type: ConnectionType
  threat_level: ThreatLevel
  proxy: boolean
  motion_type: MotionType
  velocity: number
  heading: number
  trajectory_id: string
  neighborhood: string
  zone_type: ZoneType
  federation_id: FederationId
  node_id: string
  sync_mode: SyncMode
  federation_nodes: string[]
  location_source: LocationSource
  confidence: number
  isabella_policy_id: string
  signature: string
  previous_state?: { lon: number; lat: number; alt: number; timestamp: number }
}): SndtState {
  const now = Date.now()
  const alt = params.altitude ?? 0
  const metrics = computeMetrics(
    { lon: params.lon, lat: params.lat, alt, timestamp: now },
    params.previous_state,
  )
  return {
    twin_id: params.twin_id,
    twin_type: params.twin_type ?? "smart_tourism_twin",
    timestamp: now,
    spatial_state: {
      current_position: createGeoPoint(params.lon, params.lat, params.altitude),
      accuracy_radius_meters: params.accuracy ?? 50,
      altitude_meters: params.altitude ?? 0,
      current_geofences: params.geofences ?? [],
    },
    network_state: {
      resolved_ip: params.ip,
      asn: params.asn,
      isp: params.isp,
      connection_type: params.connection_type,
      threat_level: params.threat_level,
      proxy_detected: params.proxy,
    },
    mobility_state: {
      motion_type: params.motion_type,
      velocity_mps: params.velocity,
      heading_degrees: params.heading,
      trajectory_id: params.trajectory_id,
    },
    territorial_state: buildTerritorialState(params.neighborhood, params.zone_type),
    federation_state: buildFederationState(
      params.federation_id, params.node_id, params.sync_mode, params.federation_nodes
    ),
    data_origin: {
      location_source: params.location_source,
      confidence_score: params.confidence,
      isabella_policy_id: params.isabella_policy_id,
      cryptographic_signature: params.signature,
    },
    computed_metrics: metrics,
  }
}

export function serializeSndtToJson(state: SndtState): string {
  return JSON.stringify(state)
}

export function deserializeSndtFromJson(json: string): SndtState {
  return JSON.parse(json) as SndtState
}

export function cloneSndtState(state: SndtState): SndtState {
  return JSON.parse(JSON.stringify(state))
}
