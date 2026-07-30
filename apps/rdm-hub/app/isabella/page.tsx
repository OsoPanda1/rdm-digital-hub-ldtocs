"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function IsabellaPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Soy Isabella, el núcleo cognitivo de RDM. ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const supabase = createClient();
      const session = await supabase.auth.getSession();
      const actorId = session.data.session?.user?.id;

      const res = await fetch("/api/v1/isabella", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputType: "chat",
          payload: { text: input },
          timestamp: new Date().toISOString(),
          sessionId: crypto.randomUUID(),
          actorId,
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        role: "assistant",
        content: data.decision?.summary || "No pude procesar tu solicitud.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error al conectar con Isabella." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-[#2a2d35] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl font-bold">Isabella</h1>
          <p className="text-[#9ca3af] mt-1">Núcleo cognitivo gobernado del territorio</p>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-[#c8a356] text-[#0a0b0e]"
                    : "bg-[#1a1d24] text-[#e8e6e0]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1a1d24] rounded-xl px-4 py-3 text-[#9ca3af]">
                Pensando...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-3 bg-[#121418] border border-[#2a2d35] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a356]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-[#c8a356] text-[#0a0b0e] rounded-xl font-medium hover:bg-[#d4b26a] transition-colors disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
