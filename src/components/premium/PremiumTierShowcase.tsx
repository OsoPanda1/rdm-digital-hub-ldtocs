'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Gift, Zap, Check } from 'lucide-react';

interface PremiumBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: PremiumBenefit[] = [
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Acumula Puntos',
    description: 'Gana 2x puntos en cada juego y actividad dentro de la plataforma',
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: 'Recompensas Exclusivas',
    description: 'Canjea puntos por descuentos en comercios locales de Real del Monte',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Acceso Premium',
    description: 'Contenido exclusivo, tours virtuales avanzados y eventos especiales',
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: 'Estatus VIP',
    description: 'Sé guardián de Real del Monte con reconocimiento en la comunidad',
  },
];

interface TierOption {
  name: string;
  price: number;
  period: string;
  color: string;
  points: number;
  pointsValue: number;
  features: string[];
  recommended?: boolean;
}

const tiers: TierOption[] = [
  {
    name: 'Base',
    price: 0,
    period: 'Gratis',
    color: 'slate',
    points: 0,
    pointsValue: 0,
    features: [
      'Acceso a contenido público',
      '1x multiplicador de puntos',
      'Participar en juegos básicos',
    ],
  },
  {
    name: 'Guardián',
    price: 99,
    period: 'Mensual',
    color: 'amber',
    points: 500,
    pointsValue: 50,
    features: [
      'Todo lo de Base',
      '2x multiplicador de puntos',
      'Tours virtuales avanzados',
      'Acceso a eventos mensuales',
      'Badge de Guardián',
    ],
    recommended: true,
  },
  {
    name: 'Embajador',
    price: 249,
    period: 'Mensual',
    color: 'yellow',
    points: 1500,
    pointsValue: 150,
    features: [
      'Todo lo de Guardián',
      '3x multiplicador de puntos',
      'Contenido exclusivo avanzado',
      'Streaming prioritario',
      'Consulta directa con administradores',
      'Badge de Embajador',
    ],
  },
];

interface Points {
  available: number;
  earned: number;
  redeemed: number;
}

interface PremiumUser {
  tier: string;
  points: Points;
  nextReward?: number;
}

interface PremiumTierShowcaseProps {
  currentUser?: PremiumUser;
  onSelectTier?: (tier: string) => void;
}

export function PremiumTierShowcase({ currentUser, onSelectTier }: PremiumTierShowcaseProps) {
  const [selectedTier, setSelectedTier] = useState<string>(currentUser?.tier || 'Base');

  const handleSelectTier = (tierName: string) => {
    setSelectedTier(tierName);
    onSelectTier?.(tierName);
  };

  return (
    <div className="w-full space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold uppercase tracking-wider">
          Programa Premium
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Sé un Guardián o Embajador de Real del Monte. Acumula puntos y accede a
          recompensas exclusivas en tu pueblo.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/20 hover:border-amber-400/40 transition-all"
          >
            <div className="text-amber-400 mb-3">{benefit.icon}</div>
            <h3 className="font-display text-white mb-2">{benefit.title}</h3>
            <p className="text-sm text-slate-400">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Current Points Display */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-xl border border-amber-400/30"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-amber-300/70 uppercase tracking-wider mb-2">
                Puntos disponibles
              </p>
              <p className="text-3xl font-bold text-amber-400">
                {currentUser.points.available.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-amber-300/70 uppercase tracking-wider mb-2">
                Total ganados
              </p>
              <p className="text-3xl font-bold text-amber-300">
                {currentUser.points.earned.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-amber-300/70 uppercase tracking-wider mb-2">
                Próxima recompensa
              </p>
              <p className="text-3xl font-bold text-amber-200">
                {currentUser.nextReward || 0} pts
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tiers */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
            onClick={() => handleSelectTier(tier.name)}
            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer transform hover:scale-105 ${
              selectedTier === tier.name
                ? 'border-amber-400 bg-gradient-to-br from-slate-800 via-amber-900/20 to-slate-900 shadow-lg shadow-amber-500/30'
                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase">
                  Recomendado
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-display text-2xl text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-amber-400">${tier.price}</span>
                  <span className="text-sm text-slate-400">/{tier.period}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Puntos al suscribirse</p>
                <p className="text-xl font-bold text-amber-400">{tier.points.toLocaleString()} pts</p>
                <p className="text-xs text-slate-500 mt-1">
                  Equivalente a ${tier.pointsValue} MXN
                </p>
              </div>

              <div className="space-y-3">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.price === 0
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : selectedTier === tier.name
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 hover:from-amber-500 hover:to-yellow-500'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/50'
                }`}
              >
                {tier.price === 0 ? 'Tu plan actual' : 'Actualizar plan'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Points Redemption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-amber-500/30"
      >
        <h3 className="font-display text-2xl text-white mb-6 flex items-center gap-2">
          <Gift className="w-6 h-6 text-amber-400" />
          Canjear Puntos
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { points: 100, reward: 'Café gratis en Pastes El Portal', store: 'Portal Café' },
            { points: 250, reward: 'Descuento 20% en joyería artesanal', store: 'Platería La Veta' },
            { points: 500, reward: '1 noche Hotel Mina Real', store: 'Hotel Mina Real' },
          ].map((offer, idx) => (
            <motion.div
              key={idx}
              whileHover={{ translateY: -4 }}
              className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-amber-400/50 transition-all cursor-pointer"
            >
              <p className="text-sm text-slate-400 mb-1">{offer.store}</p>
              <p className="font-semibold text-white mb-3">{offer.reward}</p>
              <p className="text-lg font-bold text-amber-400">{offer.points} pts</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
