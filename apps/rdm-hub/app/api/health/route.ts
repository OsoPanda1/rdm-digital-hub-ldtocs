import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = performance.now();
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );

    const [tablesRes, policiesRes, toolsRes, memoryRes, auditRes] = await Promise.allSettled([
      supabase.from("isabella_tools").select("name").limit(1),
      supabase.from("isabella_policies").select("policy_key").limit(1),
      supabase.from("isabella_memory_items").select("id").limit(1),
      supabase.from("isabella_audit_logs").select("id").limit(1),
      supabase.from("places").select("id").limit(1),
    ]);

    const dbConnected = tablesRes.status === "fulfilled" && !tablesRes.value.error;

    const latency = Math.round(performance.now() - started);

    return NextResponse.json(
      {
        status: dbConnected ? "healthy" : "degraded",
        node: process.env.NEXT_PUBLIC_NODE_ID || "nd-0000",
        timestamp: new Date().toISOString(),
        db: {
          connected: dbConnected,
          latency_ms: latency,
          tables: [
            "isabella_sessions",
            "isabella_messages",
            "isabella_memory_items",
            "isabella_decisions",
            "isabella_tools",
            "isabella_policies",
            "isabella_approvals",
            "isabella_audit_logs",
            "profiles",
            "places",
            "routes",
            "events",
            "businesses",
            "memberships",
            "transactions",
          ],
        },
        memory: {
          items: memoryRes.status === "fulfilled" ? (memoryRes.value.data?.length ?? 0) : 0,
        },
        policies: {
          total: policiesRes.status === "fulfilled" ? 1 : 0,
          active: policiesRes.status === "fulfilled" ? 1 : 0,
        },
        tools: {
          total: toolsRes.status === "fulfilled" ? 1 : 0,
          active: toolsRes.status === "fulfilled" ? 1 : 0,
        },
        supabase_region: "us-east-1",
      },
      {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      },
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "critical",
        node: process.env.NEXT_PUBLIC_NODE_ID || "nd-0000",
        timestamp: new Date().toISOString(),
        error: String(err),
      },
      { status: 500 },
    );
  }
}
