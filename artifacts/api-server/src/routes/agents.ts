// ────────────────────────────────────────────────────────────────
// Agents F6 Routes — Catálogo de agentes, HITL triggers
// GET/POST /api/agents/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createAgentRegistry } from "../lib/federation/agents-registry";
import { validate, schemas } from "../middlewares/validate";

export function registerAgentsRoutes(router: Router) {
  const registry = createAgentRegistry();

  router.get("/agents/list", (_req: Request, res: Response) => {
    registry.list().then((agents) => res.status(200).json({ ok: true, data: agents }));
  });

  router.get("/agents/:id", (req: Request, res: Response) => {
    registry.get(req.params.id).then((agent) => {
      if (!agent) { res.status(404).json({ ok: false, error: "not_found" }); return; }
      res.status(200).json({ ok: true, data: agent });
    });
  });

  router.get("/agents/:id/triggers", (req: Request, res: Response) => {
    registry.getTriggers(req.params.id).then((triggers) => {
      res.status(200).json({ ok: true, data: triggers });
    });
  });

  router.post("/agents/register",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "agents-register", limit: 10 }),
    validate(schemas.agentRegister),
    async (req: Request, res: Response) => {
      const { name, domain, capabilities, permissions, autonomyLevel } = req.body ?? {};
      if (!name || !domain) { res.status(400).json({ ok: false, error: "name and domain required" }); return; }
      const agent = await registry.register({
        name, domain, capabilities: capabilities ?? [], permissions: permissions ?? [],
        autonomyLevel: autonomyLevel ?? "supervised", status: "active",
      });
      auditSecurityEvent(req, "agents.register", { agentId: agent.agentId });
      res.status(201).json({ ok: true, data: agent });
    }
  );

  router.post("/agents/:id/trigger",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "agents-trigger", limit: 20 }),
    validate(schemas.agentTrigger),
    async (req: Request, res: Response) => {
      const { condition, action } = req.body ?? {};
      if (!condition || !action) { res.status(400).json({ ok: false, error: "condition and action required" }); return; }
      const trigger = await registry.addTrigger({ agentId: req.params.id, condition, action });
      res.status(201).json({ ok: true, data: trigger });
    }
  );

  router.get("/agents/stats", (_req: Request, res: Response) => {
    registry.stats().then((stats) => res.status(200).json({ ok: true, data: stats }));
  });
}
