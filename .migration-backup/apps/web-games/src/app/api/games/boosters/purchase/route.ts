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
    const { gameId, boosterType, successUrl, cancelUrl } = body;

    if (!gameId || !boosterType) {
      return NextResponse.json({ error: 'gameId y boosterType son requeridos' }, { status: 400 });
    }

    // Check user's Cattleya tier for discount
    const tierBenefits = await cattleyaClient.getUserBenefits();
    const discountRate = tierBenefits.discountRate || 0;

    // Create Stripe checkout session via Cattleya
    const result = await cattleyaClient.purchaseBooster(
      gameId,
      boosterType,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/games/cancel`
    );

    // Store pending purchase
    const { data: purchase } = await supabase
      .from('game_booster_purchases')
      .insert({
        user_id: user.id,
        game_id: gameId,
        booster_type: boosterType,
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
    console.error('[API] Error purchasing booster:', error);
    return NextResponse.json(
      { error: 'Error procesando compra de booster' },
      { status: 500 }
    );
  }
}