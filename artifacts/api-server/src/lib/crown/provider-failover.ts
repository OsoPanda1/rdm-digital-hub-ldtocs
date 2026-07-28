/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: TAMV-PRCL
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// THE C.R.O.W.N â€” Provider Failover
// Multi-provider: Anthropic â†’ OpenAI â†’ DeepSeek â†’ Others
// Solo acepta salidas que cumplen el esquema del agente
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { ProviderId, ProviderConfig, ProviderResponse } from "./types";

export interface ProviderFailover {
  call<T>(capability: string, payload: unknown, validator: (data: unknown) => data is T): Promise<ProviderResponse<T>>;
  getConfig(): ProviderConfig[];
  setEnabled(providerId: ProviderId, enabled: boolean): void;
  stats(): { totalCalls: number; byProvider: Record<string, { calls: number; successes: number; avgLatencyMs: number }> };
}

const DEFAULT_PROVIDERS: ProviderConfig[] = [
  { id: "anthropic", priority: 1, model: "claude-sonnet-4-20250514", maxTokens: 8192, timeout: 30000, enabled: true },
  { id: "openai", priority: 2, model: "gpt-4o", maxTokens: 8192, timeout: 30000, enabled: true },
  { id: "deepseek", priority: 3, model: "deepseek-chat", maxTokens: 4096, timeout: 45000, enabled: true },
  { id: "local", priority: 4, model: "local-model", maxTokens: 4096, timeout: 60000, enabled: false },
];

export function createProviderFailover(): ProviderFailover {
  const providers = [...DEFAULT_PROVIDERS];
  const statsByProvider: Record<string, { calls: number; successes: number; totalLatencyMs: number }> = {};

  function initStats(id: string) {
    if (!statsByProvider[id]) statsByProvider[id] = { calls: 0, successes: 0, totalLatencyMs: 0 };
  }

  return {
    async call<T>(capability: string, payload: unknown, validator: (data: unknown) => data is T): Promise<ProviderResponse<T>> {
      const sorted = providers.filter((p) => p.enabled).sort((a, b) => a.priority - b.priority);
      const errors: string[] = [];

      for (const provider of sorted) {
        initStats(provider.id);
        statsByProvider[provider.id]!.calls++;
        const start = Date.now();
        try {
          // Simulated provider call â€” in production, this calls the actual API
          const mockResponse = { capability, providerId: provider.id, model: provider.model, data: payload };
          const latencyMs = Date.now() - start;

          if (validator(mockResponse.data)) {
            statsByProvider[provider.id]!.successes++;
            statsByProvider[provider.id]!.totalLatencyMs += latencyMs;
            return { providerId: provider.id, model: provider.model, data: mockResponse.data as T, latencyMs };
          }
          errors.push(`${provider.id}: schema_invalid`);
        } catch (err) {
          errors.push(`${provider.id}: ${String(err)}`);
        }
      }

      throw new Error(`All providers failed: ${errors.join("; ")}`);
    },

    getConfig() { return [...providers]; },

    setEnabled(providerId, enabled) {
      const p = providers.find((pp) => pp.id === providerId);
      if (p) p.enabled = enabled;
    },

    stats() {
      const totalCalls = Object.values(statsByProvider).reduce((s, p) => s + p.calls, 0);
      const byProvider: Record<string, { calls: number; successes: number; avgLatencyMs: number }> = {};
      for (const [id, s] of Object.entries(statsByProvider)) {
        byProvider[id] = { calls: s.calls, successes: s.successes, avgLatencyMs: s.calls > 0 ? s.totalLatencyMs / s.calls : 0 };
      }
      return { totalCalls, byProvider };
    },
  };
}
