/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Isabella Memory Routes â€” Multiscale RAG, PRA Score
// GET/POST /api/memory/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response, NextFunction } from "express";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { createMultiscaleRag } from "../lib/isabella/memory/multiscale-rag";
import { createScorePra } from "../lib/isabella/memory/score-pra";

export function registerIsabellaMemoryRoutes(router: Router) {
  // ⚠️ IN-MEMORY — rag/pra stores LOST ON SERVER RESTART
  const rag = createMultiscaleRag();
  const pra = createScorePra();

  router.get("/memory/rag/status", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: rag.stats() });
  });

  router.post("/memory/rag/query",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "memory-rag", limit: 30 }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { query, types, limit } = req.body ?? {};
        if (!query) { res.status(400).json({ ok: false, error: "query required" }); return; }
        const results = await rag.query(query, types, limit);
        res.status(200).json({ ok: true, data: results });
      } catch (err) { next(err); }
    }
  );

  router.post("/memory/store",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "memory-store", limit: 20 }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { type, content, tags, source, ttl, confidence } = req.body ?? {};
        if (!type || !content) { res.status(400).json({ ok: false, error: "type and content required" }); return; }
        const entry = await rag.store({ type, content, tags: tags ?? [], source: source ?? "api", ttl, confidence: confidence ?? 0.5 });
        res.status(201).json({ ok: true, data: entry });
      } catch (err) { next(err); }
    }
  );

  router.post("/memory/pra/score",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "memory-pra", limit: 30 }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { contentId, timestamp, frequency } = req.body ?? {};
        if (!contentId) { res.status(400).json({ ok: false, error: "contentId required" }); return; }
        const score = pra.score(contentId, { timestamp: timestamp ?? Date.now(), frequency: frequency ?? 1 });
        res.status(200).json({ ok: true, data: score });
      } catch (err) { next(err); }
    }
  );

  router.get("/memory/stats", requireRdmRole("user"), (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: rag.stats() });
  });
}
