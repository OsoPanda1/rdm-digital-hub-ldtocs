/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Agents F6 Routes â€” Catálogo de agentes, HITL triggers
// GET/POST /api/agents/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response, NextFunction } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createAgentRegistry } from "../lib/federation/agents-registry";
import { validate, schemas } from "../middlewares/validate";

export function registerAgentsRoutes(router: Router) {
  const registry = createAgentRegistry();

  router.get("/agents/list", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const agents = await registry.list();
      res.status(200).json({ ok: true, data: agents });
    } catch (err) { next(err); }
  });

  router.get("/agents/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const agent = await registry.get(req.params.id);
      if (!agent) { res.status(404).json({ ok: false, error: "not_found" }); return; }
      res.status(200).json({ ok: true, data: agent });
    } catch (err) { next(err); }
  });

  router.get("/agents/:id/triggers", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const triggers = await registry.getTriggers(req.params.id);
      res.status(200).json({ ok: true, data: triggers });
    } catch (err) { next(err); }
  });

  router.post("/agents/register",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "agents-register", limit: 10 }),
    validate(schemas.agentRegister),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, domain, capabilities, permissions, autonomyLevel } = req.body ?? {};
        if (!name || !domain) { res.status(400).json({ ok: false, error: "name and domain required" }); return; }
        const agent = await registry.register({
          name, domain, capabilities: capabilities ?? [], permissions: permissions ?? [],
          autonomyLevel: autonomyLevel ?? "supervised", status: "active",
        });
        auditSecurityEvent(req, "agents.register", { agentId: agent.agentId });
        res.status(201).json({ ok: true, data: agent });
      } catch (err) { next(err); }
    }
  );

  router.post("/agents/:id/trigger",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "agents-trigger", limit: 20 }),
    validate(schemas.agentTrigger),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { condition, action } = req.body ?? {};
        if (!condition || !action) { res.status(400).json({ ok: false, error: "condition and action required" }); return; }
        const trigger = await registry.addTrigger({ agentId: req.params.id, condition, action });
        res.status(201).json({ ok: true, data: trigger });
      } catch (err) { next(err); }
    }
  );

  router.get("/agents/stats", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await registry.stats();
      res.status(200).json({ ok: true, data: stats });
    } catch (err) { next(err); }
  });
}
