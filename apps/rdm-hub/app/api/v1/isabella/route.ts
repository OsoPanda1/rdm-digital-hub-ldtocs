import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import type { IsabellaPerception } from '@nodo-cero/ai-sdk/contracts';
import { processPerception } from '@nodo-cero/domain-ai/application/handlers/processPerception';

// Validation schema (simple)
const PerceptionSchema = z.object({
  sessionId: z.string().optional(),
  actorId: z.string().optional(),
  territoryId: z.string().optional(),
  inputType: z.enum(['chat', 'event', 'signal', 'api', 'ui']),
  payload: z.record(z.any()),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PerceptionSchema.parse(body) as IsabellaPerception;

    // Process perception (delegated to domain handler)
    const decision = await processPerception(parsed);

    return NextResponse.json({ ok: true, decision }, { status: 200 });
  } catch (err: any) {
    console.error('isabella.api.error', err);
    return NextResponse.json({ ok: false, error: err.message ?? String(err) }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, info: 'Isabella endpoint - POST perceptions' });
}
