import { serve } from "https://deno.land/std@0.215.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const localReplies: Record<string, string> = {
  paste: "¡Los pastes son nuestra joya gastronómica! Puedes encontrar pastes de carne, pollo, tinga, frijol con queso, arándano y más en las pasteurías del centro. Mi recomendación: prueba uno de paste de carne recién horneado en la Plaza Principal.",
  comer: "Para comer en Real del Monte te sugiero: 1) Pastes (obvio), 2) Café de olla en los portales, 3) Barbacoa los fines de semana en el mercado, 4) Pan de pulque artesanal. ¿Qué se te antoja?",
  evento: "Real del Monte tiene vida cultural constante: conciertos en la Plaza, ferias gastronómicas, exposiciones en el Museo del Paste y celebraciones patronales. Revisa la sección Eventos del menú para más detalles.",
  hoy: "Hoy te recomiendo dar un paseo por la Plaza Principal, visitar la Parroquia de la Asunción y probar un café de olla en los portales. Si tienes más tiempo, la Mina de Acosta está abierta hasta las 5 PM.",
  ruta: "Ruta histórica sugerida: Plaza Principal → Callejón del Jazmín → Museo del Paste → Mina de Acosta → Antigua Hacienda de Beneficio. Unos 2 km a pie, ideal para medio día.",
  historia: "Real del Monte fue el centro minero más importante de México en el siglo XVIII. Los ingleses de Cornwall trajeron la tecnología de vapor y dejaron una herencia arquitectónica única: casas de estilo inglés, el Panteón Inglés y por supuesto, ¡los pastes!",
  mina: "La Mina de Acosta (10 AM - 5 PM) es una visita imperdible: túneles reales, malacates originales y museo de sitio. Entrada general ~$80 MXN. Guías expertos explican la historia minera de la región.",
  hospedaje: "Hay opciones para todos los presupuestos: hoteles boutique en el centro (casonas restauradas), cabañas en las afueras y Airbnb. La zona centro es la más conveniente para llegar caminando a todo.",
  transporte: "Desde CDMX: autobús desde Terminal Norte (Autobuses del Valle, 2 hrs). En auto: carretera a Pachuca, luego desviación a Real del Monte. También hay shuttle los fines de semana, revisa la sección Transporte.",
};

function getReply(message: string): string {
  const text = message.toLowerCase();
  for (const [key, reply] of Object.entries(localReplies)) {
    if (text.includes(key)) return reply;
  }
  return "¡Hola! Soy Realito, tu asistente turístico de Real del Monte. Pregúntame sobre pastes, rutas, historia, eventos, minas, hospedaje o transporte. ¡Estoy aquí para ayudarte a descubrir nuestro Pueblo Mágico!";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages?.[messages?.length - 1]?.content || "";

    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    if (openAiKey) {
      const openaiBody = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres Realito, un asistente digital amigable y conocedor del Pueblo Mágico de Real del Monte, Hidalgo. Respondes en español mexicano con calidez y orgullo local. Tus especialidades: gastronomía (pastes, café de olla), historia minera, eventos culturales, turismo, transporte. Respuestas breves (máximo 3 párrafos)." },
          ...messages,
        ],
        stream: true,
        max_tokens: 300,
      };

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(openaiBody),
      });

      if (resp.ok) {
        const sseTransform = new TransformStream();
        const writer = sseTransform.writable.getWriter();
        const encoder = new TextEncoder();

        (async () => {
          try {
            const reader = resp.body!.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) { await writer.write(encoder.encode("data: [DONE]\n\n")); break; }
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && !l.includes("[DONE]"));
              for (const line of lines) {
                try {
                  const parsed = JSON.parse(line.slice(6));
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    await writer.write(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`));
                  }
                } catch { /* skip */ }
              }
            }
          } catch (err) { console.error("Stream error:", err); }
          finally { await writer.close(); }
        })();

        return new Response(sseTransform.readable, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      }
    }

    const reply = getReply(lastMessage);
    const sse = `data: ${JSON.stringify({ choices: [{ delta: { content: reply } }] })}\n\ndata: [DONE]\n\n`;
    return new Response(sse, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
