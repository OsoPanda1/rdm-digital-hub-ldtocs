"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { useIsabellaChat } from "@/hooks/use-isabella";
import { createClient } from "@/lib/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "¿Qué lugares puedo visitar?",
  "Cuéntame la historia minera",
  "¿Cuál es el platillo típico?",
  "¿Qué eventos hay próximos?",
];

export default function IsabellaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Soy Isabella, el núcleo cognitivo de RDM Digital Hub. Puedo guiarte por la historia, la gastronomía, las rutas y la vida de Real del Monte. ¿En qué te ayudo?",
    },
  ]);
  const [input, setInput] = useState("");
  const chat = useIsabellaChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chat.isPending]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || chat.isPending) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      const actorId = session.data.session?.user?.id;

      const data = await chat.mutateAsync(input);
      const aiMsg: Message = {
        role: "assistant",
        content: data.decision?.summary || data.response || "No pude procesar tu solicitud.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No logré conectar con mi núcleo en este momento. Intenta de nuevo en unos segundos.",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative overflow-hidden border-b border-[#2a2d35]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2414] via-[#0d0e12] to-[#1a1308]" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4b26a]">
            <Sparkles className="h-4 w-4" /> Núcleo Cognitivo Gobernado
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Isabella</h1>
          <p className="text-[#9ca3af] max-w-xl mx-auto">
            Conversa con la inteligencia artificial del territorio: historia, rutas, gastronomía y comunidad.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#2a2d35] bg-[#121418]/80 text-[#9ca3af] hover:border-[#c8a356]/60 hover:text-[#d4b26a] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto mb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#c8a356] to-[#b8944c] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#0a0b0e]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#c8a356] text-[#0a0b0e]"
                    : "bg-[#1a1d24] text-[#e8e6e0] border border-[#2a2d35]"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-[#1a1d24] border border-[#2a2d35] flex items-center justify-center">
                  <User className="h-4 w-4 text-[#9ca3af]" />
                </div>
              )}
            </div>
          ))}
          {chat.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#c8a356] to-[#b8944c] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#0a0b0e]" />
              </div>
              <div className="bg-[#1a1d24] border border-[#2a2d35] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#c8a356] animate-bounce [animation-delay:-0.2s]" />
                <span className="h-2 w-2 rounded-full bg-[#c8a356] animate-bounce [animation-delay:-0.1s]" />
                <span className="h-2 w-2 rounded-full bg-[#c8a356] animate-bounce" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 pb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje…"
            className="flex-1 px-4 py-3 bg-[#121418] border border-[#2a2d35] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a356]"
            disabled={chat.isPending}
          />
          <button
            type="submit"
            disabled={chat.isPending || !input.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8a356] text-[#0a0b0e] rounded-xl font-medium hover:bg-[#d4b26a] transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
