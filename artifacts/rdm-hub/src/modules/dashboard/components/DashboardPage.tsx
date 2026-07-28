/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  RefreshCw,
  Users,
  Store,
  Gamepad2,
  Map,
  Bot,
  Settings,
  Shield,
  Clock,
  Zap,
  ChevronRight,
  Circle,
} from "lucide-react";
import { DashboardKpis } from "./DashboardKpis";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ActivityEntry {
  id: string;
  text: string;
  time: string;
  icon: string;
}

const ACTIVITY_FEED: ActivityEntry[] = [
  { id: "a1", text: "Nuevo registro: María García se unió a la comunidad", time: "Hace 12 min", icon: "👤" },
  { id: "a2", text: "Reseña en Pastes El Portal: ★★★★★", time: "Hace 28 min", icon: "⭐" },
  { id: "a3", text: "Isabella procesó 1,247 consultas hoy", time: "Hace 1 hora", icon: "🤖" },
  { id: "a4", text: "Comercio actualizado: Café El Estación", time: "Hace 2 horas", icon: "🏪" },
  { id: "a5", text: "Nuevo logro: Carlos alcanzó rango Guardian", time: "Hace 3 horas", icon: "🏆" },
  { id: "a6", text: "Evento del día: Recorrido por las Minas", time: "Hace 4 horas", icon: "⛏️" },
];

interface SystemModule {
  name: string;
  status: "green" | "yellow" | "red";
  detail: string;
}

const SYSTEM_MODULES: SystemModule[] = [
  { name: "Isabella AI", status: "green", detail: "Operational" },
  { name: "Gamificación", status: "green", detail: "Active" },
  { name: "Territorio", status: "green", detail: "Synced" },
  { name: "Economía", status: "yellow", detail: "Degraded" },
  { name: "Tracking", status: "green", detail: "Active" },
  { name: "Red/Federación", status: "green", detail: "8 nodes" },
  { name: "BookPI", status: "green", detail: "IPFS" },
  { name: "MSR Bridge", status: "green", detail: "Connected" },
];

interface QuickLink {
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  { label: "Admin Dashboard", icon: <Settings className="h-4 w-4" />, href: "/admin", color: "text-gold" },
  { label: "Gamificación", icon: <Gamepad2 className="h-4 w-4" />, href: "/gamification", color: "text-copper" },
  { label: "Territorio", icon: <Map className="h-4 w-4" />, href: "/territory", color: "text-teal" },
  { label: "Isabella AI", icon: <Bot className="h-4 w-4" />, href: "/isabella", color: "text-electric" },
];

// Simple CSS bar chart
function MiniBarChart({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="flex items-end gap-1 h-16">
        {values.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-gold/40 to-gold/10 rounded-t"
              style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? "4px" : "1px" }}
            />
            <span className="text-[8px] font-mono text-muted-foreground">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  green: "bg-emerald-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};

export function DashboardPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setLastRefresh(new Date());
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Panel de Control RDM</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            Última actualización: {lastRefresh.toLocaleTimeString("es-MX")}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-secondary/20 border border-border/20 px-4 py-2.5 text-sm font-mono text-muted-foreground hover:text-gold hover:border-gold/30 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Section */}
      <section>
        <DashboardKpis />
      </section>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-border/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-display font-bold">Actividad Reciente</h2>
            </div>
            <div className="space-y-3">
              {ACTIVITY_FEED.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition">
                  <span className="text-lg mt-0.5">{entry.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body">{entry.text}</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Modules */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl border border-border/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-display font-bold">Módulos del Sistema</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SYSTEM_MODULES.map((mod) => (
                <div key={mod.name} className="rounded-xl bg-secondary/5 border border-border/10 p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Circle className={`h-2 w-2 fill-current ${STATUS_COLORS[mod.status]}`} />
                    <span className="text-xs font-display font-bold truncate">{mod.name}</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">{mod.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* System Health */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-2xl border border-border/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-display font-bold">Salud del Sistema</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">API Status</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Circle className="h-2 w-2 fill-current" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Base de datos</span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Circle className="h-2 w-2 fill-current" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Uptime</span>
                <span className="text-xs font-mono text-gold">99.97%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Latencia promedio</span>
                <span className="text-xs font-mono text-gold">12ms</span>
              </div>
            </div>
          </motion.div>

          {/* Metrics Charts */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl border border-border/20 p-5 space-y-6">
            <MiniBarChart values={[120, 340, 280, 420, 310, 190]} label="Requests / hora (últimas 6h)" />
            <MiniBarChart values={[45, 62, 38, 71, 55, 48, 67]} label="Usuarios activos (últimos 7 días)" />
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl border border-border/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-gold" />
              <h2 className="text-sm font-display font-bold">Accesos Rápidos</h2>
            </div>
            <div className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className={link.color}>{link.icon}</span>
                    <span className="text-sm font-body">{link.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
