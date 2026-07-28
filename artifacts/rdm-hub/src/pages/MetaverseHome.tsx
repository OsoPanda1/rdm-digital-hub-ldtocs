/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Map, Bot, Users, Gamepad2, MapPin, Globe, Music2,
  Send, Sparkles, Building2, TrendingUp, CheckCircle2,
  Clock, ChevronRight, Layers, Palette, Compass, Zap,
  CircleDot
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoadingTimeout } from "@/hooks/useLoadingTimeout";

interface ToolbarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { id: "atlas", icon: <Map className="h-4 w-4" />, label: "Mapa 3D", path: "/atlas" },
  { id: "isabella", icon: <Bot className="h-4 w-4" />, label: "Isabella AI", path: "/isabella-ai" },
  { id: "comunidad", icon: <Users className="h-4 w-4" />, label: "Comunidad", path: "/comunidad" },
  { id: "gamificacion", icon: <Gamepad2 className="h-4 w-4" />, label: "Gamificación", path: "/gamificacion" },
  { id: "territorio", icon: <MapPin className="h-4 w-4" />, label: "Territorio", path: "/territorial-dashboard" },
  { id: "constelacion", icon: <Globe className="h-4 w-4" />, label: "Constelación", path: "/constelacion" },
  { id: "nexo", icon: <Send className="h-4 w-4" />, label: "Nexo Estelar", path: "/nexo-estelar" },
  { id: "musica", icon: <Music2 className="h-4 w-4" />, label: "Música", path: "/musica" },
];

const FEATURED_CONTENT = [
  {
    title: "Ruta del Paste",
    desc: "Recorrido turístico por los pastes más emblemáticos del pueblo.",
    path: "/ruta-del-paste",
    icon: <Compass className="h-6 w-6" />,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Isabella AI",
    desc: "Tu asistente inteligente que conoce cada rincón de Real del Monte.",
    path: "/isabella-ai",
    icon: <Bot className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Gobernanza DAO",
    desc: "Participa en las decisiones que moldean el futuro del territorio.",
    path: "/gobernanza",
    icon: <Building2 className="h-6 w-6" />,
    color: "from-teal-500 to-emerald-600",
  },
  {
    title: "Mina Virtual",
    desc: "Explora la historia minera y gana Realitos.",
    path: "/mina",
    icon: <Sparkles className="h-6 w-6" />,
    color: "from-purple-500 to-violet-600",
  },
];

const MODULES = [
  { name: "Isabella Ω-Core", status: "active" as const },
  { name: "YUN Network", status: "active" as const },
  { name: "C.R.O.W.N", status: "active" as const },
  { name: "Gamificación", status: "active" as const },
  { name: "Territorio", status: "active" as const },
  { name: "Comunidad", status: "active" as const },
  { name: "Comercio B2B", status: "active" as const },
  { name: "Música RDM", status: "active" as const },
  { name: "Constelación", status: "active" as const },
  { name: "Nexo Estelar", status: "active" as const },
  { name: "Realito", status: "development" as const },
  { name: "Cultura Digital", status: "development" as const },
];

const RECENT_ACTIVITY = [
  { text: "Nueva reseña en Pastes El Portal", time: "hace 1h", icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> },
  { text: "Isabella actualizó su conocimiento", time: "hace 3h", icon: <Bot className="h-3.5 w-3.5 text-blue-400" /> },
  { text: "3 nuevos comercios registrados", time: "hace 5h", icon: <TrendingUp className="h-3.5 w-3.5 text-purple-400" /> },
  { text: "Festival del Paste — Evento activo", time: "hace 8h", icon: <Sparkles className="h-3.5 w-3.5 text-amber-400" /> },
  { text: "Comunidad: 12 nuevos miembros", time: "hace 1d", icon: <Users className="h-3.5 w-3.5 text-teal-400" /> },
];

const CATEGORIES = [
  { name: "Cultura", icon: <Palette className="h-5 w-5" />, count: 24, path: "/cultura" },
  { name: "Turismo", icon: <Compass className="h-5 w-5" />, count: 18, path: "/directorio" },
  { name: "Comercio", icon: <Building2 className="h-5 w-5" />, count: 42, path: "/b2b" },
  { name: "Tecnología", icon: <Zap className="h-5 w-5" />, count: 15, path: "/oraculo" },
  { name: "Comunidad", icon: <Users className="h-5 w-5" />, count: 31, path: "/comunidad" },
];

const MetaverseHome: React.FC = () => {
  const navigate = useNavigate();
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline" | "checking">("checking");
  const networkTimedOut = useLoadingTimeout(networkStatus === "checking", 5000);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/health`, {
          signal: AbortSignal.timeout(5000),
        });
        setNetworkStatus(res.ok ? "online" : "offline");
      } catch {
        setNetworkStatus("offline");
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <main className="relative z-10 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 sm:py-12"
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            <span
              style={{
                background: "linear-gradient(180deg, #fff 0%, #00f0ff 50%, #0066ff 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Metaverso RDM
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            Explora el ecosistema digital de Real del Monte. Navega entre módulos, conecta con la comunidad y descubre el territorio.
          </p>

          {/* Network Status */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              networkStatus === "online"
                ? "bg-emerald-500 animate-pulse"
                : networkStatus === "checking"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-red-500"
            }`} />
            <span className="text-[10px] font-mono text-muted-foreground">
              {networkStatus === "online"
                ? "RED ACTIVA"
                : networkStatus === "checking"
                  ? "VERIFICANDO..."
                  : "RED INACTIVA"}
            </span>
          </div>
        </motion.section>

        {/* Functional Toolbar */}
        <section>
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Navegación Rápida
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {TOOLBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        <section>
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Contenido Destacado
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_CONTENT.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                onClick={() => navigate(item.path)}
                className="cursor-pointer"
              >
                <Card className="p-5 h-full hover:shadow-lg transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-8">
            {/* Active Modules */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
                Módulos Activos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MODULES.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-2 p-3 rounded-lg border bg-card"
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      m.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                    }`} />
                    <span className="text-xs font-medium truncate">{m.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section>
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-4">
                Explorar por Categoría
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => navigate(cat.path)}
                    className="group text-left p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200"
                  >
                    <div className="text-primary mb-2 group-hover:scale-110 transition-transform inline-block">
                      {cat.icon}
                    </div>
                    <p className="text-sm font-semibold">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.count} items</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Recent Activity Feed */}
          <Card className="p-5 h-fit">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{a.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MetaverseHome;
