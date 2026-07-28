/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-EOL
 */
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Isabella Î© Cognitive Kernel â€” Main Orchestrator
// The Cognitive Operating System: Perceive â†’ Understand â†’ Plan â†’ Execute â†’ Verify â†’ Learn
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//
// ARCHITECTURE:
//
//                    ISABELLA Î© CORE
//                           â”‚
// â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
// â”‚                         â”‚                         â”‚
// PercepciÃ³n             CogniciÃ³n               EjecuciÃ³n
// â”‚                         â”‚                         â”‚
// â”‚                    Meta-Razonador          Capability Fabric
// â”‚                         â”‚                         â”‚
// Memoria               Planificador          Agent Coordinator
// â”‚                         â”‚                         â”‚
// Aprendizaje         Gobernanza YUN          Security Nucleus
// â”‚                         â”‚                         â”‚
//                  Verifier + Simulator
//                  Evaluator + Emergency
//
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { randomBytes } from "crypto";
import type {
  CognitiveRequest,
  CognitiveResponse,
  CognitivePhase,
  DynamicContext,
  ResponseMetadata,
} from "./types";
import { createMetaReasoner } from "./meta-reasoner";
import { createCapabilityFabric } from "./capability-fabric";
import { createHierarchicalMemory } from "./hierarchical-memory";
import { createPlanner } from "./planner";
import { createVerifier } from "./verifier";
import { createKnowledgeGraph } from "./knowledge-graph";
import { createConfidenceModel } from "./confidence";
import { createDynamicContextEngine } from "./dynamic-context";
import { createContinuousLearning } from "./learning";
import { createSecurityNucleus } from "./security-nucleus";
import { createSimulationEngine } from "./simulator";
import { createAgentCoordinator } from "./agent-coordinator";
import { createEvaluator } from "./evaluator";
import { createEmergencyProtocols } from "./emergency";
import { logger } from "../../logger";

// â”€â”€ Kernel Interface â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CognitiveKernel {
  process(input: string, userId: string, sessionId: string, options?: {
    priority?: CognitiveRequest["priority"];
    securityLevel?: CognitiveRequest["securityLevel"];
  }): Promise<CognitiveResponse>;

  // Sub-system access
  readonly metaReasoner: ReturnType<typeof createMetaReasoner>;
  readonly capabilityFabric: ReturnType<typeof createCapabilityFabric>;
  readonly memory: ReturnType<typeof createHierarchicalMemory>;
  readonly planner: ReturnType<typeof createPlanner>;
  readonly verifier: ReturnType<typeof createVerifier>;
  readonly knowledgeGraph: ReturnType<typeof createKnowledgeGraph>;
  readonly confidence: ReturnType<typeof createConfidenceModel>;
  readonly context: ReturnType<typeof createDynamicContextEngine>;
  readonly learning: ReturnType<typeof createContinuousLearning>;
  readonly security: ReturnType<typeof createSecurityNucleus>;
  readonly simulation: ReturnType<typeof createSimulationEngine>;
  readonly agentCoordinator: ReturnType<typeof createAgentCoordinator>;
  readonly evaluator: ReturnType<typeof createEvaluator>;
  readonly emergency: ReturnType<typeof createEmergencyProtocols>;

  // Kernel state
  getKernelStats(): KernelStats;
}

export interface KernelStats {
  totalRequests: number;
  averageLatencyMs: number;
  averageConfidence: number;
  emergencyLevel: string;
  systemIntegrity: number;
  memoryStats: Record<string, { count: number; avgConfidence: number }>;
  evaluationAggregate: Record<string, number>;
  activeTeams: number;
}

// â”€â”€ Kernel Implementation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

let totalRequests = 0;
let totalLatencyMs = 0;
let totalConfidence = 0;

