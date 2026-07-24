// artifacts/api-server/src/routes/isabella.ts
// Isabella AI — Backend API routes for conversational AI, decisions, feedback, TTS
// ADR-001: docs/adr/001-rdm-living-world-gamification.md
// Endpoints: /api/isabella/*

import type { Router, Request, Response } from "express";

// ═══════════════════════════════════════════════════════════════════════════════
//  IN-MEMORY STORES (replace with Supabase when wired)
// ═══════════════════════════════════════════════════════════════════════════════

interface IsabellaSession {
  id: string;
  playerId: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  status: "active" | "closed";
}

interface IsabellaDecision {
  id: string;
  playerId: string;
  type: string;
  confidence: number;
  territoryId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  mode: "NORMAL" | "SAFE" | "EMERGENCY";
}

interface IsabellaFeedback {
  id: string;
  playerId: string;
  decisionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

interface KnowledgeEntry {
  id: string;
  topic: string;
  content: string;
  category: string;
  source: string;
  confidence: number;
  createdAt: string;
}

const sessions: Map<string, IsabellaSession> = new Map();
const decisions: IsabellaDecision[] = [];
const feedback: IsabellaFeedback[] = [];
const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "kb-1",
    topic: "Historia de la Mina de Acosta",
    content: "La Mina de Acosta fue una de las minas más importantes de Real del Monte, operada durante la colonia española. Fue un centro neurálgico de la minería de plata en Nueva España.",
    category: "historia",
    source: "Archivo Histórico Regional",
    confidence: 0.95,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "kb-2",
    topic: "Paste de Real del Monte",
    content: "El paste es un platillo típico de Real del Monte, herencia de los mineros cornisas británicos que llegaron en el siglo XIX. Se prepara con masa de trigo y rellenos variados.",
    category: "gastronomia",
    source: "Archivo Histórico Regional",
    confidence: 0.92,
    createdAt: "2026-02-10T00:00:00Z",
  },
  {
    id: "kb-3",
    topic: "TAMV 92.5 FM",
    content: "TAMV 92.5 es la estación de radio comunitaria de Real del Monte. Transmite programas de noticias, música folclórica, deportes y cultura local las 24 horas del día.",
    category: "cultura",
    source: "TAMV Online Network",
    confidence: 0.98,
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "kb-4",
    topic: "Panteón de Real del Monte",
    content: "El panteón inglés es un sitio histórico con tumbas de mineros británicos del siglo XIX. Es uno de los atractivos turísticos más visitados del pueblo.",
    category: "turismo",
    source: "Archivo Histórico Regional",
    confidence: 0.94,
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "kb-5",
    topic: "Arquitectura Colonial Minera",
    content: "Real del Monte conserva arquitectura colonial minera con casas de adobe, techos de teja y patios interiores. El centro histórico fue declarado patrimonio cultural.",
    category: "patrimonio",
    source: "Archivo Histórico Regional",
    confidence: 0.90,
    createdAt: "2026-04-05T00:00:00Z",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  CONVERSATIONAL ENGINE (contextual responses)
// ═══════════════════════════════════════════════════════════════════════════════

const INTENT_RESPONSES: Record<string, string[]> = {
  saludo: [
    "¡Hola! Soy Isabella, tu asistente de turismo y patrimonio de Real del Monte. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido a Real del Monte! Soy Isabella y estoy aquí para guiarte. ¿Qué te gustaría saber?",
    "¡Hola! Me alegra que estés aquí. Soy Isabella, experta en patrimonio y turismo sostenible. ¿Cómo puedo asistirte?",
  ],
  historia: [
    "Real del Monte tiene una historia fascinante. Fundada en el siglo XVI, fue un centro minero clave en Nueva España. Los mineros británicos del siglo XIX dejaron una huella profunda en la cultura, la arquitectura y hasta la gastronomía — ¡el paste es herencia cornisa!",
    "La minería ha sido el corazón de Real del Monte durante siglos. La Mina de Acosta es testimonio de esa riqueza históricas. ¿Te gustaría conocer más sobre algún período específico?",
    "La historia de Real del Monte está entrelazada con la minería de plata. Desde la época prehispánica hasta la colonia española, cada piedra guarda un relato.",
  ],
  turismo: [
    "Real del Monte ofrece experiencias únicas: tours mineros, el panteón inglés, el Centro Cultural, y la gastronomía. ¿Qué tipo de actividad te interesa más?",
    "Te recomiendo comenzar por la Mina de Acosta y el panteón inglés — son los puntos más emblemáticos. También tenemos rutas de senderismo con vistas espectaculares.",
    "El turismo sostenible es nuestra prioridad. Cada visita fortalece la economía local y preserva el patrimonio. ¿Ya conoces nuestras rutas temáticas?",
  ],
  gastronomia: [
    "¡La gastronomía es patrimonio vivo! El paste es el platillo insignia — una herencia de los mineros británicos adaptada con sabores mexicanos. También tenemos chocolate de la sierra, mezcal artesanal y tamales tradicionales.",
    "Los paste de Real del Monte son únicos en México. Te recomiendo probar el paste tradicional de picadillo y el de queso con frijol. ¿Quieres que te recomiende un lugar específico?",
    "La Feria del Paste Anual es el evento gastronómico más importante. También tenemos cocinas mineras que preservan recetas de hace más de 200 años.",
  ],
  eventos: [
    "Tenemos eventos todo el año: Festival de la Mina, Feria del Paste, Noche de Muertos, Festival Musical y más. ¿Qué tipo de eventos te interesan?",
    "Los eventos comunitarios son el alma de Real del Monte. Cada celebración une a la comunidad y fortalece nuestra identidad cultural.",
    "Puedes consultar el calendario completo de eventos en nuestra sección de Eventos. ¿Te gustaría que te recomiende uno basado en tus intereses?",
  ],
  default: [
    "Entiendo tu interés. Real del Monte es un lugar lleno de historia, cultura y naturaleza. ¿Hay algo específico que te gustaría explorar?",
    "Esa es una buena pregunta. Déjame compartirte lo que sé y si necesitas más detalles, puedo conectarte con expertos locales.",
    "Gracias por tu pregunta. Real del Monte tiene mucho que ofrecer. ¿Te gustaría que te guíe hacia algún tema en particular?",
  ],
};

function classifyIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/hola|buen[oa]|salud|hey|hello/i.test(lower)) return "saludo";
  if (/histor|pasado|antigu|colonial|miner|siglo|año/i.test(lower)) return "historia";
  if (/turis|visita|lugar|ruta|recomend|punto|interest|tour|sender/i.test(lower)) return "turismo";
  if (/comida|paste|gastronom|comer|restaur|café|chocolate|mezcal/i.test(lower)) return "gastronomia";
  if (/event|feria|festival|concierto|celebr|actividad/i.test(lower)) return "eventos";
  return "default";
}

