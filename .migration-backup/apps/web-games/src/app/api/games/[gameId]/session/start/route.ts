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

    const session = await gamesClient.startGameSession(gameId);

    return NextResponse.json(session);
  } catch (error) {
    console.error('[API] Error starting game session:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión de juego' },
      { status: 500 }
    );
  }
}