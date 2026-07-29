/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, MapPin, Sparkles, Radio, Mountain, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

import rdmLogo from "@assets/ChatGPT_Image_18_jul_2026,_09_28_51_p.m._1784832222163.png";
import tamvBanner from "@assets/Gemini_Generated_Image_a3vb18a3vb18a3vb_1784832222162.png";

const HERO_IMAGES = [
  "/images/hero-realdelmonte.jpg",
  "/images/rdm-aerial-pueblo.jpg",
  "/images/rdm-bosque-niebla.jpg",
  "/images/rdm-calles-coloridas.jpg",
  "/images/rdm-mirador-sunset.jpg",
];

const STATS = [
  { value: "500+", label: "Años de historia", icon: Calendar },
  { value: "2,700m", label: "Altitud", icon: Mountain },
  { value: "14Â°C", label: "Temperatura", icon: null },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: 30 + Math.random() * 60,
  size: Math.random() * 2.5 + 1,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 8,
}));

export function RDMHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y       = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImg((p) => (p + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[100vh] w-full overflow-hidden"
      style={{ background: "hsl(222 47% 4%)" }}
    >
      {/* â”€â”€ Background image stack with Ken Burns â”€â”€ */}
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms]"
            style={{ backgroundImage: `url(${img})`, opacity: i === currentImg ? 0.38 : 0 }}
          />
        ))}

        {/* Layered overlays for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(222 47% 5% / 0.65) 0%, hsl(222 47% 3% / 0.88) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, hsl(222 47% 3% / 0.7) 100%)",
          }}
        />
      </motion.div>

      {/* â”€â”€ Aurora / atmosphere glow â”€â”€ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[460px] w-[900px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse, hsl(200 70% 40% / 0.35) 0%, hsl(220 60% 30% / 0.1) 50%, transparent 75%)",
            filter: "blur(60px)",
          }}
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-[320px] w-[500px]"
          style={{
            background:
              "radial-gradient(ellipse at 0% 100%, hsl(43 70% 40% / 0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* â”€â”€ Ambient particles â”€â”€ */}
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
              background: "hsl(43 80% 65%)",
              boxShadow: "0 0 8px hsl(43 80% 60% / 0.6)",
            }}
            animate={{ y: [0, -160], opacity: [0, 0.55, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
          />
        ))}
      </div>

      {/* â”€â”€ Thin top border accent â”€â”€ */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* â”€â”€ Content â”€â”€ */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-16"
      >
        {/* Live radio badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-6"
        >
          <Link
            to="/musica"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-sm transition-colors hover:bg-white/10 group"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span
              className="text-[11px] font-semibold uppercase tracking-widest text-white/75 group-hover:text-white/95 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              TAMV 92.5 · En vivo
            </span>
            <Radio className="w-3 h-3 text-white/40" />
          </Link>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1.0 }}
          className="text-center mb-5"
        >
          {/* Eye-brow */}
          <p
            className="mb-3 text-[10px] md:text-xs uppercase tracking-[0.45em] text-cyan-400/70 font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Pueblo Mágico · Hidalgo · México
          </p>

          <h1
            className="text-5xl md:text-7xl lg:text-[88px] font-bold leading-[1.05] text-white drop-shadow-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real del Monte
          </h1>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[hsl(43,70%,55%)]" />
            <span
              className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.22em] text-[hsl(43,70%,62%)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Digital Hub
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[hsl(43,70%,55%)]" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="mb-9 max-w-lg text-center text-base md:text-lg text-white/55 leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          El portal soberano del Pueblo Mágico â€” donde la niebla abraza
          la historia minera y la cultura cobra vida digital.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4"
        >
          <Link
            to="/mapa"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[hsl(43,72%,52%)] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_0_35px_-6px_hsl(43,80%,55%/0.55)] transition-all hover:scale-[1.04] hover:shadow-[0_0_50px_-4px_hsl(43,80%,55%/0.65)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
            Explorar Territorio
          </Link>
          <Link
            to="/historia"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-medium tracking-wide text-white/85 backdrop-blur-sm transition-all hover:bg-white/14 hover:text-white hover:border-white/25"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <MapPin className="w-4 h-4" />
            Descubrir Legado
          </Link>
        </motion.div>

        {/* Logo â€” small, beneath buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 relative"
        >
          <div className="absolute inset-0 rounded-full bg-[hsl(43,70%,55%)] blur-[28px] opacity-15 animate-pulse" />
          <img
            src={rdmLogo}
            alt="RDM Digital Hub"
            className="relative z-10 h-14 w-14 md:h-16 md:w-16 rounded-full border border-[hsl(43,60%,55%/0.25)] object-cover shadow-[0_0_24px_hsl(43,70%,55%/0.18)]"
          />
        </motion.div>
      </motion.div>

      {/* â”€â”€ Bottom bar â”€â”€ */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        {/* Thin accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="flex items-end justify-between px-6 md:px-14 py-6 bg-gradient-to-t from-black/70 to-transparent pt-16">
          {/* TAMV banner â€” desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="hidden md:block"
          >
            <Link to="/musica" className="flex items-center gap-3 group">
              <img
                src={tamvBanner}
                alt="TAMV 92.5"
                className="h-10 w-auto rounded-lg border border-white/8 object-cover shadow-lg transition-transform group-hover:scale-105"
              />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-[hsl(43,70%,60%)]">Sintoniza la sierra</p>
                <p className="text-xs font-bold text-white/80">TAMV 92.5 FM</p>
              </div>
            </Link>
          </motion.div>

          {/* Scroll chevron â€” centered */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-5 h-5 text-[hsl(43,70%,55%/0.65)]" />
          </motion.div>

          {/* Stats â€” right */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.45, duration: 0.8 }}
            className="flex gap-6 md:gap-10 ml-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-right">
                <p
                  className="text-xl md:text-2xl font-bold text-[hsl(43,72%,60%)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </p>
                <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/45 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
