/**
 * GamificationHUD — Compact player progress widget
 * Shows in the navbar/layout for logged-in users.
 * Falls back to "Únete" CTA when not authenticated.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trophy, Zap, Star, Shield, Flame, ChevronRight, Crown } from "lucide-react";
import { getPlayerProfile } from "@/features/gamification/api";
import { calculateLevel, levelProgress } from "@/features/gamification/engine";
import type { GamificationPlayer } from "@/features/gamification/types";

const RANK_CONFIG: Record<string, { label: string; color: string; icon: typeof Trophy }> = {
  explorer:          { label: "Explorador",       color: "hsl(152 60% 45%)", icon: Star },
  chronicler:        { label: "Cronista",          color: "hsl(210 80% 55%)", icon: Shield },
  legendary_miner:   { label: "Minero Legendario", color: "hsl(43 80% 55%)",  icon: Flame },
  guardian_of_the_town: { label: "Guardián",       color: "hsl(270 60% 60%)", icon: Crown },
};

function getRank(player: GamificationPlayer): keyof typeof RANK_CONFIG {
  const xp = player.total_xp;
  if (xp >= 10000) return "guardian_of_the_town";
  if (xp >= 3000)  return "legendary_miner";
  if (xp >= 1000)  return "chronicler";
  return "explorer";
}

interface GamificationHUDProps {
  compact?: boolean;
}

export function GamificationHUD({ compact = false }: GamificationHUDProps) {
  const [player, setPlayer] = useState<GamificationPlayer | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPlayerProfile()
      .then((p) => setPlayer(p.player))
      .catch(() => setPlayer(null));
  }, []);

  if (!player) {
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

  const rank = getRank(player);
  const { label, color, icon: RankIcon } = RANK_CONFIG[rank] ?? RANK_CONFIG.explorer;
  const level = calculateLevel(player.total_xp);
  const progress = levelProgress(player.total_xp);

  if (compact) {
    return (
      <Link
        to="/leaderboard"
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
      >
        <RankIcon className="w-4 h-4" style={{ color }} />
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold" style={{ color, fontFamily: "var(--font-display)" }}>
            Nv. {level}
          </span>
          <div className="w-16 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
        <span className="text-[10px] text-white/50" style={{ fontFamily: "var(--font-body)" }}>
          {player.total_xp.toLocaleString()} XP
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
        <RankIcon className="w-4 h-4" style={{ color }} />
        <div className="flex flex-col items-start">
          <span className="text-[11px] font-semibold leading-none" style={{ color, fontFamily: "var(--font-display)" }}>
            {label}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
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
            {/* XP tracks */}
            <div className="p-4 border-b border-white/5">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-body)" }}>
                XP por categoría
              </p>
              {[
                { label: "Cultura", xp: player.xp_cultura, icon: Star, color: "hsl(43 80% 55%)" },
                { label: "Comunidad", xp: player.xp_comunidad, icon: Shield, color: "hsl(152 60% 45%)" },
                { label: "Juego", xp: player.xp_juego, icon: Zap, color: "hsl(210 80% 55%)" },
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
                        style={{ width: `${Math.min((track.xp / player.total_xp) * 100, 100)}%`, backgroundColor: track.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats */}
            <div className="p-3 flex justify-between">
              {[
                { label: "Misiones", value: player.quests_completed, icon: Trophy },
                { label: "Rachas", value: player.streak_days, icon: Flame },
                { label: "Combos", value: player.combos_total, icon: Zap },
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
