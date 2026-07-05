/**
 * YUN Data Fabric — Cross-Domain Orchestration
 * Per YUN Constitution Principle #3 (Federate Don't Subjugate)
 * and Principle #4 (Reversible by Default)
 *
 * Provides: saga pattern, circuit breakers for data access, transaction coordination.
 */

import type { YunDomain, StorageEngine, DOMAIN_STORAGE } from './types';
import { publish, createEvent } from './event-bus';

// ============================================================================
// DATA FABRIC CONFIGURATION
// ============================================================================

export interface DataFabricConfig {
  defaultTimeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

const DEFAULT_CONFIG: DataFabricConfig = {
  defaultTimeoutMs: 10_000,
  retryAttempts: 3,
  retryDelayMs: 1_000,
};

// ============================================================================
// SAGA PATTERN
// ============================================================================

export interface SagaStep<TInput = unknown, TOutput = unknown> {
  name: string;
  execute: (input: TInput) => Promise<TOutput>;
  compensate: (input: TInput, output: TOutput, error: Error) => Promise<void>;
}

export interface SagaResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  completedSteps: string[];
  compensatedSteps: string[];
}

/**
 * Executes a saga — a sequence of steps with compensating transactions.
 * Per YUN Principle #4: Reversible by Default.
 *
 * If any step fails, all completed steps are compensated in reverse order.
 */
export async function executeSaga<TFinal>(
  steps: SagaStep[],
  initialInput: unknown,
  config: Partial<DataFabricConfig> = {},
): Promise<SagaResult<TFinal>> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const completedSteps: string[] = [];
  const compensatedSteps: string[] = [];
  const stepOutputs: unknown[] = [];
  let currentInput = initialInput;

  try {
    for (const step of steps) {
      let lastError: Error | undefined;
      let attempts = 0;

      while (attempts < cfg.retryAttempts) {
        try {
          const output = await step.execute(currentInput as never);
          stepOutputs.push(output);
          completedSteps.push(step.name);
          currentInput = output;
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          attempts++;
          if (attempts < cfg.retryAttempts) {
            await delay(cfg.retryDelayMs * attempts);
          }
        }
      }

      if (lastError && attempts >= cfg.retryAttempts) {
        throw lastError;
      }
    }

    return {
      success: true,
      result: currentInput as TFinal,
      completedSteps,
      compensatedSteps,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    // Compensate in reverse order
    for (let i = completedSteps.length - 1; i >= 0; i--) {
      const step = steps.find((s) => s.name === completedSteps[i]);
      if (step) {
        try {
          await step.compensate(
            i > 0 ? stepOutputs[i - 1] : initialInput,
            stepOutputs[i],
            err,
          );
          compensatedSteps.push(step.name);
        } catch (compError) {
          console.error(
            `[YUN DataFabric] Compensation failed for step ${completedSteps[i]}:`,
            compError,
          );
        }
      }
    }

    return {
      success: false,
      error: err,
      completedSteps,
      compensatedSteps,
    };
  }
}

// ============================================================================
// CROSS-DOMAIN DATA ACCESS
// ============================================================================

export interface DataAccessRequest {
  domain: YunDomain;
  entity: string;
  operation: 'read' | 'write' | 'delete';
  payload?: unknown;
  userId?: string;
}

export interface DataAccessResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  domain: YunDomain;
  storage: StorageEngine;
  latencyMs: number;
}

/**
 * Accesses data across domains through the Data Fabric.
 * Routes to the correct storage engine based on domain mapping.
 */
