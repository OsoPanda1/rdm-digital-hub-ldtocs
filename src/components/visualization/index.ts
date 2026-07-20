// ============================================================================
// Visualization Registry - Central registry for all map/3D/XR components
// ============================================================================

import { UnifiedMap, RDM_BOUNDS, type UseMapOptions } from './UnifiedMap';
import { IsabellaVoiceEngine } from './isabella/IsabellaVoiceEngine';
import { useTelemetry, useMetric } from '@/hooks/useTelemetry';
import { useYunEventBus, useYunPublisher } from '@/hooks/useYunEventBus';
import { useIsabella } from '@/hooks/useIsabella';
import { useIsabellaSSE } from '@/hooks/useIsabellaSSE';
import { useIsabellaVoice } from '@/hooks/useIsabellaVoice';
import { useIsabellaConnectionPool } from '@/hooks/useIsabellaConnectionPool';

// ============================================================================
// Component Registry
// ============================================================================

export const VisualizationComponents = {
  // Maps
  UnifiedMap,
  TerritorialMap: UnifiedMap, // alias for backwards compatibility
  
  // 3D / XR (placeholder for future components)
  // TerrainView: null,
  // BuildingExplorer: null,
  // XRSession: null,
  
  // Voice / AI
  IsabellaVoiceEngine,
  
  // Telemetry
  TelemetryView: () => null, // Will be implemented
  
  // Real-time
  FederationPulse: () => null,
} as const;

// ============================================================================
// Hook Registry
// ============================================================================

export const VisualizationHooks = {
  // Map hooks
  useUnifiedMap: (options: UseMapOptions) => UnifiedMap(options),
  
  // Telemetry
  useTelemetry,
  useMetric,
  
  // YUN Event Bus
  useYunEventBus,
  useYunPublisher,
  useCommerceEvents: () => useYunEventBus({ domain: 'commerce' }),
  useIdentityEvents: () => useYunEventBus({ domain: 'identity' }),
  useKnowledgeEvents: () => useYunEventBus({ domain: 'knowledge' }),
  useTelemetryEvents: () => useYunEventBus({ domain: 'telemetry' }),
  useGameplayEvents: () => useYunEventBus({ domain: 'gameplay' }),
  useFederationEvents: (federation: string) => useYunEventBus({ federation: federation as any }),
  useSystemHealthEvents: () => useYunEventBus({ eventType: 'yun.system.health' }),
  useFederationDegradedEvents: () => useYunEventBus({ eventType: 'yun.federation.degraded' }),
  useFederationRecoveredEvents: () => useYunEventBus({ eventType: 'yun.federation.recovered' }),
  useIsabellaEvents: () => useYunEventBus({ eventType: 'yun.isabella.*' }),
  
  // Isabella
  useIsabella,
  useIsabellaSSE,
  useIsabellaVoice,
  useIsabellaDecisions: () => useIsabellaConnectionPool(),
  useIsabellaTerritorialEvents: () => useIsabellaConnectionPool(),
  useIsabellaSystemHealth: () => useIsabellaConnectionPool(),
  useIsabellaConnectionPool,
  
  // Constants
  RDM_BOUNDS,
} as const;

// ============================================================================
// Map Layer Configurations
// ============================================================================

export const MAP_LAYER_PRESETS = {
  tourism: [
    { id: 'osm', name: 'OpenStreetMap', type: 'base' as const, visible: true },
    { id: 'satellite', name: 'Satélite', type: 'base' as const, visible: false },
    { id: 'poi-markers', name: 'Puntos de Interés', type: 'overlay' as const, visible: true },
    { id: 'routes', name: 'Rutas Turísticas', type: 'overlay' as const, visible: true },
    { id: 'federation-heat', name: 'Calor Federado', type: 'federation' as const, visible: true, opacity: 0.3 },
  ],
  governance: [
    { id: 'osm', name: 'OpenStreetMap', type: 'base' as const, visible: true },
    { id: 'satellite', name: 'Satélite', type: 'base' as const, visible: false },
    { id: 'federation-heat', name: 'Salud Federada', type: 'federation' as const, visible: true, opacity: 0.5 },
    { id: 'realtime-events', name: 'Eventos en Vivo', type: 'realtime' as const, visible: true },
    { id: 'zones', name: 'Zonas de Gobernanza', type: 'overlay' as const, visible: true },
  ],
  commerce: [
    { id: 'osm', name: 'OpenStreetMap', type: 'base' as const, visible: true },
    { id: 'satellite', name: 'Satélite', type: 'base' as const, visible: false },
    { id: 'poi-markers', name: 'Comercios', type: 'overlay' as const, visible: true },
    { id: 'heatmap', name: 'Actividad Comercial', type: 'heatmap' as const, visible: true, opacity: 0.4 },
  ],
  adventure: [
    { id: 'topo', name: 'Topográfico', type: 'base' as const, visible: true },
    { id: 'satellite', name: 'Satélite', type: 'base' as const, visible: false },
    { id: 'trails', name: 'Senderos', type: 'overlay' as const, visible: true },
    { id: 'elevation', name: 'Perfil de Elevación', type: 'overlay' as const, visible: false },
    { id: 'poi-markers', name: 'Puntos de Interés', type: 'overlay' as const, visible: true },
  ],
  default: [
    { id: 'osm', name: 'OpenStreetMap', type: 'base' as const, visible: true },
    { id: 'satellite', name: 'Satélite', type: 'base' as const, visible: false },
    { id: 'poi-markers', name: 'Puntos de Interés', type: 'overlay' as const, visible: true },
    { id: 'federation-heat', name: 'Calor Federado', type: 'federation' as const, visible: true, opacity: 0.3 },
  ],
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type { UseMapOptions, MapState, MapPOI, MapLayerConfig } from './UnifiedMap';
export type { TelemetryData } from '@/hooks/useTelemetry';
export type { YunEventMessage, UseYunEventBusOptions } from '@/hooks/useYunEventBus';

// ============================================================================
// Default Export
// ============================================================================

export default {
  components: VisualizationComponents,
  hooks: VisualizationHooks,
  presets: MAP_LAYER_PRESETS,
  bounds: RDM_BOUNDS,
};