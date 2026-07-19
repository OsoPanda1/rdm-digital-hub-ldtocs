import { getMppStripe } from "../_shared/stripe.js";
import { handleCors } from "../_shared/cors.js";

/**
 * Endpoint: Collect/Verify Payment
 * Arquitectura: TAMV MD-X4 | Federated Gateway
 */
export default async function handler(req: Request): Promise<Response> {
  // 1. Manejo de CORS
  const cors = handleCors(req);
  if (cors) {
    return cors;
  }

  // 2. Validación de Método
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "POST required" }
    }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  // 3. Procesamiento principal
  try {
    const body = await req.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId || typeof paymentIntentId !== "string") {
      throw new Error("MISSING_PAYMENT_INTENT_ID");
    }

    const stripe = getMppStripe();

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["charges.data.balance_transaction"]
    });

    if (intent.status !== "succeeded") {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: "PAYMENT_NOT_COMPLETED",
          status: intent.status,
          requiresAction: ["requires_action", "requires_payment_method"].includes(intent.status)
        }
      }), {
        status: 402,
        headers: { "Content-Type": "application/json" }
      });
    }

    const charge = intent.charges?.data?.[0];

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status,
        receiptUrl: charge?.receipt_url ?? null,
        metadata: intent.metadata,
        processedAt: new Date().toISOString()
      },
      meta: { architecture: "TAMV-MD-X4", source: "stripe-mpp" }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-TAMV-Architecture": "MD-X4"
      }
    });

  } catch (err: any) {
    console.error("[MPP-COLLECT-ERROR]:", err);

    return new Response(JSON.stringify({
      success: false,
      error: {
        code: err.type === "StripeInvalidRequestError" ? "INVALID_REQUEST" : "INTERNAL_ERROR",
        message: err.message || "Unknown error occurred"
      }
    }), {
      status: err.statusCode || 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
