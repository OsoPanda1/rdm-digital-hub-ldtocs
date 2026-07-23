import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, MapPin, Sparkles, Radio } from "lucide-react";
import { Link } from "react-router-dom";

import rdmLogo from '@assets/ChatGPT_Image_18_jul_2026,_09_28_51_p.m._1784832222163.png';
import tamvBanner from '@assets/Gemini_Generated_Image_a3vb18a3vb18a3vb_1784832222162.png';

const HERO_IMAGES = [
  "/images/hero-realdelmonte.jpg",
  "/images/rdm-aerial-pueblo.jpg",
  "/images/rdm-bosque-niebla.jpg",
  "/images/rdm-calles-coloridas.jpg",
  "/images/rdm-mirador-sunset.jpg",
];

export function RDMHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <section ref={ref} className="relative h-[100vh] w-full overflow-hidden bg-[hsl(220_30%_5%)]">
      {/* Background Images with Ken Burns */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms]"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentImg ? 0.4 : 0,
            }}
          />
        ))}

        {/* Deep obsidian/navy base gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, hsl(220 30% 8% / 0.7) 0%, hsl(220 30% 5% / 0.9) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, transparent 0%, hsl(220 30% 4% / 0.8) 100%)",
          }}
        />
      </motion.div>

      {/* Volumetric Gold Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[hsl(var(--rdm-amber))]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0.3,
              boxShadow: "0 0 10px hsl(var(--rdm-amber))",
            }}
            animate={{
              y: [0, -200],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-16 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-[hsl(var(--rdm-amber))] rounded-full blur-[60px] opacity-20 animate-pulse" />
          <img src={rdmLogo} alt="RDM Digital Hub Logo" className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-[hsl(var(--rdm-amber)/0.3)] shadow-[0_0_40px_hsl(var(--rdm-amber)/0.2)] object-cover relative z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4"
        >
          <Link to="/musica" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer group">
            <Radio className="w-3 h-3 text-red-500 group-hover:animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-white/80 font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              TAMV 92.5 · <span className="text-red-400">En vivo</span>
            </span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 text-white drop-shadow-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Real del Monte<br/>
          <span className="text-[hsl(var(--rdm-amber))] text-3xl md:text-5xl lg:text-6xl font-medium tracking-wide">Digital Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          El portal soberano del Pueblo Mágico. Donde la niebla abraza la historia minera y la magia cobra vida.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/mapa"
            className="inline-flex items-center gap-3 bg-[hsl(var(--rdm-amber))] text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide shadow-[0_0_30px_-5px_hsla(43,80%,55%,0.5)] hover:scale-105 transition-transform"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Sparkles className="w-4 h-4" /> Explorar Territorio
          </Link>
          <Link
            to="/historia"
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-medium text-sm tracking-wide text-white/90 border border-white/20 hover:bg-white/20 transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <MapPin className="w-4 h-4" /> Descubrir Legado
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom stats & elements */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-32 pb-8 px-6 md:px-16 flex flex-col md:flex-row justify-between items-end md:items-center z-20">
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:block"
        >
          <Link to="/musica" className="flex items-center gap-4 group cursor-pointer">
            <img src={tamvBanner} alt="TAMV 92.5 Banner" className="w-32 h-auto rounded-lg border border-white/10 shadow-xl group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--rdm-amber))]">Sintoniza la sierra</p>
              <p className="text-white text-sm font-bold">TAMV 92.5 FM</p>
            </div>
          </Link>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-[hsl(var(--rdm-amber)/0.8)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex gap-6 md:gap-10 text-right w-full md:w-auto justify-between md:justify-end"
        >
          {[
            { value: "500+", label: "Años de historia" },
            { value: "2,700m", label: "Altitud" },
            { value: "14°C", label: "Temperatura" },
          ].map((stat, i) => (
            <div key={stat.label}>
              <p
                className="text-2xl md:text-3xl font-bold text-[hsl(var(--rdm-amber))]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-white/70 uppercase tracking-wider mt-1" style={{ fontFamily: "var(--font-body)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
