import { NextResponse } from "next/server";
import { loadRecent } from "@nodo-cero/tamv-kernel";

export const dynamic = "force-dynamic";

const LAYER_BY_TYPE: Record<string, string> = {
  PAYMENT_COMPLETED: "Capa 5: Economía Ética",
  AI_INTERACTION: "Capa 4: IA Civilizacional",
  TOURISM_INTERACTION: "Capa 2: Experiencia XR",
  DICHO_CONSULTED: "Capa 3: Memoria Cultural",
  CITY_FEEDBACK: "Capa 6: Gobernanza",
};

export async function GET() {
  try {
    const events = await loadRecent(25);

    const mapped = events.map((e: any) => ({
      id: e.event_id ?? e.id,
      timestamp: e.occurred_at ?? e.occurredAt ?? new Date().toISOString(),
      layer: LAYER_BY_TYPE[e.event_type ?? e.type] ?? "Capa 0: Infraestructura",
      source: e.source ?? "TAMV Kernel",
      type: e.event_type ?? e.type,
      payload: e.payload ?? {},
      hash: (e.event_hash ?? "").slice(0, 16),
    }));

    return NextResponse.json({ totalEvents: mapped.length, events: mapped });
  } catch (err) {
    console.error("events.read.error", err);
    return NextResponse.json({ totalEvents: 0, events: [] });
  }
}
