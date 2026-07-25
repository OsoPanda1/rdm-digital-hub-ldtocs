// ────────────────────────────────────────────────────────────────
// Maps Routes — Turismo F3 — POIs, rutas, heatmap
// GET/POST /api/maps/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { createTurismoF3 } from "../lib/federation/turismo-f3";

export function registerMapsRoutes(router: Router) {
  const turismo = createTurismoF3();

  router.get("/maps/pois", (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    const pois = turismo.listPois(category);
    res.status(200).json({ ok: true, data: pois });
  });

  router.get("/maps/poi/:id", (req: Request, res: Response) => {
    const poi = turismo.getPoi(req.params.id);
    if (!poi) { res.status(404).json({ ok: false, error: "not_found" }); return; }
    res.status(200).json({ ok: true, data: poi });
  });

  router.get("/maps/routes", (_req: Request, res: Response) => {
    const routes = turismo.listRoutes();
    res.status(200).json({ ok: true, data: routes });
  });

  router.get("/maps/heatmap", (_req: Request, res: Response) => {
    const heatmap = turismo.getHeatmap();
    res.status(200).json({ ok: true, data: heatmap });
  });

  router.post("/maps/poi",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "maps-create-poi", limit: 10 }),
    async (req: Request, res: Response) => {
      const { name, description, lat, lng, category } = req.body ?? {};
      if (!name || lat == null || lng == null) {
        res.status(400).json({ ok: false, error: "name, lat, lng required" }); return;
      }
      const poi = await turismo.createPoi({ name, description: description ?? "", lat, lng, category: category ?? "general" });
      res.status(201).json({ ok: true, data: poi });
    }
  );
}
