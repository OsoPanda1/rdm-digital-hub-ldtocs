// ────────────────────────────────────────────────────────────────
// Search Routes — Búsqueda full-text del ecosistema
// GET/POST /api/search/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createSearchIndexer } from "../lib/search/indexer";

export function registerSearchRoutes(router: Router) {
  const indexer = createSearchIndexer();

  router.get("/search", (req: Request, res: Response) => {
    const query = (req.query.q as string) ?? "";
    const type = req.query.type as string | undefined;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    if (!query) { res.status(400).json({ ok: false, error: "q parameter required" }); return; }
    const results = indexer.search(query, type, limit);
    res.status(200).json({ ok: true, data: results });
  });

  router.get("/search/document/:id", (req: Request, res: Response) => {
    indexer.getDocument(req.params.id).then((doc) => {
      if (!doc) { res.status(404).json({ ok: false, error: "not_found" }); return; }
      res.status(200).json({ ok: true, data: doc });
    });
  });

  router.post("/search/index",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "search-index", limit: 30 }),
    async (req: Request, res: Response) => {
      const { type, title, content, tags, metadata } = req.body ?? {};
      if (!type || !title || !content) {
        res.status(400).json({ ok: false, error: "type, title, content required" }); return;
      }
      const doc = await indexer.index({ type, title, content, tags: tags ?? [], metadata: metadata ?? {} });
      auditSecurityEvent(req, "search.index", { docId: doc.docId, type });
      res.status(201).json({ ok: true, data: doc });
    }
  );

  router.delete("/search/document/:id",
    requireRdmRole("operator"),
    async (req: Request, res: Response) => {
      const removed = await indexer.removeDocument(req.params.id);
      res.status(200).json({ ok: removed });
    }
  );

  router.get("/search/stats", (_req: Request, res: Response) => {
    indexer.stats().then((stats) => res.status(200).json({ ok: true, data: stats }));
  });
}
