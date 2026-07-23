// @ts-nocheck
// ============================================================================
// RDM Digital OS + TAMV — YUN-native Sovereign Module Manifest
// Fundado sobre: YUN Manifesto, Constitución, Blueprint, ADR, Heptafederación
// ============================================================================

export type ModuleType =
  | "ui"
  | "backend"
  | "infra"
  | "ai"
  | "content"
  | "bridge"
  | "protocol";

export type ModuleStatus =
  | "integrated"
  | "partial"
  | "planned"
  | "deprecated";

export type CriticalityLevel = "core" | "high" | "medium" | "low";

export type SovereignDomain =
  | "territorial"
  | "civilizational"
  | "economic"
  | "cultural"
  | "tourism"
  | "governance"
  | "ai";

export type YunDomain =
  | "identity"
  | "commerce"
  | "knowledge"
  | "telemetry"
  | "gameplay";

export type FederationId =
  | "fed1_commerce_local"
  | "fed2_tourism_culture"
  | "fed3_academia_science"
  | "fed4_local_government"
  | "fed5_tech_infra"
  | "fed6_community_orgs"
  | "fed7_metaverse_xr";

export type ResilienceMode =
  | "normal"
  | "degraded-domain"
  | "degraded-federation";

export interface YunBinding {
  domain: YunDomain | null;
  federation: FederationId | null;
  events: {
    produces: string[];
    consumes: string[];
  };
  sensitivity: "P0" | "P1" | "P2";
  resilience: {
    supportedModes: ResilienceMode[];
    degradedBehavior: string;
  };
  governance: {
    constitutionVersion: string;
    adrRefs: string[];
  };
}

export interface RepoModule {
  id: string;
  repo: string;
  path: string;
  type: ModuleType;
  description: string;
  entryPoints: string[];
  status: ModuleStatus;
  criticality: CriticalityLevel;
  domain: SovereignDomain;
  hardening: {
    threatModel: string[];
    hasZeroTrustLayer: boolean;
    hasSignedArtifacts: boolean;
    hasRuntimeGuards: boolean;
  };
  dependencies: string[];
  tags: string[];
  yun: YunBinding;
}

const normalizePath = (p: string): string =>
  p.replace(/\\/g, "/").replace(/\/+/g, "/");

// ============================================================================
// Manifiesto de módulos — población exhaustiva con YUN completo
// ============================================================================

