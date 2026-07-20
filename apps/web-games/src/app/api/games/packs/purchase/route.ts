import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { gamesClient, cattleyaClient } from '@/lib/clients';

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

    // Check user's Cattleya tier for discount
    const tierBenefits = await cattleyaClient.getUserBenefits();
    const discountRate = tierBenefits.discountRate || 0;

    // Create Stripe checkout session via Cattleya
    const result = await cattleyaClient.purchaseGamePack(
      gameId,
      packType,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/cancel`
    );

    // Store pending purchase in Neon for reconciliation
    const { data: purchase } = await supabase
      .from('game_pack_purchases')
      .insert({
        user_id: user.id,
        game_id: gameId,
        pack_type: packType,
        status: 'PENDING',
        stripe_session_id: result.sessionId,
        discount_applied: discountRate,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.url,
      purchaseId: purchase?.id,
      discountApplied: discountRate > 0,
    });
  } catch (error) {
    console.error('[API] Error purchasing game pack:', error);
    return NextResponse.json(
      { error: 'Error procesando compra de pack' },
      { status: 500 }
    );
  }
}