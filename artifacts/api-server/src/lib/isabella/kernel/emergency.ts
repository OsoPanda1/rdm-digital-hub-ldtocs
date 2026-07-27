// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Emergency Protocols
// Emergency shutdown, violation detection, rollback, integrity checks.
// ══════════════════════════════════════════════════════════════════════════════

import type { EmergencyLevel, EmergencyState, EmergencyAction } from "./types";
import { logger } from "../../logger";

export interface EmergencyProtocols {
  getState(): EmergencyState;
  trigger(level: EmergencyLevel, reason: string, triggeredBy: string): EmergencyAction[];
  shutdown(reason: string, triggeredBy: string): EmergencyAction[];
  rollback(): boolean;
  clear(): boolean;
  checkIntegrity(): { score: number; issues: string[] };
  onViolation(callback: (state: EmergencyState) => void): void;
}

let state: EmergencyState = {
  level: "none",
  triggeredAt: null,
  reason: null,
  actions: [],
  rollbackAvailable: false,
  systemIntegrity: 1.0,
};

const violationCallbacks: Array<(state: EmergencyState) => void> = [];
const actionLog: EmergencyAction[] = [];

function executeAction(type: EmergencyAction["type"], target: string, executedBy: string): EmergencyAction {
  const action: EmergencyAction = {
    type,
    target,
    timestamp: Date.now(),
    executedBy,
    reversible: type !== "shutdown",
  };

  actionLog.push(action);
  state.actions.push(action);

  logger.warn({
    actionType: type,
    target,
    executedBy,
    level: state.level,
  }, "Emergency action executed");

  return action;
}

export function createEmergencyProtocols(): EmergencyProtocols {
  return {
    getState() {
      return { ...state };
    },

    trigger(level, reason, triggeredBy) {
      const actions: EmergencyAction[] = [];

      // Escalation logic
      if (level === "watch") {
        actions.push(executeAction("alert", "monitoring", triggeredBy));
      } else if (level === "alert") {
        actions.push(executeAction("alert", "all-systems", triggeredBy));
        actions.push(executeAction("degrade", "non-critical-features", triggeredBy));
      } else if (level === "critical") {
        actions.push(executeAction("alert", "all-systems", triggeredBy));
        actions.push(executeAction("degrade", "non-critical-features", triggeredBy));
        actions.push(executeAction("isolate", "external-apis", triggeredBy));
        state.rollbackAvailable = true;
      } else if (level === "shutdown") {
        actions.push(executeAction("alert", "all-systems", triggeredBy));
        actions.push(executeAction("freeze", "all-operations", triggeredBy));
        actions.push(executeAction("isolate", "all-external", triggeredBy));
        actions.push(executeAction("shutdown", "system", triggeredBy));
      }

      state.level = level;
      state.triggeredAt = Date.now();
      state.reason = reason;
      state.systemIntegrity = Math.max(0, state.systemIntegrity - (level === "shutdown" ? 1.0 : level === "critical" ? 0.5 : 0.2));

      // Notify callbacks
      for (const cb of violationCallbacks) {
        try { cb(state); } catch { /* swallow callback errors */ }
      }

      logger.fatal({
        level,
        reason,
        triggeredBy,
        actionsCount: actions.length,
        systemIntegrity: state.systemIntegrity,
      }, "Emergency level changed");

      return actions;
    },

    shutdown(reason, triggeredBy) {
      return this.trigger("shutdown", reason, triggeredBy);
    },

    rollback() {
      if (!state.rollbackAvailable) return false;

      // Revert most recent reversible actions
      const reversibleActions = state.actions.filter((a) => a.reversible).reverse();
      for (const action of reversibleActions.slice(0, 3)) {
        executeAction("rollback", `revert:${action.target}`, "system-rollback");
      }

      state.level = "none";
      state.rollbackAvailable = false;
      state.systemIntegrity = Math.min(1.0, state.systemIntegrity + 0.3);

      logger.info({ rollbackActions: Math.min(3, reversibleActions.length) }, "Emergency rollback completed");
      return true;
    },

    clear() {
      state = {
        level: "none",
        triggeredAt: null,
        reason: null,
        actions: [],
        rollbackAvailable: false,
        systemIntegrity: 1.0,
      };
      logger.info("Emergency state cleared");
      return true;
    },

    checkIntegrity() {
      const issues: string[] = [];

      // Check for recent critical actions
      const recentActions = actionLog.filter(
        (a) => Date.now() - a.timestamp < 3600000, // last hour
      );

      if (recentActions.some((a) => a.type === "shutdown")) {
        issues.push("Recent shutdown detected");
      }
      if (recentActions.filter((a) => a.type === "isolate").length > 3) {
        issues.push("Multiple isolation events in last hour");
      }
      if (state.systemIntegrity < 0.5) {
        issues.push(`System integrity critically low: ${state.systemIntegrity}`);
      }

      return {
        score: state.systemIntegrity,
        issues,
      };
    },

    onViolation(callback) {
      violationCallbacks.push(callback);
    },
  };
}
