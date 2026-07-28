/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, History, RotateCcw, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  category?: string;
  timestamp: number;
};

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const SUGGESTIONS = [
  "Tendencias 2026",
  "IA en Educación",
  "Blockchain para Turismo",
  "Smart Cities",
  "Energía Renovable",
];

const CATEGORY_COLORS: Record<string, string> = {
  Tendencia: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  Predicción: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  Análisis: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Recomendación: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

function unwrapResponse(json: any): any {
  if (json && typeof json === 'object' && 'ok' in json) {
    if (!json.ok) throw new Error(json.error?.message || 'API error');
    return json.data;
  }
  return json;
}

function loadRecent(): Message[] {
  try {
    const raw = localStorage.getItem("oraculo_recent");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(msgs: Message[]) {
  try {
    localStorage.setItem("oraculo_recent", JSON.stringify(msgs.slice(0, 20)));
  } catch {}
}

export default function OraculoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<Message[]>(loadRecent);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const detectCategory = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("tendencia") || t.includes("futuro") || t.includes("2026")) return "Tendencia";
    if (t.includes("predicc") || t.includes("será") || t.includes("llegará")) return "Predicción";
    if (t.includes("análisis") || t.includes("datos") || t.includes("métrica")) return "Análisis";
    return "Recomendación";
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch(`${API_BASE}/v1/isabella/interpret`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const json = await res.json();
        const payload = unwrapResponse(json);
        const reply: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: payload?.response || payload?.message || payload?.reply || JSON.stringify(payload),
          category: detectCategory(trimmed),
          timestamp: Date.now(),
        };
        setMessages((prev) => {
          const next = [...prev, reply];
          setRecentAnalyses((r) => {
            const updated = [reply, ...r].slice(0, 20);
            saveRecent(updated);
            return updated;
          });
          return next;
        });
      } catch {
        const fallback: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Análisis para "${trimmed}": El Oráculo Tecnológico procesa tu consulta sobre "${trimmed}". En el contexto de Real del Monte, esta tecnología presenta oportunidades significativas para la digitalización del patrimonio cultural y la optimización de servicios turísticos. El ecosistema TAMV podría beneficiarse de una implementación gradual, priorizando el impacto comunitario y la soberanía tecnológica local.`,
          category: detectCategory(trimmed),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, fallback]);
        toast.info("Respuesta generada con datos locales");
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-violet-950/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/10">
              <Sparkles className="h-5 w-5 text-violet-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Oráculo Tecnológico</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Análisis predictivo de tendencias tecnológicas para Real del Monte
          </p>
        </div>
      </section>

      <div className="flex-1 flex max-w-5xl mx-auto w-full">
        {/* Sidebar — Recent */}
        <aside
          className={`${
            showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } fixed lg:static inset-y-0 left-0 z-30 w-72 bg-card/80 backdrop-blur border-r border-border/40 flex flex-col transition-transform lg:transition-none`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Análisis Recientes</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {recentAnalyses.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">
                Sin análisis previos
              </p>
            )}
            {recentAnalyses.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setInput(m.content);
                  setShowSidebar(false);
                }}
                className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs text-muted-foreground line-clamp-2"
              >
                {m.content}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 lg:hidden">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <History className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground">Recientes</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-violet-500/60" />
                </div>
                <h3 className="text-lg font-medium mb-2">¿Qué tecnología te interesa?</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                  Consulta al Oráculo sobre tendencias, predicciones y análisis tecnológicos para el ecosistema RDM.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="px-4 py-2 rounded-full border border-border/50 bg-card/50 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-violet-500" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card/80 border border-border/40 rounded-bl-md"
                  }`}
                >
                  {msg.category && (
                    <Badge
                      className={`mb-2 ${CATEGORY_COLORS[msg.category] ?? ""} border-0`}
                      variant="outline"
                    >
                      {msg.category}
                    </Badge>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-violet-500" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-card/80 border border-border/40 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border/40 p-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta tecnológica..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-border/50 bg-card/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  inputRef.current?.focus();
                }}
                className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Nueva conversación
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
