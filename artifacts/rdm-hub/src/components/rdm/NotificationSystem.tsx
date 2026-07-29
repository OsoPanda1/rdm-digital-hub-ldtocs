/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * RDM Notification System
 * Visual toast notifications + optional Web Audio API sound effects.
 * Usage: import { useRDMNotify } from "@/components/rdm/NotificationSystem"
 *        const notify = useRDMNotify();
 *        notify.success("¡XP ganada!", "+50 puntos de exploración");
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info, Zap, Trophy } from "lucide-react";

export type NotifKind = "success" | "error" | "info" | "xp" | "achievement";

export interface RDMNotif {
  id: string;
  kind: NotifKind;
  title: string;
  body?: string;
  duration?: number; // ms, default 4500
}

interface RDMNotifyAPI {
  success:     (title: string, body?: string) => void;
  error:       (title: string, body?: string) => void;
  info:        (title: string, body?: string) => void;
  xp:          (points: number, reason?: string) => void;
  achievement: (name: string, desc?: string) => void;
}

const CTX = createContext<RDMNotifyAPI | null>(null);

export function useRDMNotify(): RDMNotifyAPI {
  const ctx = useContext(CTX);
  if (!ctx) throw new Error("useRDMNotify must be used inside <RDMNotificationProvider>");
  return ctx;
}

// â”€â”€ Web Audio API sound synthesiser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useAudioSynth() {
  const acRef = useRef<AudioContext | null>(null);

  const getAC = () => {
    if (!acRef.current) {
      acRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (acRef.current.state === "suspended") acRef.current.resume();
    return acRef.current;
  };

  const playTone = useCallback((freq: number, type: OscillatorType, duration: number, gain: number) => {
    try {
      const ac  = getAC();
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.connect(g); g.connect(ac.destination);
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(gain, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
      osc.start(); osc.stop(ac.currentTime + duration);
    } catch { /* silently ignore if no audio context */ }
  }, []);

  return {
    success:     () => { playTone(523, "sine", 0.18, 0.3); setTimeout(() => playTone(659, "sine", 0.22, 0.25), 120); },
    error:       () => { playTone(330, "sawtooth", 0.25, 0.2); setTimeout(() => playTone(220, "sawtooth", 0.28, 0.18), 150); },
    info:        () => playTone(440, "sine", 0.18, 0.2),
    xp:          () => { [0, 80, 160].forEach((d, i) => setTimeout(() => playTone(523 + i * 130, "triangle", 0.15, 0.25), d)); },
    achievement: () => { [0, 100, 200, 350].forEach((d, i) => setTimeout(() => playTone([523, 659, 784, 1047][i], "sine", 0.3, 0.3), d)); },
  };
}

// â”€â”€ Config per kind â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const KIND_CFG: Record<NotifKind, {
  icon: typeof CheckCircle2;
  bg: string;
  border: string;
  accent: string;
  defaultDuration: number;
}> = {
  success:     { icon: CheckCircle2,   bg: "hsl(152 40% 8%)",  border: "hsl(152 60% 30% / 0.5)", accent: "hsl(152 60% 50%)", defaultDuration: 4000 },
  error:       { icon: AlertTriangle,  bg: "hsl(350 40% 8%)",  border: "hsl(350 60% 30% / 0.5)", accent: "hsl(350 70% 55%)", defaultDuration: 6000 },
  info:        { icon: Info,           bg: "hsl(210 40% 8%)",  border: "hsl(210 60% 30% / 0.5)", accent: "hsl(210 80% 60%)", defaultDuration: 4500 },
  xp:          { icon: Zap,           bg: "hsl(43  40% 7%)",  border: "hsl(43  70% 40% / 0.5)", accent: "hsl(43  80% 58%)", defaultDuration: 3500 },
  achievement: { icon: Trophy,         bg: "hsl(280 40% 8%)",  border: "hsl(280 60% 40% / 0.5)", accent: "hsl(280 70% 65%)", defaultDuration: 6000 },
};

// â”€â”€ Provider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function RDMNotificationProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<RDMNotif[]>([]);
  const synth = useAudioSynth();

  const push = useCallback((notif: Omit<RDMNotif, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setQueue((q) => [...q.slice(-4), { ...notif, id }]); // max 5 at once
    try { synth[notif.kind]?.(); } catch { /* ignore */ }
    return id;
  }, [synth]);

  const dismiss = useCallback((id: string) => {
    setQueue((q) => q.filter((n) => n.id !== id));
  }, []);

  const api: RDMNotifyAPI = {
    success:     (title, body) => push({ kind: "success", title, body }),
    error:       (title, body) => push({ kind: "error",   title, body }),
    info:        (title, body) => push({ kind: "info",    title, body }),
    xp:          (pts, reason) => push({ kind: "xp",     title: `+${pts} XP`, body: reason }),
    achievement: (name, desc)  => push({ kind: "achievement", title: `ðŸ† ${name}`, body: desc }),
  };

  return (
    <CTX.Provider value={api}>
      {children}
      {/* â”€â”€ Notification stack â”€â”€ */}
      <div className="fixed bottom-24 right-4 z-[9999] flex flex-col-reverse gap-2 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
        <AnimatePresence mode="popLayout">
          {queue.map((notif) => (
            <NotifCard key={notif.id} notif={notif} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </CTX.Provider>
  );
}

// â”€â”€ Individual notification card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function NotifCard({ notif, onDismiss }: { notif: RDMNotif; onDismiss: (id: string) => void }) {
  const cfg      = KIND_CFG[notif.kind];
  const Icon     = cfg.icon;
  const duration = notif.duration ?? cfg.defaultDuration;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(notif.id), duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, notif.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="pointer-events-auto relative rounded-xl overflow-hidden border shadow-[0_8px_32px_hsl(0_0%_0%/0.5)]"
      style={{ background: cfg.bg, borderColor: cfg.border }}
      role="alert"
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => { timerRef.current = setTimeout(() => onDismiss(notif.id), 2000); }}
    >
      {/* Progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] rounded-full"
        style={{ background: cfg.accent }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />

      <div className="flex items-start gap-3 px-4 py-3">
        <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: cfg.accent }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-white leading-snug" style={{ fontFamily: "var(--font-body)" }}>
            {notif.title}
          </p>
          {notif.body && (
            <p className="text-[11px] text-white/55 mt-0.5 leading-snug" style={{ fontFamily: "var(--font-body)" }}>
              {notif.body}
            </p>
          )}
        </div>
        <button
          onClick={() => onDismiss(notif.id)}
          className="shrink-0 p-0.5 rounded-md text-white/30 hover:text-white/70 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
