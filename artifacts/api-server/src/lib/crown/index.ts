// ────────────────────────────────────────────────────────────────
// THE C.R.O.W.N — Master Barrel Export
// Constitutional Realm of Omniscient Wise Nexus
// ────────────────────────────────────────────────────────────────

export * from "./types";
export * from "./capability-gateway";
export * from "./bookpi-telemetry";
export * from "./provider-failover";

// Skills
export * from "./skills/memory-fabric";
export * from "./skills/execution-fabric";
export * from "./skills/knowledge-fabric";
export * from "./skills/massive-context";
export * from "./skills/continuous-learning";
export * from "./skills/self-evaluation";
export * from "./skills/multi-agent-collective";
export * from "./skills/digital-twin";
export * from "./skills/architecture-reasoning";
export * from "./skills/strategic-intelligence";

import { createCapabilityGateway, type CapabilityGateway } from "./capability-gateway";
import { createBookPiTelemetry, type BookPiTelemetry } from "./bookpi-telemetry";
import { createProviderFailover, type ProviderFailover } from "./provider-failover";
import { createMemoryFabric, type MemoryFabric } from "./skills/memory-fabric";
import { createExecutionFabric, type ExecutionFabric } from "./skills/execution-fabric";
import { createKnowledgeFabric, type KnowledgeFabric } from "./skills/knowledge-fabric";
import { createMassiveContextProcessor, type MassiveContextProcessor } from "./skills/massive-context";
import { createContinuousLearningEngine, type ContinuousLearningEngine } from "./skills/continuous-learning";
import { createSelfEvaluationEngine, type SelfEvaluationEngine } from "./skills/self-evaluation";
import { createMultiAgentCollective, type MultiAgentCollective } from "./skills/multi-agent-collective";
import { createDigitalTwinEngine, type DigitalTwinEngine } from "./skills/digital-twin";
import { createArchitectureReasoningEngine, type ArchitectureReasoningEngine } from "./skills/architecture-reasoning";
import { createStrategicIntelligenceEngine, type StrategicIntelligenceEngine } from "./skills/strategic-intelligence";

import { MemoryFabricDefinition } from "./skills/memory-fabric";
import { ExecutionFabricDefinition } from "./skills/execution-fabric";
import { KnowledgeFabricDefinition } from "./skills/knowledge-fabric";
import { MassiveContextDefinition } from "./skills/massive-context";
import { ContinuousLearningDefinition } from "./skills/continuous-learning";
import { SelfEvaluationDefinition } from "./skills/self-evaluation";
import { MultiAgentDefinition } from "./skills/multi-agent-collective";
import { DigitalTwinDefinition } from "./skills/digital-twin";
import { ArchitectureReasoningDefinition } from "./skills/architecture-reasoning";
import { StrategicIntelligenceDefinition } from "./skills/strategic-intelligence";

export interface CrownSystem {
  gateway: CapabilityGateway;
  telemetry: BookPiTelemetry;
  failover: ProviderFailover;
  memory: MemoryFabric;
  execution: ExecutionFabric;
  knowledge: KnowledgeFabric;
  massiveContext: MassiveContextProcessor;
  continuousLearning: ContinuousLearningEngine;
  selfEvaluation: SelfEvaluationEngine;
  multiAgent: MultiAgentCollective;
  digitalTwin: DigitalTwinEngine;
  architectureReasoning: ArchitectureReasoningEngine;
  strategicIntelligence: StrategicIntelligenceEngine;
  stats(): Record<string, unknown>;
}

export function createCrownSystem(): CrownSystem {
  const gateway = createCapabilityGateway();
  const telemetry = createBookPiTelemetry();
  const failover = createProviderFailover();
  const memory = createMemoryFabric();
  const execution = createExecutionFabric();
  const knowledge = createKnowledgeFabric();
  const massiveContext = createMassiveContextProcessor();
  const continuousLearning = createContinuousLearningEngine();
  const selfEvaluation = createSelfEvaluationEngine();
  const multiAgent = createMultiAgentCollective();
  const digitalTwin = createDigitalTwinEngine();
  const architectureReasoning = createArchitectureReasoningEngine();
  const strategicIntelligence = createStrategicIntelligenceEngine();

  gateway.registerSkill(MemoryFabricDefinition);
  gateway.registerSkill(ExecutionFabricDefinition);
  gateway.registerSkill(KnowledgeFabricDefinition);
  gateway.registerSkill(MassiveContextDefinition);
  gateway.registerSkill(ContinuousLearningDefinition);
  gateway.registerSkill(SelfEvaluationDefinition);
  gateway.registerSkill(MultiAgentDefinition);
  gateway.registerSkill(DigitalTwinDefinition);
  gateway.registerSkill(ArchitectureReasoningDefinition);
  gateway.registerSkill(StrategicIntelligenceDefinition);

  return {
    gateway, telemetry, failover,
    memory, execution, knowledge, massiveContext,
    continuousLearning, selfEvaluation, multiAgent,
    digitalTwin, architectureReasoning, strategicIntelligence,
    stats() {
      return {
        gateway: gateway.stats(),
        memory: memory.stats(),
        execution: execution.stats(),
        knowledge: knowledge.stats(),
        massiveContext: massiveContext.stats(),
        continuousLearning: continuousLearning.stats(),
        selfEvaluation: selfEvaluation.stats(),
        multiAgent: multiAgent.stats(),
        digitalTwin: digitalTwin.stats(),
        architectureReasoning: architectureReasoning.stats(),
        strategicIntelligence: strategicIntelligence.stats(),
      };
    },
  };
}
