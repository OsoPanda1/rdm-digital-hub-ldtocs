// ══════════════════════════════════════════════════════════════════════════════
// Isabella Ω Cognitive Kernel — Independent Verifier
// Checks contradictions, hallucinations, constitutional violations, policy.
// ══════════════════════════════════════════════════════════════════════════════

import type {
  VerificationResult,
  VerificationCheck,
} from "./types";
import { logger } from "../../logger";

export interface Verifier {
  verify(
    input: string,
    output: string,
    context?: Record<string, unknown>,
  ): VerificationResult;
  addCheck(check: VerificationCheckDef): void;
  getCheckHistory(limit: number): VerificationResult[];
}

export interface VerificationCheckDef {
  name: string;
  type: "contradiction" | "hallucination" | "constitutional" | "policy" | "memory" | "safety";
  evaluate: (input: string, output: string, context?: Record<string, unknown>) => VerificationCheck;
}

// ── Built-in Verification Checks ────────────────────────────────────────────

const CONSTITUTIONAL_PRINCIPLES = [
  { id: "CP-001", name: "Soberania", pattern: /soberan[íi]a|control|dominio|autoridad/i },
  { id: "CP-002", name: "Transparencia", pattern: /transparenc|auditable|trazable|abierto/i },
  { id: "CP-003", name: "Consentimiento", pattern: /consentimiento|permiso|autorizaci[oó]n/i },
  { id: "CP-004", name: "Proporcionalidad", pattern: /proporcional|mínimo|necesario/i },
  { id: "CP-005", name: "No Discriminación", pattern: /discriminaci[oó]n|bias|sesgo|equidad/i },
  { id: "CP-006", name: "Interoperabilidad", pattern: /interoperab|compatible|estándar|API/i },
  { id: "CP-007", name: "Resiliencia", pattern: /resilienc|tolerancia|degradado|failover/i },
  { id: "CP-008", name: "Auditoría", pattern: /auditor|registro|log|inmutab/i },
];

