import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { gamesClient, cattleyaClient } from '@/lib/clients';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Firma Stripe faltante' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('[Webhook] Error verificando firma:', err);
      return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const gameId = session.metadata?.gameId;
        const packType = session.metadata?.packType;
        const userId = session.metadata?.userId;

        if (!gameId || !packType || !userId) {
          console.error('[Webhook] Metadata incompleta en session:', session.metadata);
          break;
        }

        await cattleyaClient.confirmGamePackPurchase(
          gameId,
          packType,
          userId,
          session.id
        );

        await gamesClient.recordGamePackPurchase(
          gameId,
          userId,
          packType,
          session.amount_total || 0,
          'MXN',
          session.id
        );

        console.log('[Webhook] Pack de juego comprado:', { gameId, packType, userId });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('[Webhook] Pago fallido:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('[Webhook] Reembolso procesado:', charge.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error procesando webhook:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}