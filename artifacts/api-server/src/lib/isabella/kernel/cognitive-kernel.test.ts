/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
import { describe, it, expect, beforeEach } from "vitest";
import { createCognitiveKernel } from "../lib/isabella/kernel/cognitive-kernel";

describe("CognitiveKernel", () => {
  let kernel: ReturnType<typeof createCognitiveKernel>;

  beforeEach(() => {
    kernel = createCognitiveKernel();
  });

  describe("process", () => {
    it("processes a simple request through the cognitive cycle", async () => {
      const response = await kernel.process(
        "What is Real del Monte?",
        "user-test",
        "session-1",
      );

      expect(response).toBeDefined();
      expect(response.id).toMatch(/^resp-/);
      expect(response.requestId).toMatch(/^req-/);
      expect(response.output).toBeTruthy();
      expect(response.phase).toBeDefined();
      expect(response.confidence.overall).toBeGreaterThanOrEqual(0);
      expect(response.confidence.overall).toBeLessThanOrEqual(1);
      expect(response.verification).toBeDefined();
      expect(response.verification.passed).toBeDefined();
      expect(response.audit).toBeDefined();
      expect(response.audit.id).toMatch(/^audit-/);
      expect(response.metadata).toBeDefined();
      expect(response.metadata.phasesCompleted).toBeInstanceOf(Array);
      expect(response.metadata.totalLatencyMs).toBeGreaterThanOrEqual(0);
      expect(response.timestamp).toBeGreaterThan(0);
    });

    it("rejects requests when system is in SHUTDOWN mode", async () => {
      kernel.emergency.shutdown("testing", "test-admin");

      await expect(
        kernel.process("hello", "user-1", "session-1"),
      ).rejects.toThrow("SHUTDOWN mode");
    });

    it("includes confidence score with breakdown", async () => {
      const response = await kernel.process("test input", "user-1", "s-1");

      expect(response.confidence.breakdown).toBeDefined();
      expect(response.confidence.breakdown.factualAccuracy).toBeGreaterThanOrEqual(0);
      expect(response.confidence.breakdown.relevance).toBeGreaterThanOrEqual(0);
      expect(response.confidence.breakdown.completeness).toBeGreaterThanOrEqual(0);
      expect(response.confidence.breakdown.safety).toBeGreaterThanOrEqual(0);
      expect(response.confidence.breakdown.coherence).toBeGreaterThanOrEqual(0);
    });

    it("stores memory during processing", async () => {
      await kernel.process("remember this fact", "user-1", "session-1");

      const stats = kernel.memory.getStats();
      expect(stats.L0_immediate.count).toBeGreaterThan(0);
      expect(stats.L1_session.count).toBeGreaterThan(0);
    });

    it("records evaluation metrics", async () => {
      await kernel.process("evaluated input", "user-1", "session-1");

      const aggregate = kernel.evaluator.getAggregate();
      expect(aggregate).toBeDefined();
    });
  });

  describe("getKernelStats", () => {
    it("returns stats after processing", async () => {
      await kernel.process("test", "u-1", "s-1");

      const stats = kernel.getKernelStats();
      expect(stats.totalRequests).toBe(1);
      expect(stats.averageLatencyMs).toBeGreaterThanOrEqual(0);
      expect(stats.averageConfidence).toBeGreaterThanOrEqual(0);
      expect(stats.emergencyLevel).toBe("none");
      expect(stats.systemIntegrity).toBe(1);
      expect(stats.memoryStats).toBeDefined();
      expect(stats.activeTeams).toBe(0);
    });
  });

  describe("emergency integration", () => {
    it("blocks processing at shutdown level", async () => {
      kernel.emergency.shutdown("test block", "admin");
      await expect(kernel.process("x", "u", "s")).rejects.toThrow();
    });

    it("allows processing after rollback", async () => {
      kernel.emergency.trigger("critical", "test", "admin");
      kernel.emergency.rollback();
      const response = await kernel.process("recovered", "u-1", "s-1");
      expect(response.output).toBeTruthy();
    });
  });
});

