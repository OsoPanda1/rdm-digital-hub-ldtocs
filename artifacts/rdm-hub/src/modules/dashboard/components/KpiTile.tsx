/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiTileProps {
  label: string;
  value: string | number;
  delta?: number;
  icon?: string;
  accent?: "gold" | "teal" | "copper" | "electric";
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

const accentMap = {
  gold: "from-gold/20 to-gold/5 border-gold/30 text-gold",
  teal: "from-teal/20 to-teal/5 border-teal/30 text-teal",
  copper: "from-copper/20 to-copper/5 border-copper/30 text-copper",
  electric: "from-electric/20 to-electric/5 border-electric/30 text-electric",
} as const;

export function KpiTile({ label, value, delta, icon = "📊", accent = "gold", loading, error, onRetry }: KpiTileProps) {
  if (loading) {
    return (
      <div className="relative rounded-2xl border border-border/20 bg-secondary/10 p-5 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-2 w-20 rounded bg-secondary/40" />
            <div className="h-7 w-16 rounded bg-secondary/40 mt-2" />
          </div>
          <div className="h-7 w-7 rounded-lg bg-secondary/40" />
        </div>
        <div className="h-2 w-12 rounded bg-secondary/40 mt-3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-destructive/70">{label}</p>
        <p className="mt-2 text-sm font-mono text-destructive">Error</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-[10px] font-mono text-destructive underline hover:no-underline">
            Reintentar
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-gradient-to-br ${accentMap[accent]} p-5 backdrop-blur-sm overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-display font-bold tracking-tight">{value}</p>
        </div>
        <span className="text-2xl opacity-80">{icon}</span>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-mono">
          {delta > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : delta < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          <span>{delta >= 0 ? "+" : ""}{delta}% vs ayer</span>
        </div>
      )}
    </motion.div>
  );
}