function generateResponse(message: string): string {
  const intent = classifyIntent(message);
  const responses = INTENT_RESPONSES[intent] ?? INTENT_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTE REGISTRATION
// ═══════════════════════════════════════════════════════════════════════════════

export function registerIsabellaRoutes(router: Router) {
  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/chat
  //  Conversational endpoint — accepts a message, returns Isabella's response.
  //  Body: { playerId, message, sessionId? }
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/isabella/chat", (req: Request, res: Response) => {
    const { playerId = "anonymous", message = "", sessionId } = req.body ?? {};

    if (!message || typeof message !== "string") {
      res.status(400).json({ ok: false, error: "message is required" });
      return;
    }

    // Create or retrieve session
    const sid = sessionId ?? `sess-${Date.now()}-${playerId}`;
    if (!sessions.has(sid)) {
      sessions.set(sid, {
        id: sid,
        playerId,
        startedAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messageCount: 0,
        status: "active",
      });
    }
    const session = sessions.get(sid)!;
    session.lastMessageAt = new Date().toISOString();
    session.messageCount += 1;

    const response = generateResponse(message);

    // Record decision
    const decision: IsabellaDecision = {
      id: `dec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playerId,
      type: "CHAT_RESPONSE",
      confidence: 0.85,
      payload: { message, response, intent: classifyIntent(message) },
      createdAt: new Date().toISOString(),
      mode: "NORMAL",
    };
    decisions.push(decision);

    res.status(200).json({
      ok: true,
      data: {
        sessionId: sid,
        response,
        decisionId: decision.id,
        mode: decision.mode,
        knowledgeUsed: classifyIntent(message) !== "default",
        messageCount: session.messageCount,
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/stream (SSE placeholder)
  //  Returns a Server-Sent Events stream of Isabella decisions.
  //  In production, this would use actual SSE; here it sends a single event.
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/isabella/stream", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const playerId = (req.query.playerId as string) ?? "anonymous";

    // Send initial connection event
    res.write(`data: ${JSON.stringify({
      type: "CONNECTED",
      playerId,
      timestamp: new Date().toISOString(),
      mode: "NORMAL",
    })}\n\n`);

    // Send a simulated decision after 2 seconds
    setTimeout(() => {
      const decision: IsabellaDecision = {
        id: `dec-sse-${Date.now()}`,
        playerId,
        type: "TERRITORIAL_SCAN",
        confidence: 0.9,
        payload: {
          territoryId: "ter-rdm",
          weather: "SUNNY",
          temperature: 18,
          activePlayers: Math.floor(Math.random() * 50) + 10,
          recommendation: "Visit the mine museum",
        },
        createdAt: new Date().toISOString(),
        mode: "NORMAL",
      };
      decisions.push(decision);
      res.write(`data: ${JSON.stringify(decision)}\n\n`);
    }, 2000);

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: "HEARTBEAT", timestamp: new Date().toISOString() })}\n\n`);
    }, 30000);

    req.on("close", () => {
      clearInterval(heartbeat);
      res.end();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/decisions
  //  Returns decision history for a player.
  //  Query: ?playerId=&limit=50
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/isabella/decisions", (req: Request, res: Response) => {
    const playerId = (req.query.playerId as string) ?? "anonymous";
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const playerDecisions = decisions
      .filter((d) => d.playerId === playerId)
      .slice(-limit)
      .reverse();

    res.status(200).json({
      ok: true,
      data: {
        playerId,
        decisions: playerDecisions,
        total: playerDecisions.length,
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/status
  //  Returns Isabella system health and metrics.
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/isabella/status", (_req: Request, res: Response) => {
    const activeSessions = [...sessions.values()].filter((s) => s.status === "active").length;
    const totalDecisions = decisions.length;
    const totalFeedback = feedback.length;
    const avgRating = totalFeedback > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

    res.status(200).json({
      ok: true,
      data: {
        status: "operational",
        mode: "NORMAL",
        uptime: process.uptime(),
        metrics: {
          activeSessions,
          totalDecisions,
          totalFeedback,
          avgRating: Math.round(avgRating * 100) / 100,
          knowledgeEntries: knowledgeBase.length,
        },
        capabilities: [
          "CONVERSATIONAL_AI",
          "TERRITORIAL_DECISIONS",
          "KNOWLEDGE_BASE",
          "SSE_STREAMING",
          "FEEDBACK_LEARNING",
          "TTS_VOICE",
        ],
        version: "1.0.0",
        lastHealthCheck: new Date().toISOString(),
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/feedback
  //  Submit user feedback on an Isabella interaction.
  //  Body: { playerId, decisionId, rating, comment? }
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/isabella/feedback", (req: Request, res: Response) => {
    const { playerId = "anonymous", decisionId = "", rating = 3, comment } = req.body ?? {};

    if (!decisionId || typeof decisionId !== "string") {
      res.status(400).json({ ok: false, error: "decisionId is required" });
      return;
    }

    const numRating = Math.max(1, Math.min(5, Math.round(Number(rating))));

    const entry: IsabellaFeedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playerId,
      decisionId,
      rating: numRating as 1 | 2 | 3 | 4 | 5,
      comment: typeof comment === "string" ? comment : undefined,
      createdAt: new Date().toISOString(),
    };
    feedback.push(entry);

    res.status(200).json({
      ok: true,
      data: {
        feedbackId: entry.id,
        rating: entry.rating,
        message: "Gracias por tu feedback. Mejorará la experiencia de Isabella.",
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/knowledge
  //  Returns knowledge base entries.
  //  Query: ?category=&q=&limit=20
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/isabella/knowledge", (req: Request, res: Response) => {
    const category = (req.query.category as string) ?? "";
    const query = (req.query.q as string)?.toLowerCase() ?? "";
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    let results = [...knowledgeBase];

    if (category) {
      results = results.filter((k) => k.category === category);
    }
    if (query) {
      results = results.filter(
        (k) =>
          k.topic.toLowerCase().includes(query) ||
          k.content.toLowerCase().includes(query),
      );
    }

    res.status(200).json({
      ok: true,
      data: results.slice(0, limit),
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/knowledge
  //  Add a new knowledge base entry.
  //  Body: { topic, content, category, source }
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/isabella/knowledge", (req: Request, res: Response) => {
    const { topic = "", content = "", category = "general", source = "manual" } = req.body ?? {};

    if (!topic || !content) {
      res.status(400).json({ ok: false, error: "topic and content are required" });
      return;
    }

    const entry: KnowledgeEntry = {
      id: `kb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      topic,
      content,
      category,
      source,
      confidence: 0.8,
      createdAt: new Date().toISOString(),
    };
    knowledgeBase.push(entry);

    res.status(201).json({
      ok: true,
      data: entry,
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/tts-isabella
  //  Text-to-Speech proxy for Isabella voice generation.
  //  Body: { text, emotion?, speed? }
  //  Returns mock audio metadata (real TTS would use a cloud provider).
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/tts-isabella", (req: Request, res: Response) => {
    const { text = "", emotion = "neutral", speed = 1.0 } = req.body ?? {};

    if (!text || typeof text !== "string") {
      res.status(400).json({ ok: false, error: "text is required" });
      return;
    }

    // Mock TTS response — in production, integrate with a TTS provider
    res.status(200).json({
      ok: true,
      data: {
        audioUrl: null, // Would be a signed URL to generated audio
        duration: Math.ceil(text.length / 15) * (1 / speed), // rough estimate
        emotion,
        speed,
        text: text.slice(0, 500), // truncated for metadata
        format: "mp3",
        sampleRate: 22050,
        voice: "isabella-es-MX",
        note: "Mock TTS response. Deploy Supabase Edge Function for real voice synthesis.",
      },
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  GET /api/isabella/sessions
  //  Returns active sessions for a player.
  //  Query: ?playerId=
  // ───────────────────────────────────────────────────────────────────────────
  router.get("/isabella/sessions", (req: Request, res: Response) => {
    const playerId = (req.query.playerId as string) ?? "anonymous";

    const playerSessions = [...sessions.values()]
      .filter((s) => s.playerId === playerId)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    res.status(200).json({
      ok: true,
      data: playerSessions,
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  //  POST /api/isabella/sessions/:id/close
  //  Close an active session.
  // ───────────────────────────────────────────────────────────────────────────
  router.post("/isabella/sessions/:id/close", (req: Request, res: Response) => {
    const session = sessions.get(req.params.id);
    if (!session) {
      res.status(404).json({ ok: false, error: "Session not found" });
      return;
    }

    session.status = "closed";
    res.status(200).json({
      ok: true,
      data: { sessionId: session.id, status: "closed" },
    });
  });
}
