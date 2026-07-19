import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";
import type {
  FederationId,
  FederationModule,
  FederationNumber,
  FederationStatus,
  MDX5Intent,
} from "@/core/models";
import { FEDERATION_MAP, FEDERATION_NAMES } from "@/core/models";

// YUN canonical federation type (Fed1-Fed7 standard)
export type YunFederationId =
  | "fed1_commerce_local"
  | "fed2_tourism_culture"
  | "fed3_academia_science"
  | "fed4_local_government"
  | "fed5_tech_infra"
  | "fed6_community_orgs"
  | "fed7_metaverse_xr";

// TAMV GEN-7 federation mapping to YUN standard
const TAMV_TO_YUN_FEDERATION: Record<string, YunFederationId> = {
  DEKATEOTL: "fed1_commerce_local",
  ANUBIS: "fed2_tourism_culture",
  BOOKPI_DATAGIT: "fed3_academia_science",
  PHOENIX: "fed4_local_government",
  MDD_TAMV: "fed5_tech_infra",
  KAOS_HYPERRENDER: "fed6_community_orgs",
  CHRONOS: "fed7_metaverse_xr",
};

const TAMV_FEDERATION_NAMES: Record<string, string> = {
  DEKATEOTL: "Federación de Datos (DATA)",
  ANUBIS: "Federación de Inteligencia (INTEL)",
  BOOKPI_DATAGIT: "Federación de Seguridad (SEC)",
  PHOENIX: "Federación de Gobernanza (GOV)",
  MDD_TAMV: "Federación Económica (ECON)",
  KAOS_HYPERRENDER: "Federación Visual (VIS)",
  CHRONOS: "Federación Territorial (TERRITORY)",
};

export interface FederationEvent {
  id: string;
  type: string;
  source: FederationId;
  payload: unknown;
  timestamp: Date;
  traceId: string;
}

export type EventHandler = (event: FederationEvent) => void;

class FederationBus {
  private federations: Map<FederationId, FederationModule> = new Map();
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private federationQueues: Map<FederationId, FederationEvent[]> = new Map();

  constructor() {
    this.initFederations();
  }

  private initFederations(): void {
    const specs: Array<{
      id: FederationId;
      number: FederationNumber;
      specialty: string;
      stack: string[];
      role: string;
    }> = [
      {
        id: "DEKATEOTL",
        number: "F1",
        specialty: "DATA - Vault / PostGIS / TimeSeries",
        stack: ["PostgreSQL", "PostGIS", "Tile38", "InfluxDB"],
        role: "Custodio de datos territoriales y memoria civilizatoria",
      },
      {
        id: "ANUBIS",
        number: "F2",
        specialty: "INTEL - Cognitive & Agentic AI",
        stack: ["Isabella AI", "LangChain", "VectorDB", "ONNX"],
        role: "Inteligencia cognitiva y procesamiento emocional",
      },
      {
        id: "BOOKPI_DATAGIT",
        number: "F3",
        specialty: "SEC - PQC / Zero-Trust / Q-Cells",
        stack: ["OpenFHE", "OPA/Rego", "OIDC", "Kyber/SPHINCS+"],
        role: "Seguridad post-cuántica y gobierno de identidad",
      },
      {
        id: "PHOENIX",
        number: "F4",
        specialty: "GOV - Executable Governance",
        stack: ["OPA", "Cel", "Rego", "DID:key"],
        role: "Gobernanza ejecutable y políticas TIME UP",
      },
      {
        id: "MDD_TAMV",
        number: "F5",
        specialty: "ECON - Economía local / phygital",
        stack: ["Stripe", "CATTLEYA", "TNX", "LedgerDB"],
        role: "Motor económico local y moneda interna",
      },
      {
        id: "KAOS_HYPERRENDER",
        number: "F6",
        specialty: "VIS - GeoEngine 2D/3D",
        stack: ["Three.js", "Mapbox", "D5 Render", "WebGL"],
        role: "Renderizado geoespacial y visualización inmersiva",
      },
      {
        id: "CHRONOS",
        number: "F7",
        specialty: "TERRITORY - Edge / IoT / Human mesh",
        stack: ["Meshtastic", "LoRa", "EdgeDB", "MQTT"],
        role: "Sensing territorial y malla humana",
      },
    ];

    for (const spec of specs) {
      const module: FederationModule = {
        id: spec.id,
        federationNumber: spec.number,
        name: TAMV_FEDERATION_NAMES[spec.id] || spec.id,
        specialty: spec.specialty,
        stack: spec.stack,
        role: spec.role,
        status: "ACTIVE",
        health: 1.0,
        operationalScore: 1.0,
        lastHeartbeat: new Date(),
      };

      this.federations.set(spec.id, module);
      this.federationQueues.set(spec.id, []);
    }

    logger.info("[FED-BUS] 7 federaciones TAMV GEN-7 inicializadas", {
      federaciones: Array.from(this.federations.keys()),
    });
  }

