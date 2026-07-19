import { createStripe, safeError } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface LineItem {
  sku_id: string;
  quantity: number;
}

interface CheckoutRequest {
  sellerProfileId: string;
  currency: string;
  lineItems: LineItem[];
  returnUrl: string;
}

Deno.serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: "METHOD_NOT_ALLOWED",
          message: "Use POST to create a Stripe Checkout session",
        },
      }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const stripe = createStripe();

    let body: CheckoutRequest;
    try {
      body = (await req.json()) as CheckoutRequest;

      if (
        !body.sellerProfileId ||
        !body.lineItems?.length ||
        !body.returnUrl
      ) {
        throw new Error(
          "sellerProfileId, lineItems and returnUrl are required",
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "sellerProfileId, lineItems and returnUrl are required";

      return new Response(
        JSON.stringify({
          ok: false,
          error: { code: "BAD_REQUEST", message },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const currency = body.currency || "usd";

    // Construcción de line_items según guía Stripe (price_data dinámico). [web:222][web:223][web:224][web:225][web:228]
    const lineItems = body.lineItems.map((item) => ({
      price_data: {
        currency,
        // Aquí mantengo unit_amount fijo (100) porque no conocemos tu lógica de precios.
        // En tu repo real esto debería venir de tu modelo de SKU/precios.
        unit_amount: 100,
        product_data: {
          name: `SKU: ${item.sku_id}`,
          // Puedes añadir description/imágenes si tu modelo lo soporta.
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency,
      line_items: lineItems,
      payment_intent_data: {
        metadata: {
          source: "agentic_commerce",
          seller_profile: body.sellerProfileId,
        },
      },
      success_url: `${body.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.returnUrl,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        url: session.url,
        sessionId: session.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    // safeError ya debería encargarse de serializar errores y añadir CORS si lo tienes así en tu _shared. [web:55][web:229]
    const resp = safeError(e);
    // En caso de que safeError no añada CORS, los reforzamos aquí de forma defensiva.
    const headers = resp.headers ?? new Headers();
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));

    return new Response(await resp.text(), {
      status: resp.status,
      headers,
    });
  }
});
