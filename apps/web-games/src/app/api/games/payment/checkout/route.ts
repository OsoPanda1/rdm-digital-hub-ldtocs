import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamerClient, cattleyaClient } from '@/lib/clients';

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
    const { gameId, packType, successUrl, cancelUrl } = body;

    if (!gameId || !packType) {
      return NextResponse.json({ error: 'gameId y packType son requeridos' }, { status: 400 });
    }

    const result = await cattleyaClient.purchaseGamePack(
      gameId,
      packType,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/success`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/cancel`
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API] Error purchasing game pack:', error);
    return NextResponse.json(
      { error: 'Error al procesar compra de pack' },
      { status: 500 }
    );
  }
}