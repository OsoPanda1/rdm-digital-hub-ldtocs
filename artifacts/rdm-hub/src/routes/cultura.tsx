// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { CULTURE } from "@/data/content";
import { Landmark, Music, Users, Calendar, MapPin, Star, BookOpen, Award, Sparkles } from "lucide-react";

export const Route = createFileRoute("/cultura")({
  head: () => ({
    meta: [
      { title: "Cultura · Festival del Paste, Panteón Inglés · RDM" },
      { name: "description", content: "Patrimonio cultural cornish-mexicano, museos y festividades de Real del Monte." },
      { property: "og:title", content: "Cultura · Real del Monte" },
      { property: "og:description", content: "Museos, festivales y arquitectura de cantera." },
    ],
  }),
  component: CulturaPage,
});

const CULTURE_ICONS = {
  default: Landmark,
  festival: Music,
  museo: BookOpen,
  panteon: Award,
  arquitectura: Sparkles,
  devocion: Users,
} as const;

function getCultureIcon(title: string): React.ComponentType<{ className?: string }> {
  const lower = title.toLowerCase();
  if (lower.includes('festival')) return CULTURE_ICONS.festival;
  if (lower.includes('museo')) return CULTURE_ICONS.museo;
  if (lower.includes('panteón') || lower.includes('panteon')) return CULTURE_ICONS.panteon;
  if (lower.includes('arquitectura') || lower.includes('casa') || lower.includes('hacienda')) return CULTURE_ICONS.arquitectura;
  if (lower.includes('capilla') || lower.includes('devocion') || lower.includes('procesión')) return CULTURE_ICONS.devocion;
  return CULTURE_ICONS.default;
}

function CulturaPage() {
  return (
    <>
      <PageHero
        eyebrow="VI · Patrimonio"
        title="Una cultura"
        highlight="bilingüe del subsuelo."
        description="Patrimonio cornish-mexicano, museografía digital y festividades de devoción comunitaria."
      />
      <section className="container mx-auto px-6 pb-24">
        {/* Cultural Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CULTURE.map((c, i) => {
            const Icon = getCultureIcon(c.title);
            return (
              <motion.article
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative rounded-2xl border-hairline bg-card p-7 hover:shadow-sovereign transition-all overflow-hidden"
              >
                {/* Decorative background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Icon className="absolute top-4 right-4 w-24 h-24 text-accent/10" />
                </div>

                <div className="relative z-10">
                  <div className="font-mono text-[10px] tracking-sovereign text-accent mb-2">{c.subtitle}</div>
                  <h3 className="font-display text-2xl text-ink mb-2 group-hover:text-accent transition-colors">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {getCultureTags(c.title).map((tag, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[9px] tracking-sovereign px-2 py-1 rounded-full border-hairline bg-card hover:bg-secondary transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Location hint */}
                  <div className="mt-4 pt-4 border-t border-hairline flex items-center gap-2 text-[11px] text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>Real del Monte, Hidalgo</span>
                    <span className="flex-1" />
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="font-mono text-accent">4.9</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Featured: Festival del Paste */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl border-hairline overflow-hidden bg-gradient-to-br from-accent/5 via-transparent to-primary/5 p-8 md:p-12"
          >
            <div className="absolute inset-0 opacity-5">
              <Sparkles className="w-full h-full" style={{ color: 'currentColor' }} />
            </div>
            <div className="relative max-w-3xl">
              <p className="font-mono text-[10px] tracking-sovereign text-accent mb-2">Evento Emblemático</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
                Festival Internacional del Paste
                <br />
                <span className="text-gradient-copper italic">XV Edición · Octubre 2026</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl">
                La celebración gastronómica más esperada de la Comarca Minera. Demostraciones en vivo, concurso del mejor paste, música cornish-mexicana y recorrido por hornos artesanales centenarios.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm hover:bg-accent transition-colors"
                >
                  <Calendar className="w-4 h-4" /> 15-17 Octubre 2026
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full border-hairline px-6 py-3 text-sm hover:bg-secondary transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Plaza Principal, Real del Monte
                </motion.button>
              </div>

              {/* Highlights */}
              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Music, label: "Música en vivo", desc: "Bandas cornish y son huasteco" },
                  { icon: UtensilsCrossed, label: "Gastronomía", desc: "Concurso paste tradicional" },
                  { icon: Users, label: "Comunidad", desc: "Talleres familiares" },
                  { icon: Sparkles, label: "Patrimonio", desc: "Recorridos nocturnos guiados" },
                ].map((h, idx) => (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-hairline"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <h.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-ink">{h.label}</p>
                      <p className="text-[11px] text-muted-foreground">{h.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Intangible Heritage */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-sovereign text-accent">Patrimonio Inmaterial</p>
              <h2 className="font-display text-3xl text-ink">Memoria viva del territorio</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Archivo Oral", desc: "Grabaciones de dichos, leyendas y testimonios mineros", icon: BookOpen, color: "oklch(0.6 0.14 80)" },
              { title: "Rituales Mineros", desc: "Procesiones, ofrendas y ceremonias de la Comarca", icon: Sparkles, color: "oklch(0.5 0.16 330)" },
              { title: "Lengua Cornish", desc: "Palabras y expresiones preservadas en el habla local", icon: Globe, color: "oklch(0.55 0.1 180)" },
            ].map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border-hairline bg-card p-6 hover:shadow-sovereign transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${item.color}22` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <div className="mt-4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ backgroundColor: item.color }} />
              </motion.article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

function getCultureTags(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes('festival')) return ['Festival', 'Gastronomía', 'Música', 'Comunidad'];
  if (lower.includes('museo')) return ['Museo', 'Patrimonio Industrial', 'Historia'];
  if (lower.includes('panteón') || lower.includes('panteon')) return ['Cementerio', 'Cornwall', 'Arquitectura', 'Memoria'];
  if (lower.includes('arquitectura') || lower.includes('casa') || lower.includes('hacienda')) return ['Arquitectura', 'Cantera', 'Siglo XIX'];
  if (lower.includes('capilla') || lower.includes('devocion') || lower.includes('procesión')) return ['Devoción', 'Tradición', 'Barrio Alto'];
  return ['Patrimonio', 'Cultura', 'Real del Monte'];
}

// Missing imports
import { UtensilsCrossed } from "lucide-react";