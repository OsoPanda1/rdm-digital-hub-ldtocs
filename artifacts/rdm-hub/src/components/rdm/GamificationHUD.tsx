/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * GamificationHUD — Compact player progress widget
 * Shows in the navbar/layout for logged-in users.
 * Falls back to "Únete" CTA when not authenticated.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Zap, Star, Shield, Flame, ChevronRight, Crown } from "lucide-react";
import { useGamification } from "@/hooks/use-gamification";
import { calculateLevel, levelProgress, getRankConfig } from "@/features/gamification/engine";

const RANK_CONFIG: Record<string, { label: string; color: string; icon: typeof Trophy }> = {
  visitante:    { label: "Visitante",     color: "hsl(0 0% 60%)",   icon: Star },
  explorador:   { label: "Explorador",    color: "hsl(152 60% 45%)", icon: Star },
  minero:       { label: "Minero",        color: "hsl(43 80% 55%)",  icon: Shield },
  cronista:     { label: "Cronista",      color: "hsl(210 80% 55%)", icon: Shield },
  guardian:     { label: "Guardian",      color: "hsl(270 60% 60%)", icon: Crown },
  leyenda_rdm:  { label: "Leyenda RDM",   color: "hsl(43 90% 50%)",  icon: Flame },
};

interface GamificationHUDProps {
  compact?: boolean;
}

export function GamificationHUD({ compact = false }: GamificationHUDProps) {
  const { profile, isLoading } = useGamification();
  const [open, setOpen] = useState(false);

  if (isLoading || !profile) {
    return (
      <Link
        to="/perfil"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[hsl(var(--rdm-amber)/0.4)] text-[hsl(var(--rdm-amber))] text-xs font-medium hover:bg-[hsl(var(--rdm-amber)/0.1)] transition-all"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Trophy className="w-3.5 h-3.5" />
        Mis logros
      </Link>
    );
  }

  const rank = getRankConfig(profile.total_xp);
  const rankStyle = RANK_CONFIG[rank.rank] ?? RANK_CONFIG.visitante;
  const level = calculateLevel(profile.total_xp);
  const progress = levelProgress(profile.total_xp);

  if (compact) {
    return (
      <Link
        to="/leaderboard"
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
      >
        <rankStyle.icon className="w-4 h-4" style={{ color: rankStyle.color }} />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold" style={{ color: rankStyle.color, fontFamily: "var(--font-display)" }}>
            Nv. {level}
          </span>
          <div className="w-16 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, backgroundColor: rankStyle.color }}
            />
          </div>
        </div>
        <span className="text-[10px] text-white/50" style={{ fontFamily: "var(--font-body)" }}>
          {profile.total_xp.toLocaleString()} XP
        </span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
      >
        <rankStyle.icon className="w-4 h-4" style={{ color: rankStyle.color }} />
        <div className="flex flex-col items-start">
          <span className="text-[11px] font-semibold leading-none" style={{ color: rankStyle.color, fontFamily: "var(--font-display)" }}>
            {rankStyle.label}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: rankStyle.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-[9px] text-white/50" style={{ fontFamily: "var(--font-body)" }}>
              Nv.{level}
            </span>
          </div>
        </div>
        <ChevronRight
          className="w-3 h-3 text-white/30 transition-transform"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[hsl(220_25%_10%/0.95)] backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-body)" }}>
                XP por categoría
              </p>
              {[
                { label: "Cultura", xp: profile.xp_cultura, icon: Star, color: "hsl(43 80% 55%)" },
                { label: "Comunidad", xp: profile.xp_comunidad, icon: Shield, color: "hsl(152 60% 45%)" },
                { label: "Juego", xp: profile.xp_juego, icon: Zap, color: "hsl(210 80% 55%)" },
              ].map((track) => (
                <div key={track.label} className="flex items-center gap-2 mb-2">
                  <track.icon className="w-3.5 h-3.5 shrink-0" style={{ color: track.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-white/60" style={{ fontFamily: "var(--font-body)" }}>{track.label}</span>
                      <span style={{ color: track.color, fontFamily: "var(--font-mono)" }}>{track.xp.toLocaleString()}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min((track.xp / profile.total_xp) * 100, 100)}%`, backgroundColor: track.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 flex justify-between">
              {[
                { label: "Misiones", value: profile.quests_completed, icon: Trophy },
                { label: "Rachas", value: profile.streak_days, icon: Flame },
                { label: "Combos", value: profile.combos_total, icon: Zap },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <stat.icon className="w-4 h-4 text-[hsl(var(--rdm-amber))]" />
                  <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/leaderboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center text-xs font-semibold border-t border-white/5 text-[hsl(var(--rdm-amber))] hover:bg-white/5 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ver leaderboard completo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
