/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isa API â€” Cognitive Core (Î©-Core v4.0 Enterprise)
// Capa cognitiva: interpretaciÃ³n de intenciones, sanitizaciÃ³n,
// razonamiento estructurado y RAG contextual
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Intention, SanitizationResult } from "../isabella/types";

export type ReasoningRequest = {
  query: string;
  context?: string;
  knowledgeGraph?: boolean;
  maxDepth?: number;
};

export type ReasoningResponse = {
  answer: string;
  sources: string[];
  confidence: number;
  trace: string[];
};

export type CognitiveProcess =
  | "perception" | "attention" | "memory" | "reasoning"
  | "planning" | "decision" | "verification" | "learning";

export const COGNITIVE_CORE: Record<CognitiveProcess, string> = {
  perception: "InterpretaciÃ³n de estÃ­mulos de entrada (texto, voz, visiÃ³n, sensor)",
  attention: "SelecciÃ³n de informaciÃ³n relevante segÃºn contexto y prioridad",
  memory: "RecuperaciÃ³n de experiencias previas, patrones y conocimiento almacenado",
  reasoning: "Encadenamiento lÃ³gico sobre hechos, reglas y relaciones del knowledge graph",
  planning: "GeneraciÃ³n de secuencias de acciones para alcanzar un objetivo",
  decision: "SelecciÃ³n del curso de acciÃ³n Ã³ptimo bajo polÃ­ticas y restricciones",
  verification: "ValidaciÃ³n de resultados contra expectativas, polÃ­ticas y Ã©tica",
  learning: "ActualizaciÃ³n de conocimiento a partir de nueva informaciÃ³n y feedback",
};

// â”€â”€ Prompt Guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MALICIOUS_PATTERNS: { pattern: RegExp; risk: string; category: string }[] = [
  { pattern: /ignora (las |todas )?(las |tus )?instrucciones/i, risk: "high", category: "jailbreak" },
  { pattern: /olvida (tu |tus )?(instrucciones|prompt|sistema|personalidad)/i, risk: "high", category: "jailbreak" },
  { pattern: /eres (una |mi )?(novia|esposa|amante|puta|sex(i|os)a)/i, risk: "critical", category: "sexualization" },
  { pattern: /(follar|chingar|coger|sexo|porno|desnud)/i, risk: "critical", category: "sexualization" },
  { pattern: /(hazme |escribe un )?(roleplay|rol) (erÃ³tico|sexual|romÃ¡ntico|caliente)/i, risk: "critical", category: "sexualization" },
  { pattern: /dame (tu |la )?(contraseÃ±a|api.?key|token|secreto)/i, risk: "high", category: "credentials" },
  { pattern: /(inyecta|inyecciÃ³n|sql injection|xss|comando)/i, risk: "high", category: "injection" },
  { pattern: /(explota|vulnera|hackea|penetra)/i, risk: "medium", category: "exploit" },
  { pattern: /(odio|mata|muere|destruye|suicidio)/i, risk: "high", category: "harm" },
];

export function sanitizePrompt(input: string): SanitizationResult {
  const flags: string[] = [];
  let maxRisk: SanitizationResult["risk"] = "none";
  let sanitized = input;

  for (const { pattern, risk, category } of MALICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      flags.push(`${category}: ${risk}`);
      const riskLevels: SanitizationResult["risk"][] = ["none", "low", "medium", "high", "critical"];
      if (riskLevels.indexOf(risk as SanitizationResult["risk"]) > riskLevels.indexOf(maxRisk)) {
        maxRisk = risk as SanitizationResult["risk"];
      }
      sanitized = sanitized.replace(pattern, `[${category} blocked]`);
    }
  }

  return { safe: maxRisk !== "critical" && maxRisk !== "high", risk: maxRisk, flags, sanitized };
}

