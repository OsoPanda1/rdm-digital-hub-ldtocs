import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamerClient, gamesClient, federationsClient } from '@/lib/clients';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const stats = await gamesClient.getGameStats(gameId);

    if (userId) {
      try {
        const federation = await federationsClient.getUserFederation(userId);
        return NextResponse.json({ ...stats, userFederation: federation });
      } catch {
        return NextResponse.json(stats);
      }
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[API] Error fetching game stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del juego' },
      { status: 500 }
    );
  }
}