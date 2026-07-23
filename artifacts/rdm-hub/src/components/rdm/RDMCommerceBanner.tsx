import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_BANNERS = [
  { id: 1, name: "Restaurante El Minero", tagline: "Auténtico sabor a Real del Monte", category: "🍴", color: "from-[hsl(220_30%_8%)] to-[hsl(220_30%_15%)]" },
  { id: 2, name: "Platería Reyes", tagline: "Arte en plata desde 1920", category: "💍", color: "from-[hsl(220_40%_12%)] to-[hsl(220_40%_20%)]" },
  { id: 3, name: "Hostal de la Montaña", tagline: "Descanso entre la neblina", category: "🛏️", color: "from-[hsl(150_30%_10%)] to-[hsl(150_30%_18%)]" },
  { id: 4, name: "Café del Pueblo", tagline: "El mejor café de altura", category: "☕", color: "from-[hsl(20_30%_12%)] to-[hsl(20_30%_20%)]" },
  { id: 5, name: "Mezcalería El Piquete", tagline: "Tragos coquetos y tradición", category: "🥃", color: "from-[hsl(280_30%_12%)] to-[hsl(280_30%_20%)]" },
  { id: 6, name: "Tours Real del Monte", tagline: "Aventuras mineras guiadas", category: "⛏️", color: "from-[hsl(0_0%_12%)] to-[hsl(0_0%_20%)]" },
];

export function RDMCommerceBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 30 minutes in milliseconds = 1800000
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 2) % MOCK_BANNERS.length);
    }, 1800000);
    return () => clearInterval(interval);
  }, []);

  const b1 = MOCK_BANNERS[index];
  const b2 = MOCK_BANNERS[(index + 1) % MOCK_BANNERS.length];

  return (
    <div className="w-full py-8 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-3 h-3 text-[hsl(var(--rdm-amber))]" />
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
            Publicidad · Actualiza cada 30 min
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {[b1, b2].map((banner, i) => (
              <motion.div
                key={banner.id + i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[160px] group border border-white/10 hover:border-[hsl(var(--rdm-amber))/0.5] hover:shadow-[0_0_20px_hsl(var(--rdm-amber)/0.15)] transition-all bg-gradient-to-br ${banner.color}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">
                  {banner.category}
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {banner.name}
                  </h4>
                  <p className="text-sm text-white/70" style={{ fontFamily: "var(--font-body)" }}>
                    {banner.tagline}
                  </p>
                </div>
                <div className="mt-6 flex justify-between items-end relative z-10">
                  <Link to="/directorio" className="inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--rdm-amber))] group-hover:text-white transition-colors">
                    Ver más <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
