/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Evaluator
// Precision, latency, cost, utility, satisfaction, correction rate, coherence.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type { EvaluationMetrics, EvaluationTrend } from "./types";
import { logger } from "../../logger";

export interface Evaluator {
  record(metrics: Omit<EvaluationMetrics, "timestamp">): EvaluationMetrics;
  getHistory(limit: number): EvaluationMetrics[];
  getTrends(): EvaluationTrend[];
  getAggregate(): EvaluationMetrics;
  getAlerts(): Array<{ metric: string; value: number; threshold: number; severity: string }>;
}

const history: EvaluationMetrics[] = [];
const MAX_HISTORY = 5000;

const ALERT_THRESHOLDS = {
  precision: { min: 0.7, severity: "warning" },
  coherence: { min: 0.7, severity: "warning" },
  constitutionalCompliance: { min: 0.9, severity: "critical" },
  securityScore: { min: 0.85, severity: "critical" },
  correctionRate: { max: 0.3, severity: "warning" },
};

function computeTrend(values: number[]): { trend: EvaluationTrend["trend"]; changeRate: number } {
  if (values.length < 2) return { trend: "stable", changeRate: 0 };
  const recent = values.slice(-5);
  const older = values.slice(-10, -5);
  if (older.length === 0) return { trend: "stable", changeRate: 0 };

  const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length;
  const olderAvg = older.reduce((s, v) => s + v, 0) / older.length;
  const changeRate = (recentAvg - olderAvg) / (olderAvg || 1);

  if (changeRate > 0.05) return { trend: "improving", changeRate };
  if (changeRate < -0.05) return { trend: "declining", changeRate };
  return { trend: "stable", changeRate };
}

export function createEvaluator(): Evaluator {
  return {
    record(metrics) {
      const entry: EvaluationMetrics = {
        ...metrics,
        timestamp: Date.now(),
      };
      history.push(entry);
      if (history.length > MAX_HISTORY) history.shift();

      // Check alerts
      for (const [metric, threshold] of Object.entries(ALERT_THRESHOLDS)) {
        const value = (entry as Record<string, number>)[metric];
        if (value === undefined) continue;

        if ("min" in threshold && value < threshold.min) {
          logger.warn({ metric, value, threshold: threshold.min }, "Evaluation alert");
        }
        if ("max" in threshold && value > threshold.max) {
          logger.warn({ metric, value, threshold: threshold.max }, "Evaluation alert");
        }
      }

      return entry;
    },

    getHistory(limit) {
      return history.slice(-limit);
    },

    getTrends() {
      const metricNames = [
        "precision", "latencyMs", "cost", "utility", "satisfaction",
        "correctionRate", "coherence", "memoryRetrievalRate",
        "constitutionalCompliance", "securityScore",
      ];

      return metricNames.map((metric) => {
        const values = history.map((h) => (h as Record<string, number>)[metric] ?? 0);
        const { trend, changeRate } = computeTrend(values);
        return {
          metric,
          values: history.slice(-20).map((h) => ({
            timestamp: h.timestamp,
            value: (h as Record<string, number>)[metric] ?? 0,
          })),
          trend,
          changeRate,
        };
      });
    },

    getAggregate() {
      if (history.length === 0) {
        return {
          precision: 0, latencyMs: 0, cost: 0, utility: 0, satisfaction: 0,
          correctionRate: 0, coherence: 0, memoryRetrievalRate: 0,
          constitutionalCompliance: 0, securityScore: 0, timestamp: Date.now(),
        };
      }

      const n = history.length;
      const sum = (field: keyof EvaluationMetrics) =>
        history.reduce((s, h) => s + ((h[field] as number) ?? 0), 0) / n;

      return {
        precision: sum("precision"),
        latencyMs: sum("latencyMs"),
        cost: sum("cost"),
        utility: sum("utility"),
        satisfaction: sum("satisfaction"),
        correctionRate: sum("correctionRate"),
        coherence: sum("coherence"),
        memoryRetrievalRate: sum("memoryRetrievalRate"),
        constitutionalCompliance: sum("constitutionalCompliance"),
        securityScore: sum("securityScore"),
        timestamp: Date.now(),
      };
    },

    getAlerts() {
      const alerts: Array<{ metric: string; value: number; threshold: number; severity: string }> = [];
      const latest = history[history.length - 1];
      if (!latest) return alerts;

      for (const [metric, threshold] of Object.entries(ALERT_THRESHOLDS)) {
        const value = (latest as Record<string, number>)[metric];
        if (value === undefined) continue;

        if ("min" in threshold && value < threshold.min) {
          alerts.push({ metric, value, threshold: threshold.min, severity: threshold.severity });
        }
        if ("max" in threshold && value > threshold.max) {
          alerts.push({ metric, value, threshold: threshold.max, severity: threshold.severity });
        }
      }

      return alerts;
    },
  };
}
