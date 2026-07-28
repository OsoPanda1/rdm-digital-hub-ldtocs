/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { ScoreInput } from "@/core/engine/scoring.engine";

export interface ScoreRule {
  name: string;
  evaluate(input: ScoreInput): number;
}

export class ThresholdRule implements ScoreRule {
  constructor(
    public name: string,
    private score: number,
    private predicate: (input: ScoreInput) => boolean,
  ) {}

  evaluate(input: ScoreInput): number {
    return this.predicate(input) ? this.score : 0;
  }
}
