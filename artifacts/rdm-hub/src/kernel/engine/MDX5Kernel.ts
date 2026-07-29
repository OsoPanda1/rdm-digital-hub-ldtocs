/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/lib/logger";
import { timeUpEngine } from "./TimeUpEngine";
import { ledger } from "./Ledger";
import { ChronusEngine } from "./ChronusEngine";
import { FederationBus } from "@/federaciones/FederationBus";
import type {
  MDX5Intent,
  MDX5Decision,
  MDX5Phase,
  FederationId,
  TimeUpVerdict,
} from "@/core/models";

interface MDX5Config {
  pollIntervalMs: number;
  maxQueueSize: number;
  enableTimeUp: boolean;
  enableLedger: boolean;
  // Nuevo: ¿permitimos ejecución con PENDING_* o exigimos resolución previa?
  allowPendingIsabellaToProceed: boolean;
  allowPendingHumanToProceed: boolean;
}

interface PendingIntent extends MDX5Intent {
  status: "pending" | "evaluating" | "planning" | "executing" | "committing" | "reconciling";
  timeUpVerdict?: TimeUpVerdict;
}

export class MDX5Kernel {
  private queue: PendingIntent[] = [];
  private processed: PendingIntent[] = [];
  private readonly config: MDX5Config;
  private running = false;
  private pollTimer?: ReturnType<typeof setInterval>;

  constructor(
    config: Partial<MDX5Config> = {},
    private readonly chronus: ChronusEngine,
    private readonly federationBus: FederationBus,
  ) {
    this.config = {
      pollIntervalMs: 1000,
      maxQueueSize: 1000,
      enableTimeUp: true,
      enableLedger: true,
      allowPendingIsabellaToProceed: false,
      allowPendingHumanToProceed: false,
      ...config,
    };
  }

