// ────────────────────────────────────────────────────────────────
// YUN Resilience Manager — Progressive Degradation
// Implements CP-004: system degrades gracefully, never crashes.
// ────────────────────────────────────────────────────────────────

import { randomUUID } from "node:crypto";
import type { YunMode, YunDomain, ModeTransition } from "./types";

// ── Degradation Profiles ───────────────────────────────────────

interface DegradationProfile {
  mode: YunMode;
  allowedDomains: YunDomain[];
  allowedActions: string[];
  blockedActions: string[];
  maxEventsPerMin: number;
  replicationEnabled: boolean;
  federationOutbound: boolean;
  podcastEnabled: boolean;
  commerceEnabled: boolean;
  advancedFeaturesEnabled: boolean;
}

const DEGRADATION_PROFILES: Record<YunMode, DegradationProfile> = {
  NORMAL: {
    mode: "NORMAL",
    allowedDomains: ["identity", "commerce", "knowledge", "telemetry", "gameplay", "territorial", "media", "cognitive"],
    allowedActions: ["*"],
    blockedActions: [],
    maxEventsPerMin: 1000,
    replicationEnabled: true,
    federationOutbound: true,
    radioEnabled: true,
    commerceEnabled: true,
    advancedFeaturesEnabled: true,
  },
  SAFE: {
    mode: "SAFE",
    allowedDomains: ["identity", "knowledge", "telemetry", "territorial", "cognitive"],
    allowedActions: ["yun.identity.read", "yun.events.publish", "yun.telemetry.read", "yun.governance.read"],
    blockedActions: ["yun.commerce.*", "yun.gameplay.*", "yun.media.write"],
    maxEventsPerMin: 200,
    replicationEnabled: true,
    federationOutbound: true,
    radioEnabled: true,
    commerceEnabled: false,
    advancedFeaturesEnabled: false,
  },
  EMERGENCY: {
    mode: "EMERGENCY",
    allowedDomains: ["identity", "telemetry"],
    allowedActions: ["yun.identity.read", "yun.identity.write", "yun.telemetry.read"],
    blockedActions: ["yun.commerce.*", "yun.gameplay.*", "yun.media.*", "yun.knowledge.write", "yun.federation.*"],
    maxEventsPerMin: 50,
    replicationEnabled: false,
    federationOutbound: false,
    radioEnabled: true,
    commerceEnabled: false,
    advancedFeaturesEnabled: false,
  },
};

// ── MD-X4 Island Mode Profile ─────────────────────────────────

interface IslandModeServices {
  identityLocal: boolean;
  memorySnapshot: boolean;
  podcastLocal: boolean;
  offlineIsabella: boolean;
  federationSync: boolean;
  telemetryGlobal: boolean;
  livingWorldAdvanced: boolean;
  commerceExternal: boolean;
}

const ISLAND_MODE_SERVICES: IslandModeServices = {
  identityLocal: true,
  memorySnapshot: true,
  podcastLocal: true,
  offlineIsabella: true,
  federationSync: false,
  telemetryGlobal: false,
  livingWorldAdvanced: false,
  commerceExternal: false,
};

// ── Resilience Manager ─────────────────────────────────────────

export class YunResilienceManager {
  private currentMode: YunMode = "NORMAL";
  private transitionHistory: ModeTransition[] = [];
  private eventCounts = new Map<string, { count: number; windowStart: number }>();
  private isIslandMode = false;
  private modeEnteredAt = Date.now();

  constructor(private onTransition?: (transition: ModeTransition) => void) {}

  // ── Mode Management ──────────────────────────────────────────

  getCurrentMode(): YunMode {
    return this.currentMode;
  }

  getProfile(): DegradationProfile {
    return DEGRADATION_PROFILES[this.currentMode];
  }

  transition(to: YunMode, trigger: string): ModeTransition {
    const from = this.currentMode;
    const transition: ModeTransition = {
      from,
      to,
      trigger,
      timestamp: Date.now(),
    };

    this.currentMode = to;
    this.modeEnteredAt = Date.now();
    this.transitionHistory.push(transition);

    // Notify
    if (this.onTransition) this.onTransition(transition);

    return transition;
  }

