export const config = { runtime: "edge" };

import { getCorsHeaders, handleCors } from "../_shared/cors.js";
import { checkRateLimit } from "../_shared/rate-limit.js";
import { getStripe } from "../_shared/stripe.js";

export default async function handler(req: Request): Promise<Response> {
  const cors = handleCors(req);
  if (cors) return cors;

  // Rate limiting
  const rateLimit = checkRateLimit(req, { keyPrefix: "pay", windowMs: 60_000, maxRequests: 20 });
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  }

  try {
    const body = await req.json();
    const { amount, currency = "mxn", paymentMethodId, paymentIntentId, metadata = {} } = body;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Amount must be positive" }), {
        status: 400,
        headers: { "content-type": "application/json", ...getCorsHeaders(req) },
      });
    }

    const stripe = getStripe();

    let paymentIntent;

    if (paymentIntentId) {
      // Retrieve existing payment intent
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // If payment method provided, update and confirm
      if (body.paymentMethodId && paymentIntent.status === "requires_payment_method") {
        await stripe.paymentIntents.update(paymentIntentId, {
          payment_method: body.paymentMethodId,
        });
        paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      }
    } else {
      // Create new payment intent
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        payment_method: paymentMethodId,
        confirm: !!paymentMethodId,
        automatic_payment_methods: { enabled: true, allow_redirects: "always" },
        metadata,
        return_url: body.returnUrl,
      });
    }

    return new Response(JSON.stringify({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      nextAction: paymentIntent.next_action,
    }), {
      status: 200,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  } catch (err) {
    console.error("[mpp/pay] error", err);
    const message = err instanceof Error ? err.message : "Payment failed";
    const code = err instanceof Error && "code" in err ? (err as any).code : undefined;
    return new Response(JSON.stringify({ error: message, code }), {
      status: code === "card_declined" ? 402 : 500,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  }
}