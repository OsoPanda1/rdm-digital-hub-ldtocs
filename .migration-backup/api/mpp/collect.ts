export const config = { runtime: "edge" };

import { getCorsHeaders, handleCors } from "../_shared/cors.js";
import { checkRateLimit } from "../_shared/rate-limit.js";
import { getStripe } from "../_shared/stripe.js";

export default async function handler(req: Request): Promise<Response> {
  const cors = handleCors(req);
  if (cors) return cors;

  // Rate limiting
  const rateLimit = checkRateLimit(req, { keyPrefix: "collect", windowMs: 60_000, maxRequests: 30 });
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
    const { paymentIntentId, paymentMethodId, amount, currency = "mxn" } = body;

    if (!paymentIntentId) {
      return new Response(JSON.stringify({ error: "paymentIntentId is required" }), {
        status: 400,
        headers: { "content-type": "application/json", ...getCorsHeaders(req) },
      });
    }

    const stripe = getStripe();

    // Retrieve the payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["charges"],
    });

    if (paymentIntent.status === "succeeded") {
      return new Response(JSON.stringify({
        status: "succeeded",
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        charges: (paymentIntent.charges as any)?.data || [],
      }), {
        status: 200,
        headers: { "content-type": "application/json", ...getCorsHeaders(req) },
      });
    }

    // If payment needs action (3DS, etc.)
    if (paymentIntent.status === "requires_action") {
      return new Response(JSON.stringify({
        status: "requires_action",
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        nextAction: paymentIntent.next_action,
      }), {
        status: 200,
        headers: { "content-type": "application/json", ...getCorsHeaders(req) },
      });
    }

    // Try to confirm if payment method provided
    if (paymentMethodId && paymentIntent.status === "requires_payment_method") {
      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return new Response(JSON.stringify({
        status: confirmed.status,
        paymentIntentId: confirmed.id,
        clientSecret: confirmed.client_secret,
      }), {
        status: 200,
        headers: { "content-type": "application/json", ...getCorsHeaders(req) },
      });
    }

    // Return current status
    return new Response(JSON.stringify({
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      lastError: paymentIntent.last_payment_error,
    }), {
      status: 200,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  } catch (err) {
    console.error("[mpp/collect] error", err);
    const message = err instanceof Error ? err.message : "Collection failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json", ...getCorsHeaders(req) },
    });
  }
}