import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getKernel, loadRecent, loadStream, verifyStreamIntegrity } from "@nodo-cero/tamv-kernel";

export const dynamic = "force-dynamic";

const FEDERATIONS = [
  "DEKATEOTL",
  "ANUBIS",
  "BOOKPI",
  "PHOENIX",
  "MDD_TAMV",
  "KAOS",
  "CHRONOS",
] as const;

const EventSchema = z.object({
  type: z.string().min(3).max(64),
  federation: z.enum(FEDERATIONS),
  source: z.enum(["WEB_PORTAL", "EDGE_NODE", "MOBILE_APP", "BACKOFFICE"]).default("WEB_PORTAL"),
  payload: z.record(z.any()).default({}),
  correlationId: z.string().uuid().optional(),
  streamId: z.string().min(3).max(120).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = EventSchema.parse(await req.json());
    const kernel = getKernel();

    const stored = await kernel.emit(
      {
        type: parsed.type as never,
        federation: parsed.federation,
        source: parsed.source,
        payload: parsed.payload,
        correlationId: parsed.correlationId,
      },
      parsed.streamId,
    );

    return NextResponse.json({ ok: true, event: stored });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, code: "TAMV_EVENT_INVALID", issues: err.flatten() },
        { status: 400 },
      );
    }

    console.error("tamv.kernel.api.error", err);
    return NextResponse.json(
      { ok: false, code: "TAMV_KERNEL_ERROR", error: err?.message ?? "unknown" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const streamId = url.searchParams.get("streamId");
  const verify = url.searchParams.get("verify") === "1";
  const limit = Number(url.searchParams.get("limit") ?? 50);

  try {
    if (streamId && verify) {
      return NextResponse.json({ ok: true, integrity: await verifyStreamIntegrity(streamId) });
    }

    const events = streamId ? await loadStream(streamId) : await loadRecent(limit);

    return NextResponse.json({
      ok: true,
      kernel: getKernel().status(),
      count: events.length,
      events,
    });
  } catch (err: any) {
    console.error("tamv.kernel.api.read.error", err);
    return NextResponse.json(
      { ok: false, code: "TAMV_KERNEL_READ_ERROR", error: err?.message ?? "unknown" },
      { status: 500 },
    );
  }
}
