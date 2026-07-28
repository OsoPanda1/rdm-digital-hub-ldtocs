/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================================
// Hooks Index - Central export for all custom React hooks
// ============================================================================

// Isabella AI hooks
export { useIsabella } from './useIsabella';
export { useIsabellaSSE } from './useIsabellaSSE';
export { useIsabellaVoice } from './useIsabellaVoice';

// Telemetry & Metrics
export { useTelemetry, useMetric } from './useTelemetry';

// YUN Event Bus hooks
export {
  useYunEventBus,
  useYunPublisher,
  useCommerceEvents,
  useIdentityEvents,
  useKnowledgeEvents,
  useTelemetryEvents,
  useGameplayEvents,
  useFederationEvents,
  useSystemHealthEvents,
  useFederationDegradedEvents,
  useFederationRecoveredEvents,
  useIsabellaEvents,
  IsabellaConnectionPool,
  useIsabellaConnectionPool,
} from './useYunEventBus';

// Gamification
export { useGamification } from './use-gamification';
export type { UseGamificationReturn } from './use-gamification';

// Common hooks
export { useWebSocket } from './useWebSocket';
export { useWeather } from './useWeather';
export { useUserRole } from './useUserRole';
export { useTimeTheme } from './useTimeTheme';
export { useSystemMode } from './useSystemMode';
export { usePaginated } from './usePaginated';
export { useCivicEvent } from './useCivicEvent';
export { useApi } from './useApi';
export { useToast } from './use-toast';
export { useDemoMode } from './useDemoMode';
export { useResizeObserver } from './useResizeObserver';