export const RDMX_MODULES: RepoModule[] = [
  {
    id: "real-del-monte-explorer",
    repo: "https://github.com/OsoPanda1/real-del-monte-explorer.git",
    path: normalizePath("packages/real-del-monte-explorer"),
    type: "ui",
    description:
      "Frontend React + backend Express del ecosistema RDM Digital OS (nodo interactivo territorial).",
    entryPoints: ["src/App.tsx", "server/src/index.ts"],
    status: "integrated",
    criticality: "core",
    domain: "territorial",
    hardening: {
      threatModel: ["supply-chain", "api-abuse", "session-hijack"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: [
      "real-del-monte-twin",
      "rdm-digital-2dbd42b0",
      "rdm-smart-city-os",
      "tenochtitlan-kernel",
    ],
    tags: ["Explorer", "Tourism", "TerritorialGraph", "PublicPortal"],
    yun: {
      domain: "knowledge",
      federation: "fed2_tourism_culture",
      events: {
        produces: [
          "knowledge.events.explorer_viewed",
          "knowledge.events.route_selected",
          "telemetry.events.explorer_session_started",
        ],
        consumes: [
          "telemetry.events.incident_reported",
          "commerce.events.offer_published",
        ],
      },
      sensitivity: "P2",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Modo lectura con rutas y contenidos; sin nuevas operaciones críticas de comercio; avisos explícitos de degradación de Fed2.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "real-del-monte-twin",
    repo: "https://github.com/OsoPanda1/real-del-monte-twin.git",
    path: normalizePath("packages/real-del-monte-twin"),
    type: "backend",
    description:
      "Gemelo digital de Real del Monte: telemetría, grafo territorial, modelos de flujo de visitantes.",
    entryPoints: ["src/models/index.ts", "src/services/twinTelemetry.ts"],
    status: "integrated",
    criticality: "core",
    domain: "territorial",
    hardening: {
      threatModel: ["data-integrity", "telemetry-fraud", "dos"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["rdm-digital-2dbd42b0", "rdm-smart-city-os"],
    tags: ["DigitalTwin", "Telemetry", "GraphEngine"],
    yun: {
      domain: "telemetry",
      federation: "fed2_tourism_culture",
      events: {
        produces: [
          "telemetry.events.twin_telemetry",
          "telemetry.events.territorial_graph_updated",
          "telemetry.events.flow_model_updated",
        ],
        consumes: [
          "federations.events.policy_updated",
          "security.events.telemetry_rule_changed",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Mantiene telemetría agregada y grafo estático; suspende recomputaciones intensivas hasta recuperación.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "rdm-digital-2dbd42b0",
    repo: "https://github.com/OsoPanda1/rdm-digital-2dbd42b0.git",
    path: normalizePath("packages/rdm-digital-core"),
    type: "backend",
    description:
      "Servicios base y APIs legacy de RDM Digital — autenticación, donaciones, economía local.",
    entryPoints: ["src/routes/index.ts"],
    status: "integrated",
    criticality: "high",
    domain: "economic",
    hardening: {
      threatModel: ["auth-bypass", "financial-fraud", "supply-chain"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["tenochtitlan-kernel", "civilizational-core"],
    tags: ["Auth", "Donations", "Payments", "LegacyAPI"],
    yun: {
      domain: "commerce",
      federation: "fed1_commerce_local",
      events: {
        produces: [
          "identity.events.user_created",
          "commerce.events.payment_initiated",
          "commerce.events.payment_settled",
          "telemetry.events.payment_audit_logged",
        ],
        consumes: [
          "telemetry.events.security_alert",
          "federations.events.kernel_alert",
        ],
      },
      sensitivity: "P0",
      resilience: {
        supportedModes: ["normal", "degraded-domain"],
        degradedBehavior:
          "Suspende nuevas operaciones de pago; mantiene lectura del historial y estado consolidado de donaciones.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-001-supabase", "ADR-002-event-driven"],
      },
    },
  },
  {
    id: "rdm-smart-city-os",
    repo: "https://github.com/OsoPanda1/rdm-smart-city-os.git",
    path: normalizePath("packages/rdm-smart-city-os"),
    type: "infra",
    description:
      "Capa Smart City: sensores urbanos, dashboards de gobierno, gestión inteligente de destino.",
    entryPoints: ["src/index.ts"],
    status: "partial",
    criticality: "high",
    domain: "governance",
    hardening: {
      threatModel: ["iot-takeover", "data-integrity", "dos"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: false,
      hasRuntimeGuards: true,
    },
    dependencies: ["civilizational-core", "tenochtitlan-kernel"],
    tags: ["SmartCity", "GovernmentDashboard", "SensorMesh"],
    yun: {
      domain: "telemetry",
      federation: "fed4_local_government",
      events: {
        produces: [
          "telemetry.events.smartcity_sensor",
          "telemetry.events.governance_dashboard_viewed",
          "telemetry.events.smartcity_alert",
        ],
        consumes: [
          "federations.events.kernel_alert",
          "security.events.governance_violation",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Dashboards en modo lectura, sin aplicar nuevas órdenes sobre territorio físico; toda acción requiere confirmación manual.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "real-del-monte-elevated",
    repo: "https://github.com/OsoPanda1/real-del-monte-elevated.git",
    path: normalizePath("packages/real-del-monte-elevated"),
    type: "ui",
    description:
      "Sistema de diseño cinematográfico elevated — CinematicIntro, VisualEffects, SectionHeader.",
    entryPoints: ["src/components/CinematicIntro.tsx", "src/components/VisualEffects.tsx"],
    status: "integrated",
    criticality: "medium",
    domain: "cultural",
    hardening: {
      threatModel: ["xss", "ui-supply-chain"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["real-del-monte-explorer"],
    tags: ["ElevatedDesign", "CinematicUX"],
    yun: {
      domain: "knowledge",
      federation: "fed2_tourism_culture",
      events: {
        produces: ["telemetry.events.elevated_experience_rendered"],
        consumes: ["knowledge.events.explorer_viewed"],
      },
      sensitivity: "P2",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Degrada efectos visuales y animaciones; mantiene narrativa base y estructura de contenido.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "citemesh-roots",
    repo: "https://github.com/OsoPanda1/citemesh-roots.git",
    path: normalizePath("packages/citemesh-roots"),
    type: "content",
    description:
      "Wiki semántica y malla de contenidos territoriales — WikiLayout, WikiSearch, IsabellaChat.",
    entryPoints: ["src/components/WikiLayout.tsx", "src/services/wikiSearch.ts"],
    status: "partial",
    criticality: "medium",
    domain: "cultural",
    hardening: {
      threatModel: ["content-poisoning", "prompt-injection"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: false,
      hasRuntimeGuards: true,
    },
    dependencies: ["genesis-digytamv-nexus", "quantum-system-tamv"],
    tags: ["SemanticWiki", "KnowledgeGraph", "Isabella"],
    yun: {
      domain: "knowledge",
      federation: "fed2_tourism_culture",
      events: {
        produces: [
          "knowledge.events.article_created",
          "knowledge.events.article_updated",
        ],
        consumes: [
          "identity.events.user_created",
          "telemetry.events.content_flagged",
        ],
      },
      sensitivity: "P2",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Wiki en modo sólo lectura cuando Fed2 está degradada; bloquea nuevas contribuciones hasta estabilización.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "genesis-digytamv-nexus",
    repo: "https://github.com/OsoPanda1/genesis-digytamv-nexus.git",
    path: normalizePath("packages/genesis-digytamv-nexus"),
    type: "ai",
    description:
      "Módulos avanzados TAMV — IsabellaOrb, BancoTAMV, Marketplace, Universidad Digital.",
    entryPoints: ["src/modules/isabella/index.ts", "src/modules/banco/index.ts"],
    status: "partial",
    criticality: "high",
    domain: "civilizational",
    hardening: {
      threatModel: ["ai-model-poisoning", "data-exfiltration", "economic-fraud"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["quantum-system-tamv", "civilizational-core"],
    tags: ["TAMV", "Isabella", "Marketplace", "BancoTAMV"],
    yun: {
      domain: "commerce",
      federation: "fed1_commerce_local",
      events: {
        produces: [
          "commerce.events.marketplace_listing_created",
          "commerce.events.banco_operation",
        ],
        consumes: [
          "identity.events.user_created",
          "telemetry.events.security_alert",
        ],
      },
      sensitivity: "P0",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Suspende operaciones financieras automatizadas; mantiene lectura de balances y estados educativos/marketplace.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-001-supabase", "ADR-002-event-driven"],
      },
    },
  },
  {
    id: "civilizational-core",
    repo: "https://github.com/OsoPanda1/civilizational-core.git",
    path: normalizePath("packages/civilizational-core"),
    type: "infra",
    description:
      "Núcleo civilizacional — protocolos éticos, BookPI, módulos de gobernanza digital.",
    entryPoints: ["src/protocols/index.ts"],
    status: "partial",
    criticality: "core",
    domain: "civilizational",
    hardening: {
      threatModel: ["protocol-drift", "governance-capture"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["tenochtitlan-kernel"],
    tags: ["BookPI", "Governance", "EthicalProtocols"],
    yun: {
      domain: "telemetry",
      federation: "fed4_local_government",
      events: {
        produces: [
          "federations.events.policy_updated",
          "security.events.governance_violation",
        ],
        consumes: [
          "telemetry.events.system_health_changed",
          "federations.events.incident",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Mantiene registro de políticas pero suspende aplicación automática de cambios hasta revisión humana.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "quantum-system-tamv",
    repo: "https://github.com/OsoPanda1/quantum-system-tamv.git",
    path: normalizePath("packages/quantum-system-tamv"),
    type: "ai",
    description:
      "Sistema quantum TAMV — Isabella AI, ChronusEngine, DecisionStore, agentes turismo/cultura/comercio.",
    entryPoints: ["src/main.py", "lib/isabella.ts"],
    status: "integrated",
    criticality: "core",
    domain: "ai",
    hardening: {
      threatModel: ["ai-model-poisoning", "prompt-injection", "data-exfiltration"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["civilizational-core"],
    tags: ["QuantumAI", "ChronusEngine", "DecisionStore", "Isabella"],
    yun: {
      domain: "knowledge",
      federation: "fed3_academia_science",
      events: {
        produces: [
          "knowledge.events.isabella_insight",
          "telemetry.events.ai_decision_logged",
        ],
        consumes: [
          "identity.events.user_context_updated",
          "federations.events.policy_updated",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Sólo explicación sobre datos ya existentes; desactiva decisiones automatizadas y recomendaciones de alto impacto.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "tamv-online-nextgen",
    repo: "lovable://projects/e7d6549a-68e6-44f5-b5af-c602adada6bc",
    path: normalizePath("packages/tamv-online-nextgen"),
    type: "ai",
    description:
      "TAMV Online NextGen™ — Civilization Hub, Isabella emocional, MSR Bridge, DreamSpaces, Phoenix 20·30·50, BABAS, Fénix Rex, ANUBIS-ZK.",
    entryPoints: [
      "src/pages/TAMVHub.tsx",
      "src/stores/tamv/isabellaStore.ts",
      "server/src/routes/tamv.ts",
    ],
    status: "integrated",
    criticality: "core",
    domain: "civilizational",
    hardening: {
      threatModel: ["cross-federation-breach", "identity-corruption", "ai-abuse"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["quantum-system-tamv", "civilizational-core", "tenochtitlan-kernel"],
    tags: ["TAMVHub", "MSRBridge", "ANUBIS-ZK", "Phoenix203050"],
    yun: {
      domain: "knowledge",
      federation: "fed7_metaverse_xr",
      events: {
        produces: [
          "federations.events.hub_state_changed",
          "telemetry.events.metaverse_session",
        ],
        consumes: [
          "identity.events.user_created",
          "telemetry.events.system_health_changed",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Mantiene experiencias XR en modo seguro/limitado; desactiva funciones que dependen de federaciones degradadas.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "rdm-digital-nodo-cero",
    repo: "https://github.com/OsoPanda1/rdm-digital-nodo-cero.git",
    path: normalizePath("packages/rdm-digital-nodo-cero"),
    type: "infra",
    description:
      "Nodo Cero — manifiesto soberano de RDM Digital, anclajes BookPI y constitución civilizacional.",
    entryPoints: ["src/pages/TAMVThesis.tsx", "server/src/routes/tamv-thesis.ts"],
    status: "integrated",
    criticality: "high",
    domain: "civilizational",
    hardening: {
      threatModel: ["protocol-drift", "constitutional-tampering"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["civilizational-core", "tenochtitlan-kernel"],
    tags: ["NodoCero", "Thesis", "BookPIAnchors"],
    yun: {
      domain: "telemetry",
      federation: "fed4_local_government",
      events: {
        produces: [
          "federations.events.nodo_cero_thesis_updated",
          "telemetry.events.constitution_change_logged",
        ],
        consumes: [
          "federations.events.kernel_alert",
          "security.events.governance_violation",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Permite lectura de tesis y manifiesto; suspende cambios estructurales hasta recuperar plena gobernanza.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "real-del-monte-explorer-11b3982a",
    repo: "https://github.com/OsoPanda1/real-del-monte-explorer-11b3982a.git",
    path: normalizePath("packages/real-del-monte-explorer-11b3982a"),
    type: "ui",
    description:
      "Variante elevated del explorer (fork 11b3982a) — fusionada en páginas y componentes principales.",
    entryPoints: ["src/pages/Index.tsx"],
    status: "integrated",
    criticality: "low",
    domain: "territorial",
    hardening: {
      threatModel: ["ui-supply-chain"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: false,
      hasRuntimeGuards: true,
    },
    dependencies: ["real-del-monte-explorer", "real-del-monte-elevated"],
    tags: ["Fork", "Variant", "ElevatedExplorer"],
    yun: {
      domain: "knowledge",
      federation: "fed2_tourism_culture",
      events: {
        produces: ["telemetry.events.explorer_variant_loaded"],
        consumes: ["knowledge.events.explorer_viewed"],
      },
      sensitivity: "P2",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Se desactiva en modo degradado de Fed2, delegando al explorer principal.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "rdm-digital-2026",
    repo: "https://github.com/OsoPanda1/RDM-DIGITAL2026.git",
    path: normalizePath("packages/rdm-digital-2026"),
    type: "content",
    description:
      "Roadmap visual 2026 de RDM Digital — hoja de ruta operativa ejecutable.",
    entryPoints: ["docs/roadmap-rdmx-executable.yaml"],
    status: "integrated",
    criticality: "medium",
    domain: "civilizational",
    hardening: {
      threatModel: ["roadmap-tampering"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["civilizational-core"],
    tags: ["Roadmap2026", "ExecutableSpec"],
    yun: {
      domain: "telemetry",
      federation: "fed5_tech_infra",
      events: {
        produces: ["telemetry.events.roadmap_update_logged"],
        consumes: ["telemetry.events.system_health_changed"],
      },
      sensitivity: "P2",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Roadmap accesible en modo lectura; se bloquean cambios hasta restablecer salud de Fed5.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "tenochtitlan-kernel",
    repo: "rdm-digital://core/tenochtitlan",
    path: normalizePath("server/src/services/tenochtitlan"),
    type: "backend",
    description:
      "Kernel soberano Tenochtitlán: panteón centinela, radares paralelos, ID-NVIDA, EOCT, BookPI hash-chained, MD-X4 y los 48 nodos funcionales.",
    entryPoints: ["server/src/routes/tenochtitlan.ts", "src/pages/Tenochtitlan.tsx"],
    status: "integrated",
    criticality: "core",
    domain: "civilizational",
    hardening: {
      threatModel: [
        "identity-corruption",
        "governance-capture",
        "hash-chain-tampering",
        "cross-federation-breach",
      ],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: [
      "rdm-digital-2dbd42b0",
      "civilizational-core",
      "quantum-system-tamv",
      "tamv-online-nextgen",
    ],
    tags: ["Kernel", "BookPI", "MD-X4", "SentinelPantheon", "48Nodes"],
    yun: {
      domain: "telemetry",
      federation: "fed4_local_government",
      events: {
        produces: [
          "federations.events.kernel_alert",
          "security.events.governance_violation",
          "telemetry.events.bookpi_hash_chain_updated",
        ],
        consumes: [
          "telemetry.events.system_health_changed",
          "federations.events.incident",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Mantiene vigilancia reducida; suspende cambios profundos en gobernanza hasta confirmación humana.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
  {
    id: "isabella-villaseñor-ai",
    repo: "https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git",
    path: normalizePath("src/isabella"),
    type: "ai",
    description:
      "Isabella Villaseñor AI — sistema operativo cognitivo territorial con doble hexágono de seguridad, pipeline de conciencia hexagonal y 5 skills (ORION, SOPHIA, ARGUS, MNEMOS, LUMEN).",
    entryPoints: ["src/isabella/index.ts", "src/isabella/api/router.ts"],
    status: "integrated",
    criticality: "core",
    domain: "ai",
    hardening: {
      threatModel: ["prompt-injection", "data-exfiltration", "identity-spoofing"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: [],
    tags: ["Isabella", "AI", "Consciousness", "Heptafederation", "DoubleHexagon"],
    yun: {
      domain: "identity",
      federation: "fed5_tech_infra",
      events: {
        produces: [
          "identity.events.isabella_consciousness_activated",
          "governance.events.constitution_evaluated",
          "knowledge.events.artifact_discovered",
        ],
        consumes: [
          "telemetry.events.twin_telemetry",
          "federations.events.policy_updated",
        ],
      },
      sensitivity: "P0",
      resilience: {
        supportedModes: ["normal", "degraded-domain", "degraded-federation"],
        degradedBehavior:
          "Isabella opera en modo seguro con skills críticos (LUMEN, MNEMOS) y desactiva skills no esenciales.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: [
          "ADR-001-supabase",
          "ADR-002-event-driven",
          "ADR-003-yun-architecture",
          "ADR-004-heptafederation",
        ],
      },
    },
  },
  {
    id: "yun-data-fabric",
    repo: "https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git",
    path: normalizePath("src/core/yun"),
    type: "protocol",
    description:
      "YUN Data Fabric — orquestador central de 5 dominios de almacenamiento con adaptables por dominio (Supabase, Neon, Turso, D1, Redis).",
    entryPoints: ["src/core/yun/index.ts", "src/core/yun/data-fabric.ts"],
    status: "integrated",
    criticality: "core",
    domain: "governance",
    hardening: {
      threatModel: ["data-leak", "cross-domain-contamination", "storage-failure"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: [],
    tags: ["YUN", "DataFabric", "Storage", "DomainIsolation"],
    yun: {
      domain: null,
      federation: null,
      events: {
        produces: [
          "yun.events.domain_operation_completed",
          "yun.events.storage_fallback_activated",
        ],
        consumes: [
          "yun.events.domain_operation_requested",
        ],
      },
      sensitivity: "P0",
      resilience: {
        supportedModes: ["normal", "degraded-domain"],
        degradedBehavior:
          "Fallback automático a Supabase cuando el backend primario del dominio falla.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-001-supabase", "ADR-005-commerce-neon-migration"],
      },
    },
  },
  {
    id: "yun-event-bus",
    repo: "https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git",
    path: normalizePath("src/core/yun/event-bus.ts"),
    type: "protocol",
    description:
      "YUN Constitutional Event Bus — bus central de eventos con validación de dominio, trazabilidad y resiliencia.",
    entryPoints: ["src/core/yun/event-bus.ts"],
    status: "integrated",
    criticality: "core",
    domain: "governance",
    hardening: {
      threatModel: ["event-spoofing", "bus-flooding", "cross-domain-leak"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: [],
    tags: ["YUN", "EventBus", "Constitutional", "Observable"],
    yun: {
      domain: null,
      federation: null,
      events: {
        produces: [
          "yun.events.event_published",
          "yun.events.event_validated",
        ],
        consumes: [
          "yun.events.event_requested",
        ],
      },
      sensitivity: "P0",
      resilience: {
        supportedModes: ["normal"],
        degradedBehavior:
          "El event bus opera in-memory; si falla, los productores reintentan con backoff exponencial.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-002-event-driven", "ADR-003-yun-architecture"],
      },
    },
  },
  {
    id: "rdm-web-games",
    repo: "https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git",
    path: normalizePath("apps/web-games"),
    type: "ui",
    description:
      "Portal de minijuegos federados RDM Web Games — Mina Responsable, Ruta del Guardián. Integración completa con Kernel GAMER, Cattleya tiers, YUN Event Bus y pagos Stripe.",
    entryPoints: ["src/app/page.tsx", "src/app/games/[slug]/page.tsx"],
    status: "integrated",
    criticality: "high",
    domain: "gameplay",
    hardening: {
      threatModel: ["payment-fraud", "score-manipulation", "session-hijack", "xss"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["isabella-villaseñor-ai", "yun-event-bus", "yun-gateway"],
    tags: ["WebGames", "Flutter", "Gamification", "Cattleya", "GAMER"],
    yun: {
      domain: "gameplay",
      federation: "fed6_community_orgs",
      events: {
        produces: [
          "gameplay.events.session_started",
          "gameplay.events.session_completed",
          "gameplay.events.score_submitted",
          "gameplay.events.pack_purchased",
          "gameplay.events.booster_activated",
          "gameplay.events.mission_completed",
        ],
        consumes: [
          "identity.events.user_created",
          "federations.events.policy_updated",
          "commerce.events.payment_settled",
          "yun.events.federation_degraded",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Modo solo lectura con partidas gratis limitadas; pagos y boosters deshabilitados hasta recuperar federación.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation", "ADR-005-commerce-neon-migration"],
      },
    },
  },
  {
    id: "rdm-web-games",
    repo: "https://github.com/OsoPanda1/rdm-digital-hub-ldtocs.git",
    path: normalizePath("apps/web-games"),
    type: "ui",
    description:
      "Portal de minijuegos federados RDM Web Games — Mina Responsable, Ruta del Guardián. Integración completa con Kernel GAMER, Cattleya tiers, YUN Event Bus y pagos Stripe.",
    entryPoints: ["src/app/page.tsx", "src/app/games/[slug]/page.tsx"],
    status: "integrated",
    criticality: "high",
    domain: "gameplay",
    hardening: {
      threatModel: ["payment-fraud", "score-manipulation", "session-hijack", "xss"],
      hasZeroTrustLayer: true,
      hasSignedArtifacts: true,
      hasRuntimeGuards: true,
    },
    dependencies: ["isabella-villaseñor-ai", "yun-event-bus", "yun-gateway"],
    tags: ["WebGames", "Gamification", "Cattleya", "MinaResponsable", "RutaGuardian", "Flutter"],
    yun: {
      domain: "gameplay",
      federation: "fed7_metaverse_xr",
      events: {
        produces: [
          "gameplay.events.session_started",
          "gameplay.events.session_completed",
          "gameplay.events.rewards_claimed",
          "gameplay.events.pack_purchased",
        ],
        consumes: [
          "identity.events.user_created",
          "federations.events.policy_updated",
          "commerce.events.payment_completed",
        ],
      },
      sensitivity: "P1",
      resilience: {
        supportedModes: ["normal", "degraded-federation"],
        degradedBehavior:
          "Modo lectura con partidas guardadas localmente; sincroniza al recuperar conectividad.",
      },
      governance: {
        constitutionVersion: "YUN Constitution – v1.0",
        adrRefs: ["ADR-003-yun-architecture", "ADR-004-heptafederation"],
      },
    },
  },
];

// Aliases para bundlers / TS
export const MODULE_ALIASES: Record<string, string> = {
  "@rdm/core": "packages/rdm-digital-core/src",
  "@rdm/twin": "packages/real-del-monte-twin/src",
  "@rdm/explorer": "packages/real-del-monte-explorer/src",
  "@rdm/smartcity": "packages/rdm-smart-city-os/src",
  "@rdm/isabella": "src/isabella",
  "@rdm/yun": "src/core/yun",
  "@rdm/yun-data-fabric": "src/core/yun/data-fabric",
  "@rdm/yun-event-bus": "src/core/yun/event-bus",
  "@rdm/yun-gateway": "src/core/yun/gateway",
  "@rdm/web-games": "apps/web-games/src",
};