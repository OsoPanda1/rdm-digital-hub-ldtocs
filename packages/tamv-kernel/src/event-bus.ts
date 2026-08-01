import { randomUUID } from "node:crypto";
import { appendEvent, type AppendEventOptions, type StoredEvent } from "./event-store";
import type { CivicEvent } from "./types";

/**
 * Bus de eventos en proceso con circuit breaker.
 * El repo original usaba Kafka; en el despliegue serverless (Vercel) el
 * transporte durable es el propio event store y los suscriptores se ejecutan
 * en el mismo request, sin infraestructura extra.
 */

export type EventSubscriber = (event: StoredEvent) => Promise<void> | void;

const subscribers = new Map<string, EventSubscriber>();

let publishFailures = 0;
let circuitOpenedAt = 0;

const FAILURE_THRESHOLD = 5;
const CIRCUIT_COOLDOWN_MS = 30_000;

export function subscribe(name: string, subscriber: EventSubscriber) {
  subscribers.set(name, subscriber);
  return () => subscribers.delete(name);
}

export function listSubscribers() {
  return [...subscribers.keys()];
}

function assertCircuitClosed() {
  if (publishFailures < FAILURE_THRESHOLD) return;

  const elapsed = Date.now() - circuitOpenedAt;
  if (elapsed >= CIRCUIT_COOLDOWN_MS) {
    publishFailures = 0;
    circuitOpenedAt = 0;
    return;
  }

  throw new Error(`Event bus circuit breaker open. Retry in ${CIRCUIT_COOLDOWN_MS - elapsed}ms`);
}

async function fanout(event: StoredEvent) {
  await Promise.all(
    [...subscribers.entries()].map(async ([name, subscriber]) => {
      try {
        await subscriber(event);
      } catch (error) {
        console.error("tamv.bus.subscriber.error", { name, error });
      }
    }),
  );
}

export async function publishEvent(
  event: Partial<CivicEvent>,
  options: Partial<AppendEventOptions> = {},
): Promise<StoredEvent> {
  assertCircuitClosed();

  if (!event.type || !event.federation || !event.source) {
    throw new Error("event.type, event.federation and event.source are required");
  }

  const enriched: CivicEvent = {
    id: event.id ?? randomUUID(),
    type: event.type,
    federation: event.federation,
    payload: event.payload ?? {},
    occurredAt: event.occurredAt ?? new Date().toISOString(),
    source: event.source,
    correlationId: event.correlationId,
    canonical: event.canonical,
  };

  const streamId = options.streamId ?? `${enriched.federation}:${enriched.type}`;

  try {
    const persisted = await appendEvent(enriched, { ...options, streamId });
    publishFailures = 0;
    await fanout(persisted);
    return persisted;
  } catch (error) {
    publishFailures += 1;
    if (publishFailures === FAILURE_THRESHOLD) {
      circuitOpenedAt = Date.now();
    }
    throw error;
  }
}
