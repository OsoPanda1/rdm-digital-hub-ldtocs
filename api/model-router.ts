// api/model-router.ts — Vercel Serverless Function
// Unified entry point for open-source models (Hugging Face, OpenLLM, etc.)
// Auth + Rate limiting + CORS unified

import type { Request, Response } from "express";
import { requireAuth } from "./_shared/auth.js";
import { checkRateLimit, RATE_LIMITS } from "./_shared/rate-limit.js";
import { sendWebResponse, vercelRequestToWebRequest } from "./_edge-adapter";

type ModelProvider = "huggingface" | "openllm" | "fallback";

interface FederationContext {
  nodeId: string;
  federation: string;
  useCase: string;
  environment: "dev" | "staging" | "prod";
  userId?: string | null;
}

interface ModelRouterRequest {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  context?: {
    federation?: string;
    useCase?: string;
    userId?: string | null;
  };
}

interface ModelRouterResponse {
  provider: ModelProvider;
  model: string;
  output: string;
  meta: {
    tokens?: number;
    latencyMs: number;
    traceId: string;
    federation: FederationContext;
  };
}

function buildFederationContext(
  ctx?: ModelRouterRequest["context"],
  userId?: string,
): FederationContext {
  const env = (process.env.NODE_ENV as "dev" | "staging" | "prod") || "dev";

  return {
    nodeId: process.env.NODE_ID || "nodo-cero-model-router",
    federation: ctx?.federation || "F5",
    useCase: ctx?.useCase || "model-router",
    environment: env,
    userId: ctx?.userId ?? userId ?? null,
  };
}

function emitTelemetry(
  level: "info" | "warn" | "error",
  message: string,
  federation: FederationContext,
  traceId: string,
  data?: Record<string, unknown>,
) {
  const payload = {
    level,
    message,
    traceId,
    timestamp: new Date().toISOString(),
    federation,
    data,
  };
  // eslint-disable-next-line no-console
  console.log("[model-router]", JSON.stringify(payload));
}

export default async function handler(req: Request, res: Response) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth check
  const auth = await requireAuth(req as any);
  if (auth.errorResponse) {
    return res.status(401).json({ error: auth.errorMessage });
  }

  // Rate limit
  const rateLimit = checkRateLimit(req as any, RATE_LIMITS.model);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: rateLimit.retryAfter,
    });
  }

  const start = Date.now();
  const traceId = `${start}-${Math.random().toString(36).slice(2, 10)}`;

  const body = req.body as any;
  const federation = buildFederationContext(body.context, auth.userId);

  try {
    const { model, prompt, max_tokens = 512, temperature = 0.7 } = body;

    if (!model || !prompt) {
      return res.status(400).json({ error: "Missing model or prompt" });
    }

    let provider: ModelProvider = "fallback";
    let output = "";
    let tokens: number | undefined;

    // Hugging Face provider
    if (
      model.startsWith("Qwen/") ||
      model.startsWith("mistralai/") ||
      model.startsWith("meta-llama/") ||
      model.startsWith("google/")
    ) {
      provider = "huggingface";
      const hfToken = process.env.HUGGINGFACE_API_TOKEN;

      if (!hfToken) {
        return res.status(500).json({
          error: "HF provider not configured",
          meta: { traceId, federation },
        });
      }

      const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 512, temperature: 0.7 },
        }),
      });

      if (!hfRes.ok) {
        const errText = await hfRes.text();
        return res.status(502).json({
          error: "HF API error",
          meta: { traceId, federation },
        });
      }

      const hfData = await hfRes.json();
      const candidate = Array.isArray(hfData) ? hfData[0] : hfData;

      output = candidate?.generated_text ?? JSON.stringify(hfData);
      tokens = typeof candidate?.tokens === "number" ? candidate.tokens : undefined;
    } else {
      // OpenLLM / future provider
      const openllmUrl = process.env.OPENLLM_API_URL;

      if (openllmUrl) {
        const ollmRes = await fetch(`${openllmUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENLLM_API_TOKEN || ""}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 512,
            temperature: 0.7,
          }),
        });

        if (!ollmRes.ok) {
          const text = await ollmRes.text();
          output = `Model unavailable via OpenLLM.`;
        } else {
          const ollmData = await ollmRes.json();
          output = ollmData?.choices?.[0]?.message?.content ?? JSON.stringify(ollmData);
        }
      } else {
        output = `No provider configured for model: ${model}`;
      }
    }

    const latencyMs = Date.now() - start;

    const response = {
      provider,
      model,
      output,
      meta: {
        tokens,
        latencyMs,
        traceId,
        federation,
      },
    };

    return res.status(200).json(response);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : "unknown error";
    // eslint-disable-next-line no-console
    console.error("Model router error:", e);
    return res.status(500).json({
      error: "Model router error",
      detail: process.env.NODE_ENV === "development" ? errMsg : undefined,
    });
  }
}
