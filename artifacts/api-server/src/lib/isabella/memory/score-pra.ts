// ────────────────────────────────────────────────────────────────
// Isabella Memory — PRA Score (Predictive Relevance Assessment)
// S_i(t) — Score de relevancia predictiva por sesión/recuerdo
// ────────────────────────────────────────────────────────────────

export interface PRAInput {
  queryTime: number;
  lastAccessTime: number;
  accessCount: number;
  relevanceScore: number;
  decayRate?: number;
}

export interface PRAScore {
  score: number;
  components: {
    temporalDecay: number;
    frequencyBoost: number;
    relevanceWeight: number;
  };
  classification: "hot" | "warm" | "cold" | "frozen";
}

export interface PRA {
  compute(input: PRAInput): PRAScore;
  batchCompute(inputs: PRAInput[]): PRAScore[];
}

const DEFAULT_DECAY_RATE = 0.001;

export function createPRA(): PRA {
  return {
    compute(input) {
      const decayRate = input.decayRate ?? DEFAULT_DECAY_RATE;
      const timeSinceAccess = Math.max(0, input.queryTime - input.lastAccessTime);
      const temporalDecay = Math.exp(-decayRate * timeSinceAccess / 1000);
      const frequencyBoost = Math.min(1.0, Math.log2(input.accessCount + 1) / 5);
      const relevanceWeight = input.relevanceScore;

      const score = temporalDecay * 0.4 + frequencyBoost * 0.3 + relevanceWeight * 0.3;

      let classification: PRAScore["classification"];
      if (score > 0.7) classification = "hot";
      else if (score > 0.4) classification = "warm";
      else if (score > 0.15) classification = "cold";
      else classification = "frozen";

      return { score, components: { temporalDecay, frequencyBoost, relevanceWeight }, classification };
    },

    batchCompute(inputs) {
      return inputs.map((input) => this.compute(input));
    },
  };
}