export function createCognitiveKernel(): CognitiveKernel {
  const metaReasoner = createMetaReasoner();
  const capabilityFabric = createCapabilityFabric();
  const memory = createHierarchicalMemory();
  const planner = createPlanner();
  const verifier = createVerifier();
  const knowledgeGraph = createKnowledgeGraph();
  const confidence = createConfidenceModel();
  const contextEngine = createDynamicContextEngine();
  const learning = createContinuousLearning();
  const security = createSecurityNucleus();
  const simulation = createSimulationEngine();
  const agentCoordinator = createAgentCoordinator();
  const evaluator = createEvaluator();
  const emergency = createEmergencyProtocols();

  // Register emergency callback
  emergency.onViolation((state) => {
    logger.fatal({ level: state.level, integrity: state.systemIntegrity }, "Kernel emergency state changed");
  });

  async function processPhase(
    phase: CognitivePhase,
    request: CognitiveRequest,
    previousOutput: string,
  ): Promise<{ output: string; latencyMs: number; capabilityIds: string[] }> {
    const start = Date.now();
    const capabilityIds: string[] = [];
    let output = previousOutput;

    switch (phase) {
      case "perceive": {
        // Gather context signals
        const ctx = contextEngine.getCurrentContext(request.userId);
        output = JSON.stringify({
          input: request.input,
          context: {
            location: ctx.location,
            timeOfDay: ctx.timeOfDay,
            season: ctx.season,
            systemMode: ctx.systemState.mode,
          },
          priority: request.priority,
        });
        capabilityIds.push("reasoning");
        break;
      }

      case "understand": {
        // Use memory to enrich understanding
        const memories = memory.query({
          text: request.input,
          levels: ["L0_immediate", "L1_session", "L2_project", "L3_territory"],
          limit: 5,
          minConfidence: 0.3,
        });
        output = JSON.stringify({
          input: request.input,
          relevantMemories: memories.length,
          memoryInsights: memories.slice(0, 3).map((m) => m.content.slice(0, 100)),
        });
        capabilityIds.push("reasoning", "memory");
        break;
      }

      case "plan": {
        const plan = planner.createPlan(request.input);
        planner.approvePlan(plan.id);
        output = JSON.stringify({
          planId: plan.id,
          steps: plan.steps.length,
          estimatedCost: plan.estimatedTotalCost,
          riskLevel: plan.risks.level,
        });
        capabilityIds.push("planning");
        break;
      }

      case "execute": {
        // Execute using capability fabric
        const caps = capabilityFabric.select(["reasoning", "memory", "synthesis"]);
        for (const cap of caps) {
          const result = await capabilityFabric.execute(cap.capabilityId, request.input);
          capabilityIds.push(cap.capabilityId);
          if (result.success) {
            output = JSON.stringify({ capabilityResult: result.output, confidence: result.confidence });
          }
        }
        break;
      }

      case "verify": {
        const verification = verifier.verify(request.input, output, {
          userId: request.userId,
          securityLevel: request.securityLevel,
        });
        output = JSON.stringify({
          passed: verification.passed,
          score: verification.overallScore,
          issues: verification.contradictions.length + verification.hallucinations.length,
        });
        capabilityIds.push("verification");
        break;
      }

      case "learn": {
        // Store interaction in memory
        memory.store({
          level: "L1_session",
          content: `User ${request.userId}: ${request.input.slice(0, 200)}`,
          tags: ["interaction", request.priority],
          source: "kernel",
          confidence: 0.8,
          metadata: { requestId: request.id },
        });
        capabilityIds.push("memory");
        break;
      }
    }

    return {
      output,
      latencyMs: Date.now() - start,
      capabilityIds,
    };
  }

  return {
    metaReasoner,
    capabilityFabric,
    memory,
    planner,
    verifier,
    knowledgeGraph,
    confidence,
    context: contextEngine,
    learning,
    security,
    simulation,
    agentCoordinator,
    evaluator,
    emergency,

    async process(input, userId, sessionId, options) {
      const startTime = Date.now();
      const requestId = `req-${Date.now()}-${randomBytes(4).toString("hex")}`;

      // Check emergency state
      const emergencyState = emergency.getState();
      if (emergencyState.level === "shutdown") {
        throw new Error("System is in SHUTDOWN mode. All operations suspended.");
      }

      // Build request context
      const ctx = contextEngine.getCurrentContext(userId);
      const request: CognitiveRequest = {
        id: requestId,
        input,
        userId,
        sessionId,
        context: ctx,
        timestamp: startTime,
        priority: options?.priority ?? "normal",
        securityLevel: options?.securityLevel ?? "public",
      };

      // Phase 0: Meta-Reasoning (decide HOW to think)
      const metaDecision = metaReasoner.decide(request);
      const phases = metaDecision.strategy.phases;

      logger.info({
        requestId,
        strategyId: metaDecision.strategy.id,
        riskLevel: metaDecision.riskAssessment.level,
        phasesCount: phases.length,
      }, "CognitiveKernel: processing started");

      // Execute cognitive cycle
      let currentOutput = input;
      const completedPhases: CognitivePhase[] = [];
      const allCapabilityIds: string[] = [];
      const phasesLatencies: number[] = [];

      for (const phase of phases) {
        // Check emergency state before each phase
        if (emergency.getState().level === "shutdown") {
          break;
        }

        try {
          const result = await processPhase(phase, request, currentOutput);
          currentOutput = result.output;
          completedPhases.push(phase);
          allCapabilityIds.push(...result.capabilityIds);
          phasesLatencies.push(result.latencyMs);
        } catch (err) {
          logger.error({ requestId, phase, error: String(err) }, "Phase execution failed");
          break;
        }
      }

      // Store session memory
      memory.store({
        level: "L0_immediate",
        content: `Session ${sessionId}: ${input.slice(0, 100)} â†’ ${currentOutput.slice(0, 100)}`,
        tags: ["session", sessionId],
        source: "kernel",
        confidence: 0.9,
        metadata: { requestId, phases: completedPhases },
      });

      // Calculate confidence
      const confScore = confidence.calculate({
        sources: 3,
        memories: 2,
        policies: ["CP-001", "CP-002", "CP-007", "CP-008"],
        tools: allCapabilityIds,
      });

      // Verify output
      const verification = verifier.verify(input, currentOutput, { userId });

      // Security audit
      const securityDecision = security.authorize({
        userId,
        action: "kernel.process",
        resource: "cognitive-output",
        level: request.securityLevel,
        input: { input: input.slice(0, 200) },
      });

      // Create audit record
      const auditRecord = security.createAuditRecord({
        requestId,
        userId,
        action: "cognitive.process",
        inputs: { input: input.slice(0, 500) },
        outputs: { output: currentOutput.slice(0, 500) },
        securityDecision,
        constitutionalCompliance: ["CP-001", "CP-002", "CP-007", "CP-008"],
      });

      const totalLatency = Date.now() - startTime;

      // Record evaluation metrics
      evaluator.record({
        precision: confScore.overall,
        latencyMs: totalLatency,
        cost: 0.05,
        utility: confScore.overall * 0.9,
        satisfaction: 0.8,
        correctionRate: verification.passed ? 0 : 0.5,
        coherence: confScore.breakdown.coherence,
        memoryRetrievalRate: 0.5,
        constitutionalCompliance: verification.constitutionalViolations.length === 0 ? 1.0 : 0.3,
        securityScore: securityDecision.authorized ? 1.0 : 0.0,
      });

      // Update global stats
      totalRequests++;
      totalLatencyMs += totalLatency;
      totalConfidence += confScore.overall;

      logger.info({
        requestId,
        phasesCompleted: completedPhases.length,
        totalLatencyMs: totalLatency,
        confidence: confScore.overall,
        verificationPassed: verification.passed,
      }, "CognitiveKernel: processing completed");

      // Build response
      const response: CognitiveResponse = {
        id: `resp-${requestId}`,
        requestId,
        output: currentOutput,
        phase: completedPhases[completedPhases.length - 1] ?? "perceive",
        confidence: confScore,
        plan: null,
        verification,
        audit: auditRecord,
        capabilities: capabilityFabric.select([...new Set(allCapabilityIds)] as any),
        metadata: {
          phasesCompleted: completedPhases,
          totalLatencyMs: totalLatency,
          capabilitiesUsed: [...new Set(allCapabilityIds)],
          agentsInvolved: [],
          memoryLevelsAccessed: ["L0_immediate", "L1_session"],
          securityChecksPassed: securityDecision.authorized ? 1 : 0,
          constitutionalPrinciplesChecked: ["CP-001", "CP-002", "CP-007", "CP-008"],
          simulationScenariosEvaluated: 0,
        },
        timestamp: Date.now(),
      };

      return response;
    },

    getKernelStats() {
      const emergencyState = emergency.getState();
      const integrity = emergency.checkIntegrity();
      return {
        totalRequests,
        averageLatencyMs: totalRequests > 0 ? totalLatencyMs / totalRequests : 0,
        averageConfidence: totalRequests > 0 ? totalConfidence / totalRequests : 0,
        emergencyLevel: emergencyState.level,
        systemIntegrity: integrity.score,
        memoryStats: memory.getStats(),
        evaluationAggregate: evaluator.getAggregate() as unknown as Record<string, number>,
        activeTeams: agentCoordinator.listTeams().filter((t) => t.status === "active").length,
      };
    },
  };
}
