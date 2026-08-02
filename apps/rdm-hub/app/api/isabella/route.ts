import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateChatResponse, ISABELLA_SYSTEM_PROMPT } from "@nodo-cero/domain-ai/infrastructure/llm-gateway";

export const dynamic = "force-dynamic";

const FALLBACK = (prompt: string) => `[ISABELLA AI — Modo Local Soberano]
Hola. Soy ISABELLA, la Inteligencia Civilizacional e Histórica de Real del Monte (Nodo Cero).

Sobre tu consulta "${prompt}": Real del Monte (2,760 m.s.n.m., comarca minera de Hidalgo) reúne el legado de los mineros de Cornualles, las minas de Acosta y La Dificultad, el Panteón Inglés y el paste tradicional.

*Tip territorial:* explora la Ruta de la Plata y apoya al comercio local con Cattleya Pay.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "Proporcione un mensaje válido para ISABELLA AI." }, { status: 400 });
    }

    const history = Array.isArray(body?.conversationHistory) ? body.conversationHistory : [];

    const messages = [
      { role: "system" as const, content: ISABELLA_SYSTEM_PROMPT },
      ...history
        .slice(-8)
        .filter((m: any) => typeof m?.content === "string" || typeof m?.text === "string")
        .map((m: any) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: String(m.content ?? m.text ?? ""),
        })),
      { role: "user" as const, content: prompt },
    ];

    const text = await generateChatResponse(messages).catch(() => "");

    return NextResponse.json({ response: text && text.trim() ? text.trim() : FALLBACK(prompt) });
  } catch (err: any) {
    console.error("isabella.simple.error", err);
    return NextResponse.json({ error: "Error al consultar la IA ISABELLA." }, { status: 500 });
  }
}
