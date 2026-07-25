// ────────────────────────────────────────────────────────────────
// YUN Routes — Constitutional Realm API Surface
// ────────────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";
import {
  createYunSystem,
  type YunSystem,
  type PolicyInput,
  type PerceptionSignal,
  type YunDomain,
  type FederationId,
} from "../lib/yun";

const router = Router();

// Singleton YUN system
let yunSystem: YunSystem | null = null;

function getYun(): YunSystem {
  if (!yunSystem) yunSystem = createYunSystem(process.env.YUN_SIGNING_SECRET);
  return yunSystem;
}

// ── System Status ──────────────────────────────────────────────

router.get("/status", (_req: Request, res: Response) => {
  const yun = getYun();
  const mode = yun.resilience.getCurrentMode();
  const profile = yun.resilience.getProfile();
  const busStats = yun.bus.getStats();
  const registryStats = yun.registry.getStats();
  const policyStats = yun.policyEngine.getStats();
  const governanceStats = yun.governance.getGovernanceStats();
  const pqcStats = yun.pqc.getInventoryStats();

  res.json({
    ok: true,
    mode,
    constitution: {
      principles: 8,
      enforced: true,
    },
    bus: busStats,
    registry: registryStats,
    policies: policyStats,
    governance: governanceStats,
    pqc: pqcStats,
    perception: {
      signalsProcessed: yun.perception.getSignalCount(),
    },
    resilience: yun.resilience.getResilienceStats(),
  });
});

// ── Policy Engine ──────────────────────────────────────────────

router.post("/policy/evaluate", (req: Request, res: Response) => {
  const input: PolicyInput = req.body;
  if (!input.principal || !input.action || !input.resource || !input.context) {
    res.status(400).json({ ok: false, error: "Missing required fields: principal, action, resource, context." });
    return;
  }

  const yun = getYun();
  const result = yun.policyEngine.evaluate(input);

  if (!result.allowed) {
    yun.perception.ingestOpaDecisionLog({
      decision_id: result.decisionId,
      policy: "yun",
      timestamp: new Date().toISOString(),
      input,
      result: { allow: false, reasons: [result.reason] },
    });
  }

  res.json({ ok: true, decision: result });
});

router.get("/policy/history", (req: Request, res: Response) => {
  const yun = getYun();
  const limit = parseInt(req.query.limit as string) || 50;
  const decisions = yun.policyEngine.getDecisionHistory(limit);
  const violations = yun.policyEngine.getViolations();
  const stats = yun.policyEngine.getStats();

  res.json({
    ok: true,
    stats,
    recentDecisions: decisions,
    recentViolations: violations.slice(-20),
  });
});

router.get("/policy/stats", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, stats: yun.policyEngine.getStats() });
});

// ── Registry ───────────────────────────────────────────────────

router.post("/registry/nodes", (req: Request, res: Response) => {
  const yun = getYun();
  const node = yun.registry.registerNode(req.body);
  res.json({ ok: true, node });
});

router.get("/registry/nodes", (req: Request, res: Response) => {
  const yun = getYun();
  const domain = req.query.domain as YunDomain | undefined;
  const federation = req.query.federation as FederationId | undefined;

  if (domain) {
    res.json({ ok: true, nodes: yun.registry.findNodesByDomain(domain) });
  } else if (federation) {
    res.json({ ok: true, nodes: yun.registry.findNodesByFederation(federation) });
  } else {
    res.json({ ok: true, stats: yun.registry.getStats() });
  }
});

router.get("/registry/nodes/:nodeId", (req: Request, res: Response) => {
  const yun = getYun();
  const node = yun.registry.getNode(req.params.nodeId);
  if (!node) {
    res.status(404).json({ ok: false, error: "Node not found." });
    return;
  }
  res.json({ ok: true, node, binding: yun.registry.getBinding(req.params.nodeId) });
});

router.post("/registry/agents", (req: Request, res: Response) => {
  const yun = getYun();
  const agent = yun.registry.registerAgent(req.body);
  res.json({ ok: true, agent });
});

