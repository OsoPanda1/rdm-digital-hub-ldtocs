// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Send, Loader2, Volume2, VolumeX, Sparkles, Minimize2, Maximize2, RotateCcw } from "lucide-react";
import { useIsabellaVoice } from "@/hooks/useIsabellaVoice";
import { logger } from "@/lib/logger";

type Msg = { role: "user" | "assistant"; content: string; ts?: number };

// Connects to the local API server (proxied via Replit at /api)
const CHAT_URL = "/api/isabella/chat";

const GREETINGS = [
  "¡Hola! Soy **Isabella**, la IA territorial de RDM Digital Hub. Conozco cada rincón de Real del Monte — historia, minas, gastronomía, eventos. ¿Qué deseas explorar?",
];

const SUGGESTIONS = [
  "¿Cuál es la historia de las minas?",
  "¿Dónde comer los mejores pastes?",
  "¿Qué hacer este fin de semana?",
  "Cuéntame sobre el Panteón Inglés",
];

export function IsabellaChat() {
  const voice = useIsabellaVoice();
  const [open, setOpen]       = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETINGS[0], ts: Date.now() },
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [online, setOnline]   = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Probe the API on open
  useEffect(() => {
    if (!open) return;
    fetch("/api/isabella/status", { signal: AbortSignal.timeout(4000) })
      .then((r) => setOnline(r.ok))
      .catch(() => setOnline(false));
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const history = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });

      if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

      const reader  = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl).replace(/\r$/, "");
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data: ") || line.trim() === "") continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const chunk = JSON.parse(json);
            const delta = chunk.choices?.[0]?.delta?.content ?? chunk.content ?? "";
            if (delta) {
              assistantSoFar += delta;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar, ts: Date.now() }];
              });
            }
          } catch { /* skip malformed */ }
        }
      }

      // If no streaming content arrived, check for JSON body
      if (!assistantSoFar) {
        const clone = resp.clone?.();
        const json = await clone?.json?.().catch(() => null);
        const text = json?.response ?? json?.message ?? json?.content ?? "Respuesta recibida.";
        setMessages((prev) => [...prev, { role: "assistant", content: text, ts: Date.now() }]);
      }

    } catch (e) {
      logger.error(e);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: online === false
          ? "⚠️ Isabella no está conectada al servidor. Verifica que la API esté activa."
          : "Lo siento, hubo un problema al procesar tu mensaje. Intenta de nuevo.",
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, online]);

  const clearChat = () => setMessages([{ role: "assistant", content: GREETINGS[0], ts: Date.now() }]);

  const panelW = expanded ? "w-[520px]" : "w-[380px]";
  const panelH = expanded ? "h-[640px]" : "h-[500px]";

  return (
    <>
      {/* ── Floating trigger ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Abrir Isabella AI"
          >
            {/* Outer pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--rdm-amber)/0.35)] animate-ping" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--rdm-amber))] to-[hsl(43_70%_40%)] shadow-[0_0_30px_hsl(43_80%_55%/0.4)] transition-shadow group-hover:shadow-[0_0_44px_hsl(43_80%_55%/0.65)]">
              <Brain className="h-6 w-6 text-white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={`fixed bottom-6 right-6 z-50 ${panelW} ${panelH} max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_-12px_hsl(0_0%_0%/0.7)]`}
            style={{ background: "hsl(222 47% 5%)" }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/[0.07]"
              style={{ background: "hsl(222 47% 7%)" }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(43_80%_55%)] to-[hsl(43_60%_35%)] flex items-center justify-center shadow-[0_0_18px_hsl(43_80%_55%/0.4)]">
                    <Brain className="h-4.5 w-4.5 text-white" />
                  </div>
                  {/* Status dot */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[hsl(222_47%_7%)] ${
                      online === null ? "bg-yellow-400 animate-pulse" :
                      online ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Isabella
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[hsl(43_70%_60%)]">
                    {online === null ? "Conectando…" : online ? "IA Territorial · En línea" : "Sin conexión al servidor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (voice.isSpeaking) { voice.cancelAll(); return; }
                    const last = messages.filter((m) => m.role === "assistant").pop();
                    if (last) voice.speak(last.content);
                  }}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  title="Leer última respuesta"
                >
                  {voice.isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={clearChat}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  title="Nueva conversación"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  title={expanded ? "Minimizar" : "Expandir"}
                >
                  {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                  title="Cerrar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {m.role === "assistant" && (
                    <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-[hsl(43_80%_55%)] to-[hsl(43_60%_35%)] flex items-center justify-center mb-0.5">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-[hsl(var(--rdm-amber)/0.18)] text-white border border-[hsl(var(--rdm-amber)/0.25)]"
                        : "rounded-bl-sm bg-white/[0.06] text-white/90 border border-white/[0.07]"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {m.content.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-end gap-2"
                >
                  <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-[hsl(43_80%_55%)] to-[hsl(43_60%_35%)] flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/[0.07] px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((d) => (
                        <motion.div
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--rdm-amber)/0.6)]"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay: d * 0.18 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Suggestions ── */}
            {messages.length <= 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-[hsl(var(--rdm-amber)/0.25)] text-[hsl(var(--rdm-amber)/0.85)] hover:bg-[hsl(var(--rdm-amber)/0.08)] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input ── */}
            <div className="px-3 pb-3 pt-2 shrink-0 border-t border-white/[0.06]">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-[hsl(var(--rdm-amber)/0.4)] transition-colors"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Real del Monte…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                  style={{ fontFamily: "var(--font-body)" }}
                  disabled={loading}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="shrink-0 h-7 w-7 rounded-lg bg-[hsl(var(--rdm-amber))] flex items-center justify-center shadow-md disabled:opacity-30 hover:bg-[hsl(var(--rdm-amber)/0.85)] transition-all"
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" /> : <Send className="h-3.5 w-3.5 text-white" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
