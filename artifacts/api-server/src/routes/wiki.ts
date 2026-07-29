/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Wiki Routes â€” Patrimonio F2 â€” Artículos del patrimonio
// GET/POST /api/wiki/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { createWikiEngine } from "../lib/wiki/engine";

export function registerWikiRoutes(router: Router) {
  const wiki = createWikiEngine();

  router.get("/wiki/articles", (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const articles = wiki.listArticles(category, status);
    res.status(200).json({ ok: true, data: articles });
  });

  router.get("/wiki/article/:id", (req: Request, res: Response) => {
    const article = wiki.getArticle(req.params.id);
    if (!article) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    res.status(200).json({ ok: true, data: article });
  });

  router.get("/wiki/article/:id/revisions", (req: Request, res: Response) => {
    const revisions = wiki.getRevisions(req.params.id);
    res.status(200).json({ ok: true, data: revisions });
  });

  router.get("/wiki/search", (req: Request, res: Response) => {
    const query = (req.query.q as string) ?? "";
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const results = wiki.searchArticles(query, limit);
    res.status(200).json({ ok: true, data: results });
  });

  router.get("/wiki/stats", (_req: Request, res: Response) => {
    const stats = wiki.stats();
    res.status(200).json({ ok: true, data: stats });
  });
}
