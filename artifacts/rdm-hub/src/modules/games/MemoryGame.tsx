/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy, Timer, Sparkles } from "lucide-react";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const BEST_SCORE_KEY = "rdm-memory-best";

const SYMBOLS = ["⛏️", "🔨", "🥾", "☕", "🔭", "✂️", "🌫️", "🪙"];

type Difficulty = "easy" | "normal" | "hard";
const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; pairs: number; xpMultiplier: number }> = {
  easy: { label: "Fácil", pairs: 3, xpMultiplier: 1 },
  normal: { label: "Normal", pairs: 4, xpMultiplier: 1.5 },
  hard: { label: "Difícil", pairs: 6, xpMultiplier: 2 },
};

type Card = { sym: string; flipped: boolean; matched: boolean };

function buildDeck(pairs: number): Card[] {
  const symbols = SYMBOLS.slice(0, pairs);
  const deck = [...symbols, ...symbols].map((sym) => ({ sym, flipped: false, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function loadBestScore(): number {
  try {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(DIFFICULTY_CONFIG.normal.pairs));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [bestScore, setBestScore] = useState(loadBestScore);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (done || !gameStarted) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [done, gameStarted]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [a, b] = flipped;
    setMoves((m) => m + 1);
    if (deck[a].sym === deck[b].sym) {
      setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
      setFlipped([]);
    } else {
      setTimeout(() => {
        setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
        setFlipped([]);
      }, 800);
    }
  }, [flipped, deck]);

  const awardXp = useCallback(async (finalScore: number, finalMoves: number, finalSeconds: number) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    let xp = 10;
    let message = "Sigue intentando";
    if (finalScore >= 80) {
      xp = 50;
      message = "¡Excelente!";
    } else if (finalScore >= 50) {
      xp = 25;
      message = "¡Bien hecho!";
    }
    xp = Math.round(xp * config.xpMultiplier);
    setXpEarned(xp);
    setXpAwarded(true);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem(BEST_SCORE_KEY, String(finalScore));
    }

    try {
      await fetch(`${API_BASE}/v1/gamification/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "quest_complete",
          payload: { game: "memory", score: finalScore, moves: finalMoves, time: finalSeconds, difficulty, xp },
        }),
        keepalive: true,
      });
    } catch {
      // non-critical
    }

    toast.success(`${message} +${xp} XP`);
  }, [difficulty, bestScore]);

  useEffect(() => {
    if (!deck.every((c) => c.matched) || xpAwarded) return;
    setDone(true);
    const config = DIFFICULTY_CONFIG[difficulty];
    const score = Math.max(0, Math.round((config.pairs * 2 / Math.max(moves, 1)) * 100));
    awardXp(score, moves, seconds);
  }, [deck, xpAwarded, difficulty, moves, seconds, awardXp]);

  const click = (i: number) => {
    if (flipped.length >= 2 || deck[i].flipped || deck[i].matched) return;
    if (!gameStarted) setGameStarted(true);
    setDeck((d) => d.map((c, idx) => (idx === i ? { ...c, flipped: true } : c)));
    setFlipped((f) => [...f, i]);
  };

  const reset = () => {
    const config = DIFFICULTY_CONFIG[difficulty];
    setDeck(buildDeck(config.pairs));
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setDone(false);
    setXpEarned(0);
    setXpAwarded(false);
    setGameStarted(false);
  };

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    const config = DIFFICULTY_CONFIG[d];
    setDeck(buildDeck(config.pairs));
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setDone(false);
    setXpEarned(0);
    setXpAwarded(false);
    setGameStarted(false);
  };

  const config = DIFFICULTY_CONFIG[difficulty];
  const score = useMemo(() => {
    if (moves === 0) return 0;
    return Math.max(0, Math.round((config.pairs * 2 / Math.max(moves, 1)) * 100));
  }, [moves, config.pairs]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/20">
      {/* Header: Stats + Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-wider">
          <span className="flex items-center gap-1 text-electric">
            <Timer className="h-3 w-3" />{formatTime(seconds)}
          </span>
          <span className="text-muted-foreground">Movs: {moves}</span>
          {done && (
            <span className="flex items-center gap-2 text-gold">
              <Trophy className="h-3 w-3" />Score {score}%
              {xpAwarded && <Sparkles className="h-3 w-3 text-emerald" />}
            </span>
          )}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-body glass hover:text-gold transition">
          <RotateCcw className="h-3 w-3" /> Reiniciar
        </button>
      </div>

      {/* Difficulty Selector */}
      <div className="flex items-center gap-2 mb-4">
        {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => changeDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition ${
              difficulty === d
                ? "bg-gold/20 border border-gold/40 text-gold"
                : "bg-secondary/20 border border-border/20 text-muted-foreground hover:border-gold/20"
            }`}
          >
            {DIFFICULTY_CONFIG[d].label} ({DIFFICULTY_CONFIG[d].pairs * 2})
          </button>
        ))}
        {bestScore > 0 && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">
            Mejor: {bestScore}%
          </span>
        )}
      </div>

      {/* XP Earned Animation */}
      {done && xpAwarded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-center"
        >
          <motion.p
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="text-2xl font-display font-bold text-emerald-400"
          >
            +{xpEarned} XP
          </motion.p>
          <p className="text-xs text-muted-foreground mt-1">
            {score >= 80 ? "¡Excelente!" : score >= 50 ? "¡Bien hecho!" : "Sigue intentando"}
          </p>
        </motion.div>
      )}

      {/* Card Grid */}
      <div className={`grid gap-2 ${difficulty === "easy" ? "grid-cols-4" : difficulty === "normal" ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-6"}`}>
        {deck.map((c, i) => (
          <motion.button
            key={i}
            onClick={() => click(i)}
            whileHover={{ scale: c.matched ? 1 : 1.04 }}
            className={`aspect-square rounded-xl flex items-center justify-center text-2xl font-display transition ${
              c.matched ? "bg-emerald-500/20 border border-emerald-500/40" :
              c.flipped ? "bg-gold/20 border border-gold/40" :
              "bg-secondary/30 border border-border/20 hover:border-gold/30"
            }`}
          >
            {(c.flipped || c.matched) ? c.sym : ""}
          </motion.button>
        ))}
      </div>

      {/* Play Again Button */}
      {done && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={reset}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gold/20 border border-gold/40 px-4 py-3 text-sm font-display font-bold text-gold hover:bg-gold/30 transition"
        >
          <RotateCcw className="h-4 w-4" />
          Jugar de nuevo
        </motion.button>
      )}
    </div>
  );
}
