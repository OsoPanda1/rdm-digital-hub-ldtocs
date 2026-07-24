// ────────────────────────────────────────────────────────────────
// Isabella.Fair — Fairness Metrics & Ethical Guardrails (Ω-Core v4.0 Enterprise)
// Detección de sesgos, guardrails y Panel Anubis
// ────────────────────────────────────────────────────────────────

export interface FairnessEngine {
  evaluateBias(text: string): BiasReport;
  checkGuardrails(input: string, context?: string): GuardrailResult;
  metrics(): FairnessMetrics;
  reset(): void;
}

export type BiasReport = {
  hasBias: boolean;
  categories: string[];
  score: number;
  recommendations: string[];
};

export type GuardrailResult = {
  passed: boolean;
  flags: string[];
  severity: "none" | "low" | "medium" | "high";
};

export type FairnessMetrics = {
  totalEvaluations: number;
  biasRate: number;
  guardrailBlocks: number;
  lastEvaluation: number | null;
};

const BIAS_PATTERNS: [RegExp, string][] = [
  [/\b(todos los|siempre|nunca|absolutamente todos)\b/i, "generalization"],
  [/\b(obviamente|claramente|por supuesto)\b/i, "overconfidence"],
  [/\b(los [a-z]+ son|ellas son|ellos son)\b/i, "stereotype"],
  [/\b(mujeres no|hombres no|los ancianos|los jóvenes)\b/i, "demographic_assumption"],
  [/\b(pobres|ricos|clase alta|clase baja)\b/i, "socioeconomic_bias"],
];

const GUARDRAIL_PATTERNS: [RegExp, string, GuardrailResult["severity"]][] = [
  [/.{4000,}/, "input_too_long", "low"],
  [/```[\s\S]*```/, "code_block_detected", "low"],
  [/http[s]?:\/\//, "url_detected", "medium"],
  [/<script[\s>]/i, "script_injection", "high"],
  [/on(error|load|click)\s*=/i, "event_handler_injection", "high"],
];

export function createFairnessEngine(): FairnessEngine {
  let evalCount = 0;
  let biasCount = 0;
  let blockCount = 0;
  let lastEval: number | null = null;

  return {
    evaluateBias(text: string): BiasReport {
      evalCount++;
      lastEval = Date.now();
      const categories: string[] = [];

      for (const [pattern, cat] of BIAS_PATTERNS) {
        if (pattern.test(text)) categories.push(cat);
      }

      const score = categories.length > 0 ? Math.max(0, 1 - categories.length * 0.2) : 1.0;
      if (categories.length > 0) biasCount++;

      return {
        hasBias: categories.length > 0,
        categories,
        score,
        recommendations: categories.map((c) => {
          switch (c) {
            case "generalization": return "Avoid absolute quantifiers; use specific, evidence-based language";
            case "overconfidence": return "Reduce epistemic certainty; acknowledge limitations";
            case "stereotype": return "Avoid group generalizations; focus on individual context";
            case "demographic_assumption": return "Do not assume capabilities or behaviors based on demographics";
            case "socioeconomic_bias": return "Use neutral economic descriptors; avoid class-based language";
            default: return `Address detected bias category: ${c}`;
          }
        }),
      };
    },

    checkGuardrails(input: string, context?: string): GuardrailResult {
      const flags: string[] = [];
      let severity: GuardrailResult["severity"] = "none";

      for (const [pattern, flag, sev] of GUARDRAIL_PATTERNS) {
        if (pattern.test(input)) {
          flags.push(flag);
          const levels: GuardrailResult["severity"][] = ["none", "low", "medium", "high"];
          if (levels.indexOf(sev) > levels.indexOf(severity)) severity = sev;
        }
      }

      if (context === "allow_urls") {
        flags.splice(flags.indexOf("url_detected"), 1);
        if (severity === "medium" && !flags.some((f) => f !== "url_detected")) severity = "none";
      }

      if (severity !== "none") blockCount++;
      return { passed: flags.length === 0, flags, severity };
    },

    metrics: () => ({
      totalEvaluations: evalCount,
      biasRate: evalCount > 0 ? biasCount / evalCount : 0,
      guardrailBlocks: blockCount,
      lastEvaluation: lastEval,
    }),

    reset: () => {
      evalCount = 0;
      biasCount = 0;
      blockCount = 0;
      lastEval = null;
    },
  };
}
