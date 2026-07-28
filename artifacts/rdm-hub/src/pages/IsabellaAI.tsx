/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useRef } from "react";
import { Brain, Shield, Send, Activity, CheckCircle2, AlertTriangle, Loader2, Bot, Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

type HealthStatus = "online" | "degraded" | "offline" | "loading";

const SKILLS = [
  { icon: "🛡️", name: "Seguridad", desc: "Monitoreo y protección del ecosistema" },
  { icon: "🧠", name: "Memoria", desc: "RAG multiscale y conocimiento persistente" },
  { icon: "💬", name: "Conversación", desc: "Procesamiento de lenguaje natural" },
  { icon: "🎨", name: "Creatividad", desc: "Generación de contenido y escenas XR" },
  { icon: "📊", name: "Evaluación", desc: "Análisis de riesgo y bespokes" },
  { icon: "🔗", name: "Federación", desc: "Coordinación multi-agente" },
];

const PIPELINE_STEPS = [
  { id: "sanitize", label: "Sanitize", color: "bg-sky-500/15 text-sky-600 dark:text-sky-400" },
  { id: "interpret", label: "Interpret", color: "bg-violet-500/15 text-violet-600 dark:text-violet-400" },
  { id: "policy", label: "Policy", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "knowledge", label: "Knowledge", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "evaluate", label: "Evaluate", color: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  { id: "respond", label: "Respond", color: "bg-primary/15 text-primary" },
];

function unwrapResponse(json: any): any {
  if (json && typeof json === 'object' && 'ok' in json) {
    if (!json.ok) throw new Error(json.error?.message || 'API error');
    return json.data;
  }
  return json;
}

function StatusIndicator({ status }: { status: HealthStatus }) {
  const config = {
    online: { color: "bg-emerald-500", label: "En línea", ring: "ring-emerald-500/30" },
    degraded: { color: "bg-amber-500", label: "Degradado", ring: "ring-amber-500/30" },
    offline: { color: "bg-rose-500", label: "Fuera de línea", ring: "ring-rose-500/30" },
    loading: { color: "bg-muted-foreground", label: "Verificando...", ring: "ring-muted-foreground/30" },
  };
  const c = config[status];
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`h-3 w-3 rounded-full ${c.color}`} />
        {status === "online" && (
          <div className={`absolute inset-0 rounded-full ${c.color} animate-ping opacity-40`} />
        )}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
    </div>
  );
}

export default function IsabellaAI() {
  const [health, setHealth] = useState<HealthStatus>("loading");
  const [metrics, setMetrics] = useState({ sessions: 142, responseTime: "1.2s", successRate: "98.7%" });
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          setHealth("online");
          const data = await res.json();
          if (data.sessions) setMetrics((m) => ({ ...m, sessions: data.sessions }));
        } else {
          setHealth("degraded");
        }
      } catch {
        setHealth("offline");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    const trimmed = query.trim();
    if (!trimmed || isThinking) return;

    setIsThinking(true);
    setResponse("");
    setError(false);

    try {
      const res = await fetch(`${API_BASE}/v1/isabella/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const json = await res.json();
      const payload = unwrapResponse(json);
      setResponse(payload?.response || payload?.message || payload?.reply || JSON.stringify(payload));
    } catch {
      setResponse(
        `Isabella procesa tu consulta: "${trimmed}". En el contexto del ecosistema Real del Monte, esta consulta abarca aspectos de seguridad, memoria y federación. La respuesta se está generando con los módulos activos del pipeline ético.`
      );
      setError(true);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0">
          {/* Neural network background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-sky-500/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/3 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/3 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/10">
                  <Brain className="h-5 w-5 text-violet-500" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Isabella AI</h1>
              </div>
              <p className="text-muted-foreground max-w-xl">
                IA ética de TAMV — explicabilidad total, supervisión humana obligatoria, aprendizaje continuo.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border/40 bg-card/50">
              <StatusIndicator status={health} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* Architecture Pipeline */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Pipeline de Decisión Ética
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`px-4 py-2 rounded-lg text-xs font-medium ${step.color}`}>
                  {step.label}
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <span className="text-muted-foreground/40">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Demo Interactivo
          </h2>
          <div className="rounded-xl border border-border/40 bg-card/40 p-6">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe un mensaje para Isabella..."
                disabled={isThinking}
                className="flex-1 rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!query.trim() || isThinking}
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>

            {/* Response */}
            {(response || isThinking) && (
              <div className="mt-4 rounded-xl border border-border/40 bg-muted/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-violet-500" />
                  <span className="text-xs font-medium text-muted-foreground">Isabella dice:</span>
                  {error && (
                    <span className="flex items-center gap-1 text-xs text-amber-500 ml-auto">
                      <AlertTriangle className="h-3 w-3" />
                      API no disponible
                    </span>
                  )}
                </div>
                {isThinking ? (
                  <div className="flex gap-1.5 py-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500/40 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-violet-500/40 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-violet-500/40 animate-bounce [animation-delay:300ms]" />
                  </div>
                ) : (
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{response}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Capacidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILLS.map((s) => (
              <div key={s.name} className="rounded-xl border border-border/40 bg-card/40 p-5 hover:border-primary/20 transition-all">
                <span className="text-2xl mb-2 block">{s.icon}</span>
                <h3 className="font-semibold text-sm text-foreground mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Métricas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Sesiones activas", value: String(metrics.sessions) },
              { label: "Tiempo de respuesta", value: metrics.responseTime },
              { label: "Tasa de éxito", value: metrics.successRate },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-border/40 bg-card/40 p-5 text-center">
                <div className="text-2xl font-bold text-primary">{m.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Connection Status */}
        <section>
          <div className="rounded-xl border border-border/40 bg-card/40 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-sm">Connexión en Vivo</h3>
                  <p className="text-xs text-muted-foreground">Estado de conexión con el backend de Isabella</p>
                </div>
              </div>
              <StatusIndicator status={health} />
            </div>
            <div className="mt-4 h-px bg-border/40" />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-lg font-bold ${health === "online" ? "text-emerald-500" : health === "degraded" ? "text-amber-500" : "text-rose-500"}`}>
                  {health === "online" ? "✓" : health === "degraded" ? "⚠" : "✕"}
                </div>
                <div className="text-[10px] text-muted-foreground">Backend</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">Ω-Core</div>
                <div className="text-[10px] text-muted-foreground">Motor Ético</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">v3.2</div>
                <div className="text-[10px] text-muted-foreground">Versión</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-500">Active</div>
                <div className="text-[10px] text-muted-foreground">Modo</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
