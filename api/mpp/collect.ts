import { getMppStripe } from "../_shared/stripe";
import { handleCors } from "../_shared/cors";

/**
 * Endpoint para verificar un PaymentIntent y devolver un recibo simplificado.
 * Usa Stripe PaymentIntents según las recomendaciones actuales. [web:212][web:213][web:217]
 */
export default async function handler(req: Request): Promise<Response> {
  // CORS / preflight
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Use POST for payment intent verification",
        },
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Parseo y validación básica del body
  let body: { paymentIntentId?: string };
  try {
    body = (await req.json()) as { paymentIntentId?: string };

    if (!body.paymentIntentId || typeof body.paymentIntentId !== "string") {
      throw new Error("paymentIntentId required");
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "paymentIntentId required";

    return new Response(
      JSON.stringify({
        ok: false,
        error: { code: "BAD_REQUEST", message },
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try:
    const stripe = getMppStripe();

    // Recuperar el PaymentIntent desde Stripe. [web:215][web:212][web:213]
    const intent = await stripe.paymentIntents.retrieve(body.paymentIntentId, {
      expand: ["charges.data.balance_transaction"],
    });

    // Estados “no terminales” o fallidos según el flujo de PaymentIntents. [web:217][web:219]
    if (intent.status !== "succeeded") {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: "PAYMENT_NOT_COMPLETED",
            message: "Payment not completed",
            status: intent.status,
            requiresAction:
              intent.status === "requires_action" ||
              intent.status === "requires_payment_method",
          },
        }),
        {
          status: 402,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Construimos un recibo compacto pero útil.
    const charge = intent.charges?.data?.[0];
    const receiptUrl = charge?.receipt_url ?? null;

    return new Response(
      JSON.stringify({
        ok: true,
        resource: body.paymentIntentId,
        receipt: {
          id: intent.id,
          amount: intent.amount,
          currency: intent.currency,
          status: intent.status,
          created: intent.created,
          paymentMethod: intent.payment_method,
          description: intent.description,
          receiptUrl,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    // Manejo de errores Stripe y genéricos. [web:215][web:217][web:219][web:220]
    const message = err instanceof Error ? err.message : "Unknown error";
    const statusCode =
      typeof (err as any)?.statusCode === "number"
        ? (err as any).statusCode
        : 500;

    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: "STRIPE_ERROR",
          message,
        },
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
