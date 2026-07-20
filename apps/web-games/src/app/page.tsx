'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Gem, Shield, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const GAMES = [
  {
    id: 'mina-responsable',
    slug: 'mina-responsable',
    name: 'Mina Responsable',
    tagline: 'Extrae sabiduría, no solo minerales',
    description: 'Simulador de gestión minera ética. Equilibra producción, seguridad y comunidad. Cada decisión afecta tu reputación federada.',
    icon: Gem,
    color: 'from-amber-500 to-orange-500',
    category: 'Gestión · Estrategia',
    duration: '15-20 min',
    freeRuns: 2,
    features: ['Gestión de recursos', 'Eventos éticos', 'Reputación federada', 'Boost de XP Cattleya'],
    cta: 'Entrar a la mina',
  },
  {
    id: 'ruta-guardian',
    slug: 'ruta-guardian',
    name: 'Ruta del Guardián',
    tagline: 'Protege el territorio, gana honor',
    description: 'Aventura narrativa por Real del Monte. Resuelve acertijos patrimoniales, ayuda a la comunidad y desbloquea la Ruta del Guardián.',
    icon: Shield,
    color: 'from-emerald-500 to-teal-500',
    category: 'Aventura · Narrativa',
    duration: '20-30 min',
    freeRuns: 2,
    features: ['Acertijos culturales', 'Mapa interactivo', 'Crónicas sonoras', 'Badges de Guardián'],
    cta: 'Iniciar ruta',
  },
];

const CATTLEYA_TIERS = [
  { id: 'BASE', name: 'Base', minXp: 0, color: 'bg-slate-400', benefits: ['2 runs gratis/día', 'XP base', 'Acceso a Mina Responsable'] },
  { id: 'CUIDADO', name: 'Cuidado', minXp: 900, color: 'bg-amber-500', benefits: ['3 runs gratis/día', '+10% XP', 'Acceso a Ruta del Guardián', 'Descuento 5% packs'] },
  { id: 'GUARDIAN', name: 'Guardián', minXp: 1300, color: 'bg-emerald-500', benefits: ['4 runs gratis/día', '+25% XP', 'Booster semanal gratis', 'Descuento 10% packs', 'Acceso anticipado'] },
  { id: 'EMBAJADOR', name: 'Embajador', minXp: 1700, color: 'bg-purple-500', benefits: ['Runs ilimitados', '+50% XP', 'Booster diario gratis', 'Descuento 20% packs', 'Packs exclusivos', 'Voz en gobernanza'] },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rdm-paper via-rdm-parchment to-rdm-paper">
      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-24 pt-32 pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-radial from-rdm-copper/10 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 rounded-full border-hairline glass px-4 py-2 mb-6"
            >
              <span className="h-2 w-2 rounded-full bg-rdm-copper animate-pulse-ring" />
              <span className="font-mono text-[10px] tracking-sovereign text-muted-foreground">
                Web Games · Federación TAMV
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-ink"
            >
              Minijuegos
              <br />
              <span className="text-gradient-copper italic">Territoriales</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body"
            >
              Gamificación federada con Cattleya tiers. Juega gratis, progresa con packs, gana reputación en la heptafederación.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <Link
                href="/games/mina-responsable"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-sm hover:bg-rdm-copper transition-colors shadow-sovereign"
              >
                Jugar Mina Responsable <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/games/ruta-guardian"
                className="inline-flex items-center gap-2 rounded-full border-hairline glass px-8 py-4 text-sm hover:bg-secondary transition-colors"
              >
                Iniciar Ruta del Guardián <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="font-mono text-[10px] tracking-sovereign text-rdm-copper mb-3">JUEGOS DISPONIBLES</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Experiencias <span className="text-gradient-copper italic">Federadas</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Cada juego está vinculado a una federación TAMV. Tu progreso alimenta la heptafederación.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {GAMES.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      </section>

      {/* Cattleya Tiers */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="font-mono text-[10px] tracking-sovereign text-rdm-copper mb-3">SISTEMA CATTLEYA</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Tu <span className="text-gradient-copper italic">Nivel</span> Define la Experiencia
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Progresa jugando. Cada tier Cattleya desbloquea más runs gratis, multiplicadores de XP y beneficios exclusivos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATTLEYA_TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border-hairline bg-card p-8 overflow-hidden',
                tier.id === 'BASE' && 'border-rdm-copper/30',
                tier.id === 'CUIDADO' && 'border-amber-500/30',
                tier.id === 'GUARDIAN' && 'border-emerald-500/30',
                tier.id === 'EMBAJADOR' && 'border-purple-500/30'
              )}
            >
              <div className="absolute inset-0 opacity-5">
                <div className={cn('absolute inset-0 bg-gradient-to-br', tier.color)} />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-sovereign font-semibold mb-4" style={{ backgroundColor: tier.color.replace('bg-', 'bg-').replace('500', '100'), color: tier.color.replace('bg-', '').replace('500', '700') }}>
                  {tier.id}
                </div>
                <h3 className="font-display text-2xl font-bold text-ink mb-2">{tier.name}</h3>
                <p className="font-mono text-[10px] tracking-sovereign text-muted-foreground mb-6">
                  {tier.minXp > 0 ? `≥ ${tier.minXp.toLocaleString()} XP` : 'Nivel inicial'}
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tier.color.replace('bg-', '').replace('500', '500') }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border-hairline bg-gradient-to-br from-rdm-copper/10 via-transparent to-rdm-primary/10 p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-rdm-copper/20 to-rdm-primary/20" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <p className="font-mono text-[10px] tracking-sovereign text-rdm-copper mb-3">¿LISTO PARA JUGAR?</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-4">
              Tu Territorio te Espera
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Elige tu primera partida. 2 runs gratis al día. Sube de nivel, desbloquea packs y conviértete en Guardián del territorio.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/games/mina-responsable"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-sm hover:bg-rdm-copper transition-colors shadow-sovereign"
              >
                Empezar Gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full border-hairline glass px-8 py-4 text-sm hover:bg-secondary transition-colors"
              >
                Ver mi Progreso
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function GameCard({ game, index }: { game: typeof GAMES[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-3xl border-hairline bg-card overflow-hidden hover:shadow-sovereign transition-all duration-500 group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${game.color}`} />
      </div>
      
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            `bg-gradient-to-br ${game.color}`
          )}>
            <game.icon className="w-7 h-7 text-white" />
          </div>
          <span className="font-mono text-[10px] tracking-sovereign px-2 py-1 rounded-full bg-background/80 text-muted-foreground">
            {game.category}
          </span>
        </div>

        <h3 className="font-display text-2xl font-bold text-ink mb-2 group-hover:text-rdm-copper transition-colors">
          {game.name}
        </h3>
        <p className="font-mono text-[10px] tracking-sovereign text-rdm-copper mb-3">{game.tagline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{game.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {game.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="font-mono text-[9px] tracking-sovereign px-2 py-1 rounded-full bg-background/50 border border-hairline text-muted-foreground">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-hairline">
          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {game.duration}</span>
            <span className="flex items-center gap-1 text-rdm-copper"><Sparkles className="w-3 h-3" /> {game.freeRuns} gratis/día</span>
          </div>
          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rdm-copper/10 text-rdm-copper hover:bg-rdm-copper hover:text-background transition-all text-sm font-medium"
          >
            {game.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}