import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamesClient } from '@/lib/clients';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const payload = {
      gameId,
      sessionId: body.sessionId,
      score: body.score,
      xpEarned: body.xpEarned,
      coinsEarned: body.coinsEarned,
      durationMs: body.durationMs,
      metadata: body.metadata,
      completedAt: new Date().toISOString(),
    };

    const result = await gamesClient.completeGameSession(payload);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Error completing game session:', error);
    return NextResponse.json(
      { error: 'Error al completar sesión de juego' },
      { status: 500 }
    );
  }
}