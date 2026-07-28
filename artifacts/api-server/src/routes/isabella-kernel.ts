/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” API Routes
// POST /api/kernel/process â€” Run full cognitive cycle
// GET  /api/kernel/stats   â€” Kernel statistics
// GET  /api/kernel/memory  â€” Memory stats
// GET  /api/kernel/emergency â€” Emergency state
// POST /api/kernel/emergency/trigger â€” Trigger emergency
// POST /api/kernel/emergency/shutdown â€” Emergency shutdown
// POST /api/kernel/emergency/rollback â€” Rollback emergency
// POST /api/kernel/emergency/clear â€” Clear emergency state
// GET  /api/kernel/evaluator â€” Evaluation metrics
// GET  /api/kernel/evaluator/trends â€” Evaluation trends
// GET  /api/kernel/evaluator/alerts â€” Active alerts
// GET  /api/kernel/verifier â€” Verification history
// GET  /api/kernel/learning â€” Learning history
// GET  /api/kernel/learning/errors â€” Error patterns
// GET  /api/kernel/capabilities â€” List capabilities
// POST /api/kernel/capabilities/:id/toggle â€” Toggle capability
// GET  /api/kernel/plans â€” List plans
// POST /api/kernel/plans â€” Create plan
// GET  /api/kernel/knowledge â€” Knowledge graph stats
// POST /api/kernel/knowledge/entities â€” Add entity
// POST /api/kernel/knowledge/relations â€” Add relation
// POST /api/kernel/knowledge/search â€” Search entities
// POST /api/kernel/knowledge/query â€” Query graph
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import type { Router, Request, Response } from "express";
import { createCognitiveKernel } from "../lib/isabella/kernel";
import { requireRdmRole, rateLimitByRoute, auditSecurityEvent } from "../lib/security";
import { validate, schemas } from "../middlewares/validate";

// ⚠️ IN-MEMORY — kernel singleton LOST ON SERVER RESTART
const kernel = createCognitiveKernel();

