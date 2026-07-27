// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Dynamic Context
// Location, time, weather, events, system state.
// ══════════════════════════════════════════════════════════════════════════════

import type { DynamicContext, ContextEvent, SystemState } from "./types";

export interface DynamicContextEngine {
  getCurrentContext(userId?: string): DynamicContext;
  setTimeOverride(timestamp: number | null): void;
  setLocationOverride(location: DynamicContext["location"] | null): void;
  setSystemStateOverride(state: Partial<SystemState> | null): void;
  addEvent(event: ContextEvent): void;
  removeEvent(eventId: string): void;
}

function getTimeOfDay(hour: number): DynamicContext["timeOfDay"] {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

function getSeason(month: number): DynamicContext["season"] {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// Default: Real del Monte, Hidalgo
const RDM_LOCATION = { lat: 20.1432, lng: -98.6694, name: "Real del Monte, Hidalgo" };

let timeOverride: number | null = null;
let locationOverride: DynamicContext["location"] | null = null;
let systemStateOverride: Partial<SystemState> | null = null;
const events: ContextEvent[] = [];

const systemState: SystemState = {
  mode: "NORMAL",
  uptime: 0,
  activeUsers: 0,
  pendingTasks: 0,
  systemLoad: 0,
  lastSecurityCheck: Date.now(),
};

export function createDynamicContextEngine(): DynamicContextEngine {
  return {
    getCurrentContext(_userId) {
      const now = timeOverride ?? Date.now();
      const date = new Date(now);
      const hour = date.getHours();
      const month = date.getMonth() + 1;

      // Filter active events
      const activeEvents = events.filter(
        (e) => e.startDate <= now && e.endDate >= now,
      );

      return {
        location: locationOverride ?? RDM_LOCATION,
        timestamp: now,
        timeOfDay: getTimeOfDay(hour),
        season: getSeason(month),
        events: activeEvents.length > 0 ? activeEvents : undefined,
        systemState: systemStateOverride
          ? { ...systemState, ...systemStateOverride }
          : systemState,
      };
    },

    setTimeOverride(timestamp) {
      timeOverride = timestamp;
    },

    setLocationOverride(location) {
      locationOverride = location;
    },

    setSystemStateOverride(state) {
      systemStateOverride = state;
    },

    addEvent(event) {
      events.push(event);
    },

    removeEvent(eventId) {
      const idx = events.findIndex((e) => e.id === eventId);
      if (idx >= 0) events.splice(idx, 1);
    },
  };
}