  // ── Isla MD-X4 Mode ─────────────────────────────────────────

  enterIslandMode(): IslandModeServices {
    this.isIslandMode = true;
    this.transition("EMERGENCY", "MD-X4 disconnected — entering island mode");
    return { ...ISLAND_MODE_SERVICES };
  }

  exitIslandMode(): void {
    this.isIslandMode = false;
    this.transition("NORMAL", "MD-X4 reconnection restored — exiting island mode");
  }

  getIslandModeServices(): IslandModeServices {
    return this.isIslandMode ? { ...ISLAND_MODE_SERVICES } : DEGRADATION_PROFILES.NORMAL as unknown as IslandModeServices;
  }

  // ── OPA Degradation Profiles ─────────────────────────────────

  getOpaDegradationProfile(): {
    status: "healthy" | "degraded" | "unreachable";
    mode: YunMode;
    allowedActions: string[];
    blockedActions: string[];
    notifyIsabella: boolean;
  } {
    const profile = this.getProfile();
    return {
      status: this.currentMode === "NORMAL" ? "healthy" : this.currentMode === "SAFE" ? "degraded" : "unreachable",
      mode: this.currentMode,
      allowedActions: profile.allowedActions,
      blockedActions: profile.blockedActions,
      notifyIsabella: this.currentMode !== "NORMAL",
    };
  }

  // ── Rate Limiting by Domain ──────────────────────────────────

  checkDomainRateLimit(domain: YunDomain): { allowed: boolean; retryAfterMs?: number } {
    const profile = this.getProfile();
    const key = domain;
    const now = Date.now();
    const windowMs = 60_000;

    const bucket = this.eventCounts.get(key);
    if (!bucket || now - bucket.windowStart > windowMs) {
      this.eventCounts.set(key, { count: 1, windowStart: now });
      return { allowed: true };
    }

    if (bucket.count >= profile.maxEventsPerMin) {
      return { allowed: false, retryAfterMs: windowMs - (now - bucket.windowStart) };
    }

    bucket.count++;
    return { allowed: true };
  }

  // ── Action Enforcement ───────────────────────────────────────

  isActionAllowed(action: string): { allowed: boolean; reason: string } {
    const profile = this.getProfile();

    // Check blocked actions first
    for (const blocked of profile.blockedActions) {
      if (blocked === action || (blocked.endsWith(".*") && action.startsWith(blocked.slice(0, -2)))) {
        return { allowed: false, reason: `Action "${action}" blocked in ${this.currentMode} mode.` };
      }
    }

    // In SAFE/EMERGENCY, only explicitly allowed actions permitted
    if (this.currentMode !== "NORMAL") {
      const isAllowed = profile.allowedActions.includes("*") || profile.allowedActions.includes(action);
      if (!isAllowed) {
        return { allowed: false, reason: `Action "${action}" not in allowed list for ${this.currentMode} mode.` };
      }
    }

    return { allowed: true, reason: "OK" };
  }

  // ── Core Preservation Check ──────────────────────────────────

  isCorePreserved(serviceName: string): boolean {
    const coreServices = ["identity", "telemetry", "memory", "podcast-local", "isabella-offline"];
    return coreServices.includes(serviceName);
  }

  // ── History & Stats ──────────────────────────────────────────

  getTransitionHistory(limit = 20): ModeTransition[] {
    return this.transitionHistory.slice(-limit);
  }

  getTimeInCurrentMode(): number {
    return Date.now() - this.modeEnteredAt;
  }

  getResilienceStats(): {
    currentMode: YunMode;
    isIslandMode: boolean;
    timeInModeMs: number;
    transitionCount: number;
    opaStatus: string;
    coreServicesPreserved: string[];
  } {
    return {
      currentMode: this.currentMode,
      isIslandMode: this.isIslandMode,
      timeInModeMs: this.getTimeInCurrentMode(),
      transitionCount: this.transitionHistory.length,
      opaStatus: this.getOpaDegradationProfile().status,
      coreServicesPreserved: ["identity", "telemetry", "memory", "podcast-local", "isabella-offline"],
    };
  }
}
