/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Admin Routes â€” AuditorÃ­a, estadÃ­sticas del sistema
// GET/POST /api/admin/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response, NextFunction } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createAdminAuditLog } from "../lib/admin/audit-log";
import { validate, schemas } from "../middlewares/validate";

export function registerAdminRoutes(router: Router) {
  const auditLog = createAdminAuditLog();

  router.get("/admin/audit", requireRdmRole("admin"), (req: Request, res: Response, next: NextFunction) => {
    const { actor, action, severity, since, until } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    auditLog.query({
      actor: actor as string,
      action: action as string,
      severity: severity as any,
      since: since as string,
      until: until as string,
      limit,
    }).then((entries) => res.status(200).json({ ok: true, data: entries })).catch(next);
  });

  router.get("/admin/audit/:id", requireRdmRole("admin"), (req: Request, res: Response, next: NextFunction) => {
    auditLog.getEntry(req.params.id).then((entry) => {
      if (!entry) { res.status(404).json({ ok: false, error: "not_found" }); return; }
      res.status(200).json({ ok: true, data: entry });
    }).catch(next);
  });

  router.get("/admin/audit/stats", requireRdmRole("admin"), (req: Request, res: Response, next: NextFunction) => {
    const since = req.query.since as string | undefined;
    auditLog.getStats(since).then((stats) => res.status(200).json({ ok: true, data: stats })).catch(next);
  });

  router.get("/admin/audit/export", requireRdmRole("federation_auditor"), (req: Request, res: Response, next: NextFunction) => {
    const format = (req.query.format as string) === "csv" ? "csv" : "json";
    auditLog.exportEntries(format).then((data) => {
      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=audit-export.csv");
      }
      res.status(200).send(data);
    }).catch(next);
  });

  router.post("/admin/audit/record",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "admin-audit-record", limit: 50 }),
    validate(schemas.adminAuditRecord),
    async (req: Request, res: Response) => {
      const { actor, actorRole, action, target, details, sourceIp, severity } = req.body ?? {};
      if (!actor || !action) {
        res.status(400).json({ ok: false, error: "actor and action required" }); return;
      }
      const entry = await auditLog.record({
        actor, actorRole: actorRole ?? "admin", action, target: target ?? "",
        details: details ?? {}, sourceIp: sourceIp ?? "unknown", severity: severity ?? "info",
      });
      res.status(201).json({ ok: true, data: entry });
    }
  );
}
