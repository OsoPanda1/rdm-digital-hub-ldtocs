import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";
import type { IsabellaPerception } from "@nodo-cero/ai-sdk/contracts";
import { processPerception } from "@nodo-cero/domain-ai/application/handlers/processPerception";
import {
  generateChatResponse,
  ISABELLA_SYSTEM_PROMPT,
} from "@nodo-cero/domain-ai/infrastructure/llm-gateway";

export const dynamic = "force-dynamic";

// Territorio por defecto del nodo cero (puedes ajustarlo)
const DEFAULT_TERRITORY_ID = "rdm-real-del-monte-hidalgo-mx";

const PerceptionSchema = z.object({
  sessionId: z.string().uuid().optional(),
  actorId: z.string().optional(),
  territoryId: z.string().optional(),
  inputType: z.enum(["chat", "event", "signal", "api", "ui"]),
  payload: z.record(z.any()),
  timestamp: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "timestamp must be ISO 8601",
  }),
  metadata: z.record(z.any()).optional(),
});

const MAX_HISTORY = 8;
const MAX_HISTORY_FETCH = 50;
const LLM_TIMEOUT_MS = 25_000;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    throw new Error("SUPABASE_CONFIG_MISSING");
  }

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function ensureSession(
  supabase: ReturnType<typeof getSupabase>,
  sessionId?: string,
  actorId?: string,
): Promise<string> {
  if (sessionId) {
    const { data, error } = await supabase
      .from("isabella_sessions")
      .select("id")
      .eq("id", sessionId)
      .maybeSingle();

    if (error) {
      console.error("isabella.session.lookup.error", { error });
    }

    if (data?.id) return sessionId;
  }

  const next = crypto.randomUUID();
  const { error } = await supabase
    .from("isabella_sessions")
    .insert({ id: next, actor_id: actorId ?? null });

  if (error) {
    console.error("isabella.session.create.error", { error });
    throw new Error("SESSION_PERSIST_ERROR");
  }

  return next;
}

type StoredMessage = {
  role: string;
  content: { text?: string } | null;
  created_at: string;
};

async function loadHistory(
  supabase: ReturnType<typeof getSupabase>,
  sessionId: string,
): Promise<StoredMessage[]> {
  const { data, error } = await supabase
    .from("isabella_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY_FETCH);

  if (error) {
    console.error("isabella.history.load.error", { error });
    return [];
  }

  return (data ?? []) as StoredMessage[];
}

async function persistTurn(
  supabase: ReturnType<typeof getSupabase>,
  args: { sessionId: string; actorId?: string; role: string; text: string; sequenceNo: number },
) {
  const { error } = await supabase.from("isabella_messages").insert({
    session_id: args.sessionId,
    actor_id: args.actorId ?? null,
    role: args.role,
    content: { text: args.text },
    sequence_no: args.sequenceNo,
    metadata: {},
  });

  if (error) {
    console.error("isabella.turn.persist.error", { error, args });
    // No rompemos la respuesta al usuario, pero queda log de fallo de memoria
  }
}

async function safeGenerateChatResponse(messages: { role: "system" | "user" | "assistant"; content: string }[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    const text = await generateChatResponse(messages, { signal: controller.signal });
    return text ?? "";
  } catch (err) {
    console.error("isabella.llm.error", err);
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

function buildErrorResponse(message: string, code: string, status = 400) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      code,
    },
    { status },
  );
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const rawBody = await req.json();
    console.info("isabella.perception.received", { requestId, rawBody });

    const parsed = PerceptionSchema.parse(rawBody) as IsabellaPerception;

    // Territorio por defecto si no viene
    if (!parsed.territoryId) {
      parsed.territoryId = DEFAULT_TERRITORY_ID;
    }

    const input =
      typeof parsed.payload?.input === "string" ? parsed.payload.input.trim() : "";

    // Gobernanza de dominio
    const decision = await processPerception(parsed);

    console.info("isabella.decision", { requestId, decision });

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

      const llmText = await safeGenerateChatResponse(messages);

      let responseText: string;
      if (llmText && llmText.trim().length > 0) {
        responseText = llmText.trim();
        decision.summary = responseText;
        decision.confidence = decision.confidence ?? 0.92;
        decision.details = { ...(decision.details ?? {}), source: "llm", requestId };
      } else {
        // Fallback: usamos gobernanza como voz soberana
        responseText = decision.summary ?? "Percepción recibida, pero no se pudo generar respuesta de IA.";
        decision.details = { ...(decision.details ?? {}), source: "stub", requestId };
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

      console.info("isabella.response.sent", {
        requestId,
        sessionId,
        actorId: parsed.actorId,
      });

      return NextResponse.json({
        ok: true,
        decision,
        sessionId,
        response: responseText,
        requestId,
      });
    }

    // Caso no permitido o no-chat: la decisión es la respuesta soberana
    const summary =
      decision.summary ??
      "Percepción procesada por gobernanza; la política del nodo cero no permite respuesta conversacional.";

    return NextResponse.json({
      ok: true,
      decision,
      sessionId: decision.sessionId ?? null,
      response: summary,
      requestId,
    });
  } catch (err: any) {
    console.error("isabella.api.error", { err, requestId });

    if (err instanceof z.ZodError) {
      return buildErrorResponse("Perception payload invalid", "ISABELLA_PERCEPTION_INVALID", 400);
    }

    if (err?.message === "SUPABASE_CONFIG_MISSING") {
      return buildErrorResponse("Supabase configuration missing", "SUPABASE_CONFIG_MISSING", 500);
    }

    if (err?.message === "SESSION_PERSIST_ERROR") {
      return buildErrorResponse("Failed to persist session", "SESSION_PERSIST_ERROR", 500);
    }

    return buildErrorResponse(err?.message ?? "Unknown error", "ISABELLA_UNKNOWN_ERROR", 500);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const sessionId = url.searchParams.get("sessionId");

  if (action === "history") {
    if (!sessionId) {
      return buildErrorResponse("sessionId required", "ISABELLA_SESSION_ID_REQUIRED", 400);
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("isabella_messages")
        .select("id, role, content, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(MAX_HISTORY_FETCH);

      if (error) {
        console.error("isabella.history.query.error", { error, sessionId });
        return buildErrorResponse("Failed to load history", "ISABELLA_HISTORY_ERROR", 500);
      }

      const messages = (data ?? []).map((m) => ({
        id: m.id,
        role: m.role,
        content: (m.content as any)?.text ?? "",
        created_at: m.created_at,
      }));

      return NextResponse.json({ ok: true, messages });
    } catch (err: any) {
      console.error("isabella.history.api.error", { err, sessionId });

      if (err?.message === "SUPABASE_CONFIG_MISSING") {
        return buildErrorResponse("Supabase configuration missing", "SUPABASE_CONFIG_MISSING", 500);
      }

      return buildErrorResponse("Unknown history error", "ISABELLA_HISTORY_UNKNOWN_ERROR", 500);
    }
  }

  return NextResponse.json({
    ok: true,
    info: "Isabella endpoint - POST perceptions (governed LLM with territorial memory)",
  });
}
