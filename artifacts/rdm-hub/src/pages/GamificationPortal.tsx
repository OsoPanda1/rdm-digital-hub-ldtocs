/**
 * GamificationPortal — Hub central de gamificación
 * Integra: perfil del jugador, leaderboard, misiones
 * Sistema: geo-discovery → XP → rank → missions → leaderboard
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, User, Target, Crown, Pickaxe, Map, Zap, Star, Shield, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { PlayerProfile } from "@/features/gamification/components/PlayerProfile";
import { QuestPanel } from "@/features/gamification/components/QuestPanel";
import { Leaderboard } from "@/features/gamification/components/Leaderboard";

const RANK_TIERS = [
  {
    id: "explorer",
    label: "Explorador",
    icon: Map,
    xp: 0,
    color: "hsl(152 60% 45%)",
    bg: "hsl(152 60% 45% / 0.1)",
    desc: "Descubre los primeros rincones de Real del Monte. Explora el mapa, visita secciones y acumula tus primeros XP.",
  },
  {
    id: "chronicler",
    label: "Cronista",
    icon: Star,
    xp: 1000,
    color: "hsl(210 80% 55%)",
    bg: "hsl(210 80% 55% / 0.1)",
    desc: "Documenta y comparte la historia del pueblo. Completa misiones culturales y de comunidad.",
  },
  {
    id: "legendary_miner",
    label: "Minero Legendario",
    icon: Pickaxe,
    xp: 3000,
    color: "hsl(43 80% 55%)",
    bg: "hsl(43 80% 55% / 0.1)",
    desc: "Dominas el territorio como los mineros de antaño. Desbloquea misiones exclusivas y multiplicadores.",
  },
  {
    id: "guardian_of_the_town",
    label: "Guardián del Pueblo",
    icon: Shield,
    xp: 10000,
    color: "hsl(270 60% 60%)",
    bg: "hsl(270 60% 60% / 0.1)",
    desc: "El título máximo. Eres un pilar de la comunidad digital y territorial de Real del Monte.",
  },
];

const HOW_TO_EARN = [
  { icon: Map,     label: "Check-in geográfico",   xp: 50,  desc: "Visita físicamente un POI y valida con geofence" },
  { icon: Trophy,  label: "Completar misión",       xp: 100, desc: "Finaliza una quest narrativa o territorial" },
  { icon: Star,    label: "Visita cultural",         xp: 25,  desc: "Explora páginas de historia, arte o cultura" },
  { icon: Zap,     label: "Compra validada",         xp: 75,  desc: "Paga en un comercio registrado con QR RDM" },
  { icon: Flame,   label: "Racha diaria",            xp: 30,  desc: "3+ días consecutivos de actividad" },
  { icon: Shield,  label: "Acción comunitaria",      xp: 40,  desc: "Publica en el feed o apoya a un comercio" },
];

export default function GamificationPortal() {
  const [activeTab, setActiveTab] = useState("perfil");

  return (
    <RDMLayout>
      <SEOMeta
        title="Gamificación — RDM Digital Hub"
        description="Sistema de progresión territorial para Real del Monte. Explora, acumula XP, sube de rango y conquista el leaderboard."
      />

      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-end pb-12 overflow-hidden bg-[oklch(0.12_0.025_260)]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[hsl(var(--rdm-amber)/0.06)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[hsl(270_60%_60%/0.08)] blur-2xl" />
        </div>
        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-[hsl(var(--rdm-amber))] text-xs uppercase tracking-widest mb-3">
              <Trophy className="w-4 h-4" />
              <span style={{ fontFamily: "var(--font-body)" }}>Sistema de Progresión Territorial</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Real del Monte<br />
              <span className="text-[hsl(var(--rdm-amber))]">RPG</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl" style={{ fontFamily: "var(--font-body)" }}>
              Geo-discovery → XP → Rango → Misiones → Leaderboard.
              Convierte tu exploración real en progresión digital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rank tiers showcase */}
      <section className="bg-[oklch(0.14_0.02_260)] py-12 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Rangos del sistema
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RANK_TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 p-4 hover:border-white/15 transition-all"
                style={{ background: tier.bg }}
              >
                <tier.icon className="w-6 h-6 mb-3" style={{ color: tier.color }} />
                <p className="font-bold text-white text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {tier.label}
                </p>
                <p className="text-[10px] font-mono mb-2" style={{ color: tier.color }}>
                  {tier.xp.toLocaleString()}+ XP
                </p>
                <p className="text-[11px] text-white/40 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {tier.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to earn XP */}
      <section className="bg-[oklch(0.12_0.02_260)] py-12 px-6 md:px-12 border-y border-white/5">
        <div className="container mx-auto max-w-5xl">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Cómo ganar XP
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {HOW_TO_EARN.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/2"
              >
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--rdm-amber)/0.1)] flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-[hsl(var(--rdm-amber))]" />
                </div>
                <div>
                  <p className="font-semibold text-white text-xs mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/40 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {item.desc}
                  </p>
                  <p className="text-[11px] font-mono text-[hsl(var(--rdm-amber))] mt-1">+{item.xp} XP</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs: Profile / Quests / Leaderboard */}
      <section className="bg-[oklch(0.13_0.02_260)] py-12 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10 mb-8">
              <TabsTrigger value="perfil" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <User className="w-4 h-4 mr-2" /> Mi Perfil
              </TabsTrigger>
              <TabsTrigger value="misiones" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Target className="w-4 h-4 mr-2" /> Misiones
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Crown className="w-4 h-4 mr-2" /> Leaderboard
              </TabsTrigger>
            </TabsList>
            <TabsContent value="perfil"><PlayerProfile /></TabsContent>
            <TabsContent value="misiones"><QuestPanel /></TabsContent>
            <TabsContent value="leaderboard"><Leaderboard showSeason /></TabsContent>
          </Tabs>
        </div>
      </section>
    </RDMLayout>
  );
}
