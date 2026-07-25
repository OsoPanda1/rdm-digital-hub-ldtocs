// ────────────────────────────────────────────────────────────────
// ATLAS TRANSCENDENCE — Master Integration Module
// Orquestador supremo: integra Genesis, Federation, Memory, Security
// Punto de entrada único para el ecosistema cognitivo completo
// ────────────────────────────────────────────────────────────────

import { createCognitiveOrchestrator } from "./isabella/core/orchestrator";
import { createContextEngine } from "./isabella/genesis/context-engine";
import { createKnowledgeLayer } from "./isabella/genesis/knowledge-layer";
import { createReasoner } from "./isabella/genesis/reasoner";
import { createEthicalFirewall } from "./isabella/genesis/ethical-firewall";
import { createBookPi } from "./isabella/genesis/bookpi";
import { createInterpretability } from "./isabella/genesis/interpretability";
import { createYunBus } from "./federation/yun-bus";
import { createYunRouter } from "./federation/yun-router";
import { createIdentityF1 } from "./federation/identity-f1";
import { createPatrimonioF2 } from "./federation/patrimonio-f2";
import { createTurismoF3 } from "./federation/turismo-f3";
import { createEconomiaF4 } from "./federation/economia-f4";
import { createTwinsF5 } from "./federation/twins-f5";
import { createAgentRegistry } from "./federation/agents-registry";
import { createMultiscaleRag } from "./isabella/memory/multiscale-rag";
import { createScorePra } from "./isabella/memory/score-pra";
import { createDualLayer } from "./isabella/security/dual-layer";
import { createAnubisSentinel } from "./isabella/security/anubis-sentinel";
import { createPasskeys } from "./iam/passkeys";
import { createVaultClient } from "./iam/vault-client";
import { createItdrMonitor } from "./iam/itdr-monitor";
import { createSearchIndexer } from "./search/indexer";
import { createAdminAuditLog } from "./admin/audit-log";
import { createWikiEngine } from "./wiki/engine";
import { createGamificationEngine } from "./gamification/engine";

export interface AtlasTranscendence {
  genesis: {
    contextEngine: ReturnType<typeof createContextEngine>;
    knowledgeLayer: ReturnType<typeof createKnowledgeLayer>;
    reasoner: ReturnType<typeof createReasoner>;
    ethicalFirewall: ReturnType<typeof createEthicalFirewall>;
    bookpi: ReturnType<typeof createBookPi>;
    interpretability: ReturnType<typeof createInterpretability>;
  };
  federation: {
    yunBus: ReturnType<typeof createYunBus>;
    yunRouter: ReturnType<typeof createYunRouter>;
    identityF1: ReturnType<typeof createIdentityF1>;
    patrimonioF2: ReturnType<typeof createPatrimonioF2>;
    turismoF3: ReturnType<typeof createTurismoF3>;
    economiaF4: ReturnType<typeof createEconomiaF4>;
    twinsF5: ReturnType<typeof createTwinsF5>;
    agentsRegistry: ReturnType<typeof createAgentRegistry>;
  };
  memory: {
    rag: ReturnType<typeof createMultiscaleRag>;
    pra: ReturnType<typeof createScorePra>;
  };
  security: {
    dualLayer: ReturnType<typeof createDualLayer>;
    anubis: ReturnType<typeof createAnubisSentinel>;
    passkeys: ReturnType<typeof createPasskeys>;
    vault: ReturnType<typeof createVaultClient>;
    itdr: ReturnType<typeof createItdrMonitor>;
  };
  content: {
    search: ReturnType<typeof createSearchIndexer>;
    wiki: ReturnType<typeof createWikiEngine>;
    auditLog: ReturnType<typeof createAdminAuditLog>;
  };
  gamification: ReturnType<typeof createGamificationEngine>;
  status(): AtlasStatus;
}

export interface AtlasStatus {
  version: string;
  initializedAt: string;
  modules: Record<string, "active" | "error">;
  federationCount: number;
  totalAgents: number;
}

let instance: AtlasTranscendence | null = null;

export function createAtlasTranscendence(): AtlasTranscendence {
  if (instance) return instance;

  const contextEngine = createContextEngine();
  const knowledgeLayer = createKnowledgeLayer();
  const ethicalFirewall = createEthicalFirewall();
  const bookpi = createBookPi();
  const interpretability = createInterpretability();

  const yunBus = createYunBus();
  const yunRouter = createYunRouter(yunBus);

  const atlas: AtlasTranscendence = {
    genesis: {
      contextEngine,
      knowledgeLayer,
      reasoner: createReasoner(contextEngine, knowledgeLayer, ethicalFirewall, bookpi),
      ethicalFirewall,
      bookpi,
      interpretability,
    },
    federation: {
      yunBus,
      yunRouter,
      identityF1: createIdentityF1(),
      patrimonioF2: createPatrimonioF2(),
      turismoF3: createTurismoF3(),
      economiaF4: createEconomiaF4(),
      twinsF5: createTwinsF5(),
      agentsRegistry: createAgentRegistry(),
    },
    memory: {
      rag: createMultiscaleRag(),
      pra: createScorePra(),
    },
    security: {
      dualLayer: createDualLayer(),
      anubis: createAnubisSentinel(),
      passkeys: createPasskeys(),
      vault: createVaultClient(),
      itdr: createItdrMonitor(),
    },
    content: {
      search: createSearchIndexer(),
      wiki: createWikiEngine(),
      auditLog: createAdminAuditLog(),
    },
    gamification: createGamificationEngine(),

    status(): AtlasStatus {
      return {
        version: "ATLAS-TRANSCENDENCE-1.0.0",
        initializedAt: new Date().toISOString(),
        modules: {
          "genesis.context-engine": "active",
          "genesis.knowledge-layer": "active",
          "genesis.reasoner": "active",
          "genesis.ethical-firewall": "active",
          "genesis.bookpi": "active",
          "genesis.interpretability": "active",
          "federation.yun-bus": "active",
          "federation.yun-router": "active",
          "federation.identity-f1": "active",
          "federation.patrimonio-f2": "active",
          "federation.turismo-f3": "active",
          "federation.economia-f4": "active",
          "federation.twins-f5": "active",
          "federation.agents-registry": "active",
          "memory.rag": "active",
          "memory.pra": "active",
          "security.dual-layer": "active",
          "security.anubis": "active",
          "security.passkeys": "active",
          "security.vault": "active",
          "security.itdr": "active",
          "content.search": "active",
          "content.wiki": "active",
          "content.audit-log": "active",
          "gamification": "active",
        },
        federationCount: 7,
        totalAgents: 0,
      };
    },
  };

  instance = atlas;
  return atlas;
}

export function resetAtlas(): void {
  instance = null;
}
