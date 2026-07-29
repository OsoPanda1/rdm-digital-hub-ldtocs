import { serve } from "https://deno.land/std@0.215.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  userId?: string;
  sessionId?: string;
  protocol?: string;
  challengeResponse?: string;
  stream?: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RequestBody = await req.json();
    const { messages, userId, sessionId, protocol } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const userMessage = messages[messages.length - 1]?.content || "";

    if (!openAiKey) {
      const responseText = getCannedIsabellaResponse(userMessage, protocol);
      const sse = `data: ${JSON.stringify({ choices: [{ delta: { content: responseText } }] })}\n\ndata: [DONE]\n\n`;
      return new Response(sse, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    const systemPrompt = `Eres Isabella, la asistente de inteligencia artificial del RDM Digital Hub, plataforma territorial de Real del Monte, Pueblo Mágico de Hidalgo, México. Tu personalidad es cálida, conocedora de la cultura local, la historia minera, la gastronomía (pastas, pastes, café de olla) y las tradiciones del pueblo mágico. Respondes en español mexicano con un tono acogedor y orgulloso de la identidad de Real del Monte.${protocol ? ` Protocolo activo: ${protocol}.` : ""}`;

    const openaiBody = {
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 500,
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openaiBody),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: `OpenAI error: ${errText}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const sseTransform = new TransformStream();
    const writer = sseTransform.writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            await writer.write(encoder.encode("data: [DONE]\n\n"));
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && !l.includes("[DONE]"));
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line.slice(6));
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                const sseLine = `data: ${JSON.stringify({ choices: [{ delta: { content: delta } }] })}\n\n`;
                await writer.write(encoder.encode(sseLine));
              }
            } catch { /* skip malformed */ }
          }
        }

        if (sessionId && userId) {
          await supabase.from("narrative_messages").insert({
            player_id: userId,
            character_key: "isabella",
            type: "chat",
            content_json: { messages: [...messages, { role: "assistant", content: fullContent }] },
          }).maybeSingle();
        }
      } catch (err) {
        console.error("Stream error:", err);
      } finally {
        await writer.close();
      }
    })();

    return new Response(sseTransform.readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function getCannedIsabellaResponse(message: string, protocol?: string): string {
  const text = message.toLowerCase();
  if (protocol) return `Protocolo ${protocol} reconocido. Isabella está en modo de contingencia. Tu consulto ha sido registrada en la bitácora federada.`;
  if (text.includes("paste") || text.includes("comer")) {
    return "¡Ah, los pastes! Son el orgullo de Real del Monte. Te recomiendo probar los de paste de la Plaza Principal: los hay de carne, pollo, tinga, frijol con queso y hasta de arándano. ¿Quieres que te recomiende una pasteuría en especial?";
  }
  if (text.includes("mina") || text.includes("acosta") || text.includes("historia")) {
    return "La Mina de Acosta es una joya histórica. Abierta de 10 a 17 hrs, muestra la ingeniería minera del siglo XVIII traída por los Cornwall. Hay visitas guiadas de 45 min que recorren túneles, malacates y el museo de sitio. ¿Te interesa agendar un recorrido?";
  }
  if (text.includes("evento") || text.includes("fiesta") || text.includes("hoy")) {
    return "Real del Monte tiene actividad casi todos los fines de semana. La Plaza Principal suele albergar conciertos, ferias gastronómicas y exposiciones artesanales. Te sugiero consultar la sección de Eventos en el menú para ver el calendario actualizado.";
  }
  if (text.includes("ruta") || text.includes("camino") || text.includes("tour")) {
    return "Te recomiendo la Ruta del Paste: empieza en la Plaza, camina por el Callejón del Jazmín, visita el Museo del Paste y termina en la Antigua Hacienda de Beneficio. Son unos 2 km a pie, muy caminables y con muchas paradas fotogénicas.";
  }
  return "¡Hola! Soy Isabella, tu guía digital de Real del Monte. Puedo ayudarte con recomendaciones de pastes, rutas históricas, eventos del pueblo, datos mineros, transporte, hospedaje y más. ¿Qué te gustaría saber hoy?";
}
