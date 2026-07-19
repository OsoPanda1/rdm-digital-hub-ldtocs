import type { SagaResult, SagaStep } from "./data-fabric";
import { federationBus, type FederationEvent } from "@/federaciones/FederationBus";
import type { FederationId } from "@/core/models";

export const SAGA_EVENTS = {
  STEP_STARTED: "saga.step.started",
  STEP_COMPLETED: "saga.step.completed",
  STEP_FAILED: "saga.step.failed",
  SAGA_COMPLETED: "saga.completed",
  SAGA_ABORTED: "saga.aborted",
  COMPENSATION_STARTED: "saga.compensation.started",
  COMPENSATION_COMPLETED: "saga.compensation.completed",
} as const;

export interface SagaContext {
  sagaId: string;
  sagaName: string;
  federationSource: string;
  startedAt: number;
  ttlMs: number;
}

export interface SagaStepEvent {
  sagaId: string;
  stepName: string;
  stepIndex: number;
  totalSteps: number;
  input: unknown;
  output?: unknown;
  error?: string;
  timestamp: number;
}

interface ActiveSaga {
  context: SagaContext;
  steps: SagaStep[];
  completed: Array<{ step: SagaStep; input: unknown; output: unknown }>;
}

export class SagaChoreographyParticipant {
  private readonly activeSagas = new Map<string, ActiveSaga>();
  private readonly source: FederationId;

  constructor(federationId: string) {
    this.source = federationId as FederationId;
    this.subscribeToEvents();
  }

  async startSaga(sagaName: string, steps: SagaStep[], initialInput: unknown): Promise<SagaResult<unknown>> {
    if (steps.length === 0) {
      return { success: true, result: initialInput, completedSteps: [], compensatedSteps: [] };
    }

    const sagaId = `saga-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const context: SagaContext = {
      sagaId,
      sagaName,
      federationSource: this.source,
      startedAt: Date.now(),
      ttlMs: 30_000,
    };
    this.activeSagas.set(sagaId, { context, steps, completed: [] });
    this.emit(SAGA_EVENTS.STEP_STARTED, this.stepEvent(sagaId, 0, initialInput, steps));

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        this.activeSagas.delete(sagaId);
        resolve({ success: false, error: new Error(`Saga ${sagaId} timed out`), completedSteps: [], compensatedSteps: [] });
      }, context.ttlMs);

      const offComplete = federationBus.on(SAGA_EVENTS.SAGA_COMPLETED, (event) => {
        const data = event.payload as SagaStepEvent;
        if (data.sagaId !== sagaId) return;
        clearTimeout(timeout);
        offComplete();
        offAbort();
        const saga = this.activeSagas.get(sagaId);
        this.activeSagas.delete(sagaId);
        resolve({ success: true, result: data.output, completedSteps: saga?.completed.map(({ step }) => step.name) ?? [], compensatedSteps: [] });
      });

      const offAbort = federationBus.on(SAGA_EVENTS.SAGA_ABORTED, (event) => {
        const data = event.payload as { sagaId: string; error: string; completedSteps: string[]; compensatedSteps: string[] };
        if (data.sagaId !== sagaId) return;
        clearTimeout(timeout);
        offComplete();
        offAbort();
        this.activeSagas.delete(sagaId);
        resolve({ success: false, error: new Error(data.error), completedSteps: data.completedSteps, compensatedSteps: data.compensatedSteps });
      });
    });
  }

  stats(): { activeSagas: number } {
    return { activeSagas: this.activeSagas.size };
  }

  private subscribeToEvents(): void {
    federationBus.on(SAGA_EVENTS.STEP_STARTED, (event) => void this.executeStep(event));
  }

  private async executeStep(event: FederationEvent): Promise<void> {
    const data = event.payload as SagaStepEvent;
    const saga = this.activeSagas.get(data.sagaId);
    if (!saga) return;
    const step = saga.steps[data.stepIndex];
    if (!step) return;

    try {
      const output = await step.execute(data.input);
      saga.completed.push({ step, input: data.input, output });
      const completed = { ...data, output, timestamp: Date.now() };
      this.emit(SAGA_EVENTS.STEP_COMPLETED, completed);
      if (data.stepIndex + 1 < saga.steps.length) {
        this.emit(SAGA_EVENTS.STEP_STARTED, this.stepEvent(data.sagaId, data.stepIndex + 1, output, saga.steps));
      } else {
        this.emit(SAGA_EVENTS.SAGA_COMPLETED, completed);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.emit(SAGA_EVENTS.STEP_FAILED, { ...data, error: message, timestamp: Date.now() });
      const compensatedSteps: string[] = [];
      for (const completed of [...saga.completed].reverse()) {
        try {
          this.emit(SAGA_EVENTS.COMPENSATION_STARTED, { sagaId: data.sagaId, stepName: completed.step.name });
          await completed.step.compensate(completed.input as never, completed.output as never, new Error(message));
          compensatedSteps.push(completed.step.name);
          this.emit(SAGA_EVENTS.COMPENSATION_COMPLETED, { sagaId: data.sagaId, stepName: completed.step.name });
        } catch {
          // Continue compensating the remaining completed steps.
        }
      }
      this.emit(SAGA_EVENTS.SAGA_ABORTED, {
        sagaId: data.sagaId,
        error: message,
        completedSteps: saga.completed.map(({ step: completedStep }) => completedStep.name),
        compensatedSteps,
      });
    }
  }

  private stepEvent(sagaId: string, index: number, input: unknown, steps: SagaStep[]): SagaStepEvent {
    return { sagaId, stepName: steps[index].name, stepIndex: index, totalSteps: steps.length, input, timestamp: Date.now() };
  }

  private emit(type: string, payload: unknown): void {
    federationBus.emit({ type, source: this.source, payload, traceId: crypto.randomUUID() });
  }
}

const participants = new Map<string, SagaChoreographyParticipant>();

export function getParticipant(federationId: string): SagaChoreographyParticipant {
  const existing = participants.get(federationId);
  if (existing) return existing;
  const participant = new SagaChoreographyParticipant(federationId);
  participants.set(federationId, participant);
  return participant;
}
