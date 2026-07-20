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
export { useGamification, getTierForLevel, getLevelForXp } from './use-gamification';
export type { GamificationProfile, GamificationEvent, GamificationQuest, LeaderboardEntry } from './use-gamification';

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