router.get("/registry/agents", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, agents: yun.registry.findActiveAgents() });
});

router.post("/registry/services", (req: Request, res: Response) => {
  const yun = getYun();
  const service = yun.registry.registerService(req.body);
  res.json({ ok: true, service });
});

router.get("/registry/licenses", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, licenses: yun.registry.getLicenses() });
});

router.post("/registry/licenses", (req: Request, res: Response) => {
  const yun = getYun();
  const license = yun.registry.issueLicense(req.body);
  res.json({ ok: true, license });
});

router.get("/registry/stats", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, stats: yun.registry.getStats() });
});

// ── Message Bus ────────────────────────────────────────────────

router.post("/bus/publish", (req: Request, res: Response) => {
  const yun = getYun();
  const mode = yun.resilience.getCurrentMode();
  const result = yun.bus.publish(req.body, mode);
  res.json({ ok: true, result });
});

router.get("/bus/history", (req: Request, res: Response) => {
  const yun = getYun();
  const domain = req.query.domain as YunDomain | undefined;
  const federation = req.query.federation as FederationId | undefined;
  const since = parseInt(req.query.since as string) || undefined;
  const limit = parseInt(req.query.limit as string) || 100;

  const events = yun.bus.getHistory({ domain, federation, since, limit });
  res.json({ ok: true, events, count: events.length });
});

router.get("/bus/state", (req: Request, res: Response) => {
  const yun = getYun();
  const mode = yun.resilience.getCurrentMode();
  res.json({ ok: true, state: yun.bus.getState(mode) });
});

router.get("/bus/stats", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, stats: yun.bus.getStats() });
});

// ── Resilience ─────────────────────────────────────────────────

router.get("/resilience/mode", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({
    ok: true,
    mode: yun.resilience.getCurrentMode(),
    profile: yun.resilience.getProfile(),
    stats: yun.resilience.getResilienceStats(),
  });
});

router.post("/resilience/transition", (req: Request, res: Response) => {
  const yun = getYun();
  const { to, trigger } = req.body;
  if (!to || !trigger) {
    res.status(400).json({ ok: false, error: "Missing 'to' and 'trigger' fields." });
    return;
  }
  const transition = yun.resilience.transition(to, trigger);
  res.json({ ok: true, transition });
});

router.post("/resilience/island-mode", (req: Request, res: Response) => {
  const yun = getYun();
  const { enter } = req.body;
  const services = enter ? yun.resilience.enterIslandMode() : yun.resilience.exitIslandMode();
  res.json({ ok: true, isIslandMode: enter, services });
});

router.get("/resilience/opa-profile", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, profile: yun.resilience.getOpaDegradationProfile() });
});

router.get("/resilience/history", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, transitions: yun.resilience.getTransitionHistory() });
});

// ── Perception ─────────────────────────────────────────────────

router.post("/perception/ingest", (req: Request, res: Response) => {
  const yun = getYun();
  const signal: PerceptionSignal = req.body;
  const event = yun.perception.ingestSignal(signal);
  res.json({ ok: true, event });
});

router.get("/perception/signals", (req: Request, res: Response) => {
  const yun = getYun();
  const limit = parseInt(req.query.limit as string) || 50;
  const source = req.query.source as PerceptionSignal["source"] | undefined;
  const signals = yun.perception.getRecentSignals(limit, source);
  res.json({ ok: true, signals, count: signals.length });
});

router.get("/perception/narrative", async (_req: Request, res: Response) => {
  const yun = getYun();
  const narrative = await yun.perception.getCurrentNarrative();
  res.json({ ok: true, narrative });
});

router.get("/perception/risk", async (_req: Request, res: Response) => {
  const yun = getYun();
  const risk = await yun.perception.getRiskAssessment();
  res.json({ ok: true, risk });
});

router.post("/perception/opa-log", (req: Request, res: Response) => {
  const yun = getYun();
  const event = yun.perception.ingestOpaDecisionLog(req.body);
  res.json({ ok: true, event });
});

