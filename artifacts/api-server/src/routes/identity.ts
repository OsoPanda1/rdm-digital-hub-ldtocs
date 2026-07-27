// ────────────────────────────────────────────────────────────────
// Identity F1 Routes — Ciudadanos, roles, credenciales
// GET/POST /api/identity/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createIdentityF1 } from "../lib/federation/identity-f1";
import { validate, schemas } from "../middlewares/validate";

export function registerIdentityRoutes(router: Router) {
  const identity = createIdentityF1();

  router.get("/identity/citizens", requireRdmRole("operator"), (_req: Request, res: Response) => {
    const citizens = identity.listCitizens();
    res.status(200).json({ ok: true, data: citizens });
  });

  router.get("/identity/citizen/:id", (req: Request, res: Response) => {
    const citizen = identity.getCitizen(req.params.id);
    if (!citizen) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    res.status(200).json({ ok: true, data: citizen });
  });

  router.post("/identity/citizen",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "identity-create", limit: 10 }),
    validate(schemas.identityCitizen),
    async (req: Request, res: Response) => {
      const { name, email, role = "citizen" } = req.body ?? {};
      if (!name || !email) { res.status(400).json({ ok: false, error: "name and email required" }); return; }
      const citizen = await identity.createCitizen({ name, email, role });
      auditSecurityEvent(req, "identity.create_citizen", { citizenId: citizen.citizenId });
      res.status(201).json({ ok: true, data: citizen });
    }
  );

  router.post("/identity/assign-role",
    requireRdmRole("federation_auditor"),
    rateLimitByRoute({ name: "identity-role", limit: 20 }),
    validate(schemas.identityAssignRole),
    async (req: Request, res: Response) => {
      const { citizenId, role } = req.body ?? {};
      if (!citizenId || !role) { res.status(400).json({ ok: false, error: "citizenId and role required" }); return; }
      const ok = await identity.assignRole(citizenId, role);
      auditSecurityEvent(req, "identity.assign_role", { citizenId, role });
      res.status(200).json({ ok, data: { citizenId, role } });
    }
  );

  router.get("/identity/roles", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: identity.listRoles() });
  });
}
