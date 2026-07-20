import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { federationsClient } from '@/lib/clients';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const federationId = searchParams.get('federationId');
    const gameId = searchParams.get('gameId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 403 });
    }

    // Check if user belongs to this federation or is admin
    const userFederation = await federationsClient.getUserFederation(user.id);
    if (federationId && userFederation?.federationId !== federationId) {
      return NextResponse.json({ error: 'No autorizado para esta federación' }, { status: 403 });
    }

    const stats = await federationsClient.getFederatedGameStats({
      federationId: federationId || userFederation?.federationId,
      gameId: gameId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });

    // Also get leaderboard
    const leaderboard = await federationsClient.getFederationLeaderboard(
      federationId || userFederation?.federationId!,
      20
    );

    return NextResponse.json({
      federation: userFederation,
      stats,
      leaderboard,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Error fetching federated stats:', error);
    return NextResponse.json(
      { error: 'Error obteniendo estadísticas federadas' },
      { status: 500 }
    );
  }
}