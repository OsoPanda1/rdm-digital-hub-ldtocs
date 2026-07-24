// artifacts/api-server/src/routes/isabella.ts
// Isabella AI — Ω-Core v4.0 Enterprise Backend API Routes
// Integración: SOUL · Isa API · Mexa API · Memory · Skills · Evaluation · Fairness · XRAI
// Endpoints: /api/isabella/*

import type { Router, Request, Response } from "express";
import { createCognitiveOrchestrator } from "../lib/isabella/core/orchestrator";
import { createMemoryEngine } from "../lib/isabella/memory/engine";
import { createSkillRegistry, registerBuiltinSkills } from "../lib/isabella/skills/registry";
import { createEvaluationEngine } from "../lib/isabella/evaluation/engine";
import { createFairnessEngine } from "../lib/isabella/fair/metrics";
import { createXrRenderer } from "../lib/isabella/xrai/renderer";
import { SOUL, AGENTS, POLICIES } from "../lib/isabella/soul/identity";
import { isabellaVersion, isabellaOrigin } from "../lib/isabella/index";
import { createIsaClient } from "../lib/ai/isa-api";
import { createMexaClient } from "../lib/ai/mexa-api";
import { buildKnowledgeContext, searchKnowledge, getAllKnowledge, knowledgeByDomain } from "../lib/ai/knowledge";
import type { FederationId } from "../lib/isabella/types";

// ═══════════════════════════════════════════════════════════════════════════════
//  SINGLETON INSTANCES (in-memory; replace with Supabase when wired)
// ═══════════════════════════════════════════════════════════════════════════════

const orchestrator = createCognitiveOrchestrator();
const memory = createMemoryEngine();
const skillRegistry = createSkillRegistry();
const evaluation = createEvaluationEngine();
const fairness = createFairnessEngine();
const xrRenderer = createXrRenderer();
const isa = createIsaClient();
const mexa = createMexaClient();

registerBuiltinSkills(skillRegistry);

