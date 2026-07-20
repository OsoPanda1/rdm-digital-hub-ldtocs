import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { DISHES } from "@/data/content";
import { UtensilsCrossed, Coffee, Flame, WheatOff, Star, MapPin, Clock, Zap, Heart, CircleDollarSign } from "lucide-react";

export const Route = createFileRoute("/gastronomia")({
  head: () => ({
    meta: [
      { title: "Gastronomía · Paste, Café de Olla, Barbacoa · RDM" },
      { name: "description", content: "Pastes tradicionales, cocina minera, café de olla y productores locales de Real del Monte." },
      { property: "og:title", content: "Gastronomía · Real del Monte" },
      { property: "og:description", content: "Pastes, barbacoa, pulque curado y sabores de la Comarca Minera." },
    ],
  }),
  component: GastronomiaPage,
});

const CATEGORY_CONFIG = {
  paste: { icon: UtensilsCrossed, label: "Pastes", color: "oklch(0.62 0.18 30)", gradient: "from-amber-500 to-orange-500" },
  cafe: { icon: Coffee, label: "Café y Bebidas", color: "oklch(0.55 0.13 220)", gradient: "from-amber-700 to-amber-900" },
  tradicional: { icon: Flame, label: "Cocina Tradicional", color: "oklch(0.58 0.15 130)", gradient: "from-green-500 to-emerald-600" },
  bebida: { icon: WheatOff, label: "Bebidas Ancestrales", color: "oklch(0.5 0.16 330)", gradient: "from-pink-500 to-rose-600" },
} as const;

function getDishCategory(name: string): keyof typeof CATEGORY_CONFIG {
  const lower = name.toLowerCase();
  if (lower.includes('paste')) return 'paste';
  if (lower.includes('café') || lower.includes('cafe') || lower.includes('pulque')) return 'cafe';
  if (lower.includes('barbacoa') || lower.includes('trucha')) return 'tradicional';
  return 'bebida';
}

function GastronomiaPage() {
  const dishesWithCategory = DISHES.map((d, i) => ({ 
    ...d, 
    category: getDishCategory(d.name),
    index: i,
    id: `dish-${i}`,
  }));

  const categories = [...new Set(dishesWithCategory.map(d => d.category))] as (keyof typeof CATEGORY_CONFIG)[];

  return (
    <>
      <PageHero
        eyebrow="IV · Sabores"
        title="Donde el paste"
        highlight="cruza el Atlántico."
        description="Herencia cornish-mexicana en cada bocado: pastes, barbacoa, café de olla y pulque curado en hornos de barro."
      />
      <section className="container mx-auto px-6 pb-24">
        {/* Category Filter */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-sovereign text-accent mb-4">Categorías</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const Icon = config.icon;
              return (
                <button
                  key={cat}
                  className={`group px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    config.gradient
                      ? `bg-gradient-to-r ${config.gradient} text-white shadow-[0_4px_14px_${config.color}40] hover:shadow-[0_8px_25px_${config.color}50]`
                      : 'border-hairline bg-card hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dishesWithCategory.map((dish, i) => {
            const config = CATEGORY_CONFIG[dish.category];
            const Icon = config.icon;
            return (
              <motion.article
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group relative rounded-2xl border-hairline bg-card overflow-hidden hover:shadow-sovereign transition-all"
              >
                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-sovereign uppercase ${config.gradient} text-white shadow-sm`}>
                    <Icon className="w-3 h-3 inline mr-1" /> {config.label}
                  </span>
                </div>

                {/* Price tag */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur text-sm font-semibold text-ink shadow-card">
                    {dish.price}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                    <h3 className="font-display text-xl text-ink group-hover:text-accent transition-colors">{dish.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{dish.desc}</p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-wider text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CircleDollarSign className="w-3 h-3" /> {dish.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Hecho al momento
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Real del Monte
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-4 pt-4 border-t border-hairline flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-display text-lg text-ink">4.8</span>
                      <span className="text-[10px] text-muted-foreground">(127 reseñas)</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto px-4 py-2 rounded-full border-hairline text-sm hover:bg-secondary transition-colors"
                    >
                      Ver en Mapa
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </motion.button>
                  </div>
                </div>

                {/* Decorative accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: config.gradient }} />
              </motion.article>
            );
          })}
        </div>

        {/* Featured Producers */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] tracking-sovereign text-accent">Productores</p>
              <h2 className="font-display text-3xl text-ink">Guardianes del sabor</h2>
            </div>
            <a href="/comercios" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
              Ver directorio completo <ChevronRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Pastes El Portal", since: 1949, specialty: "Paste tradicional cornish", tier: "Patrimonial", icon: UtensilsCrossed },
              { name: "Casa Minera", since: 1998, specialty: "Fusión hidalguense", tier: "Premium", icon: Sparkles },
              { name: "Café Real", since: 2007, specialty: "Café de olla en barro", tier: "Estándar", icon: Coffee },
            ].map((producer, i) => (
              <motion.article
                key={producer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border-hairline bg-card p-6 hover:shadow-sovereign transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <producer.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-lg text-ink">{producer.name}</h3>
                      <span className="font-mono text-[9px] tracking-sovereign px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {producer.tier}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{producer.specialty}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Desde {producer.since}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

// Need to import ChevronRight
import { ChevronRight } from "lucide-react";