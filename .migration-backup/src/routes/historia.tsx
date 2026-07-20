import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { TIMELINE } from "@/data/content";
import { ChevronRight, MapPin, Sparkles, BookOpen, Award, Landmark, Pickaxe, Flag, Globe, Zap } from "lucide-react";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Historia · RDM Digital LTOS" },
      { name: "description", content: "Cronología minera y cultural de Real del Monte: Cornwall, plata, paste, Geoparque." },
      { property: "og:title", content: "Historia · Real del Monte" },
      { property: "og:description", content: "Hitos mineros, intercambio cornish y memoria patrimonial viva." },
    ],
  }),
  component: HistoriaPage,
});

const ERA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Siglo XVI": Pickaxe,
  "1766": Zap,
  "1824": Landmark,
  "S. XIX": BookOpen,
  "1906": Sparkles,
  "2004": Award,
  "2017": Globe,
  "2026": Flag,
};

const ERA_COLORS: Record<string, string> = {
  "Siglo XVI": "oklch(0.55 0.13 220)",
  "1766": "oklch(0.62 0.18 30)",
  "1824": "oklch(0.58 0.15 130)",
  "S. XIX": "oklch(0.6 0.14 80)",
  "1906": "oklch(0.5 0.16 330)",
  "2004": "oklch(0.66 0.16 45)",
  "2017": "oklch(0.55 0.1 180)",
  "2026": "oklch(0.38 0.05 270)",
};

function HistoriaPage() {
  return (
    <>
      <PageHero
        eyebrow="III · Memoria"
        title="Bajo estas montañas,"
        highlight="imperios nacieron."
        description="Recorrido cronológico por los hitos mineros, la herencia cornish y la evolución social que dieron forma a la comarca."
      />
      <section className="container mx-auto px-6 pb-24">
        {/* Timeline with enhanced visualization */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/60 via-accent/20 to-transparent" />
          
          <ol className="relative space-y-12">
            {TIMELINE.map((t, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                {/* Era marker */}
                <div className="absolute left-0 top-2 flex items-center justify-center">
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-card"
                    style={{ backgroundColor: ERA_COLORS[t.year] }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                  >
                    <ERA_ICONS[t.year] className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  {/* Connecting line to timeline */}
                  <div className="absolute left-5 top-10 bottom-[-12px] w-0.5 bg-hairline" />
                </div>

                {/* Content card */}
                <motion.div
                  className="ml-16 relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                >
                  <div className="rounded-2xl border-hairline bg-card p-6 hover:shadow-sovereign transition-all relative overflow-hidden">
                    {/* Year badge */}
                    <div className="absolute -top-3 left-6">
                      <span className="font-mono text-[10px] tracking-sovereign px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {t.year}
                      </span>
                    </div>

                    {/* Era icon small */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <ERA_ICONS[t.year] className="w-12 h-12" style={{ color: ERA_COLORS[t.year] }} />
                    </div>

                    {/* Event content */}
                    <p className="font-display text-xl text-ink leading-relaxed relative z-10">
                      {t.event}
                    </p>

                    {/* Contextual tags based on era */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {getEraTags(t.year).map((tag, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[9px] tracking-sovereign px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: `${ERA_COLORS[t.year]}22`,
                            color: ERA_COLORS[t.year],
                            border: `1px solid ${ERA_COLORS[t.year]}44`
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Key Figures Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-sovereign text-accent">Personajes Clave</p>
              <h2 className="font-display text-3xl text-ink mt-1">Arquitectos del territorio</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Mineros de Cornwall", role: "Trajeron tecnología, fútbol y el paste", icon: Pickaxe, color: "oklch(0.55 0.13 220)" },
              { name: "Don Felipe", role: "Guardián de la memoria oral minera", icon: BookOpen, color: "oklch(0.6 0.14 80)" },
              { name: "Tía Rosa", role: "Maestra paste Artesanal desde 1949", icon: Sparkles, color: "oklch(0.66 0.16 45)" },
            ].map((figure, i) => (
              <motion.article
                key={figure.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl border-hairline bg-card p-6 hover:shadow-sovereign transition-all group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${figure.color}22` }}>
                  <figure.icon className="w-6 h-6" style={{ color: figure.color }} />
                </div>
                <h3 className="font-display text-lg text-ink">{figure.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{figure.role}</p>
                <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent group-hover:w-full group-hover:from-accent transition-all duration-300" />
              </motion.article>
            ))}
          </div>
        </section>

        {/* Geopark Status */}
        <section className="mt-24">
          <div className="rounded-3xl border-hairline bg-gradient-to-br from-accent/5 via-transparent to-primary/5 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Globe className="w-full h-full" style={{ color: 'currentColor' }} />
            </div>
            <div className="relative max-w-2xl">
              <p className="font-mono text-[10px] tracking-sovereign text-accent mb-2">Reconocimiento Internacional</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                Geoparque Mundial
                <br />
                <span className="text-gradient-copper italic">UNESCO 2017</span>
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl">
                La Comarca Minera integra la red global de Geoparques de la UNESCO, reconociendo su patrimonio geológico, minero y cultural de valor universal.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="font-mono text-[10px] tracking-sovereign px-3 py-1 rounded-full border-hairline bg-card/50">Patrimonio Geológico</span>
                <span className="font-mono text-[10px] tracking-sovereign px-3 py-1 rounded-full border-hairline bg-card/50">Patrimonio Minero</span>
                <span className="font-mono text-[10px] tracking-sovereign px-3 py-1 rounded-full border-hairline bg-card/50">Patrimonio Cultural</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

function getEraTags(year: string): string[] {
  const tags: Record<string, string[]> = {
    "Siglo XVI": ["Fundación", "Plata", "Imperio Español"],
    "1766": ["Huelga", "Derechos Laborales", "Primera en América"],
    "1824": ["Cornwall", "Tecnología", "Fútbol", "Paste", "Cementerio Inglés"],
    "S. XIX": ["Gastronomía", "Arquitectura", "Identidad Local"],
    "1906": ["Transición", "Nueva Economía", "Declive Minero"],
    "2004": ["Pueblo Mágico", "Turismo", "Patrimonio"],
    "2017": ["UNESCO", "Geoparque", "Reconocimiento Global"],
    "2026": ["LTOS", "TAMV MD-X4", "Sistema Operativo Territorial"],
  };
  return tags[year] || ["Historia", "Territorio"];
}