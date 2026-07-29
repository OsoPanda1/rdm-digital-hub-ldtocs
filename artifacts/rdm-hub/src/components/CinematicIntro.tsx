/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tumirada from "@/assets/musica/tumirada.mp3";

type CinematicIntroProps = {
  onEnter?: () => void;
  autoPlayAudio?: boolean;
};

// Territorial map nodes for Real del Monte
const MAP_NODES = [
  { x: 80,  y: 190, label: "Plaza Principal",  delay: 3.2 },
  { x: 195, y: 130, label: "Mina de Acosta",   delay: 3.8 },
  { x: 330, y: 165, label: "Panteón Inglés",   delay: 4.4 },
  { x: 460, y: 95,  label: "Ruta del Paste",   delay: 5.0 },
  { x: 590, y: 145, label: "Mirador La Peña",  delay: 5.6 },
  { x: 705, y: 115, label: "Mineral del Monte",delay: 6.2 },
];

// Background star field
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.5 + 0.4,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));

// Ambient particles
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 14 + 12,
  delay: Math.random() * 10,
}));

// Phase timing (seconds)
const PHASES = {
  stars:      0.4,   // Star field appears
  mapLine:    2.2,   // Map path starts drawing
  nodes:      3.0,   // Nodes start appearing
  tagline:    7.5,   // "PUEBLO MÃGICO · HIDALGO · MÃ‰XICO"
  title:      9.5,   // Main title
  subtitle:   12.5,  // Subtitle text
  ekg:        16.0,  // EKG heartbeat
  stats:      20.0,  // Altitude / year / temp stats
  cta:        26.0,  // Enter button
  autoSkip:   42.0,  // Auto-advance if user hasn't clicked
};

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onEnter,
  autoPlayAudio = true,
}) => {
  const [exiting, setExiting] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const exitingRef = useRef(false);
  const userInteractedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Elapsed timer for phase-gating
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Auto-advance after PHASES.autoSkip seconds
  useEffect(() => {
    if (elapsed >= PHASES.autoSkip && !exitingRef.current) {
      handleEnter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed]);

  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userInteractedRef.current) return;
    userInteractedRef.current = true;
    audio.volume = 0.01;
    audio.play()
      .then(() => {
        setAudioBlocked(false);
        const fadeIn = () => {
          const target = isAudioEnabled ? 0.7 : 0;
          if (audio.volume < target) {
            audio.volume = Math.min(audio.volume + 0.04, target);
            requestAnimationFrame(fadeIn);
          }
        };
        requestAnimationFrame(fadeIn);
      })
      .catch((err: DOMException) => {
        console.warn("[CinematicIntro] Autoplay bloqueado:", err.message);
        setAudioBlocked(true);
      });
  }, [isAudioEnabled]);

  useEffect(() => {
    const audio = new Audio(tumirada);
    audioRef.current = audio;
    audio.loop = false;
    audio.volume = 0.01;
    audio.preload = "auto";

    const onInteraction = () => { if (!userInteractedRef.current) startAudio(); };
    document.addEventListener("click", onInteraction, { once: true });
    document.addEventListener("touchstart", onInteraction, { once: true });
    document.addEventListener("keydown", onInteraction, { once: true });

    audio.addEventListener("canplaythrough", () => { if (autoPlayAudio) startAudio(); }, { once: true });
    if (audio.readyState >= 3 && autoPlayAudio) startAudio();

    return () => {
      audio.pause();
      audioRef.current = null;
      document.removeEventListener("click", onInteraction);
      document.removeEventListener("touchstart", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, [autoPlayAudio, startAudio]);

  const handleEnter = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);

    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOut = () => {
        if (audio.volume > 0.01) {
          audio.volume = Math.max(audio.volume - 0.04, 0);
          requestAnimationFrame(fadeOut);
        } else {
          audio.pause();
        }
      };
      requestAnimationFrame(fadeOut);
    }
    setTimeout(() => { if (onEnter) onEnter(); }, 900);
  }, [onEnter]);

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = !next;
        if (next && !userInteractedRef.current) startAudio();
      }
      return next;
    });
  };

  const show = (phase: keyof typeof PHASES) => elapsed >= PHASES[phase];

  return (
    <motion.div
      key="cinematic-intro"
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      style={{ background: "hsl(222 47% 3%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: exiting ? 0.9 : 1.1, ease: "easeInOut" }}
    >
      {/* â”€â”€ Deep space gradient layers â”€â”€ */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(220 60% 8% / 0.9) 0%, hsl(222 47% 3%) 100%)",
          }}
        />
        {/* Subtle cyan nebula glow â€” top-left */}
        <motion.div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(190 80% 40% / 0.06) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        {/* Rose/amber glow â€” bottom-right */}
        <motion.div
          className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(350 70% 40% / 0.05) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* â”€â”€ Star field â”€â”€ */}
      <AnimatePresence>
        {show("stars") && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
          >
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              {STARS.map((s) => (
                <motion.circle
                  key={s.id}
                  cx={`${s.x}%`}
                  cy={`${s.y}%`}
                  r={s.r}
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7, 0.3, 0.8, 0.2] }}
                  transition={{
                    duration: s.duration,
                    repeat: Infinity,
                    delay: s.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€ Ambient gold particles â”€â”€ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: "hsl(43 80% 60%)",
              boxShadow: "0 0 6px hsl(43 80% 60% / 0.8)",
            }}
            animate={{ y: [0, -180], opacity: [0, 0.5, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* â”€â”€ Territorial map â€” top section â”€â”€ */}
      <AnimatePresence>
        {show("mapLine") && (
          <motion.div
            className="absolute inset-x-0 top-12 flex justify-center"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <div className="relative h-60 w-[52rem] max-w-full px-4">
              {/* Subtle grid lines */}
              <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 800 240">
                {[60, 120, 180].map((y) => (
                  <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="hsl(200 60% 70%)" strokeWidth="0.5" strokeDasharray="4 8" />
                ))}
                {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                  <line key={x} x1={x} y1="0" x2={x} y2="240" stroke="hsl(200 60% 70%)" strokeWidth="0.5" strokeDasharray="4 8" />
                ))}
              </svg>

              <svg viewBox="0 0 800 240" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                {/* Glow filter */}
                <defs>
                  <filter id="glow-cyan">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="glow-node">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* Secondary trace â€” slightly offset, dimmer */}
                <motion.polyline
                  points="80,190 195,130 330,165 460,95 590,145 705,115"
                  fill="none"
                  stroke="hsl(190 80% 60% / 0.2)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />

                {/* Main route line */}
                <motion.polyline
                  points="80,190 195,130 330,165 460,95 590,145 705,115"
                  fill="none"
                  stroke="hsl(190 80% 70%)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  filter="url(#glow-cyan)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />

                {/* Animated leading dot */}
                <motion.circle
                  cx="80" cy="190" r="4"
                  fill="hsl(190 90% 80%)"
                  filter="url(#glow-node)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />
              </svg>

              {/* Node markers */}
              {MAP_NODES.map((node, idx) => (
                <AnimatePresence key={node.label}>
                  {elapsed >= node.delay && (
                    <motion.div
                      className="absolute"
                      style={{
                        left: `calc(${(node.x / 800) * 100}% - 5px)`,
                        top: `calc(${(node.y / 240) * 100}% - 5px)`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Outer pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-cyan-400/60"
                        style={{ margin: -6, width: 22, height: 22 }}
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2, delay: idx * 0.3 }}
                      />
                      <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_4px_rgba(34,211,238,0.7)]" />
                      <div
                        className="absolute top-4 whitespace-nowrap text-[10px] font-medium tracking-wide text-slate-300"
                        style={{ left: idx < 3 ? -4 : "auto", right: idx >= 3 ? -4 : "auto" }}
                      >
                        {node.label}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€ Center content â”€â”€ */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 mt-16">

        {/* Micro-label: PUEBLO MÃGICO */}
        <AnimatePresence>
          {show("tagline") && (
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, letterSpacing: "0.5em" }}
              transition={{ duration: 2.0, ease: "easeOut" }}
              className="mb-5 text-[10px] md:text-xs font-semibold uppercase text-cyan-400/80"
              style={{ fontFamily: "var(--font-body, monospace)" }}
            >
              Pueblo Mágico · Hidalgo · México
            </motion.p>
          )}
        </AnimatePresence>

        {/* Main title */}
        <AnimatePresence>
          {show("title") && (
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display, serif)", lineHeight: 1.1 }}
            >
              Real del Monte
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1.4 }}
                className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.18em] text-[hsl(43,75%,62%)]"
              >
                Digital Hub
              </motion.span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence>
          {show("subtitle") && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="mt-5 max-w-lg text-sm md:text-base text-slate-300/80 leading-relaxed"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              El pulso vivo de un pueblo mágico en tiempo real.
              Historias, personas, comercios y datos latiendo
              en un mismo territorio soberano.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Stats row */}
        <AnimatePresence>
          {show("stats") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="mt-7 flex gap-8 md:gap-12"
            >
              {[
                { value: "2,700m", label: "Altitud" },
                { value: "500+", label: "Años" },
                { value: "14Â°C", label: "Clima" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span
                    className="text-xl md:text-2xl font-bold text-[hsl(43,75%,62%)]"
                    style={{ fontFamily: "var(--font-display, serif)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {show("cta") && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <motion.button
                type="button"
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full border border-rose-400/60 bg-slate-900/50 px-9 py-3 text-sm md:text-base font-semibold tracking-wide text-white shadow-[0_0_40px_-4px_hsl(350_80%_60%/0.4)] backdrop-blur-lg transition-colors hover:bg-slate-900/80"
                whileHover={{ scale: 1.05, boxShadow: "0 0 55px -4px hsl(350 80% 60% / 0.55)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
              >
                {/* Shimmer sweep */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.08) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "linear", repeatDelay: 1.2 }}
                />
                Entrar al territorio
              </motion.button>

              {/* Audio toggle */}
              <button
                type="button"
                className="flex items-center gap-2 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                onClick={toggleAudio}
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-600">
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      audioBlocked
                        ? "animate-pulse bg-amber-400"
                        : isAudioEnabled
                        ? "bg-emerald-400"
                        : "bg-slate-600"
                    }`}
                  />
                </span>
                {audioBlocked
                  ? "Toca para activar sonido"
                  : isAudioEnabled
                  ? "Sonido activado"
                  : "Sonido desactivado"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* â”€â”€ EKG heartbeat â€” bottom â”€â”€ */}
      <AnimatePresence>
        {show("ekg") && (
          <motion.div
            className="absolute inset-x-0 bottom-8 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <svg
              viewBox="0 0 900 100"
              className="h-14 w-[56rem] max-w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow-rose">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* Dim baseline */}
              <motion.path
                d="M0 50 L70 50 L90 32 L110 68 L130 50 L170 50 L200 18 L230 82 L260 50 L300 50 L330 30 L360 70 L390 50 L430 50 L455 22 L480 78 L505 50 L540 50 L565 34 L590 66 L615 50 L655 50 L680 18 L705 82 L730 50 L770 50 L800 34 L830 66 L860 50 L900 50"
                fill="none"
                stroke="hsl(350 70% 50% / 0.18)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Animated main trace */}
              <motion.path
                d="M0 50 L70 50 L90 32 L110 68 L130 50 L170 50 L200 18 L230 82 L260 50 L300 50 L330 30 L360 70 L390 50 L430 50 L455 22 L480 78 L505 50 L540 50 L565 34 L590 66 L615 50 L655 50 L680 18 L705 82 L730 50 L770 50 L800 34 L830 66 L860 50 L900 50"
                fill="none"
                stroke="hsl(350 80% 60%)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow-rose)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 5.0, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€ Skip hint (appears after 15s, before CTA) â”€â”€ */}
      <AnimatePresence>
        {show("subtitle") && !show("cta") && (
          <motion.button
            type="button"
            className="absolute top-6 right-6 text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleEnter}
          >
            Omitir
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
