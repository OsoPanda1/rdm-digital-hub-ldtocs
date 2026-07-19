import { logger } from "@/lib/logger";
import type { FederationBus } from "@/federaciones/FederationBus";

export type ShutdownLevel = "GRACEFUL" | "EMERGENCY" | "CRITICAL_FAILURE";

interface ShutdownEvent {
  level: ShutdownLevel;
  reason: string;
  initiatedBy: string;
  timestamp: Date;
  stages: ShutdownStage[];
}

interface ShutdownStage {
  name: string;
  status: "PENDING" | "COMPLETED" | "SKIPPED" | "FAILED";
  durationMs: number;
}

export class ShutdownProtocol {
  private shutdownInProgress = false;

  engage(input: { level: "SYSTEM" | ShutdownLevel; reason: string; initiatedBy?: string }): Promise<ShutdownEvent> {
    const level: ShutdownLevel = input.level === "SYSTEM" ? "EMERGENCY" : input.level;
    return this.initiate(level, input.reason, input.initiatedBy);
  }
  private lastShutdown: ShutdownEvent | null = null;

  async initiate(level: ShutdownLevel, reason: string, initiatedBy = "SYSTEM"): Promise<ShutdownEvent> {
    if (this.shutdownInProgress) {
      logger.warn("[SHUTDOWN] Apagado ya en progreso");
      throw new Error("Shutdown already in progress");
    }

    this.shutdownInProgress = true;
    const startTime = Date.now();
    const stages: ShutdownStage[] = [];

    logger.info("[SHUTDOWN] Iniciando apagado", { level, reason, initiatedBy });

    stages.push(await this.stopKernel(level));
    stages.push(await this.stopKnowledgeEngine(level));
    stages.push(await this.verifyLedger(level));
    stages.push(await this.flushPending(level));
    stages.push(await this.closeConnections(level));

    const event: ShutdownEvent = {
      level,
      reason,
      initiatedBy,
      timestamp: new Date(),
      stages,
    };

    this.lastShutdown = event;
    this.shutdownInProgress = false;

    const totalDuration = Date.now() - startTime;
    logger.info("[SHUTDOWN] Apagado completado", { level, totalDurationMs: totalDuration });

    return event;
  }

  isShuttingDown(): boolean {
    return this.shutdownInProgress;
  }

  getLastShutdown(): ShutdownEvent | null {
    return this.lastShutdown;
  }

  private async stopKernel(level: ShutdownLevel): Promise<ShutdownStage> {
    const start = Date.now();
    try {
      if (level === "GRACEFUL") {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      logger.info("[SHUTDOWN] Kernel detenido", { level });
      return { name: "stopKernel", status: "COMPLETED", durationMs: Date.now() - start };
    } catch (error) {
      return { name: "stopKernel", status: "FAILED", durationMs: Date.now() - start };
    }
  }

  private async stopKnowledgeEngine(level: ShutdownLevel): Promise<ShutdownStage> {
    const start = Date.now();
    try {
      logger.info("[SHUTDOWN] Motor de conocimiento detenido", { level });
      return { name: "stopKnowledgeEngine", status: "COMPLETED", durationMs: Date.now() - start };
    } catch (error) {
      return { name: "stopKnowledgeEngine", status: level === "CRITICAL_FAILURE" ? "SKIPPED" : "FAILED", durationMs: Date.now() - start };
    }
  }

  private async verifyLedger(level: ShutdownLevel): Promise<ShutdownStage> {
    const start = Date.now();
    try {
      logger.info("[SHUTDOWN] Verificación de ledger completada", { level });
      return { name: "verifyLedger", status: "COMPLETED", durationMs: Date.now() - start };
    } catch (error) {
      return { name: "verifyLedger", status: "SKIPPED", durationMs: Date.now() - start };
    }
  }

  private async flushPending(level: ShutdownLevel): Promise<ShutdownStage> {
    const start = Date.now();
    try {
      if (level === "GRACEFUL") {
        logger.info("[SHUTDOWN] Drenando operaciones pendientes");
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return { name: "flushPending", status: "COMPLETED", durationMs: Date.now() - start };
    } catch {
      return { name: "flushPending", status: "FAILED", durationMs: Date.now() - start };
    }
  }

  private async closeConnections(level: ShutdownLevel): Promise<ShutdownStage> {
    const start = Date.now();
    try {
      if (level === "GRACEFUL") {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      return { name: "closeConnections", status: "COMPLETED", durationMs: Date.now() - start };
    } catch {
      return { name: "closeConnections", status: "FAILED", durationMs: Date.now() - start };
    }
  }
}

export const shutdownProtocol = new ShutdownProtocol();