export function registerKernelRoutes(router: Router) {

  // â”€â”€ Core Processing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.post("/kernel/process",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "kernel-process", limit: 30 }),
    validate({ message: { type: "string", required: true, min: 1, max: 10000 } }),
    async (req: Request, res: Response) => {
      const { message } = req.body;
      const identity = (req as any).rdmIdentity ?? { subject: "anonymous" };
      const sessionId = `session-${Date.now()}`;

      try {
        const response = await kernel.process(message, identity.subject, sessionId, {
          priority: "normal",
          securityLevel: "public",
        });

        auditSecurityEvent(req, "kernel.process", {
          requestId: response.requestId,
          confidence: response.confidence.overall,
          verificationPassed: response.verification.passed,
        });

        res.status(200).json({
          ok: true,
          data: {
            output: response.output,
            confidence: response.confidence,
            verification: {
              passed: response.verification.passed,
              score: response.verification.overallScore,
            },
            phases: response.metadata.phasesCompleted,
            latencyMs: response.metadata.totalLatencyMs,
            capabilities: response.metadata.capabilitiesUsed,
            auditId: response.audit.id,
          },
        });
      } catch (err) {
        console.error("[kernel/process] Unhandled error:", err);
        res.status(500).json({ ok: false, error: "Internal server error" });
      }
    },
  );

  // â”€â”€ Kernel Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/stats", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.getKernelStats() });
  });

  // â”€â”€ Memory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/memory", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.memory.getStats() });
  });

  router.get("/kernel/memory/query", requireRdmRole("operator"), (req: Request, res: Response) => {
    const { text = "", levels, limit = 10 } = req.query;
    const memoryLevels = levels
      ? String(levels).split(",") as any
      : ["L0_immediate", "L1_session", "L2_project"];
    const results = kernel.memory.query({
      text: String(text),
      levels: memoryLevels,
      limit: Math.min(Number(limit) || 10, 50),
      minConfidence: 0.1,
    });
    res.status(200).json({ ok: true, data: results });
  });

  // â”€â”€ Emergency â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/emergency", requireRdmRole("operator"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.emergency.getState() });
  });

  router.post("/kernel/emergency/trigger",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "kernel-emergency", limit: 5 }),
    validate({
      level: { type: "string", required: true, enum: ["watch", "alert", "critical", "shutdown"] },
      reason: { type: "string", required: true, min: 1, max: 500 },
    }),
    (req: Request, res: Response) => {
      const { level, reason } = req.body;
      const identity = (req as any).rdmIdentity ?? { subject: "admin" };
      const actions = kernel.emergency.trigger(level, reason, identity.subject);
      auditSecurityEvent(req, "kernel.emergency.trigger", { level, reason });
      res.status(200).json({ ok: true, data: { level, actions, state: kernel.emergency.getState() } });
    },
  );

  router.post("/kernel/emergency/shutdown",
    requireRdmRole("admin"),
    rateLimitByRoute({ name: "kernel-shutdown", limit: 3 }),
    validate({ reason: { type: "string", required: true, min: 1, max: 500 } }),
    (req: Request, res: Response) => {
      const { reason } = req.body;
      const identity = (req as any).rdmIdentity ?? { subject: "admin" };
      const actions = kernel.emergency.shutdown(reason, identity.subject);
      auditSecurityEvent(req, "kernel.emergency.shutdown", { reason });
      res.status(200).json({ ok: true, data: { actions, state: kernel.emergency.getState() } });
    },
  );

  router.post("/kernel/emergency/rollback",
    requireRdmRole("admin"),
    (req: Request, res: Response) => {
      const success = kernel.emergency.rollback();
      auditSecurityEvent(req, "kernel.emergency.rollback", { success });
      res.status(200).json({ ok: true, data: { success, state: kernel.emergency.getState() } });
    },
  );

  router.post("/kernel/emergency/clear",
    requireRdmRole("admin"),
    (req: Request, res: Response) => {
      kernel.emergency.clear();
      auditSecurityEvent(req, "kernel.emergency.clear", {});
      res.status(200).json({ ok: true, data: kernel.emergency.getState() });
    },
  );

  // â”€â”€ Evaluator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/evaluator", requireRdmRole("user"), (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.status(200).json({
      ok: true,
      data: {
        aggregate: kernel.evaluator.getAggregate(),
        recent: kernel.evaluator.getHistory(limit),
      },
    });
  });

  router.get("/kernel/evaluator/trends", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.evaluator.getTrends() });
  });

  router.get("/kernel/evaluator/alerts", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.evaluator.getAlerts() });
  });

  // â”€â”€ Verifier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/verifier", requireRdmRole("user"), (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.status(200).json({ ok: true, data: kernel.verifier.getCheckHistory(limit) });
  });

  // â”€â”€ Learning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/learning", requireRdmRole("user"), (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    res.status(200).json({
      ok: true,
      data: {
        history: kernel.learning.getHistory(limit),
        metrics: kernel.learning.getImprovementMetrics(),
      },
    });
  });

  router.get("/kernel/learning/errors", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.learning.getErrorPatterns() });
  });

  // â”€â”€ Capabilities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/capabilities", requireRdmRole("user"), (req: Request, res: Response) => {
    const caps = kernel.capabilityFabric.getAllCapabilities();
    const metrics = caps.map((c) => ({
      ...c,
      metrics: kernel.capabilityFabric.getMetrics(c.id),
    }));
    res.status(200).json({ ok: true, data: metrics });
  });

  router.post("/kernel/capabilities/:id/toggle",
    requireRdmRole("admin"),
    validate({ enabled: { type: "boolean", required: true } }),
    (req: Request, res: Response) => {
      const { enabled } = req.body;
      kernel.capabilityFabric.enableCapability(req.params.id as any, enabled);
      res.status(200).json({ ok: true, data: { id: req.params.id, enabled } });
    },
  );

  // â”€â”€ Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/plans", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.planner.listPlans() });
  });

  router.post("/kernel/plans",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "kernel-plans", limit: 10 }),
    validate({ objective: { type: "string", required: true, min: 1, max: 5000 } }),
    (req: Request, res: Response) => {
      const { objective } = req.body;
      const plan = kernel.planner.createPlan(objective);
      res.status(201).json({ ok: true, data: plan });
    },
  );

  // â”€â”€ Knowledge Graph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.get("/kernel/knowledge", requireRdmRole("user"), (req: Request, res: Response) => {
    res.status(200).json({ ok: true, data: kernel.knowledgeGraph.getStats() });
  });

  router.post("/kernel/knowledge/entities",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "kernel-entities", limit: 30 }),
    validate({
      kind: { type: "string", required: true, enum: ["territory", "commerce", "person", "building", "route", "event", "document", "project", "organization", "concept", "artifact"] },
      name: { type: "string", required: true, min: 1, max: 200 },
      description: { type: "string", required: false, max: 2000 },
    }),
    (req: Request, res: Response) => {
      const { kind, name, description = "", properties = {} } = req.body;
      const entity = kernel.knowledgeGraph.addEntity({
        kind, name, description, properties, confidence: 0.8, source: "api",
      });
      res.status(201).json({ ok: true, data: entity });
    },
  );

  router.post("/kernel/knowledge/relations",
    requireRdmRole("operator"),
    validate({
      sourceId: { type: "string", required: true },
      targetId: { type: "string", required: true },
      type: { type: "string", required: true, min: 1, max: 100 },
    }),
    (req: Request, res: Response) => {
      const { sourceId, targetId, type, weight = 1.0, bidirectional = false } = req.body;
      const rel = kernel.knowledgeGraph.addRelation({
        sourceId, targetId, type, weight, bidirectional, properties: {},
      });
      res.status(201).json({ ok: true, data: rel });
    },
  );

  router.post("/kernel/knowledge/search",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "kernel-kg-search", limit: 30 }),
    validate({ query: { type: "string", required: true, min: 1, max: 200 } }),
    (req: Request, res: Response) => {
      const { query, kinds } = req.body;
      const results = kernel.knowledgeGraph.searchEntities(query, kinds);
      res.status(200).json({ ok: true, data: results });
    },
  );

  router.post("/kernel/knowledge/query",
    requireRdmRole("user"),
    rateLimitByRoute({ name: "kernel-kg-query", limit: 20 }),
    validate({
      startEntityId: { type: "string", required: true },
      maxDepth: { type: "number", required: false, min: 1, max: 5 },
    }),
    (req: Request, res: Response) => {
      const { startEntityId, relationTypes, maxDepth = 2, maxResults = 20, minWeight = 0.1 } = req.body;
      const result = kernel.knowledgeGraph.queryGraph({
        startEntityId, relationTypes, maxDepth, maxResults, minWeight,
      });
      res.status(200).json({ ok: true, data: result });
    },
  );

  // â”€â”€ Simulation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  router.post("/kernel/simulate",
    requireRdmRole("operator"),
    rateLimitByRoute({ name: "kernel-simulate", limit: 10 }),
    validate({ objective: { type: "string", required: true, min: 1, max: 5000 } }),
    (req: Request, res: Response) => {
      const { objective } = req.body;
      const scenarios = kernel.simulation.createScenarios(objective);
      const results = scenarios.map((s) => kernel.simulation.simulate(s));
      const comparison = kernel.simulation.compare(results);
      res.status(200).json({ ok: true, data: comparison });
    },
  );
}