// ── Governance ─────────────────────────────────────────────────

router.get("/governance/adrs", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, adrs: yun.governance.getADRs() });
});

router.get("/governance/adrs/:adrId", (req: Request, res: Response) => {
  const yun = getYun();
  const adr = yun.governance.getADR(req.params.adrId);
  if (!adr) {
    res.status(404).json({ ok: false, error: "ADR not found." });
    return;
  }
  const voteStatus = yun.governance.getVoteStatus(req.params.adrId);
  res.json({ ok: true, adr, voteStatus });
});

router.post("/governance/adrs", (req: Request, res: Response) => {
  const yun = getYun();
  const proposal = yun.governance.proposeADR(req.body);
  res.json({ ok: true, proposal });
});

router.post("/governance/vote", (req: Request, res: Response) => {
  const yun = getYun();
  const result = yun.governance.castVote(req.body);
  if (!result.success) {
    res.status(400).json({ ok: false, ...result });
    return;
  }
  res.json({ ok: true, ...result });
});

router.get("/governance/stats", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, stats: yun.governance.getGovernanceStats() });
});

// ── PQC Hybrid Crypto ─────────────────────────────────────────

router.post("/pqc/keys", (req: Request, res: Response) => {
  const yun = getYun();
  const key = yun.pqc.generateKeyPair(req.body);
  res.json({ ok: true, key });
});

router.get("/pqc/keys", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, inventory: yun.pqc.getInventory(), stats: yun.pqc.getInventoryStats() });
});

router.get("/pqc/keys/:keyId", (req: Request, res: Response) => {
  const yun = getYun();
  const key = yun.pqc.getKey(req.params.keyId);
  if (!key) {
    res.status(404).json({ ok: false, error: "Key not found." });
    return;
  }
  res.json({ ok: true, key });
});

router.post("/pqc/keys/:keyId/rotate", (req: Request, res: Response) => {
  const yun = getYun();
  const result = yun.pqc.rotateKey(req.params.keyId);
  if (!result) {
    res.status(404).json({ ok: false, error: "Key not found." });
    return;
  }
  res.json({ ok: true, oldKey: result.oldKey, newKey: result.newKey });
});

router.post("/pqc/keys/:keyId/revoke", (req: Request, res: Response) => {
  const yun = getYun();
  const success = yun.pqc.revokeKey(req.params.keyId);
  if (!success) {
    res.status(404).json({ ok: false, error: "Key not found." });
    return;
  }
  res.json({ ok: true });
});

router.get("/pqc/rotation-queue", (_req: Request, res: Response) => {
  const yun = getYun();
  res.json({ ok: true, keys: yun.pqc.getKeysNeedingRotation() });
});

router.post("/pqc/handshake", (req: Request, res: Response) => {
  const yun = getYun();
  const result = yun.pqc.hybridHandshake(req.body);
  res.json({ ok: true, handshake: result });
});

router.post("/pqc/sign", (req: Request, res: Response) => {
  const yun = getYun();
  const result = yun.pqc.hybridSign(req.body);
  res.json({ ok: true, signature: result });
});

router.post("/pqc/verify", (req: Request, res: Response) => {
  const yun = getYun();
  const result = yun.pqc.hybridVerify(req.body);
  res.json({ ok: true, ...result });
});

// ── Constitution ───────────────────────────────────────────────

router.get("/constitution/principles", (_req: Request, res: Response) => {
  // Lazy import to avoid circular dependencies
  const constitution = require("../lib/yun/constitution");
  res.json({
    ok: true,
    principles: constitution.CONSTITUTION_PRINCIPLES,
    sensitivityRules: constitution.SENSITIVITY_RULES,
    quorumRules: constitution.QUORUM_RULES,
    domainStorage: constitution.DOMAIN_STORAGE,
  });
});

export function registerYunRoutes(app: Router): void {
  app.use("/api/yun", router);
}

export default router;
