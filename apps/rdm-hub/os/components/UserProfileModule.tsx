'use client';
import React from 'react';
import { TERRITORIAL_MISSIONS, USER_BADGES } from '../data/modulesData';
import { User, Award, CheckCircle2, Trophy, Flame, Shield, Footprints, Sparkles, Star } from 'lucide-react';

export const UserProfileModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl font-extrabold text-amber-400 font-serif">
              RDM
            </div>
          </div>
          <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-slate-950 border-2 border-slate-900" title="Verificado RDM">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-white font-serif">Explorador Soberano</h2>
            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
              Nivel 14 • Guardián del Socavón
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans max-w-xl">
            Identificador Soberano en TAMV OS: <span className="font-mono text-amber-400">#0x7a91f3c80</span> • Miembro activo desde Julio 2026.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono pt-1 text-slate-300">
            <span className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              950 XP
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Award className="w-3.5 h-3.5" />
              4 Insignias
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Footprints className="w-3.5 h-3.5" />
              12 Km Recorridos
            </span>
          </div>
        </div>
      </div>

      {/* Gamification Missions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Misiones Territoriales Activas
          </h3>
          <span className="text-xs font-mono text-slate-400">
            1/3 Completadas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TERRITORIAL_MISSIONS.map(mission => (
            <div
              key={mission.id}
              className={`rounded-3xl p-6 space-y-4 border shadow-xl flex flex-col justify-between ${
                mission.completed
                  ? 'bg-slate-900/90 border-emerald-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-slate-950 text-amber-300 font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-slate-800">
                    {mission.category}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    +{mission.xpReward} XP
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-serif">{mission.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{mission.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Progreso:</span>
                  <span className="text-amber-400 font-bold">{mission.completedCheckpoints}/{mission.checkpointCount} checkpoints</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      mission.completed ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${mission.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          Colección de Insignias & Logros
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {USER_BADGES.map(badge => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border text-center space-y-2 shadow-xl ${
                badge.unlockedAt
                  ? 'bg-slate-900 border-amber-500/30'
                  : 'bg-slate-950/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="text-4xl">{badge.icon}</div>
              <h4 className="text-xs font-bold text-white font-serif">{badge.title}</h4>
              <p className="text-[10px] text-slate-400">{badge.description}</p>

              <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                badge.rarity === 'Legendario' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                badge.rarity === 'Épico' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {badge.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
