import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

const COUNT_TABLES = [
  "places",
  "businesses",
  "events",
  "routes",
  "profiles",
  "memberships",
  "transactions",
  "isabella_sessions",
  "isabella_messages",
  "isabella_decisions",
  "isabella_policies",
  "isabella_audit_logs",
] as const;

type Counts = Record<(typeof COUNT_TABLES)[number], number>;

export async function GET() {
  const started = performance.now();
  const supabase = getSupabase();

  const counts = {} as Counts;
  const results = await Promise.allSettled(
    COUNT_TABLES.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      return { table, count, error };
    }),
  );

  results.forEach((res) => {
    if (res.status === "fulfilled" && !res.value.error) {
      counts[res.value.table] = res.value.count ?? 0;
    } else {
      counts[res.status === "fulfilled" ? res.value.table : "places"] =
        res.status === "fulfilled" ? 0 : 0;
    }
  });

  // Distribuciones
  const [auditRes, decisionRes, placeCatRes, bizCatRes, messageRoleRes] =
    await Promise.allSettled([
      supabase.from("isabella_audit_logs").select("event_type, payload, created_at").order("created_at", { ascending: false }).limit(500),
      supabase.from("isabella_decisions").select("policy_status, risk_level").limit(500),
      supabase.from("places").select("cat").limit(1000),
      supabase.from("businesses").select("cat").limit(1000),
      supabase.from("isabella_messages").select("role").limit(1000),
    ]);

  const byChannel: Record<string, number> = {};
  const byEvent: Record<string, number> = {};
  const recentTraces: { event_type: string; created_at: string | null }[] = [];

  if (auditRes.status === "fulfilled" && !auditRes.value.error) {
    const rows = (auditRes.value.data ?? []) as {
      event_type: string;
      payload: { inputType?: string; eventType?: string } | null;
      created_at: string | null;
    }[];
    for (const r of rows) {
      const channel = r.payload?.inputType ?? "desconocido";
      byChannel[channel] = (byChannel[channel] ?? 0) + 1;
      byEvent[r.event_type] = (byEvent[r.event_type] ?? 0) + 1;
      if (recentTraces.length < 12) {
        recentTraces.push({ event_type: r.event_type, created_at: r.created_at });
      }
    }
  }

  const byPolicyStatus: Record<string, number> = {};
  const byRisk: Record<string, number> = {};
  if (decisionRes.status === "fulfilled" && !decisionRes.value.error) {
    const rows = (decisionRes.value.data ?? []) as { policy_status: string; risk_level: string | null }[];
    for (const r of rows) {
      byPolicyStatus[r.policy_status] = (byPolicyStatus[r.policy_status] ?? 0) + 1;
      byRisk[r.risk_level ?? "low"] = (byRisk[r.risk_level ?? "low"] ?? 0) + 1;
    }
  }

  const placeCategories: Record<string, number> = {};
  if (placeCatRes.status === "fulfilled" && !placeCatRes.value.error) {
    for (const r of (placeCatRes.value.data ?? []) as { cat: string }[]) {
      placeCategories[r.cat] = (placeCategories[r.cat] ?? 0) + 1;
    }
  }

  const bizCategories: Record<string, number> = {};
  if (bizCatRes.status === "fulfilled" && !bizCatRes.value.error) {
    for (const r of (bizCatRes.value.data ?? []) as { cat: string }[]) {
      bizCategories[r.cat] = (bizCategories[r.cat] ?? 0) + 1;
    }
  }

  const byRole: Record<string, number> = {};
  if (messageRoleRes.status === "fulfilled" && !messageRoleRes.value.error) {
    for (const r of (messageRoleRes.value.data ?? []) as { role: string }[]) {
      byRole[r.role] = (byRole[r.role] ?? 0) + 1;
    }
  }

  const latencyMs = Math.round(performance.now() - started);

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    latency_ms: latencyMs,
    node: process.env.NEXT_PUBLIC_NODE_ID || "nd-0000",
    counts,
    distributions: {
      perceptionsByChannel: byChannel,
      events: byEvent,
      decisionsByStatus: byPolicyStatus,
      decisionsByRisk: byRisk,
      placesByCategory: placeCategories,
      businessesByCategory: bizCategories,
      messagesByRole: byRole,
    },
    recentTraces,
  });
}
