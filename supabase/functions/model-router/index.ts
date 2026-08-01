import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
} as const;

type RequestBody = {
  model?: string;
  prompt?: string;
};

function jsonResponse(
  data: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

serve(async (req) => {
  const startedAt = Date.now();

  try {
    if (req.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed. Use POST." },
        405,
      );
    }

    const body = (await req.json()) as RequestBody;
    const model = body?.model?.trim();
    const prompt = body?.prompt?.trim();

    if (!isNonEmptyString(model) || !isNonEmptyString(prompt)) {
      return jsonResponse(
        {
          error: "Invalid payload",
          details: "Fields 'model' and 'prompt' are required and must be non-empty strings.",
        },
        400,
      );
    }

    // Placeholder: route to actual model provider
    const response = {
      model,
      response: `[${model}] Echo: ${prompt.slice(0, 100)}`,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startedAt,
    };

    return jsonResponse(response, 200);
  } catch (err) {
    console.error("Request failed:", err);

    return jsonResponse(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      },
      500,
    );
  }
});
