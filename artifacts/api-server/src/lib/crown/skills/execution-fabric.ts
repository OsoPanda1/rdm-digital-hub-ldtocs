/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SKILL 2 â€” Execution Fabric
// Motor de tareas con rollback, circuit breakers, cola
// determinista para ejecuciÃ³n de tareas del ecosistema
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { SkillDefinition, TaskRequest, TaskResult, TaskStatus, FederationId } from "../types";

export const ExecutionFabricDefinition: SkillDefinition = {
  skillId: "execution",
  name: "Execution Fabric",
  description: "Deterministic task engine with rollback, circuit breakers, and queue",
  version: "1.0.0",
  federationRequired: [],
  hexagonZone: "kernel",
  inputSchema: "TaskRequest",
  outputSchema: "TaskResult",
};

interface Task extends TaskResult {
  request: TaskRequest;
  retries: number;
}

export interface ExecutionFabric {
  submit(request: TaskRequest): TaskResult;
  getTask(taskId: string): Task | undefined;
  cancel(taskId: string): boolean;
  rollback(taskId: string): boolean;
  tick(): TaskResult[];
  circuitBreakerStatus(): Record<string, { open: boolean; failures: number; lastFailure: number }>;
  stats(): { totalTasks: number; byStatus: Record<string, number>; avgDurationMs: number };
}

export function createExecutionFabric(): ExecutionFabric {
  const tasks = new Map<string, Task>();
  const circuitBreakers = new Map<string, { open: boolean; failures: number; lastFailure: number; threshold: number; cooldownMs: number }>();
  let idCounter = 0;
  const HISTORY: TaskResult[] = [];

  function genId(): string { return `task-${Date.now()}-${++idCounter}`; }

  function checkCircuit(federationId: FederationId): boolean {
    const cb = circuitBreakers.get(federationId);
    if (!cb) return false;
    if (cb.open && Date.now() - cb.lastFailure > cb.cooldownMs) { cb.open = false; cb.failures = 0; }
    return cb.open;
  }

  function tripCircuit(federationId: FederationId) {
    let cb = circuitBreakers.get(federationId);
    if (!cb) { cb = { open: false, failures: 0, lastFailure: 0, threshold: 5, cooldownMs: 60000 }; circuitBreakers.set(federationId, cb); }
    cb.failures++;
    cb.lastFailure = Date.now();
    if (cb.failures >= cb.threshold) cb.open = true;
  }

  return {
    submit(request) {
      if (checkCircuit(request.federationId)) {
        const result: TaskResult = { taskId: genId(), status: "failed", error: `circuit_breaker_open: ${request.federationId}`, startedAt: new Date().toISOString(), completedAt: new Date().toISOString() };
        HISTORY.push(result);
        return result;
      }

      const taskId = genId();
      const task: Task = {
        taskId, status: "running", request, retries: 0,
        startedAt: new Date().toISOString(), completedAt: null,
      };
      tasks.set(taskId, task);

      // Simulate execution â€” in production, this routes to actual executors
      task.status = "completed";
      task.completedAt = new Date().toISOString();
      const result: TaskResult = { taskId, status: task.status, startedAt: task.startedAt, completedAt: task.completedAt };
      HISTORY.push(result);
      return result;
    },

    getTask(taskId) { return tasks.get(taskId); },

    cancel(taskId) {
      const task = tasks.get(taskId);
      if (!task || task.status === "completed" || task.status === "failed") return false;
      task.status = "failed";
      task.error = "cancelled";
      task.completedAt = new Date().toISOString();
      return true;
    },

    rollback(taskId) {
      const task = tasks.get(taskId);
      if (!task || task.status !== "completed") return false;
      task.status = "rolled_back";
      task.completedAt = new Date().toISOString();
      return true;
    },

    tick() {
      const completed: TaskResult[] = [];
      for (const [id, task] of tasks) {
        if (task.status === "running") {
          task.status = "completed";
          task.completedAt = new Date().toISOString();
          completed.push({ taskId: id, status: task.status, startedAt: task.startedAt, completedAt: task.completedAt });
        }
      }
      return completed;
    },

    circuitBreakerStatus() {
      const result: Record<string, { open: boolean; failures: number; lastFailure: number }> = {};
      for (const [k, v] of circuitBreakers) result[k] = { open: v.open, failures: v.failures, lastFailure: v.lastFailure };
      return result;
    },

    stats() {
      const total = HISTORY.length;
      const byStatus: Record<string, number> = {};
      let durSum = 0;
      for (const t of HISTORY) {
        byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
        if (t.completedAt) durSum += new Date(t.completedAt).getTime() - new Date(t.startedAt).getTime();
      }
      return { totalTasks: total, byStatus, avgDurationMs: total > 0 ? durSum / total : 0 };
    },
  };
}
