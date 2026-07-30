import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();
    const { model, prompt } = body;

    if (!model || !prompt) {
      return new Response(
        JSON.stringify({ error: "model and prompt required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Placeholder: route to actual model provider
    const response = {
      model,
      response: `[${model}] Echo: ${prompt.slice(0, 100)}`,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