  /**
   * Resolves a TAMV GEN-7 federation ID to its YUN canonical federation ID
   */
  static toYunFederation(tamvId: FederationId): YunFederationId {
    return TAMV_TO_YUN_FEDERATION[tamvId] ?? "fed4_local_government";
  }

  /**
   * Resolves a YUN canonical federation ID to its TAMV GEN-7 equivalent
   */
  static toTamvFederation(yunId: YunFederationId): FederationId {
    const reverse: Record<YunFederationId, FederationId> = {
      fed1_commerce_local: "DEKATEOTL",
      fed2_tourism_culture: "ANUBIS",
      fed3_academia_science: "BOOKPI_DATAGIT",
      fed4_local_government: "PHOENIX",
      fed5_tech_infra: "MDD_TAMV",
      fed6_community_orgs: "KAOS_HYPERRENDER",
      fed7_metaverse_xr: "CHRONOS",
    };
    return reverse[yunId];
  }

  getFederation(id: FederationId): FederationModule | undefined {
    return this.federations.get(id);
  }

  getAllFederations(): FederationModule[] {
    return Array.from(this.federations.values());
  }

  updateHealth(id: FederationId, health: number): void {
    const fed = this.federations.get(id);
    if (fed) {
      fed.health = Math.max(0, Math.min(1, health));
      fed.status = health > 0.8 ? "ACTIVE" : health > 0.5 ? "DEGRADED" : "IDLE";
      fed.lastHeartbeat = new Date();
    }
  }

  emit(event: Omit<FederationEvent, "id" | "timestamp">): void {
    const fullEvent: FederationEvent = {
      ...event,
      id: uuidv4(),
      timestamp: new Date(),
    };

    const queue = this.federationQueues.get(event.source);
    if (queue) {
      queue.push(fullEvent);
      if (queue.length > 100) queue.shift();
    }

    const handlers = this.handlers.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(fullEvent);
        } catch (error) {
          logger.error("[FED-BUS] Error en handler", { type: event.type, error });
        }
      }
    }

    logger.info("[FED-BUS] Evento emitido", {
      type: event.type,
      source: event.source,
      id: fullEvent.id,
    });
  }

  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  async routeToFederation(intent: MDX5Intent, target: FederationId): Promise<void> {
    const federation = this.federations.get(target);
    if (!federation) {
      logger.error("[FED-BUS] Federación no encontrada", { target });
      return;
    }

    this.emit({
      type: "FEDERATION_INTENT",
      source: target,
      payload: intent,
      traceId: intent.traceId,
    });

    logger.info("[FED-BUS] Intent enrutado", {
      intent: intent.id,
      target: federation.name,
      type: intent.type,
    });
  }

  async emitSovereigntyEvent(type: string, details: unknown): Promise<void> {
    this.emit({
      type: "SOVEREIGNTY_ALERT",
      source: "PHOENIX",
      payload: { eventType: type, details },
      traceId: uuidv4(),
    });
  }

  async broadcastToAll(eventType: string, payload: unknown, traceId: string): Promise<void> {
    for (const [fedId] of this.federations) {
      this.emit({
        type: eventType,
        source: fedId,
        payload,
        traceId,
      });
    }
  }

  getQueueLength(federation: FederationId): number {
    return this.federationQueues.get(federation)?.length ?? 0;
  }

  getHealth(): { totalEvents: number; listenersByType: Record<string, number> } {
    const listenersByType: Record<string, number> = {};
    for (const [type, handlers] of this.handlers) {
      listenersByType[type] = handlers.size;
    }
    return {
      totalEvents: Array.from(this.federationQueues.values()).reduce((sum, q) => sum + q.length, 0),
      listenersByType,
    };
  }
}

export const federationBus = new FederationBus();
export type { FederationBus };