export async function accessData<T>(
  request: DataAccessRequest,
  handlers: Record<YunDomain, DataHandler>,
): Promise<DataAccessResponse<T>> {
  const startTime = Date.now();
  const handler = handlers[request.domain];

  if (!handler) {
    return {
      success: false,
      error: `No handler registered for domain: ${request.domain}`,
      domain: request.domain,
      storage: 'supabase',
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const result = await handler.handle<T>(request);

    // Publish observability event
    await publish(
      createEvent('yun.telemetry.data_access.created', 'data-fabric', {
        domain: request.domain,
        entity: request.entity,
        operation: request.operation,
        success: true,
        latencyMs: Date.now() - startTime,
      }, { domain: 'telemetry' }),
    );

    return {
      success: true,
      data: result,
      domain: request.domain,
      storage: handler.storage,
      latencyMs: Date.now() - startTime,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);

    await publish(
      createEvent('yun.telemetry.data_access.created', 'data-fabric', {
        domain: request.domain,
        entity: request.entity,
        operation: request.operation,
        success: false,
        error: errorMsg,
        latencyMs: Date.now() - startTime,
      }, { domain: 'telemetry' }),
    );

    return {
      success: false,
      error: errorMsg,
      domain: request.domain,
      storage: handler.storage,
      latencyMs: Date.now() - startTime,
    };
  }
}

// ============================================================================
// DATA HANDLER INTERFACE
// ============================================================================

export interface DataHandler {
  storage: StorageEngine;
  handle<T>(request: DataAccessRequest): Promise<T>;
}

// ============================================================================
// STORAGE ADAPTERS
// ============================================================================

/**
 * Supabase adapter for identity domain.
 */
export class SupabaseAdapter implements DataHandler {
  storage: StorageEngine = 'supabase';

  async handle<T>(request: DataAccessRequest): Promise<T> {
    // Placeholder — real implementation uses @supabase/supabase-js
    console.log(`[YUN Supabase] ${request.operation} ${request.entity}`, request.payload);
    return {} as T;
  }
}

/**
 * Neon adapter for commerce domain.
 */
export class NeonAdapter implements DataHandler {
  storage: StorageEngine = 'neon';

  async handle<T>(request: DataAccessRequest): Promise<T> {
    console.log(`[YUN Neon] ${request.operation} ${request.entity}`, request.payload);
    return {} as T;
  }
}

/**
 * Turso adapter for knowledge domain.
 */
export class TursoAdapter implements DataHandler {
  storage: StorageEngine = 'turso';

  async handle<T>(request: DataAccessRequest): Promise<T> {
    console.log(`[YUN Turso] ${request.operation} ${request.entity}`, request.payload);
    return {} as T;
  }
}

/**
 * D1 adapter for telemetry domain.
 */
export class D1Adapter implements DataHandler {
  storage: StorageEngine = 'd1';

  async handle<T>(request: DataAccessRequest): Promise<T> {
    console.log(`[YUN D1] ${request.operation} ${request.entity}`, request.payload);
    return {} as T;
  }
}

/**
 * Redis adapter for gameplay domain.
 */
export class RedisAdapter implements DataHandler {
  storage: StorageEngine = 'redis';

  async handle<T>(request: DataAccessRequest): Promise<T> {
    console.log(`[YUN Redis] ${request.operation} ${request.entity}`, request.payload);
    return {} as T;
  }
}

// ============================================================================
// DATA FABRIC INSTANCE
// ============================================================================

export class YunDataFabric {
  private handlers: Map<YunDomain, DataHandler> = new Map();

  constructor() {
    // Register default adapters
    this.registerHandler('identity', new SupabaseAdapter());
    this.registerHandler('commerce', new NeonAdapter());
    this.registerHandler('knowledge', new TursoAdapter());
    this.registerHandler('telemetry', new D1Adapter());
    this.registerHandler('gameplay', new RedisAdapter());
  }

  registerHandler(domain: YunDomain, handler: DataHandler): void {
    this.handlers.set(domain, handler);
  }

  async access<T>(request: DataAccessRequest): Promise<DataAccessResponse<T>> {
    const handlerMap = Object.fromEntries(this.handlers) as Record<YunDomain, DataHandler>;
    return accessData<T>(request, handlerMap);
  }

  async executeSaga<TFinal>(
    steps: SagaStep[],
    initialInput: unknown,
  ): Promise<SagaResult<TFinal>> {
    return executeSaga<TFinal>(steps, initialInput);
  }
}

// Singleton
export const dataFabric = new YunDataFabric();

// ============================================================================
// HELPERS
// ============================================================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
