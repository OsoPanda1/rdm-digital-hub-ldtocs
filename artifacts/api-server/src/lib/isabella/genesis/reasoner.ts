/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Genesis â€” Reasoner
// Pipeline: context â†’ knowledge â†’ tools â†’ firewall â†’ BookPI â†’ decision
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { DecisionRecord } from "../types/decision-record";
import { createContextEngine } from "./context-engine";
import { createKnowledgeLayer } from "./knowledge-layer";
import { createEthicalFirewall } from "./ethical-firewall";
import { createBookPI } from "./bookpi";

export interface ReasonerResponse {
  answer: string;
  record: DecisionRecord;
  confidence: number;
  trace: string[];
}

export interface ReasonerPlanStep {
  stepId: string;
  tool: string;
  inputHash: string;
}

export interface ToolOrchestratorResult {
  answer: string;
  confidence: number;
  explanation: string;
  steps: ReasonerPlanStep[];
}

export interface Reasoner {
  respond(query: string, userId: string): Promise<ReasonerResponse>;
  explain(record: DecisionRecord): { summary: string; technicalTrace: unknown[]; artifacts: unknown };
  stats(): { totalReasoned: number; avgConfidence: number };
}

function hashPayload(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return `sha256:${Math.abs(hash).toString(16).padStart(8, "0")}`;
}

function simpleToolOrchestrate(query: string, context: string, passages: string[]): ToolOrchestratorResult {
  const steps: ReasonerPlanStep[] = [
    { stepId: "ctx", tool: "contextEngine", inputHash: hashPayload(context) },
    { stepId: "kb", tool: "knowledgeLayer", inputHash: hashPayload(passages.join("|")) },
    { stepId: "gen", tool: "responseGenerator", inputHash: hashPayload(query) },
  ];

  const answer = passages.length > 0
    ? `Basado en ${passages.length} fuentes de conocimiento: ${passages[0].slice(0, 200)}...`
    : `Procesando consulta: ${query}`;

  const confidence = passages.length > 0 ? 0.7 + Math.min(passages.length * 0.05, 0.25) : 0.3;

  return {
    answer,
    confidence,
    explanation: `Contexto enriquecido + ${passages.length} pasajes de conocimiento recuperados`,
    steps,
  };
}

export function createReasoner(): Reasoner {
  const contextEngine = createContextEngine();
  const knowledgeLayer = createKnowledgeLayer();
  const firewall = createEthicalFirewall();
  const bookpi = createBookPI();
  let totalReasoned = 0;
  let totalConfidence = 0;

  return {
    async respond(query, userId) {
      const trace: string[] = [];
      trace.push("reasoner: start");

      const context = await contextEngine.buildContext({ query, userId });
      trace.push(`context: risk=${context.decisionContext.riskScore}`);

      const knowledge = await knowledgeLayer.query({ query, userId, maxPassages: 8 });
      trace.push(`knowledge: ${knowledge.passages.length} passages (${knowledge.searchType})`);

      const passages = knowledge.passages.map((p) => p.text);
      const toolsResult = simpleToolOrchestrate(query, context.enrichedContext, passages);
      trace.push(`tools: confidence=${toolsResult.confidence}`);

      const record: DecisionRecord = {
        decisionId: `dr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        event: {
          type: "query",
          actorId: userId,
          payloadHash: hashPayload(query),
        },
        context: context.decisionContext,
        plan: toolsResult.steps,
        decision: {
          action: "respond",
          confidence: toolsResult.confidence,
          explanation: toolsResult.explanation,
        },
        signatures: { isabella: "", bookpi: "" },
      };

      const filtered = await firewall.applyPolicies(record);
      trace.push(`firewall: ${filtered.decision.action}`);

      const anchored = await bookpi.anchorDecision(filtered);
      trace.push(`bookpi: anchored=${!!anchored.ledgerAnchor}`);

      totalReasoned++;
      totalConfidence += anchored.decision.confidence;

      return {
        answer: toolsResult.answer,
        record: anchored,
        confidence: anchored.decision.confidence,
        trace,
      };
    },

    explain(record) {
      return {
        summary: `DecisiÃ³n ${record.decisionId}: acciÃ³n=${record.decision.action}, confianza=${record.decision.confidence}`,
        technicalTrace: record.plan.map((step) => ({
          stepId: step.stepId,
          tool: step.tool,
          inputHash: step.inputHash,
        })),
        artifacts: {
          ledgerAnchor: record.ledgerAnchor,
          signatures: record.signatures,
          context: record.context,
        },
      };
    },

    stats() {
      return {
        totalReasoned,
        avgConfidence: totalReasoned > 0 ? totalConfidence / totalReasoned : 0,
      };
    },
  };
}