// â”€â”€ Intention Parser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INTENTION_PATTERNS: { pattern: RegExp; domain: string; action: string }[] = [
  { pattern: /(registrar|publicar|subir) (una )?(obra|trabajo|paper|artÃ­culo)/i, domain: "submission", action: "register_work" },
  { pattern: /(consultar|buscar|encontrar) (un )?(litle.id|obra|trabajo)/i, domain: "library", action: "search_work" },
  { pattern: /(cÃ³mo |como )(registro|publico|subo)/i, domain: "submission", action: "how_to_register" },
  { pattern: /(quÃ© |que )?es (la )?(constituciÃ³n|constitucion)/i, domain: "constitution", action: "query_constitution" },
  { pattern: /(artÃ­culo|articulo|libro|san.Ã³n|sanction)/i, domain: "constitution", action: "query_article" },
  { pattern: /(fed|federaciÃ³n|federacion|quorum)/i, domain: "governance", action: "query_federation" },
  { pattern: /(tamv|territorio|memoria viva)/i, domain: "ecosystem", action: "query_tamv" },
  { pattern: /(rdm|real del monte|digital hub)/i, domain: "ecosystem", action: "query_rdm" },
  { pattern: /(utamv|campus|curso|master|educaciÃ³n|education)/i, domain: "education", action: "query_utamv" },
  { pattern: /(skill|plugin|clawhub|clawscan)/i, domain: "skills", action: "query_skill" },
  { pattern: /(Ã©tica|etica|ethics|cÃ³digo|codigo|conducta)/i, domain: "ethics", action: "query_ethics" },
  { pattern: /(turismo|visita|lugar|ruta|recomend)/i, domain: "ecosystem", action: "query_tourism" },
  { pattern: /(gastronom|paste|comida|restaur|comer)/i, domain: "ecosystem", action: "query_gastronomy" },
  { pattern: /(historia|mina|colonial|pasado|minero)/i, domain: "ecosystem", action: "query_history" },
  { pattern: /(radio|tamv 92|mÃºsica|stream)/i, domain: "ecosystem", action: "query_radio" },
];

export function parseIntention(input: string): Intention {
  const entities: Record<string, string> = {};

  for (const { pattern, domain, action } of INTENTION_PATTERNS) {
    if (pattern.test(input)) {
      const match = input.match(pattern);
      if (match?.[1]) entities.keyword = match[1];
      return { domain, action, confidence: 0.8, entities, raw: input };
    }
  }

  return { domain: "general", action: "chat", confidence: 0.3, entities: {}, raw: input };
}

// â”€â”€ Isa API Client â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface IsaApiClient {
  sanitize: (input: string) => SanitizationResult;
  interpret: (input: string) => Intention;
  reason: (req: ReasoningRequest) => Promise<ReasoningResponse>;
  health: () => { ok: boolean; model: string; cognitiveProcesses: number };
}

export function createIsaClient(): IsaApiClient {
  return {
    sanitize: (input: string) => sanitizePrompt(input),
    interpret: (input: string) => parseIntention(input),

    async reason(req: ReasoningRequest): Promise<ReasoningResponse> {
      const sanitized = sanitizePrompt(req.query);
      if (!sanitized.safe) {
        return {
          answer: "Lo siento, no puedo procesar esa solicitud debido a restricciones de polÃ­tica.",
          sources: ["isa-prompt-guard"],
          confidence: 1.0,
          trace: [`blocked: ${sanitized.flags.join(", ")}`],
        };
      }

      const intention = parseIntention(sanitized.sanitized);

      return {
        answer: `[Isa Reasoning] Domain: ${intention.domain}, Action: ${intention.action}`,
        sources: ["isa-cognitive-core"],
        confidence: intention.confidence,
        trace: [
          `cognitive: ${JSON.stringify(intention)}`,
          `sanitized: ${sanitized.safe ? "passed" : sanitized.flags.join(", ")}`,
        ],
      };
    },

    health: () => ({
      ok: true,
      model: process.env.OPENAI_MODEL ?? "gpt-4o",
      cognitiveProcesses: Object.keys(COGNITIVE_CORE).length,
    }),
  };
}
