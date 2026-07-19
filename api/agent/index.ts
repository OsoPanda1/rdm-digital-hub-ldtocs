// api/agent/index.ts — Vercel Serverless Function
// AI agent with tools (weather, temperature conversion, RDM places)
// Uses Vercel AI SDK with Lovable AI Gateway

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { streamText, isStepCount } from "ai";
import { createLovableAiGatewayProvider } from "../../src/lib/ai-gateway.server";
import { weatherTool, convertFahrenheitToCelsius, rdmPlacesTool } from "../../src/lib/agent/tools";

const lovable = createLovableAiGatewayProvider(
  process.env.LOVABLE_AI_GATEWAY_KEY || "dev-key"
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const result = streamText({
      model: lovable("anthropic/claude-sonnet-4.5"),
      messages,
      tools: {
        weather: weatherTool,
        convertFahrenheitToCelsius,
        rdmPlaces: rdmPlacesTool,
      },
      stopWhen: isStepCount(5),
    });

    const stream = result.toDataStream();
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = stream.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { res.end(); return; }
        res.write(value);
      }
    };
    pump().catch((err) => {
      console.error("[agent] stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Stream error" });
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error("[agent] error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
}
