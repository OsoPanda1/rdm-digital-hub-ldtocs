import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Crown,
  Images,
  TrendingUp,
  Sparkles,
  Award,
  Users,
  Settings,
} from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { AdvancedMusicPlayer } from "@/components/music/AdvancedMusicPlayer";
import { PremiumTierCard } from "@/components/PremiumTierCard";
import { HeritageGallerySection } from "@/components/HeritageGallerySection";
import {
  ScrollReveal,
  FadeInUp,
  AnimatedSeparator,
  StaggerContainer,
  PulseElement,
} from "@/components/GlobalAnimationEffects";
import { useGamification } from "@/hooks/useGamification";

// Mock data for music player
const mockTracks = [
  {
    id: "1",
    title: "El Real (Legend)",
    artist: "Edwin Castillo",
    description: "Tema principal del intro de la plataforma.",
    src: "https://example.com/track1.mp3",
    duration: 210,
    bpm: 70,
    mood: "Emotivo",
  },
  {
    id: "2",
    title: "A Mi Madre",
    artist: "RDM Digital",
    description: "Homenaje musical a mi madre.",
    src: "https://example.com/track2.mp3",
    duration: 275,
    bpm: 70,
    mood: "Emotivo",
  },
  {
    id: "3",
    title: "Tu Mirada",
    artist: "RDM Digital",
    description: "Melodía íntima que captura la esencia de una mirada.",
    src: "https://example.com/track3.mp3",
    duration: 240,
    bpm: 72,
    mood: "Melancólico",
  },
];

const PAGE_SEO = {
  title: "Platform Hub - Real del Monte Digital",
  description: "Acceso a música, premium tier, galerías, y más experiencias de Real del Monte",
};

export default function PlatformHub() {
  const [activeTab, setActiveTab] = useState<"overview" | "music" | "premium" | "gallery">("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const gamification = useGamification("user-demo");

  const tabs = [
    { id: "overview", label: "Resumen", icon: TrendingUp },
    { id: "music", label: "Música", icon: Music },
    { id: "premium", label: "Premium", icon: Crown },
    { id: "gallery", label: "Galería", icon: Images },
  ];

  return (
    <RDMLayout>
      <SEOMeta title={PAGE_SEO.title} description={PAGE_SEO.description} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block mb-4"
              >
                <PulseElement>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-body text-amber-400">Plataforma al 200%</span>
                  </div>
                </PulseElement>
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl text-white mb-4">
                Real del Monte <span className="text-gradient-gold">Digital</span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Música, Premium Tier, Galerías Históricas y Experiencias Inmersivas
              </p>
            </div>
          </ScrollReveal>

          <AnimatedSeparator className="w-32 h-1 mx-auto" />
        </div>
      </section>

      {/* Stats Section */}
      <FadeInUp>
        <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 -mt-12 mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Puntos", value: gamification.state.totalPoints, icon: Award },
              { label: "Nivel", value: gamification.state.currentLevel, icon: TrendingUp },
              { label: "Racha", value: "7 días", icon: Sparkles },
              { label: "Tier", value: gamification.state.currentTier, icon: Crown },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl bg-slate-800 border border-slate-700 p-6 hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                  <p className="font-display text-3xl text-white">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </FadeInUp>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 mb-20">
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-body font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                    : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-amber-500"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gamification Card */}
                <FadeInUp>
                  <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-8 border border-purple-400/20">
                    <div className="flex items-center gap-3 mb-6">
                      <Award className="w-6 h-6 text-white" />
                      <h3 className="font-display text-2xl text-white">Tu Progreso</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-white/80 text-sm mb-2">Puntos Acumulados</p>
                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${(gamification.state.totalPoints / 2000) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">
                        {gamification.state.totalPoints} / 2000 para Elite
                      </p>
                    </div>
                  </div>
                </FadeInUp>

                {/* Motivational Message */}
                <FadeInUp delay={0.1}>
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 border border-blue-400/20">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-white" />
                      <h3 className="font-display text-2xl text-white">Misión</h3>
                    </div>
                    <p className="text-white/90 text-lg mb-4">
                      {gamification.getMotivationalMessage()}
                    </p>
                    <button className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-body font-medium transition-colors">
                      Ver Rewards
                    </button>
                  </div>
                </FadeInUp>
              </div>

              {/* Admin Toggle */}
              {isAdmin && (
                <FadeInUp delay={0.2}>
                  <div className="rounded-xl bg-slate-800 border border-red-500/50 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-lg text-white">Modo Admin Activo</h4>
                        <p className="text-slate-400 text-sm">Puedes activar streams en vivo</p>
                      </div>
                      <Settings className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                </FadeInUp>
              )}
            </motion.div>
          )}

          {/* Music Tab */}
          {activeTab === "music" && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdvancedMusicPlayer
                tracks={mockTracks}
                isAdmin={isAdmin}
                onLiveStreamToggle={(enabled) => console.log("Stream:", enabled)}
              />
            </motion.div>
          )}

          {/* Premium Tab */}
          {activeTab === "premium" && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PremiumTierCard
                userTier={gamification.state.currentTier as any}
                currentPoints={gamification.state.totalPoints}
                pointsToNextReward={500}
                onUpgradePremium={() => console.log("Upgrade")}
                onClaimReward={() => console.log("Claim reward")}
              />
            </motion.div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HeritageGallerySection />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Features Section */}
      <FadeInUp>
        <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-20 border-t border-slate-700">
          <h2 className="font-display text-4xl text-white mb-12 text-center">Características Principales</h2>

          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Music,
                  title: "Reproductor Avanzado",
                  description:
                    "Música en vivo, streaming con admin controls, playlist personalizada",
                },
                {
                  icon: Crown,
                  title: "Premium Tier",
                  description:
                    "Gamificación, puntos, rewards, acceso a contenido exclusivo",
                },
                {
                  icon: Images,
                  title: "Galería Histórica",
                  description:
                    "Imágenes de Pedro Romero, calcografías, patrimonio cultural",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl bg-slate-800 border border-slate-700 p-8 hover:border-amber-500/50 transition-colors group"
                    viewport={{ once: true }}
                  >
                    <Icon className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-display text-xl text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </StaggerContainer>
        </section>
      </FadeInUp>
    </RDMLayout>
  );
}
