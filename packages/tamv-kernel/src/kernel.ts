import { publishEvent, subscribe, listSubscribers } from "./event-bus";
import type { StoredEvent } from "./event-store";
import type { CivicEvent } from "./types";

export interface DomainService {
  name: string;
  handle(event: StoredEvent): Promise<void> | void;
}

/**
 * TamvOSKernel: núcleo heptafederado. Registra servicios de dominio,
 * emite eventos canónicos y garantiza persistencia auditable.
 */
export class TamvOSKernel {
  private readonly services = new Map<string, DomainService>();
  private readonly unsubscribers = new Map<string, () => void>();
  private started = false;

  register(service: DomainService) {
    this.services.set(service.name, service);
    this.unsubscribers.set(service.name, subscribe(service.name, (event) => service.handle(event)));
  }

  async emit(event: Partial<CivicEvent>, streamId?: string): Promise<StoredEvent> {
    if (!this.started) {
      throw new Error("Kernel is not started");
    }

    return publishEvent(event, {
      streamId: streamId ?? "tamv-kernel",
      actorId: "tamv-os-kernel",
      causationId: event.correlationId,
    });
  }

  start() {
    this.started = true;
    return this;
  }

  stop() {
    this.started = false;
    for (const off of this.unsubscribers.values()) off();
    this.unsubscribers.clear();
  }

  status() {
    return {
      started: this.started,
      services: [...this.services.keys()],
      subscribers: listSubscribers(),
    };
  }
}

let singleton: TamvOSKernel | null = null;

export function getKernel(): TamvOSKernel {
  if (!singleton) {
    singleton = new TamvOSKernel().start();
  }
  return singleton;
}
