/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Economia F4 Routes â€” Transacciones, ledger territorial
// GET/POST /api/economia/*
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createEconomiaF4 } from "../lib/federation/economia-f4";
import { validate, schemas } from "../middlewares/validate";

export function registerEconomiaRoutes(router: Router) {
  const economia = createEconomiaF4();

  router.get("/economia/transactions", requireRdmRole("operator"), (_req: Request, res: Response) => {
    const txns = economia.listTransactions();
    res.status(200).json({ ok: true, data: txns });
  });

  router.get("/economia/ledger", requireRdmRole("operator"), (_req: Request, res: Response) => {
    const ledger = economia.getTerritoryLedger();
    res.status(200).json({ ok: true, data: ledger });
  });

  router.get("/economia/plusvalia", (req: Request, res: Response) => {
    const territoryId = (req.query.territoryId as string) ?? "ter-rdm";
    const plusvalia = economia.calculatePlusvalia(territoryId);
    res.status(200).json({ ok: true, data: plusvalia });
  });

  router.post("/economia/transaction",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "economia-tx", limit: 20 }),
    validate(schemas.economiaTransaction),
    async (req: Request, res: Response) => {
      const { fromId, toId, amount, type, description } = req.body ?? {};
      if (!fromId || !toId || !amount) {
        res.status(400).json({ ok: false, error: "fromId, toId, amount required" }); return;
      }
      const tx = await economia.createTransaction({ fromId, toId, amount: Number(amount), type: type ?? "transfer", description: description ?? "" });
      auditSecurityEvent(req, "economia.transaction", { txId: tx.txId, amount });
      res.status(201).json({ ok: true, data: tx });
    }
  );

  router.get("/economia/stats", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: economia.stats() });
  });
}
