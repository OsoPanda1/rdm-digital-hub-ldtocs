// ────────────────────────────────────────────────────────────────
// Wiki Editor Routes — CRUD completo de artículos wiki
// GET/POST/PUT/DELETE /api/wiki-editor/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createWikiEngine } from "../lib/wiki/engine";

export function registerWikiEditorRoutes(router: Router) {
  const wiki = createWikiEngine();

  router.get("/wiki-editor/articles", requireRdmRole("operator"), (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const status = req.query.status as string | undefined;
    const articles = wiki.listArticles(category, status);
    res.status(200).json({ ok: true, data: articles });
  });

  router.get("/wiki-editor/article/:id", requireRdmRole("operator"), (req: Request, res: Response) => {
    const article = wiki.getArticle(req.params.id);
    if (!article) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    res.status(200).json({ ok: true, data: article });
  });

  router.post("/wiki-editor/article",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "wiki-editor-create", limit: 10 }),
    async (req: Request, res: Response) => {
      const { slug, title, content, category, authorId, tags, status } = req.body ?? {};
      if (!slug || !title || !content || !authorId) {
        res.status(400).json({ ok: false, error: "slug, title, content, authorId required" }); return;
      }
      const article = await wiki.createArticle({
        slug, title, content, category: category ?? "historia",
        authorId, tags: tags ?? [], status: status ?? "draft",
      });
      auditSecurityEvent(req, "wiki.create_article", { articleId: article.articleId });
      res.status(201).json({ ok: true, data: article });
    }
  );

  router.put("/wiki-editor/article/:id",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "wiki-editor-update", limit: 20 }),
    async (req: Request, res: Response) => {
      const { content, authorId, message } = req.body ?? {};
      if (!content || !authorId) {
        res.status(400).json({ ok: false, error: "content and authorId required" }); return;
      }
      const article = await wiki.updateArticle(req.params.id, content, authorId, message ?? "Updated");
      if (!article) { res.status(404).json({ ok: false, error: "not_found" }); return; }
      auditSecurityEvent(req, "wiki.update_article", { articleId: article.articleId, version: article.version });
      res.status(200).json({ ok: true, data: article });
    }
  );

  router.delete("/wiki-editor/article/:id",
    requireRdmRole("federation_auditor"),
    async (req: Request, res: Response) => {
      const removed = await wiki.deleteArticle(req.params.id);
      auditSecurityEvent(req, "wiki.delete_article", { articleId: req.params.id });
      res.status(200).json({ ok: removed });
    }
  );

  router.get("/wiki-editor/stats", requireRdmRole("operator"), (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: wiki.stats() });
  });
}
