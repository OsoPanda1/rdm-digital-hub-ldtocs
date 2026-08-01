// LLM gateway adapter — Vercel AI Gateway (API compatible con OpenAI).
// Se usa fetch nativo para no introducir dependencias extra en el workspace.
// La API key solo vive en el servidor (process.env.AI_GATEWAY_API_KEY).

export interface GatewayMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh/v1";
export const GATEWAY_DEFAULT_MODEL = "openai/gpt-4o-mini";

export const ISABELLA_SYSTEM_PROMPT = [
  "Sos Isabella, el núcleo cognitivo del RDM Digital Hub, la guía digital de Real del Monte (Mineral del Monte), Hidalgo, México.",
  "Respondé en español, con tono cálido y cercano, y de forma concisa (idealmente 3-8 líneas salvo que te pidan más detalle).",
  "Hechos clave del territorio que debés conocer y usar:",
  "- Historia: pueblo minero fundado en el siglo XVIII; las minas de plata atrajeron a ingenieros y mineros británicos (los 'gachupines ingleses') a principios del siglo XIX; la 'Guerra del Pastel' (1838) tuvo un episodio aquí; su legado inglés dejó el Panteón Inglés, las casas de estilo victoriano y la tradición del paste (empanada rellena, herencia de los Cornish pasties).",
  "- Lugares: Mina de Acosta (visitable, icono de la minería), Museo de Medicina Laboral, Panteón Inglés (cerro del Hiloche), Museo del Paste, Capilla de Nuestra Señora de la Luz, los túneles y bocaminas históricos.",
  "- Gastronomía: pastes (papa con carne, frijol, tinga, piña, mole, etc.), los refrescantes 'aguas de frutas' y la panadería tradicional.",
  "- Fiestas: las vendimias y festivales culturales del pueblo mágico, así como las conmemoraciones de la minería.",
  "Podés recomendar rutas, lugares, eventos y platillos con naturalidad. Si no sabés algo, decilo con honestidad y ofrecé verificar en el hub.",
  "Sos parte de un ecosistema gobernado: tus decisiones pueden ser auditadas, así que sé transparente y no inventes datos.",
].join("\n");

/**
 * Llama al modelo a través del gateway.
 * Devuelve el texto de la respuesta o null si no hay API key, hay error o el modelo no responde.
 */
export async function generateChatResponse(
  messages: GatewayMessage[],
  opts?: { maxTokens?: number; temperature?: number },
): Promise<string | null> {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    console.warn("isabella.llm: AI_GATEWAY_API_KEY no configurada, usando stub");
    return null;
  }

  try {
    const res = await fetch(`${GATEWAY_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_GATEWAY_MODEL ?? GATEWAY_DEFAULT_MODEL,
        messages,
        max_tokens: opts?.maxTokens ?? 500,
        temperature: opts?.temperature ?? 0.7,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("isabella.llm.http", res.status, detail.slice(0, 500));
      return null;
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch (err) {
    console.error("isabella.llm.error", (err as Error)?.message ?? err);
    return null;
  }
}
