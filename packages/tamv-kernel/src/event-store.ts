import { createHash, randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CivicEvent } from "./types";

/**
 * Event store soberano TAMV sobre Postgres gestionado (Supabase).
 * Sustituye al Pool `pg` del repo original: aquí usamos la Data API con
 * service role, de modo que funciona igual en Node, Edge y Vercel.
 */

export interface AppendEventOptions {
  streamId: string;
  expectedVersion?: number;
  actorId?: string;
  causationId?: string;
  checksum?: string;
}

export interface StoredEvent<TPayload = unknown> extends CivicEvent<TPayload> {
  streamId: string;
  streamVersion: number;
  globalPosition: number;
  eventHash: string;
  recordedAt: string;
  metadata: Record<string, unknown>;
}

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("TAMV_EVENT_STORE_CONFIG_MISSING");
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export function hashEventPayload(
  event: CivicEvent,
  streamId: string,
  streamVersion: number,
): string {
  const raw = JSON.stringify({
    id: event.id,
    type: event.type,
    federation: event.federation,
    payload: event.payload,
    occurredAt: event.occurredAt,
    source: event.source,
    correlationId: event.correlationId ?? null,
    streamId,
    streamVersion,
  });
  return createHash("sha256").update(raw).digest("hex");
}

type Row = {
  global_position: number;
  event_id: string;
  stream_id: string;
  stream_version: number;
  event_type: string;
  federation: string;
  payload: unknown;
  occurred_at: string;
  recorded_at: string;
  source: string;
  correlation_id: string | null;
  event_hash: string;
  metadata: Record<string, unknown> | null;
};

function toStoredEvent(row: Row): StoredEvent {
  return {
    id: row.event_id,
    type: row.event_type as CivicEvent["type"],
    federation: row.federation as CivicEvent["federation"],
    payload: row.payload,
    occurredAt: row.occurred_at,
    source: row.source as CivicEvent["source"],
    correlationId: row.correlation_id ?? undefined,
    streamId: row.stream_id,
    streamVersion: row.stream_version,
    globalPosition: Number(row.global_position),
    eventHash: row.event_hash,
    recordedAt: row.recorded_at,
    metadata: row.metadata ?? {},
  };
}

async function nextStreamVersion(streamId: string): Promise<number> {
  const { data, error } = await getClient()
    .from("tamv_event_store")
    .select("stream_version")
    .eq("stream_id", streamId)
    .order("stream_version", { ascending: false })
    .limit(1);

  if (error) throw new Error(`TAMV_EVENT_STORE_READ_ERROR: ${error.message}`);
  return Number(data?.[0]?.stream_version ?? 0) + 1;
}

export async function appendEvent(
  event: CivicEvent,
  options: AppendEventOptions,
): Promise<StoredEvent> {
  const streamVersion = await nextStreamVersion(options.streamId);

  if (
    typeof options.expectedVersion === "number" &&
    streamVersion !== options.expectedVersion + 1
  ) {
    throw new Error(
      `Optimistic concurrency violation in stream ${options.streamId}: expected ${options.expectedVersion}, actual ${streamVersion - 1}`,
    );
  }

  const eventHash = hashEventPayload(event, options.streamId, streamVersion);

  const { data, error } = await getClient()
    .from("tamv_event_store")
    .insert({
      event_id: event.id ?? randomUUID(),
      stream_id: options.streamId,
      stream_version: streamVersion,
      event_type: event.type,
      federation: event.federation,
      payload: event.payload ?? {},
      occurred_at: event.occurredAt,
      source: event.source,
      correlation_id: event.correlationId ?? null,
      event_hash: eventHash,
      metadata: {
        actorId: options.actorId ?? null,
        causationId: options.causationId ?? null,
        checksum: options.checksum ?? null,
        canonical: event.canonical ?? null,
      },
    })
    .select("*")
    .single();

  if (error) throw new Error(`TAMV_EVENT_STORE_WRITE_ERROR: ${error.message}`);
  return toStoredEvent(data as Row);
}

export async function loadStream(streamId: string, fromVersion = 1): Promise<StoredEvent[]> {
  const { data, error } = await getClient()
    .from("tamv_event_store")
    .select("*")
    .eq("stream_id", streamId)
    .eq("is_deleted", false)
    .gte("stream_version", fromVersion)
    .order("stream_version", { ascending: true });

  if (error) throw new Error(`TAMV_EVENT_STORE_READ_ERROR: ${error.message}`);
  return (data ?? []).map((row) => toStoredEvent(row as Row));
}

export async function loadRecent(limit = 50): Promise<StoredEvent[]> {
  const { data, error } = await getClient()
    .from("tamv_event_store")
    .select("*")
    .eq("is_deleted", false)
    .order("global_position", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 200));

  if (error) throw new Error(`TAMV_EVENT_STORE_READ_ERROR: ${error.message}`);
  return (data ?? []).map((row) => toStoredEvent(row as Row));
}

export async function verifyStreamIntegrity(
  streamId: string,
): Promise<{ valid: boolean; failedAtVersion?: number }> {
  const events = await loadStream(streamId);

  for (const event of events) {
    const recomputed = hashEventPayload(event, event.streamId, event.streamVersion);
    if (recomputed !== event.eventHash) {
      return { valid: false, failedAtVersion: event.streamVersion };
    }
  }

  return { valid: true };
}

export async function replayStream<TState>(
  streamId: string,
  reducer: (state: TState, event: StoredEvent) => TState,
  initialState: TState,
): Promise<TState> {
  const events = await loadStream(streamId);
  return events.reduce(reducer, initialState);
}
