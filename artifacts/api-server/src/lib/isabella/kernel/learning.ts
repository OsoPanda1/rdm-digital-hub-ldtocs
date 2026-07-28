/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Continuous Learning
// Feedback â†’ Evaluation â†’ Error ID â†’ Memory update â†’ Knowledge review â†’ Rules
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type {
  LearningCycle,
  LearningCorrection,
  MemoryUpdate,
  KnowledgeUpdate,
  RuleChange,
  MemoryLevel,
} from "./types";
import { logger } from "../../logger";

export interface ContinuousLearning {
  processFeedback(params: {
    input: string;
    expectedOutput?: string;
    actualOutput: string;
    userId: string;
    rating?: number;
    comment?: string;
  }): LearningCycle;
  getHistory(limit: number): LearningCycle[];
  getErrorPatterns(): Array<{ pattern: string; count: number; lastSeen: number }>;
  getImprovementMetrics(): {
    totalCycles: number;
    averageRating: number;
    correctionRate: number;
    memoryUpdatesCount: number;
    knowledgeUpdatesCount: number;
  };
}

const history: LearningCycle[] = [];
const MAX_HISTORY = 1000;
const errorPatterns = new Map<string, { count: number; lastSeen: number }>();

function classifyErrorType(input: string, expected?: string, actual?: string): string | undefined {
  if (!expected || !actual) return undefined;
  const expectedLower = expected.toLowerCase();
  const actualLower = actual.toLowerCase();

  if (actualLower.length < expectedLower.length * 0.3) return "incomplete-response";
  if (actualLower.includes("no se") || actualLower.includes("i don't know")) return "knowledge-gap";
  if (Math.abs(actualLower.length - expectedLower.length) > expectedLower.length) return "verbose-response";

  return "quality-deviation";
}

function generateCorrections(
  errorType: string | undefined,
  input: string,
  expected?: string,
  actual?: string,
): LearningCorrection[] {
  if (!errorType) return [];
  const corrections: LearningCorrection[] = [];

  switch (errorType) {
    case "incomplete-response":
      corrections.push({
        field: "completeness",
        oldValue: "partial",
        newValue: "full",
        reason: "Response was significantly shorter than expected",
        confidence: 0.8,
      });
      break;
    case "knowledge-gap":
      corrections.push({
        field: "knowledge",
        oldValue: null,
        newValue: input,
        reason: "Knowledge gap identified â€” store for future reference",
        confidence: 0.9,
      });
      break;
    case "verbose-response":
      corrections.push({
        field: "verbosity",
        oldValue: "verbose",
        newValue: "concise",
        reason: "Response was too verbose for the query type",
        confidence: 0.7,
      });
      break;
    case "quality-deviation":
      corrections.push({
        field: "quality",
        oldValue: actual,
        newValue: expected,
        reason: "Output quality deviated from expected baseline",
        confidence: 0.6,
      });
      break;
  }

  return corrections;
}

export function createContinuousLearning(): ContinuousLearning {
  return {
    processFeedback({ input, expectedOutput, actualOutput, userId, rating, comment }) {
      const errorType = classifyErrorType(input, expectedOutput, actualOutput);
      const corrections = generateCorrections(errorType, input, expectedOutput, actualOutput);

      const memoryUpdates: MemoryUpdate[] = corrections
        .filter((c) => c.field === "knowledge")
        .map((c) => ({
          entryId: `auto-${Date.now()}`,
          action: "create" as const,
          level: "L2_project" as MemoryLevel,
          content: String(c.newValue),
        }));

      const knowledgeUpdates: KnowledgeUpdate[] = [];
      const ruleChanges: RuleChange[] = [];

      // Track error patterns
      if (errorType) {
        const existing = errorPatterns.get(errorType);
        if (existing) {
          existing.count++;
          existing.lastSeen = Date.now();
        } else {
          errorPatterns.set(errorType, { count: 1, lastSeen: Date.now() });
        }
      }

      const cycle: LearningCycle = {
        id: `learn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        trigger: rating !== undefined ? "feedback" : "evaluation",
        input,
        expectedOutput,
        actualOutput,
        errorType,
        corrections,
        memoryUpdates,
        knowledgeUpdates,
        ruleChanges,
        timestamp: Date.now(),
      };

      history.push(cycle);
      if (history.length > MAX_HISTORY) history.shift();

      logger.info({
        cycleId: cycle.id,
        errorType,
        correctionsCount: corrections.length,
        userId,
        rating,
      }, "Learning cycle completed");

      return cycle;
    },

    getHistory(limit) {
      return history.slice(-limit);
    },

    getErrorPatterns() {
      return Array.from(errorPatterns.entries())
        .map(([pattern, data]) => ({ pattern, ...data }))
        .sort((a, b) => b.count - a.count);
    },

    getImprovementMetrics() {
      const totalCycles = history.length;
      const ratedCycles = history.filter(() => true); // all cycles have timestamps
      const cyclesWithCorrections = history.filter((c) => c.corrections.length > 0);

      return {
        totalCycles,
        averageRating: 0, // Would need actual ratings stored
        correctionRate: totalCycles > 0 ? cyclesWithCorrections.length / totalCycles : 0,
        memoryUpdatesCount: history.reduce((s, c) => s + c.memoryUpdates.length, 0),
        knowledgeUpdatesCount: history.reduce((s, c) => s + c.knowledgeUpdates.length, 0),
      };
    },
  };
}
