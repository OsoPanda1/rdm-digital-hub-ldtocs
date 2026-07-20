import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Zap,
  Gift,
  TrendingUp,
  Lock,
  CheckCircle,
  Award,
  Sparkles,
  Heart,
  Music,
  MapPin,
  Coins,
} from "lucide-react";

interface PremiumTierCardProps {
  userTier?: "free" | "premium" | "elite";
  currentPoints?: number;
  pointsToNextReward?: number;
  onUpgradePremium?: () => void;
  onClaimReward?: () => void;
}

export function PremiumTierCard({
  userTier = "free",
  currentPoints = 0,
  pointsToNextReward = 500,
  onUpgradePremium,
  onClaimReward,
}: PremiumTierCardProps) {
  const [showRewards, setShowRewards] = useState(false);

  const tiers = {
    free: { color: "from-slate-600 to-slate-700", icon: "🎭", name: "Explorador" },
    premium: { color: "from-amber-600 to-amber-700", icon: "👑", name: "Guardián" },
    elite: { color: "from-purple-600 to-pink-600", icon: "✨", name: "Embajador" },
  };

  const rewards = [
    { id: 1, name: "Entrada Gratis a Mina", points: 500, icon: "⛏️", claimed: currentPoints >= 500 },
    { id: 2, name: "Descuento 20% Pastes", points: 300, icon: "🥧", claimed: currentPoints >= 300 },
    { id: 3, name: "Tour Privado", points: 800, icon: "🗺️", claimed: currentPoints >= 800 },
    { id: 4, name: "Certificado Digital", points: 1000, icon: "📜", claimed: currentPoints >= 1000 },
  ];

  const progressPercent = (currentPoints / pointsToNextReward) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main Tier Card */}
      <motion.div
        className={`rounded-2xl bg-gradient-to-br ${tiers[userTier].color} p-8 border border-white/10 shadow-2xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Left Side - Tier Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{tiers[userTier].icon}</span>
              <div>
                <h3 className="font-display text-2xl text-white">
                  {tiers[userTier].name}
                </h3>
                <p className="text-sm text-white/70 capitalize">{userTier} tier</p>
              </div>
            </div>

            {userTier === "free" && (
              <motion.button
                onClick={onUpgradePremium}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-lg bg-white text-amber-700 font-body font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"
              >
                <Crown className="w-4 h-4" /> Actualizar a Premium
              </motion.button>
            )}

            {userTier === "premium" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-lg bg-white/20 text-white font-body font-bold flex items-center justify-center gap-2 border border-white/30"
              >
                <Sparkles className="w-4 h-4" /> Premium Activo ✓
              </motion.button>
            )}

            {userTier === "elite" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full py-3 rounded-lg bg-white/20 text-white font-body font-bold flex items-center justify-center gap-2 border border-white/30"
              >
                <Award className="w-4 h-4" /> Embajador VIP ✓
              </motion.button>
            )}
          </div>

          {/* Right Side - Stats */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-body text-white/80">Puntos Acumulados</label>
                <span className="font-display text-2xl text-white">{currentPoints}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-white/60">
                {pointsToNextReward - currentPoints} puntos para próximo reward
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 rounded-lg p-3 text-center border border-white/20">
                <p className="text-xs text-white/70">Nivel</p>
                <p className="text-2xl font-display text-white">
                  {Math.floor(currentPoints / 250) + 1}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center border border-white/20">
                <p className="text-xs text-white/70">Racha Actual</p>
                <p className="text-2xl font-display text-white">7 días</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Points Earning Guide */}
      <motion.div
        className="rounded-xl bg-slate-900 border border-slate-700 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-display text-amber-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Cómo Ganar Puntos
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { action: "Visitaste un lugar", points: "+50pts", icon: MapPin },
            { action: "Escuchaste canciones", points: "+25pts", icon: Music },
            { action: "Compraste en comercio", points: "+100pts", icon: Coins },
            { action: "Completaste misión", points: "+150pts", icon: CheckCircle },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center hover:border-amber-500 transition-colors"
              >
                <Icon className="w-4 h-4 mx-auto text-amber-400 mb-2" />
                <p className="text-xs text-slate-300">{item.action}</p>
                <p className="text-sm font-bold text-green-400">{item.points}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Rewards Section */}
      <motion.div
        className="rounded-xl bg-slate-900 border border-slate-700 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => setShowRewards(!showRewards)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <h4 className="font-display text-amber-400 flex items-center gap-2">
            <Gift className="w-4 h-4" /> Rewards Disponibles
          </h4>
          <motion.div animate={{ rotate: showRewards ? 180 : 0 }}>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </button>

        {showRewards && (
          <motion.div
            className="space-y-3 mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                className={`p-4 rounded-lg border transition-all ${
                  reward.claimed
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-slate-800 border-slate-700 hover:border-amber-500"
                }`}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <p className="text-white font-body font-medium">{reward.name}</p>
                      <p className="text-xs text-slate-400">{reward.points} puntos requeridos</p>
                    </div>
                  </div>

                  {reward.claimed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-body">Reclamado</span>
                    </div>
                  ) : currentPoints >= reward.points ? (
                    <motion.button
                      onClick={onClaimReward}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg font-body text-sm font-bold hover:bg-amber-600 transition-colors"
                    >
                      Reclamar
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-mono">
                        {reward.points - currentPoints} pts
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Membership Benefits */}
      <motion.div
        className="rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h4 className="font-display text-amber-400 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4" /> Beneficios Premium
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Acceso a tours exclusivos",
            "Descuentos en comercios",
            "Contenido premium desbloqueado",
            "Soporte prioritario",
            "Streamer de radio en vivo",
            "Badge de Guardián visible",
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              {benefit}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
