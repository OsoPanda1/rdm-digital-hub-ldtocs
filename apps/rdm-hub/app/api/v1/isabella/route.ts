import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { IsabellaPerception } from "@nodo-cero/ai-sdk/contracts";
import { processPerception } from "@nodo-cero/domain-ai/application/handlers/processPerception";
import {
  generateChatResponse,
  ISABELLA_SYSTEM_PROMPT,
} from "@nodo-cero/domain-ai/infrastructure/llm-gateway";

export const dynamic = "force-dynamic";

const PerceptionSchema = z.object({
  sessionId: z.string().optional(),
  actorId: z.string().optional(),
  territoryId: z.string().optional(),
  inputType: z.enum(["chat", "event", "signal", "api", "ui"]),
  payload: z.record(z.any()),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

const MAX_HISTORY = 8;
const MAX_HISTORY_FETCH = 50;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

async function ensureSession(
  supabase: ReturnType<typeof getSupabase>,
  sessionId?: string,
  actorId?: string,
): Promise<string> {
  if (sessionId) {
    const { data } = await supabase
      .from("isabella_sessions")
      .select("id")
      .eq("id", sessionId)
      .maybeSingle();
    if (data) return sessionId;
  }
  const next = crypto.randomUUID();
  await supabase.from("isabella_sessions").insert({ id: next, actor_id: actorId ?? null });
  return next;
}

type StoredMessage = { role: string; content: { text?: string } | null; created_at: string };

async function loadHistory(
  supabase: ReturnType<typeof getSupabase>,
  sessionId: string,
): Promise<StoredMessage[]> {
  const { data } = await supabase
    .from("isabella_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY_FETCH);
  return (data ?? []) as StoredMessage[];
}

async function persistTurn(
  supabase: ReturnType<typeof getSupabase>,
  args: { sessionId: string; actorId?: string; role: string; text: string; sequenceNo: number },
) {
  await supabase.from("isabella_messages").insert({
    session_id: args.sessionId,
    actor_id: args.actorId ?? null,
    role: args.role,
    content: { text: args.text },
    sequence_no: args.sequenceNo,
    metadata: {},
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PerceptionSchema.parse(body) as IsabellaPerception;
    const input =
      typeof parsed.payload?.input === "string" ? parsed.payload.input.trim() : "";

    // Pipeline de gobernanza (auditoría + policy gate) delegado al dominio
    const decision = await processPerception(parsed);

    const isChat = parsed.inputType === "chat" && input.length > 0;

    if (decision.policyStatus === "allowed" && isChat) {
      const supabase = getSupabase();
      const sessionId = await ensureSession(supabase, parsed.sessionId, parsed.actorId);
      decision.sessionId = sessionId;

      const history = await loadHistory(supabase, sessionId);

      const messages = [
        { role: "system" as const, content: ISABELLA_SYSTEM_PROMPT },
        ...history.slice(-MAX_HISTORY).map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.content?.text ?? "",
        })),
        { role: "user" as const, content: input },
      ];

      const llmText = await generateChatResponse(messages);

      let responseText: string;
      if (llmText) {
        responseText = llmText;
        decision.summary = llmText;
        decision.confidence = 0.92;
        decision.details = { ...(decision.details ?? {}), source: "llm" };
      } else {
        responseText = decision.summary;
        decision.details = { ...(decision.details ?? {}), source: "stub" };
      }

      await persistTurn(supabase, {
        sessionId,
        actorId: parsed.actorId,
        role: "user",
        text: input,
        sequenceNo: history.length + 1,
      });
      await persistTurn(supabase, {
        sessionId,
        actorId: parsed.actorId,
        role: "assistant",
        text: responseText,
        sequenceNo: history.length + 2,
      });

      return NextResponse.json({ ok: true, decision, sessionId, response: responseText });
    }

    return NextResponse.json({
      ok: true,
      decision,
      sessionId: decision.sessionId ?? null,
      response: decision.summary,
    });
  } catch (err: any) {
    console.error("isabella.api.error", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 400 },
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const sessionId = url.searchParams.get("sessionId");

  if (action === "history") {
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId required" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("isabella_messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(MAX_HISTORY_FETCH);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const messages = (data ?? []).map((m) => ({
      id: m.id,
      role: m.role,
      content: (m.content as any)?.text ?? "",
      created_at: m.created_at,
    }));

    return NextResponse.json({ ok: true, messages });
  }

  return NextResponse.json({ ok: true, info: "Isabella endpoint - POST perceptions" });
}
