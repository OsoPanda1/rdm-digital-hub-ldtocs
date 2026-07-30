import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (_req) => {
  try {
    return new Response(
      JSON.stringify({
        status: "healthy",
        node: Deno.env.get("NEXT_PUBLIC_NODE_ID") || "nd-0000",
        timestamp: new Date().toISOString(),
        region: Deno.env.get("VERCEL_REGION") || "edge",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "critical", error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
