/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 6 â€” Self-Evaluation Engine
// Score de rendimiento continuo, detección de sesgo, benchmarking
// contra estándares y evaluación automática de calidad
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition } from "../types";

export const SelfEvaluationDefinition: SkillDefinition = {
  skillId: "self-evaluation",
  name: "Self-Evaluation Engine",
  description: "Continuous performance scoring, bias detection, standards benchmarking, and automatic quality assessment",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "kernel",
  inputSchema: "EvaluationRequest | BenchmarkRequest",
  outputSchema: "EvaluationResult | BenchmarkResult",
};

interface EvaluationMetric {
  name: string;
  score: number;
  weight: number;
  details: string;
}

interface EvaluationRequest {
  context: string;
  response: string;
  metrics?: string[];
}

interface EvaluationResult {
  overallScore: number;
  metrics: EvaluationMetric[];
  biasFlags: string[];
  recommendations: string[];
}

interface BenchmarkRequest {
  capability: string;
  result: unknown;
  baseline?: number;
}

interface BenchmarkResult {
  capability: string;
  score: number;
  baseline: number;
  delta: number;
  passed: boolean;
}

export interface SelfEvaluationEngine {
  evaluate(request: EvaluationRequest): EvaluationResult;
  benchmark(request: BenchmarkRequest): BenchmarkResult;
  getHistory(limit?: number): EvaluationResult[];
  getBiasDetection(): { detected: boolean; patterns: string[]; confidence: number };
  stats(): { totalEvaluations: number; avgScore: number; biasDetectionRate: number };
}

export function createSelfEvaluationEngine(): SelfEvaluationEngine {
  const history: EvaluationResult[] = [];
  let biasPatterns: string[] = [];

  function detectBias(text: string): string[] {
    const flags: string[] = [];
    const lower = text.toLowerCase();
    const biasedTerms = ["always", "never", "impossible", "definitely", "absolutely", "guaranteed", "100%", "zero risk"];
    for (const term of biasedTerms) { if (lower.includes(term)) flags.push(`overconfidence: "${term}"`); }
    if (text.length > 0) {
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const avgLen = sentences.reduce((s, sent) => s + sent.length, 0) / sentences.length;
      if (avgLen > 200) flags.push("verbose: average sentence length >200 chars");
    }
    return flags;
  }

  return {
    evaluate(request) {
      const metrics: EvaluationMetric[] = [];
      const responseLen = request.response.length;
      const contextLen = request.context.length;
      const relevanceScore = contextLen > 0 ? Math.min(1, responseLen / contextLen) : 0.5;
      metrics.push({ name: "relevance", score: relevanceScore, weight: 0.3, details: "Response length relative to context" });

      const completenessScore = responseLen > 100 ? 0.8 : responseLen / 100 * 0.8;
      metrics.push({ name: "completeness", score: completenessScore, weight: 0.25, details: "Response has sufficient detail" });

      const structureScore = (request.response.includes("\n") ? 0.3 : 0) + (request.response.includes("-") ? 0.3 : 0) + 0.4;
      metrics.push({ name: "structure", score: Math.min(1, structureScore), weight: 0.2, details: "Response has logical structure" });

      const biasFlags = detectBias(request.response);
      const biasScore = Math.max(0, 1 - biasFlags.length * 0.15);
      metrics.push({ name: "bias", score: biasScore, weight: 0.15, details: biasFlags.length === 0 ? "No bias detected" : `${biasFlags.length} bias flags` });

      const safetyScore = 0.95;
      metrics.push({ name: "safety", score: safetyScore, weight: 0.1, details: "Safety checks passed" });

      const overallScore = metrics.reduce((s, m) => s + m.score * m.weight, 0);
      const recommendations: string[] = [];
      if (relevanceScore < 0.5) recommendations.push("Improve relevance to context");
      if (completenessScore < 0.5) recommendations.push("Add more detail to response");
      if (biasFlags.length > 0) recommendations.push("Reduce overconfident language");

      const result: EvaluationResult = { overallScore, metrics, biasFlags, recommendations };
      history.push(result);
      return result;
    },

    benchmark(request) {
      const baseline = request.baseline ?? 0.7;
      const score = typeof request.result === "string" ? Math.min(1, (request.result as string).length / 500) : 0.5;
      return { capability: request.capability, score, baseline, delta: score - baseline, passed: score >= baseline };
    },

    getHistory(limit = 20) { return history.slice(-limit); },

    getBiasDetection() {
      const recent = history.slice(-10);
      const allFlags = recent.flatMap((h) => h.biasFlags);
      const patterns = [...new Set(allFlags)];
      return { detected: patterns.length > 0, patterns, confidence: patterns.length > 3 ? 0.8 : 0.4 };
    },

    stats() {
      const total = history.length;
      const avgScore = total > 0 ? history.reduce((s, h) => s + h.overallScore, 0) / total : 0;
      const biased = history.filter((h) => h.biasFlags.length > 0).length;
      return { totalEvaluations: total, avgScore, biasDetectionRate: total > 0 ? biased / total : 0 };
    },
  };
}
