import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamesClient } from '@/lib/clients';

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

    if (!userId) {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Check daily usage
    const canPlay = await gamesClient.canPlayFree(gameId);

    // Also get today's usage for display
    const { data: dailyUsage } = await supabase
      .from('game_daily_usage')
      .select('runs_used, runs_limit')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .maybeSingle();

    return NextResponse.json({
      canPlayFree: canPlay.canPlayFree,
      remainingFreeRuns: canPlay.remainingFreeRuns,
      dailyUsage: dailyUsage || { runs_used: 0, runs_limit: 2 },
    });
  } catch (error) {
    console.error('[API] Error checking free play:', error);
    return NextResponse.json(
      { error: 'Error verificando disponibilidad' },
      { status: 500 }
    );
  }
}