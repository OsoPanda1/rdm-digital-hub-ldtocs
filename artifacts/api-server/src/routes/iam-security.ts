// ────────────────────────────────────────────────────────────────
// IAM Security Routes — Passkeys, Vault, ITDR
// GET/POST /api/iam/*
// ────────────────────────────────────────────────────────────────

import type { Router, Request, Response } from "express";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { createPasskeys } from "../lib/iam/passkeys";
import { createVaultClient } from "../lib/iam/vault-client";
import { createItdrMonitor } from "../lib/iam/itdr-monitor";

export function registerIamSecurityRoutes(router: Router) {
  const passkeys = createPasskeys();
  const vault = createVaultClient();
  const itdr = createItdrMonitor();

  router.get("/iam/status", requireRdmRole("operator"), (_req: Request, res: Response) => {
    Promise.all([passkeys.stats(), vault.stats(), itdr.stats()]).then(([pk, v, td]) => {
      res.status(200).json({ ok: true, data: { passkeys: pk, vault: v, itdr: td } });
    });
  });

  router.post("/iam/passkeys/challenge",
    rateLimitByRoute({ name: "iam-challenge", limit: 10 }),
    async (req: Request, res: Response) => {
      const { userId } = req.body ?? {};
      if (!userId) { res.status(400).json({ ok: false, error: "userId required" }); return; }
      const challenge = await passkeys.generateChallenge(userId);
      res.status(200).json({ ok: true, data: challenge });
    }
  );

  router.post("/iam/passkeys/register",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "iam-passkey-reg", limit: 10 }),
    async (req: Request, res: Response) => {
      const { userId, publicKey, counter } = req.body ?? {};
      if (!userId || !publicKey) { res.status(400).json({ ok: false, error: "userId and publicKey required" }); return; }
      const cred = await passkeys.registerCredential(userId, { publicKey, counter: counter ?? 0 });
      auditSecurityEvent(req, "iam.passkey_register", { userId });
      res.status(201).json({ ok: true, data: cred });
    }
  );

  router.get("/iam/passkeys/:userId",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "iam-passkeys-list", limit: 20 }),
    (req: Request, res: Response) => {
      passkeys.listByUser(req.params.userId).then((creds) => {
        res.status(200).json({ ok: true, data: creds });
      });
    }
  );

  router.get("/iam/vault/secrets", requireRdmRole("admin"), (_req: Request, res: Response) => {
    vault.listSecrets().then((secrets) => res.status(200).json({ ok: true, data: secrets }));
  });

  router.post("/iam/vault/write",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "iam-vault-write", limit: 10 }),
    async (req: Request, res: Response) => {
      const { key, value, ttl } = req.body ?? {};
      if (!key || !value) { res.status(400).json({ ok: false, error: "key and value required" }); return; }
      const secret = await vault.writeSecret(key, value, ttl);
      auditSecurityEvent(req, "iam.vault_write", { key });
      res.status(201).json({ ok: true, data: secret });
    }
  );

  router.get("/iam/itdr/threats", requireRdmRole("admin"), (req: Request, res: Response) => {
    const severity = req.query.severity as string | undefined;
    itdr.getThreats(undefined, severity as any).then((threats) => {
      res.status(200).json({ ok: true, data: threats });
    });
  });

  router.get("/iam/itdr/stats", requireRdmRole("operator"), (_req: Request, res: Response) => {
    itdr.stats().then((stats) => res.status(200).json({ ok: true, data: stats }));
  });
}