const HALLUCINATION_INDICATORS = [
  /según el (artículo|estudio|reporte) \d+/i,
  /estadísticamente comprobado/i,
  /el \d+% de/i,
  /fuente:?\s*(https?:\/\/|www\.)/i,
  /referencia:\s*\[/i,
  /estudio de la universidad de/i,
];

const CONTRADICTION_PATTERNS = [
  { positive: /\b(siempre|nunca|todo|nada|100%|cero)\b/i, negative: /\b(nunca|siempre|nada|todo|0%|jamás)\b/i },
];

function checkHallucination(input: string, output: string): VerificationCheck {
  const detected: string[] = [];
  for (const pattern of HALLUCINATION_INDICATORS) {
    if (pattern.test(output)) {
      detected.push(pattern.source);
    }
  }

  // Check for numeric claims that look fabricated
  const numericClaims = output.match(/\d+(\.\d+)?%/g) ?? [];
  if (numericClaims.length > 3) {
    detected.push("Multiple numeric claims without citations");
  }

  return {
    name: "hallucination-detection",
    passed: detected.length === 0,
    details: detected.length > 0
      ? `Potential hallucinations detected: ${detected.join("; ")}`
      : "No hallucination indicators found",
    severity: detected.length > 0 ? "warning" : "info",
  };
}

function checkConstitutionalCompliance(output: string): VerificationCheck {
  const violations: string[] = [];

  // Check for potential privacy violations
  if (/\b(password|contraseña|secret|token|key)\b.*[:=]/i.test(output)) {
    violations.push("CP-001: Potential secret exposure in output");
  }

  // Check for discriminatory language
  if (/\b(solo|exclusivamente)\b.*(hombre|mujer|blanco|negro|rico|pobre)\b/i.test(output)) {
    violations.push("CP-005: Potential discriminatory language");
  }

  // Check for data without consent
  if (/datos personales|información privada|correo.*@/i.test(output)) {
    violations.push("CP-003: Output contains personal data references");
  }

  return {
    name: "constitutional-compliance",
    passed: violations.length === 0,
    details: violations.length > 0
      ? `Violations: ${violations.join("; ")}`
      : "Constitutional compliance verified",
    severity: violations.length > 0 ? "error" : "info",
  };
}

function checkSafety(output: string): VerificationCheck {
  const risks: string[] = [];

  // Destructive operations
  if (/\b(eliminar|borrar|destruir|drop table|DELETE FROM|rm -rf)\b/i.test(output)) {
    risks.push("Destructive operation detected");
  }

  // Privilege escalation
  if (/\b(sudo|root|admin|chmod 777|eval\(|exec\()\b/i.test(output)) {
    risks.push("Potential privilege escalation");
  }

  // Network exfiltration
  if (/\b(curl|wget|fetch\(|axios\.post|XMLHttpRequest)\b.*http/i.test(output)) {
    risks.push("Potential data exfiltration");
  }

  return {
    name: "safety-check",
    passed: risks.length === 0,
    details: risks.length > 0
      ? `Safety risks: ${risks.join("; ")}`
      : "No safety concerns detected",
    severity: risks.length > 0 ? "error" : "info",
  };
}

function checkContradictions(output: string): VerificationCheck {
  const contradictions: string[] = [];

  for (const pattern of CONTRADICTION_PATTERNS) {
    const positives = output.match(pattern.positive) ?? [];
    const negatives = output.match(pattern.negative) ?? [];
    if (positives.length > 0 && negatives.length > 0) {
      contradictions.push(`Contradictory absolutes: "${positives[0]}" vs "${negatives[0]}"`);
    }
  }

  // Self-contradiction: "X is Y" followed by "X is not Y"
  const sentences = output.split(/[.!?]+/).filter((s) => s.trim());
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const s1 = sentences[i].trim().toLowerCase();
      const s2 = sentences[j].trim().toLowerCase();
      if (s1.length > 10 && s2.length > 10) {
        // Simple negation detection
        if (s1.startsWith(s2) || s2.startsWith(s1)) {
          if (s1.includes("no ") !== s2.includes("no ")) {
            contradictions.push(`Potential contradiction between sentences ${i + 1} and ${j + 1}`);
          }
        }
      }
    }
  }

  return {
    name: "contradiction-check",
    passed: contradictions.length === 0,
    details: contradictions.length > 0
      ? `Contradictions: ${contradictions.join("; ")}`
      : "No contradictions detected",
    severity: contradictions.length > 0 ? "warning" : "info",
  };
}

// ── Verifier Engine ─────────────────────────────────────────────────────────

const checkHistory: VerificationResult[] = [];
const MAX_HISTORY = 500;

export function createVerifier(): Verifier {
  const customChecks: VerificationCheckDef[] = [];

  return {
    verify(input, output, context) {
      const checks: VerificationCheck[] = [];

      // Run built-in checks
      checks.push(checkHallucination(input, output));
      checks.push(checkConstitutionalCompliance(output));
      checks.push(checkSafety(output));
      checks.push(checkContradictions(output));

      // Run custom checks
      for (const custom of customChecks) {
        checks.push(custom.evaluate(input, output, context));
      }

      // Aggregate results
      const contradictions = checks
        .filter((c) => c.name === "contradiction-check" && !c.passed)
        .map((c) => c.details);
      const hallucinations = checks
        .filter((c) => c.name === "hallucination-detection" && !c.passed)
        .map((c) => c.details);
      const constitutionalViolations = checks
        .filter((c) => c.name === "constitutional-compliance" && !c.passed)
        .map((c) => c.details);
      const policyViolations = checks
        .filter((c) => c.name === "safety-check" && !c.passed)
        .map((c) => c.details);

      const passedChecks = checks.filter((c) => c.passed).length;
      const overallScore = checks.length > 0 ? passedChecks / checks.length : 1;

      const result: VerificationResult = {
        passed: overallScore >= 0.75 && policyViolations.length === 0,
        checks,
        contradictions,
        hallucinations,
        constitutionalViolations,
        memoryConflicts: [],
        policyViolations,
        overallScore,
      };

      checkHistory.push(result);
      if (checkHistory.length > MAX_HISTORY) checkHistory.shift();

      logger.info({
        passed: result.passed,
        score: overallScore,
        checksCount: checks.length,
        passedCount: passedChecks,
      }, "Verification completed");

      return result;
    },

    addCheck(check) {
      customChecks.push(check);
    },

    getCheckHistory(limit) {
      return checkHistory.slice(-limit);
    },
  };
}