  submit(intent: Omit<MDX5Intent, "id" | "timestamp" | "traceId">): string {
    const id = uuidv4();
    const traceId = uuidv4();

    const full: MDX5Intent = {
      ...intent,
      id,
      timestamp: new Date(),
      traceId,
    };

    if (this.queue.length >= this.config.maxQueueSize) {
      logger.warn("[MDX5] Cola llena, rechazando intent", { id, type: intent.type });
      return "";
    }

    this.queue.push({ ...full, status: "pending" });
    logger.info("[MDX5] Intent recibido", { id, type: intent.type, federation: intent.federation });
    return id;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    logger.info("[MDX5] Kernel MD-X5 iniciado");

    this.pollTimer = setInterval(() => this.cycle(), this.config.pollIntervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }
    logger.info("[MDX5] Kernel MD-X5 detenido");
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getProcessedCount(): number {
    return this.processed.length;
  }

  private async cycle(): Promise<void> {
    const intent = this.queue.shift();
    if (!intent) return;

    try {
      await this.processIntent(intent);
    } catch (error) {
      logger.error("[MDX5] Error procesando intent", { id: intent.id, error });
    }
  }

  private async processIntent(intent: PendingIntent): Promise<void> {
    const phases: MDX5Phase[] = ["RECEIVE", "EVALUATE", "PLAN", "EXECUTE", "COMMIT", "RECONCILE"];

    for (const phase of phases) {
      intent.status = phase as PendingIntent["status"];

      const decision = await this.executePhase(phase, intent);

      if (this.config.enableLedger && intent.federation) {
        ledger.record(`phase:${phase}`, intent.id, intent.federation, decision);
      }

      if (!decision.approved) {
        logger.info("[MDX5] Intent detenido en fase", {
          id: intent.id,
          phase,
          reason: decision.reason,
          timeUpVerdict: decision.timeupVerdict,
        });

        // Emitir evento de soberanía cuando se rechaza o queda pendiente humano/Isabella.
        await this.emitSovereigntyOnStop(intent, phase, decision);

        this.processed.push(intent);
        return;
      }
    }

    this.processed.push(intent);
    logger.info("[MDX5] Intent completado exitosamente", { id: intent.id, type: intent.type });
  }

  private async executePhase(phase: MDX5Phase, intent: PendingIntent): Promise<MDX5Decision> {
    const base: MDX5Decision = {
      intentId: intent.id,
      phase,
      approved: true,
      timestamp: new Date(),
      traceId: intent.traceId,
    };

    switch (phase) {
      case "RECEIVE":
        return this.phaseReceive(base, intent);
      case "EVALUATE":
        return this.phaseEvaluate(base, intent);
      case "PLAN":
        return this.phasePlan(base, intent);
      case "EXECUTE":
        return this.phaseExecute(base, intent);
      case "COMMIT":
        return this.phaseCommit(base, intent);
      case "RECONCILE":
        return this.phaseReconcile(base, intent);
    }
  }

  private async phaseReceive(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase RECEIVE", { intentId: intent.id, type: intent.type });
    // Aquí podrías integrar Chronus para registrar el inicio de ciclo.
    this.chronus.markPhaseStart(intent, "RECEIVE");
    return { ...base, approved: true, reason: "Intent recibido en kernel" };
  }

  private async phaseEvaluate(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase EVALUATE", { intentId: intent.id });

    this.chronus.markPhaseStart(intent, "EVALUATE");

    if (this.config.enableTimeUp) {
      const results = timeUpEngine.evaluate(intent);
      const globalVerdict = timeUpEngine.getGlobalVerdict(results);
      intent.timeUpVerdict = globalVerdict;

      if (globalVerdict === "REJECTED") {
        return {
          ...base,
          approved: false,
          timeupVerdict: "REJECTED",
          reason: "TIME UP: Políticas éticas no aprobadas",
        };
      }

      if (globalVerdict === "PENDING_ISABELLA" && !this.config.allowPendingIsabellaToProceed) {
        return {
          ...base,
          approved: false,
          timeupVerdict: "PENDING_ISABELLA",
          reason: "TIME UP: Pendiente validación Isabella, ejecución bloqueada",
        };
      }

      if (globalVerdict === "PENDING_HUMAN" && !this.config.allowPendingHumanToProceed) {
        return {
          ...base,
          approved: false,
          timeupVerdict: "PENDING_HUMAN",
          reason: "TIME UP: Pendiente intervención humana, ejecución bloqueada",
        };
      }

      return {
        ...base,
        approved: true,
        timeupVerdict: globalVerdict,
        reason:
          globalVerdict === "PENDING_ISABELLA"
            ? "TIME UP: Pendiente Isabella pero permitido avanzar"
            : globalVerdict === "PENDING_HUMAN"
            ? "TIME UP: Pendiente humano pero permitido avanzar"
            : "TIME UP: Evaluación completada",
      };
    }

    return { ...base, approved: true, reason: "TIME UP deshabilitado" };
  }

  private async phasePlan(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase PLAN", { intentId: intent.id, type: intent.type });

    this.chronus.markPhaseStart(intent, "PLAN");

    // Solo emitimos evento de "POLICY_VIOLATION" si TIME UP dejó algo pendiente o rechazado.
    if (intent.timeUpVerdict && intent.timeUpVerdict !== "APPROVED") {
      try {
        await this.federationBus.emitSovereigntyEvent("POLICY_VIOLATION", {
          intentId: intent.id,
          type: intent.type,
          phase: "PLAN",
          timeUpVerdict: intent.timeUpVerdict,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        logger.warn("[MDX5] Error al emitir evento de soberanía", error as Record<string, unknown>);
      }
    }

    return { ...base, approved: true, reason: "Plan generado" };
  }

  private async phaseExecute(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase EXECUTE", { intentId: intent.id });

    this.chronus.markPhaseStart(intent, "EXECUTE");

    // Aquí es donde realmente ejecutarías la acción federada.
    // Podrías delegar al FederationBus según intent.federation/operation.
    try {
      await this.federationBus.executeIntent(intent);
    } catch (error) {
      logger.error("[MDX5] Error en ejecución federada", { intentId: intent.id, error });
      return { ...base, approved: false, reason: "Error en ejecución federada" };
    }

    return { ...base, approved: true, reason: "Ejecución completada" };
  }

  private async phaseCommit(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase COMMIT", { intentId: intent.id });

    this.chronus.markPhaseStart(intent, "COMMIT");

    try {
      await this.federationBus.emitSovereigntyEvent("OBSERVABILIDAD_SIGNAL", {
        intentId: intent.id,
        phase: "COMMIT",
        timeUpVerdict: intent.timeUpVerdict,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.warn("[MDX5] Error al emitir señal de observabilidad", error as Record<string, unknown>);
    }

    return { ...base, approved: true, reason: "Commit registrado en ledger" };
  }

  private async phaseReconcile(base: MDX5Decision, intent: PendingIntent): Promise<MDX5Decision> {
    logger.info("[MDX5] Fase RECONCILE", { intentId: intent.id });

    this.chronus.markPhaseStart(intent, "RECONCILE");

    if (this.config.enableLedger) {
      const chainValid = ledger.verifyChain();
      if (!chainValid) {
        logger.error("[MDX5] Cadena de ledger corrupta en reconciliación", { intentId: intent.id });
        // Podrías marcar aquí un REJECTED para futuras intents o emitir un evento de crisis.
      }
    }

    return { ...base, approved: true, reason: "Reconciliación completada" };
  }

  private async emitSovereigntyOnStop(
    intent: PendingIntent,
    phase: MDX5Phase,
    decision: MDX5Decision,
  ): Promise<void> {
    try {
      const eventType =
        decision.timeupVerdict === "REJECTED"
          ? "TIMEUP_REJECTION"
          : decision.timeupVerdict === "PENDING_ISABELLA"
          ? "TIMEUP_PENDING_ISABELLA"
          : decision.timeupVerdict === "PENDING_HUMAN"
          ? "TIMEUP_PENDING_HUMAN"
          : "INTENT_STOPPED";

      await this.federationBus.emitSovereigntyEvent(eventType, {
        intentId: intent.id,
        phase,
        reason: decision.reason,
        timeUpVerdict: decision.timeupVerdict,
        timestamp: decision.timestamp.toISOString(),
      });
    } catch (error) {
      logger.warn("[MDX5] Error al emitir evento de soberanía al detener intent", error as Record<string, unknown>);
    }
  }
}