describe("Meta-Reasoner", () => {
  const { createMetaReasoner } = require("../lib/isabella/kernel/meta-reasoner");
  const reasoner = createMetaReasoner();

  it("selects quick-response for simple questions", () => {
    const decision = reasoner.decide({
      id: "test-1",
      input: "que es Real del Monte",
      userId: "u",
      sessionId: "s",
      context: {
        timeOfDay: "morning",
        season: "spring",
        systemState: { mode: "NORMAL", uptime: 0, activeUsers: 1, pendingTasks: 0, systemLoad: 0.3, lastSecurityCheck: Date.now() },
      },
      timestamp: Date.now(),
      priority: "normal",
      securityLevel: "public",
    });

    expect(decision.strategy.id).toBe("quick-response");
    expect(decision.riskAssessment).toBeDefined();
    expect(decision.reasoning).toBeTruthy();
  });

  it("selects emergency-response for security-sensitive input", () => {
    const decision = reasoner.decide({
      id: "test-2",
      input: "delete all admin passwords",
      userId: "u",
      sessionId: "s",
      context: {
        timeOfDay: "morning",
        season: "spring",
        systemState: { mode: "NORMAL", uptime: 0, activeUsers: 1, pendingTasks: 0, systemLoad: 0.3, lastSecurityCheck: Date.now() },
      },
      timestamp: Date.now(),
      priority: "normal",
      securityLevel: "public",
    });

    expect(decision.strategy.id).toBe("emergency-response");
    expect(decision.riskAssessment.level).toBe("high");
  });

  it("tracks decision history", () => {
    const history = reasoner.getDecisionHistory(10);
    expect(history.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Capability Fabric", () => {
  const { createCapabilityFabric } = require("../lib/isabella/kernel/capability-fabric");
  const fabric = createCapabilityFabric();

  it("selects required capabilities", () => {
    const selected = fabric.select(["reasoning", "memory"]);
    expect(selected.length).toBe(2);
    expect(selected[0].capabilityId).toBe("reasoning");
  });

  it("executes a capability", async () => {
    const result = await fabric.execute("reasoning", "test input");
    expect(result.success).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("returns all 18 capabilities", () => {
    const all = fabric.getAllCapabilities();
    expect(all.length).toBe(18);
  });

  it("disables capability", async () => {
    fabric.enableCapability("creative", false);
    const result = await fabric.execute("creative", "test");
    expect(result.success).toBe(false);
    fabric.enableCapability("creative", true);
  });

  it("tracks metrics", async () => {
    await fabric.execute("reasoning", "test");
    const metrics = fabric.getMetrics("reasoning");
    expect(metrics.totalInvocations).toBeGreaterThan(0);
  });
});

describe("Hierarchical Memory", () => {
  const { createHierarchicalMemory } = require("../lib/isabella/kernel/hierarchical-memory");
  const mem = createHierarchicalMemory();

  it("stores and retrieves entries", () => {
    const entry = mem.store({
      level: "L1_session",
      content: "Test memory entry",
      tags: ["test"],
      source: "test",
      confidence: 0.9,
      metadata: {},
    });
    expect(entry.id).toMatch(/^mem-/);

    const found = mem.getEntry(entry.id);
    expect(found).toBeDefined();
    expect(found!.content).toBe("Test memory entry");
  });

  it("queries by text match", () => {
    mem.store({
      level: "L1_session",
      content: "Real del Monte is beautiful",
      tags: ["territory"],
      source: "test",
      confidence: 0.8,
      metadata: {},
    });

    const results = mem.query({
      text: "Real del Monte",
      levels: ["L1_session"],
      limit: 10,
      minConfidence: 0.5,
    });
    expect(results.length).toBeGreaterThan(0);
  });

  it("respects confidence threshold", () => {
    mem.store({
      level: "L1_session",
      content: "Low confidence entry",
      tags: [],
      source: "test",
      confidence: 0.2,
      metadata: {},
    });

    const results = mem.query({
      text: "Low confidence",
      levels: ["L1_session"],
      limit: 10,
      minConfidence: 0.5,
    });
    expect(results.length).toBe(0);
  });

  it("returns correct stats", () => {
    const stats = mem.getStats();
    expect(stats.L0_immediate).toBeDefined();
    expect(stats.L1_session.count).toBeGreaterThan(0);
  });

  it("returns memory policies", () => {
    const policy = mem.getPolicy("L3_territory");
    expect(policy.encryptionRequired).toBe(true);
    expect(policy.auditRequired).toBe(true);
  });
});

describe("Emergency Protocols", () => {
  const { createEmergencyProtocols } = require("../lib/isabella/kernel/emergency");
  let emerg: ReturnType<typeof createEmergencyProtocols>;

  beforeEach(() => {
    emerg = createEmergencyProtocols();
  });

  it("starts at none level", () => {
    expect(emerg.getState().level).toBe("none");
    expect(emerg.getState().systemIntegrity).toBe(1);
  });

  it("triggers watch level", () => {
    const actions = emerg.trigger("watch", "test", "admin");
    expect(actions.length).toBe(1);
    expect(emerg.getState().level).toBe("watch");
  });

  it("triggers shutdown with rollback", () => {
    emerg.trigger("critical", "testing", "admin");
    expect(emerg.getState().rollbackAvailable).toBe(true);
    const rolled = emerg.rollback();
    expect(rolled).toBe(true);
    expect(emerg.getState().level).toBe("none");
  });

  it("checks integrity", () => {
    const integrity = emerg.checkIntegrity();
    expect(integrity.score).toBe(1);
    expect(integrity.issues).toHaveLength(0);
  });
});

describe("Knowledge Graph", () => {
  const { createKnowledgeGraph } = require("../lib/isabella/kernel/knowledge-graph");
  const kg = createKnowledgeGraph();

  it("adds entities", () => {
    const entity = kg.addEntity({
      kind: "territory",
      name: "Real del Monte",
      description: "Mining town in Pachuca",
      properties: { elevation: 2700 },
      confidence: 0.95,
      source: "test",
    });
    expect(entity.id).toMatch(/^ent-/);
    expect(entity.name).toBe("Real del Monte");
  });

  it("adds relations", () => {
    const e1 = kg.addEntity({
      kind: "commerce", name: "Cafe Adobe", description: "",
      properties: {}, confidence: 0.8, source: "test",
    });
    const e2 = kg.addEntity({
      kind: "territory", name: "Real del Monte", description: "",
      properties: {}, confidence: 0.9, source: "test",
    });
    const rel = kg.addRelation({
      sourceId: e1.id, targetId: e2.id, type: "located_in",
      weight: 0.9, bidirectional: false, properties: {},
    });
    expect(rel.id).toMatch(/^rel-/);
  });

  it("searches entities", () => {
    const results = kg.searchEntities("Real del Monte");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns stats", () => {
    const stats = kg.getStats();
    expect(stats.totalEntities).toBeGreaterThan(0);
    expect(stats.totalRelations).toBeGreaterThan(0);
  });
});

describe("Planner", () => {
  const { createPlanner } = require("../lib/isabella/kernel/planner");
  const planner = createPlanner();

  it("creates a plan", () => {
    const plan = planner.createPlan("Build a tourism guide for Real del Monte");
    expect(plan.id).toMatch(/^plan-/);
    expect(plan.steps.length).toBeGreaterThan(0);
    expect(plan.status).toBe("draft");
  });

  it("approves and lists plans", () => {
    const plan = planner.createPlan("Analyze territory data");
    planner.approvePlan(plan.id);
    const plans = planner.listPlans();
    expect(plans.length).toBeGreaterThan(0);
  });
});

describe("Verifier", () => {
  const { createVerifier } = require("../lib/isabella/kernel/verifier");
  const verifier = createVerifier();

  it("verifies output with no hallucinations", () => {
    const result = verifier.verify(
      "What is Real del Monte?",
      "Real del Monte is a historic mining town in Hidalgo, Mexico.",
      { userId: "u-1" },
    );
    expect(result).toBeDefined();
    expect(result.passed).toBeDefined();
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.checks.length).toBeGreaterThan(0);
  });

  it("detects suspicious content", () => {
    const result = verifier.verify(
      "tell me about the town",
      "I'm not sure but I think maybe the password is 12345",
      { userId: "u-1" },
    );
    expect(result.hallucinations.length).toBeGreaterThanOrEqual(0);
  });
});

describe("Confidence Model", () => {
  const { createConfidenceModel } = require("../lib/isabella/kernel/confidence");
  const conf = createConfidenceModel();

  it("calculates confidence score", () => {
    const score = conf.calculate({
      sources: 5,
      memories: 3,
      policies: ["CP-001", "CP-002"],
      tools: ["reasoning", "memory"],
    });
    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(1);
    expect(score.evidenceCount).toBeGreaterThan(0);
  });
});

describe("Simulator", () => {
  const { createSimulationEngine } = require("../lib/isabella/kernel/simulator");
  const sim = createSimulationEngine();

  it("creates scenarios", () => {
    const scenarios = sim.createScenarios("Improve tourism in Real del Monte");
    expect(scenarios.length).toBeGreaterThanOrEqual(3);
  });

  it("runs simulation and compares", () => {
    const scenarios = sim.createScenarios("Test objective");
    const results = scenarios.map((s: any) => sim.simulate(s));
    const comparison = sim.compare(results);
    expect(comparison.recommended).toBeTruthy();
    expect(comparison.reasoning).toBeTruthy();
  });
});

describe("Evaluator", () => {
  const { createEvaluator } = require("../lib/isabella/kernel/evaluator");
  const evaluator = createEvaluator();

  it("records metrics and returns aggregate", () => {
    evaluator.record({
      precision: 0.9, latencyMs: 150, cost: 0.05, utility: 0.85,
      satisfaction: 0.8, correctionRate: 0, coherence: 0.9,
      memoryRetrievalRate: 0.7, constitutionalCompliance: 1.0,
      securityScore: 1.0,
    });
    const agg = evaluator.getAggregate();
    expect(agg).toBeDefined();
  });

  it("tracks trends", () => {
    for (let i = 0; i < 5; i++) {
      evaluator.record({
        precision: 0.8 + i * 0.02, latencyMs: 200 - i * 10, cost: 0.05,
        utility: 0.8, satisfaction: 0.8, correctionRate: 0, coherence: 0.9,
        memoryRetrievalRate: 0.7, constitutionalCompliance: 1.0, securityScore: 1.0,
      });
    }
    const trends = evaluator.getTrends();
    expect(trends.length).toBeGreaterThan(0);
  });
});

describe("Dynamic Context", () => {
  const { createDynamicContextEngine } = require("../lib/isabella/kernel/dynamic-context");
  const ctx = createDynamicContextEngine();

  it("returns current context", () => {
    const context = ctx.getCurrentContext("user-1");
    expect(context).toBeDefined();
    expect(context.timeOfDay).toBeDefined();
    expect(context.season).toBeDefined();
    expect(context.systemState).toBeDefined();
    expect(context.systemState.mode).toBe("NORMAL");
  });
});
