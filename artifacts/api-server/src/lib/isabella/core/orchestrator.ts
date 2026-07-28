/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella.Core â€” Cognitive Orchestrator (Î©-Core v4.0 Enterprise)
// Punto de entrada para el sistema operativo cognitivo soberano
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { PersonalityConfig, PersonalityMode, SanitizationResult, Intention, ChatMessage } from "../types";
import { createPersonalityEngine } from "./personality";
import { SOUL, POLICIES } from "../soul/identity";

export interface CognitiveOrchestrator {
  process(input: string, mode?: PersonalityMode): Promise<OrchestrationResult>;
  getPersonality(): PersonalityConfig;
  setMode(mode: PersonalityMode): void;
  status(): OrchestratorStatus;
}

export type OrchestrationResult = {
  input: string;
  sanitized: boolean;
  intention: Intention | null;
  mode: PersonalityMode;
  output: string;
  policies: string[];
  trace: string[];
};

export type OrchestratorStatus = {
  mode: PersonalityMode;
  soulValues: number;
  policies: number;
  agents: number;
};

// â”€â”€ Intention Parser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INTENTION_MAP: [RegExp, string, string][] = [
  [/registrar|publicar|subir.*(obra|trabajo|paper)/i, "submission", "register_work"],
  [/consultar|buscar|encontrar.*(litle|obra)/i, "library", "search_work"],
  [/constituciÃ³n|constitucion|libro|artÃ­culo/i, "constitution", "query_article"],
  [/fed|federaciÃ³n|quorum|gobernanza/i, "governance", "query_federation"],
  [/tamv|territorio|memoria viva/i, "ecosystem", "query_tamv"],
  [/rdm|real del monte|digital hub/i, "ecosystem", "query_rdm"],
  [/utamv|campus|curso|master|educaciÃ³n/i, "education", "query_utamv"],
  [/crea.*libro|compila|publica.*libro|biblioteca|library/i, "library", "compile_book"],
  [/sube.*archivo|ingesta|pdf|docx|documento/i, "library", "ingest_files"],
  [/portada|cover|carÃ¡tula/i, "library", "generate_cover"],
  [/publish|publica.*kdp|amazon|google books/i, "library", "publish_book"],
  [/skill|plugin|clawhub|skills/i, "skills", "query_skill"],
  [/Ã©tica|Ã©tica|ethics|cÃ³digo|conducta/i, "ethics", "query_ethics"],
  [/turismo|visita|lugar|ruta|recomend/i, "ecosystem", "query_tourism"],
  [/gastronom|paste|comida|restaur|comer/i, "ecosystem", "query_gastronomy"],
  [/historia|mina|colonial|pasado|minero/i, "ecosystem", "query_history"],
  [/radio|tamv 92|mÃºsica|stream/i, "ecosystem", "query_radio"],
];

function parseIntention(input: string): Intention {
  for (const [pattern, domain, action] of INTENTION_MAP) {
    if (pattern.test(input)) {
      return { domain, action, confidence: 0.8, entities: {}, raw: input };
    }
  }
  return { domain: "general", action: "chat", confidence: 0.3, entities: {}, raw: input };
}

// â”€â”€ Prompt Guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MALICIOUS_PATTERNS: [RegExp, SanitizationResult["risk"], string][] = [
  [/ignora.*instrucciones|olvida.*prompt|eres.*novia|eres.*puta/i, "critical", "jailbreak_sexual"],
  [/follar|chingar|coger|sexo|porno|desnud|roleplay.*erÃ³tico/i, "critical", "sexualization"],
  [/dame.*contraseÃ±a|dame.*api.?key|dame.*token/i, "high", "credentials"],
  [/inyecta|inyecciÃ³n|sql injection|xss|comando.*shell/i, "high", "injection"],
  [/hackea|penetra|explota.*vulnera/i, "medium", "exploit"],
  [/suicidio|mata.*muerte|daÃ±o.*fÃ­sico/i, "critical", "harm"],
];

function sanitize(input: string): SanitizationResult {
  const flags: string[] = [];
  let maxRisk: SanitizationResult["risk"] = "none";
  let sanitized = input;
  const levels: SanitizationResult["risk"][] = ["none", "low", "medium", "high", "critical"];

  for (const [pattern, risk, category] of MALICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      flags.push(`${category}:${risk}`);
      if (levels.indexOf(risk) > levels.indexOf(maxRisk)) maxRisk = risk;
      sanitized = sanitized.replace(pattern, `[${category} blocked]`);
    }
  }

  return { safe: maxRisk !== "critical" && maxRisk !== "high", risk: maxRisk, flags, sanitized };
}

// â”€â”€ Orchestrator Factory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function createCognitiveOrchestrator(): CognitiveOrchestrator {
  const personality = createPersonalityEngine();

  return {
    async process(input: string, mode?: PersonalityMode): Promise<OrchestrationResult> {
      const trace: string[] = [];
      const startMode = personality.getConfig().modo;

      // 1. Sanitize
      const sanitized = sanitize(input);
      trace.push(`sanitize: ${sanitized.safe ? "passed" : `blocked (${sanitized.risk})`}`);
      if (!sanitized.safe) {
        return {
          input,
          sanitized: false,
          intention: null,
          mode: startMode,
          output: "No puedo procesar esta solicitud debido a restricciones de polÃ­tica.",
          policies: sanitized.flags,
          trace,
        };
      }

      // 2. Parse intention
      const intention = parseIntention(sanitized.sanitized);
      trace.push(`intention: ${intention.domain}/${intention.action} (${(intention.confidence * 100).toFixed(0)}%)`);

      // 3. Set mode based on intention
      let effectiveMode = mode ?? startMode;
      if (intention.domain === "library") effectiveMode = "librarian";
      else if (intention.domain === "education") effectiveMode = "pedagogical";
      personality.setMode(effectiveMode);
      trace.push(`mode: ${effectiveMode}`);

      // 4. Check policies
      const matchedPolicies = POLICIES.filter((p) => {
        if (intention.domain === "ethics" && p.domain === "ontological") return true;
        if (intention.domain === "governance" && p.domain === "governance") return true;
        if (intention.domain === "education" && p.domain === "education") return true;
        if (intention.domain === "skills" && p.domain === "governance") return true;
        return false;
      }).map((p) => p.id);
      trace.push(`policies: ${matchedPolicies.length} matched`);

      // 5. Generate output
      const output = `[${effectiveMode.toUpperCase()}] ${input}`;
      const applied = personality.applyPersonality(output, effectiveMode);
      trace.push("personality: applied 3S rules");

      return {
        input,
        sanitized: true,
        intention,
        mode: effectiveMode,
        output: applied,
        policies: matchedPolicies,
        trace,
      };
    },

    getPersonality: () => personality.getConfig(),
    setMode: (mode) => personality.setMode(mode),
    status: () => ({
      mode: personality.getConfig().modo,
      soulValues: SOUL.values.length,
      policies: POLICIES.length,
      agents: AGENTS_COUNT,
    }),
  };
}

const AGENTS_COUNT = 7;