// In-memory session/decision/feedback stores
const sessions = new Map<string, {
  id: string; playerId: string; startedAt: string; lastMessageAt: string;
  messageCount: number; status: "active" | "closed";
}>();
const decisions: {
  id: string; playerId: string; type: string; confidence: number;
  territoryId?: string; payload: Record<string, unknown>; createdAt: string;
  mode: string; guardianVerdict?: { approved: boolean; guardian: string; reason: string };
}[] = [];
const feedback: {
  id: string; playerId: string; decisionId: string; rating: 1 | 2 | 3 | 4 | 5;
  comment?: string; createdAt: string;
}[] = [];

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTE REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function registerIsabellaRoutes(router: Router) {

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/chat
  //  Conversational endpoint — full Ω-Core pipeline:
  //  sanitize → interpret → policy check → knowledge lookup → personality → evaluate
  //  Body: { playerId, message, sessionId? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/chat", (req: Request, res: Response) => {
    const { playerId = "anonymous", message = "", sessionId } = req.body ?? {};

    if (!message || typeof message !== "string") {
      res.status(400).json({ ok: false, error: "message is required" });
      return;
    }

    // 1. Sanitize input via Isa API Prompt Guard
    const sanitized = isa.sanitize(message);
    if (!sanitized.safe) {
      res.status(403).json({
        ok: false,
        error: "Input blocked by ethics guardian",
        risk: sanitized.risk,
        flags: sanitized.flags,
      });
      return;
    }

    // 2. Interpret intention via Isa API
    const intention = isa.interpret(sanitized.sanitized);

    // 3. Create or retrieve session
    const sid = sessionId ?? `sess-${Date.now()}-${playerId}`;
    if (!sessions.has(sid)) {
      sessions.set(sid, {
        id: sid, playerId, startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(), messageCount: 0, status: "active",
      });
    }
    const session = sessions.get(sid)!;
    session.lastMessageAt = new Date().toISOString();
    session.messageCount += 1;

    // 4. Route through orchestrator (policy check + personality)
    orchestrator.process(message).then((result) => {
      // 5. Knowledge lookup
      const knowledgeContext = buildKnowledgeContext(message, 3);

      // 6. Evaluate response quality
      const evalResults = evaluation.evaluate(result.output, { query: message });

      // 7. Fairness check
      const biasReport = fairness.evaluateBias(result.output);

      // 8. Record decision
      const decision = {
        id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        playerId,
        type: "CHAT_RESPONSE",
        confidence: intention.confidence,
        payload: { message, response: result.output, intention, knowledgeUsed: knowledgeContext.length > 0 },
        createdAt: new Date().toISOString(),
        mode: result.mode,
        guardianVerdict: { approved: true, guardian: "isabella-ethics-guardian", reason: "passed prompt guard" },
      };
      decisions.push(decision);

      // 9. Store in memory
      memory.store({
        type: "session",
        content: `Player ${playerId}: ${message} → ${result.output}`,
        tags: [intention.domain, intention.action],
        source: "chat",
        ttl: 3600000,
        confidence: intention.confidence,
      });

      res.status(200).json({
        ok: true,
        data: {
          sessionId: sid,
          response: result.output,
          decisionId: decision.id,
          mode: result.mode,
          intention: { domain: intention.domain, action: intention.action, confidence: intention.confidence },
          policies: result.policies,
          evaluation: evalResults.map((e) => ({ metric: e.metric, score: e.score, passed: e.passed })),
          biasDetected: biasReport.hasBias,
          messageCount: session.messageCount,
        },
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/stream
  //  Server-Sent Events stream of Isabella decisions.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/stream", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const playerId = (req.query.playerId as string) ?? "anonymous";

    res.write(`data: ${JSON.stringify({
      type: "CONNECTED", playerId, timestamp: new Date().toISOString(),
      version: isabellaVersion(), mode: orchestrator.status().mode,
    })}\n\n`);

    setTimeout(() => {
      const decision = {
        id: `dec-sse-${Date.now()}`, playerId, type: "TERRITORIAL_SCAN",
        confidence: 0.9, payload: {
          territoryId: "ter-rdm", weather: "SUNNY", temperature: 18,
          activePlayers: Math.floor(Math.random() * 50) + 10,
          recommendation: "Visit the mine museum",
        },
        createdAt: new Date().toISOString(), mode: "NORMAL",
      };
      decisions.push(decision);
      res.write(`data: ${JSON.stringify(decision)}\n\n`);
    }, 2000);

    const heartbeat = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: "HEARTBEAT", timestamp: new Date().toISOString() })}\n\n`);
    }, 30000);

    req.on("close", () => { clearInterval(heartbeat); res.end(); });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/decisions
  //  Decision history for a player.
  //  Query: ?playerId=&limit=50
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/decisions", (req: Request, res: Response) => {
    const playerId = (req.query.playerId as string) ?? "anonymous";
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const playerDecisions = decisions.filter((d) => d.playerId === playerId).slice(-limit).reverse();
    res.status(200).json({ ok: true, data: { playerId, decisions: playerDecisions, total: playerDecisions.length } });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/status
  //  Full system health — Ω-Core v4.0 metrics.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/status", (_req: Request, res: Response) => {
    const activeSessions = [...sessions.values()].filter((s) => s.status === "active").length;
    const totalDecisions = decisions.length;
    const totalFeedback = feedback.length;
    const avgRating = totalFeedback > 0 ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback : 0;

    res.status(200).json({
      ok: true,
      data: {
        status: "operational",
        version: isabellaVersion(),
        origin: isabellaOrigin(),
        uptime: process.uptime(),
        orchestrator: orchestrator.status(),
        memory: memory.stats(),
        skills: skillRegistry.status(),
        evaluation: {
          avgQuality: evaluation.average("response_quality"),
          avgHallucination: evaluation.average("hallucination_rate"),
          avgEthical: evaluation.average("ethical_alignment"),
        },
        fairness: fairness.metrics(),
        metrics: { activeSessions, totalDecisions, totalFeedback, avgRating: Math.round(avgRating * 100) / 100 },
        capabilities: [
          "CONVERSATIONAL_AI", "TERRITORIAL_DECISIONS", "KNOWLEDGE_BASE",
          "SSE_STREAMING", "FEEDBACK_LEARNING", "TTS_VOICE",
          "PROMPT_GUARD", "ETHICS_EVALUATION", "FAIRNESS_MONITORING",
          "XR_RENDERING", "FEDERATION_CRYPTO", "MEMORY_ENGINE",
        ],
        soul: { name: SOUL.name, values: SOUL.values.length, never: SOUL.never.length },
        agents: AGENTS.length,
        policies: POLICIES.length,
        lastHealthCheck: new Date().toISOString(),
      },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/feedback
  //  Submit user feedback on an Isabella interaction.
  //  Body: { playerId, decisionId, rating, comment? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/feedback", (req: Request, res: Response) => {
    const { playerId = "anonymous", decisionId = "", rating = 3, comment } = req.body ?? {};

    if (!decisionId || typeof decisionId !== "string") {
      res.status(400).json({ ok: false, error: "decisionId is required" });
      return;
    }

    const numRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
    const entry = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playerId, decisionId, rating: numRating as 1 | 2 | 3 | 4 | 5,
      comment: typeof comment === "string" ? comment : undefined,
      createdAt: new Date().toISOString(),
    };
    feedback.push(entry);

    memory.store({
      type: "lesson",
      content: `Feedback ${numRating}/5 on decision ${decisionId}: ${comment ?? "no comment"}`,
      tags: ["feedback", `rating-${numRating}`],
      source: playerId,
      ttl: 0,
      confidence: 0.9,
    });

    res.status(200).json({
      ok: true,
      data: { feedbackId: entry.id, rating: entry.rating, message: "Gracias por tu feedback. Mejorará la experiencia de Isabella." },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/knowledge
  //  Knowledge base search.
  //  Query: ?category=&q=&limit=20&domain=
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/knowledge", (req: Request, res: Response) => {
    const domain = (req.query.domain as string) ?? "";
    const query = (req.query.q as string) ?? "";
    const category = (req.query.category as string) ?? "";
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    let results = domain ? knowledgeByDomain(domain) : getAllKnowledge();
    if (query) results = searchKnowledge(query, limit);
    if (category) results = results.filter((k) => k.category === category);

    res.status(200).json({ ok: true, data: results.slice(0, limit) });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/knowledge
  //  Add a new knowledge base entry.
  //  Body: { topic, content, category, source, domain? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/knowledge", (req: Request, res: Response) => {
    const { topic = "", content = "", category = "general", source = "manual", domain = "ecosystem" } = req.body ?? {};
    if (!topic || !content) {
      res.status(400).json({ ok: false, error: "topic and content are required" });
      return;
    }

    memory.store({
      type: "ecosystem",
      content: `[${domain}] ${topic}: ${content}`,
      tags: [domain, category, topic.toLowerCase().slice(0, 50)],
      source,
      ttl: 0,
      confidence: 0.8,
    });

    res.status(201).json({
      ok: true,
      data: { id: `kb-${Date.now()}`, topic, content, category, domain, source, createdAt: new Date().toISOString() },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/tts-isabella
  //  Text-to-Speech proxy for Isabella voice generation.
  //  Body: { text, emotion?, speed? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/tts-isabella", (req: Request, res: Response) => {
    const { text = "", emotion = "neutral", speed = 1.0 } = req.body ?? {};
    if (!text || typeof text !== "string") {
      res.status(400).json({ ok: false, error: "text is required" });
      return;
    }

    res.status(200).json({
      ok: true,
      data: {
        audioUrl: null,
        duration: Math.ceil(text.length / 15) * (1 / speed),
        emotion, speed, text: text.slice(0, 500),
        format: "mp3", sampleRate: 22050, voice: "isabella-es-MX",
        note: "Mock TTS. Deploy Supabase Edge Function for real voice synthesis.",
      },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/sessions
  //  Active sessions for a player.
  //  Query: ?playerId=
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/sessions", (req: Request, res: Response) => {
    const playerId = (req.query.playerId as string) ?? "anonymous";
    const playerSessions = [...sessions.values()]
      .filter((s) => s.playerId === playerId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    res.status(200).json({ ok: true, data: playerSessions });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/sessions/:id/close
  //  Close an active session.
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/sessions/:id/close", (req: Request, res: Response) => {
    const session = sessions.get(req.params.id);
    if (!session) { res.status(404).json({ ok: false, error: "Session not found" }); return; }
    session.status = "closed";
    res.status(200).json({ ok: true, data: { sessionId: session.id, status: "closed" } });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/compliance
  //  Ω-Core compliance audit — SOUL, policies, ethics status.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/compliance", (_req: Request, res: Response) => {
    res.status(200).json({
      ok: true,
      data: {
        soul: {
          name: SOUL.name,
          origin: SOUL.origin,
          model: SOUL.model,
          values: SOUL.values,
          never: SOUL.never,
        },
        policies: {
          total: POLICIES.length,
          bySeverity: {
            critical: POLICIES.filter((p) => p.severity === "critical").length,
            high: POLICIES.filter((p) => p.severity === "high").length,
            medium: POLICIES.filter((p) => p.severity === "medium").length,
            low: POLICIES.filter((p) => p.severity === "low").length,
          },
          byDomain: {
            ontological: POLICIES.filter((p) => p.domain === "ontological").length,
            semantic: POLICIES.filter((p) => p.domain === "semantic").length,
            behavioral: POLICIES.filter((p) => p.domain === "behavioral").length,
            governance: POLICIES.filter((p) => p.domain === "governance").length,
            security: POLICIES.filter((p) => p.domain === "security").length,
            education: POLICIES.filter((p) => p.domain === "education").length,
            library: POLICIES.filter((p) => p.domain === "library").length,
          },
        },
        agents: AGENTS.map((a) => ({ id: a.id, name: a.name, federation: a.federation, autonomy: a.autonomy })),
        skills: skillRegistry.status(),
        federations: [
          "FED-1 (Preservación)", "FED-2 (Estándares)", "FED-3 (Tecnología)",
          "FED-4 (Curación)", "FED-5 (Integridad)", "FED-6 (Adopción)", "FED-7 (Auditoría)",
        ],
      },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/crypto/sign
  //  Sign a payload with Mexa API federation mask.
  //  Body: { federationId, nodeId, payload }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/crypto/sign", (req: Request, res: Response) => {
    const { federationId, nodeId, payload } = req.body ?? {};
    if (!federationId || !nodeId || payload === undefined) {
      res.status(400).json({ ok: false, error: "federationId, nodeId, and payload are required" });
      return;
    }

    try {
      const mask = mexa.createMask(federationId as FederationId, nodeId);
      const signed = mexa.sign(payload, mask);
      res.status(200).json({ ok: true, data: signed });
    } catch (err) {
      res.status(400).json({ ok: false, error: (err as Error).message });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/crypto/verify
  //  Verify a signed payload.
  //  Body: SignedPayload
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/crypto/verify", (req: Request, res: Response) => {
    const signed = req.body;
    if (!signed || !signed.federationMask || !signed.hash || !signed.nonce) {
      res.status(400).json({ ok: false, error: "SignedPayload required (federationMask, hash, nonce)" });
      return;
    }

    const result = mexa.verify(signed);
    res.status(200).json({ ok: true, data: result });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/crypto/status
  //  Mexa API health and federation status.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/crypto/status", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: mexa.health() });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/xr/scene
  //  Generate an XR scene manifest from a description.
  //  Body: { description, options? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/xr/scene", async (req: Request, res: Response) => {
    const { description, options } = req.body ?? {};
    if (!description || typeof description !== "string") {
      res.status(400).json({ ok: false, error: "description is required" });
      return;
    }

    const scene = await xrRenderer.generateScene(description, options);
    res.status(201).json({ ok: true, data: scene });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/isa/health
  //  Isa API health and cognitive process count.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/isa/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: isa.health() });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/isa/reason
  //  Isa API structured reasoning.
  //  Body: { query, context?, knowledgeGraph?, maxDepth? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/isa/reason", async (req: Request, res: Response) => {
    const { query, context, knowledgeGraph, maxDepth } = req.body ?? {};
    if (!query || typeof query !== "string") {
      res.status(400).json({ ok: false, error: "query is required" });
      return;
    }

    const result = await isa.reason({ query, context, knowledgeGraph, maxDepth });
    res.status(200).json({ ok: true, data: result });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/fairness
  //  Fairness engine metrics.
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/fairness", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: fairness.metrics() });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/fairness/evaluate
  //  Evaluate text for bias and guardrails.
  //  Body: { text, context? }
  // ─────────────────────────────────────────────────────────────────────────
  router.post("/isabella/fairness/evaluate", (req: Request, res: Response) => {
    const { text, context } = req.body ?? {};
    if (!text || typeof text !== "string") {
      res.status(400).json({ ok: false, error: "text is required" });
      return;
    }

    const biasReport = fairness.evaluateBias(text);
    const guardrails = fairness.checkGuardrails(text, context);
    res.status(200).json({ ok: true, data: { bias: biasReport, guardrails } });
  });

  // ─────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/evaluation/history
  //  Evaluation engine history.
  //  Query: ?limit=50
  // ─────────────────────────────────────────────────────────────────────────
  router.get("/isabella/evaluation/history", (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    res.status(200).json({ ok: true, data: evaluation.history(limit) });
  });
}
