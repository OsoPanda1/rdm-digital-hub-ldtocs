import { createClient } from '@supabase/supabase-js';
import { gamesClient } from '@/lib/clients';
import { cn } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const { data: { session } } = await supabase.auth.getSession();

  try {
    const stats = await gamesClient.getGameStats(slug);
    
    return (
      <GameLayout game={stats.game} userProfile={stats.userProfile} todayUsage={stats.todayUsage} recentSessions={stats.recentSessions} leaderboard={stats.leaderboard} availableBoosters={stats.availableBoosters} />
    );
  } catch (error) {
    console.error('[GamePage] Error loading game:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-ink mb-4">Juego no encontrado</h1>
          <p className="text-muted-foreground mb-6">El juego solicitado no existe o no está disponible.</p>
          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-rdm-copper text-background px-6 py-3 text-sm hover:bg-amber-600 transition-colors">
            Volver al inicio
          </a>
        </div>
      );
    );
  }
}

function GameLayout({ game, userProfile, todayUsage, recentSessions, leaderboard, availableBoosters }: {
  game: any;
  userProfile: any;
  todayUsage: any;
  recentSessions: any[];
  leaderboard: any[];
  availableBoosters: any[];
}) {
  const canPlayFree = todayUsage ? todayUsage.runsUsed < todayUsage.runsLimit : true;
  const remainingFree = todayUsage ? todayUsage.runsLimit - todayUsage.runsUsed : 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative -mt-24 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-background" />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border-hairline glass px-3 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse-ring" />
              <span className="font-mono text-[10px] tracking-sovereign text-muted-foreground">
                {game.type === 'MINA_RESPONSABLE' ? 'Mina Responsable' : 'Ruta del Guardián'}
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] text-ink">
              {game.name}
              <br />
              <span className="text-gradient-copper italic">{game.tagline}</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl font-body">
              {game.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => window.location.href = `/games/${game.slug}/play`}
                disabled={!canPlayFree && !userProfile?.hasPaidAccess}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
                  canPlayFree || userProfile?.hasPaidAccess
                    ? "bg-foreground text-background hover:bg-amber-600"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Play className="w-4 h-4" />
                {canPlayFree || userProfile?.hasPaidAccess ? 'Jugar ahora' : 'Requiere pack de juego'}
              </button>
              
              {(!canPlayFree || !userProfile?.hasPaidAccess) && (
                <a
                  href="/games/packs"
                  className="inline-flex items-center gap-2 rounded-full border-hairline glass px-6 py-3 text-sm hover:bg-secondary"
                >
                  Ver packs de juego
                </a>
              )}
            </div>

            {/* Stats preview */}
            {userProfile && (
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
                {[
                  { label: 'XP Total', value: userProfile.totalXp.toLocaleString(), icon: <TrendingUp className="w-4 h-4" /> },
                  { label: 'Nivel', value: userProfile.level, icon: <Award className="w-4 h-4" /> },
                  { label: 'Mejor Score', value: userProfile.bestScore.toLocaleString(), icon: <Target className="w-4 h-4" /> },
                  { label: 'Partidas Hoy', value: `${todayUsage?.runsUsed || 0}/${todayUsage?.runsLimit || 2}`, icon: <Zap className="w-4 h-4" /> },
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl border-hairline glass p-4 shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="font-mono text-[9px] tracking-sovereign text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="font-display text-3xl text-ink mt-2">{stat.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="font-mono text-[10px] tracking-sovereign text-amber-600 mb-3">Características</div>
          <h2 className="font-display text-4xl md:text-5xl text-ink">
            Por qué jugar <span className="text-gradient-copper italic">{game.name}</span>
          </h2>
        </div>
        
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {game.features.map((feature: string, i: number) => (
            <div key={i} className="group rounded-2xl border-hairline bg-card p-6 hover:shadow-sovereign transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-display text-xl text-ink mb-2">{feature}</h3>
              <p className="text-sm text-muted-foreground">Descripción detallada de la característica en desarrollo.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <section className="container mx-auto px-6 py-24 border-t border-hairline">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] tracking-sovereign text-amber-600">Ranking</div>
              <h2 className="font-display text-3xl md:text-4xl text-ink">Mejores puntuaciones</h2>
            </div>
            <a href={`/games/${game.slug}/leaderboard`} className="text-sm text-amber-600 hover:underline inline-flex items-center gap-1">
              Ver todo <ChevronRight className="w-3 h-3" />
            </a>
          </div>
          
          <div className="rounded-2xl border-hairline bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="p-4 text-left font-mono text-[10px] tracking-sovereign text-amber-600">#</th>
                    <th className="p-4 text-left font-mono text-[10px] tracking-sovereign text-amber-600">Jugador</th>
                    <th className="p-4 text-right font-mono text-[10px] tracking-sovereign text-amber-600">Score</th>
                    <th className="p-4 text-right font-mono text-[10px] tracking-sovereign text-amber-600">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((entry, i) => (
                    <tr key={entry.userId} className="border-b border-hairline/50 hover:bg-secondary/50">
                      <td className="p-4 font-display text-xl text-ink">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="font-display text-sm text-amber-700">{entry.displayName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-ink">{entry.displayName}</div>
                            <div className="font-mono text-[9px] tracking-sovereign text-muted-foreground">{entry.tier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right font-display text-lg text-ink">{entry.score.toLocaleString()}</td>
                      <td className="p-4 text-right font-mono text-sm text-muted-foreground">{entry.totalXp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Boosters */}
      {availableBoosters.length > 0 && (
        <section className="container mx-auto px-6 py-24 border-t border-hairline">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] tracking-sovereign text-amber-600 mb-3">Potenciadores</div>
            <h2 className="font-display text-3xl md:text-4xl text-ink">Mejora tu experiencia</h2>
          </div>
          
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {availableBoosters.map((booster: any) => (
              <div key={booster.id} className="rounded-2xl border-hairline bg-card p-6 hover:shadow-card transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-ink">{booster.name}</h3>
                      <p className="font-mono text-[9px] tracking-sovereign text-amber-600">{booster.type}</p>
                    </div>
                  </div>
                  <span className="font-display text-xl text-ink">{booster.price} <span className="text-sm font-mono text-muted-foreground">MXN</span></span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{booster.description}</p>
                <button className="w-full rounded-full border-hairline bg-card px-4 py-2.5 text-sm hover:bg-secondary transition-colors">
                  Comprar potenciador
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <div className="font-mono text-[10px] tracking-sovereign text-amber-100 mb-2">¿Listo para jugar?</div>
            <h2 className="font-display text-3xl md:text-5xl text-white">
              Tu aventura en <span className="italic">{game.name}</span> comienza ahora
            </h2>
            <p className="mt-4 max-w-xl text-amber-100/80">
              {canPlayFree ? `Tienes ${remainingFree} partidas gratis hoy.` : 'Consigue un pack para acceder sin límites.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = `/games/${game.slug}/play`}
              disabled={!canPlayFree && !userProfile?.hasPaidAccess}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
                canPlayFree || userProfile?.hasPaidAccess
                  ? "bg-white text-amber-700 hover:bg-amber-50"
                  : "bg-white/20 text-white/70 cursor-not-allowed"
              )}
            >
              <Play className="w-4 h-4" />
              {canPlayFree || userProfile?.hasPaidAccess ? 'Jugar gratis' : 'Requiere pack'}
            </button>
            <a
              href="/games/packs"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Ver packs disponibles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Play, TrendingUp, Award, Target, Zap, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';