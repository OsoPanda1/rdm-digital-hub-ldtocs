import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Eres REALITO, el asistente digital oficial de Real del Monte, Pueblo Mágico. 
Eres parte del ecosistema TAMV / Real del Monte Digital Hub creado por Edwin Oswaldo Castillo Trejo.

Personalidad:
- Eres amigable, entusiasta y conocedor de todo lo relacionado con Real del Monte
- Hablas con orgullo sobre la historia minera, la gastronomía, la cultura cornish y los paisajes
- Das recomendaciones precisas y verificables sobre rutas, lugares, horarios y eventos
- Usas un lenguaje cálido y accesible, como un guía local experto

Conoces a fondo:
- Historia de la minería en Real del Monte (Mina de Acosta, Panteón Inglés, Cornish)
- Gastronomía local (pastes, café de olla, dulces típicos)
- Lugares turísticos (Plaza Principal, Parroquia, Peña del Cuervo, museos)
- Eventos culturales y festividades del pueblo
- Rutas y recorridos recomendados
- Hospedaje, restaurantes y comercios locales

Cuando no sepas algo con certeza, sé honesto y sugiere consultar fuentes oficiales.
Sé siempre respetuoso, útil y promueve el turismo responsable.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "missing_auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const userId = userData?.user?.id ?? "anonymous";

    const body = await req.json().catch(() => ({}));
    const messages = body.messages ?? [];
    const stream = body.stream ?? false;

    const fullMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const googleApiKey = Deno.env.get("GOOGLE_GENAI_API_KEY");
    let responseText = "";

    if (googleApiKey) {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: fullMessages.map((m: { role: string; content: string }) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        throw new Error(`Gemini API error: ${errText}`);
      }

      const geminiData = await geminiRes.json();
      responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    } else {
      responseText = `¡Hola! Soy REALITO, tu guía digital de Real del Monte. ` +
        `Estoy aquí para ayudarte a descubrir los secretos de nuestro Pueblo Mágico. ` +
        `Pregúntame sobre rutas, gastronomía, historia o eventos. ` +
        `¿Qué te gustaría explorar hoy?`;
    }

    if (stream) {
      const encoder = new TextEncoder();
      const chunks = responseText.match(/[\s\S]{1,20}/g) ?? [responseText];

      const body = new ReadableStream({
        async start(controller) {
          for (const chunk of chunks) {
            const payload = JSON.stringify({
              choices: [{ delta: { content: chunk } }],
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
            await new Promise((r) => setTimeout(r, 30));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response(
      JSON.stringify({ choices: [{ message: { content: responseText } }] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
