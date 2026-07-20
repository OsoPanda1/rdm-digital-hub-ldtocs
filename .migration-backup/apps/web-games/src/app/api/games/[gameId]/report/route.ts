import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamesClient, gamerClient } from '@/lib/clients';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, sessionId, score, xpEarned, coinsEarned, durationMs, metadata, completedAt } = body;

    if (!gameId || !sessionId || score === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Report to GAMER kernel
    const gamerResult = await gamerClient.registerAction(user.id, {
      type: 'GAME_SESSION_COMPLETE',
      gameId,
      payload: { score, xpEarned, coinsEarned, durationMs, metadata },
      timestamp: completedAt || new Date().toISOString(),
    });

    // Update Neon via gamesClient
    const gameResult = await gamesClient.completeGameSession({
      sessionId,
      gameId,
      score,
      xpEarned,
      coinsEarned,
      durationMs,
      metadata,
      completedAt: completedAt || new Date().toISOString(),
    });

    // If leveled up or tier changed, notify GAMER
    if (gameResult.leveledUp || gameResult.newTier) {
      await gamerClient.registerAction(user.id, {
        type: 'LEVEL_UP',
        gameId,
        payload: { newLevel: gameResult.newTier, xpGained: xpEarned },
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      gameResult,
      gamerResult,
    });
  } catch (error) {
    console.error('[API] Error reporting game session:', error);
    return NextResponse.json(
      { error: 'Error reportando sesión de juego' },
      { status: 500 }
    );
  }
}