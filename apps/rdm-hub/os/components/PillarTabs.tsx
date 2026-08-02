'use client';
import React, { useState } from 'react';
import { ActivePillar } from '../types';
import { Compass, Map, Utensils, Landmark, Layers, ShoppingBag, Store, Wrench, User, Radio, MessageSquare, CreditCard, Megaphone, Sparkles, Activity, ShieldCheck, BookOpen, Newspaper, Video } from 'lucide-react';

interface PillarTabsProps {
  activePillar: ActivePillar;
  setActivePillar: (pillar: ActivePillar) => void;
}

export const PillarTabs: React.FC<PillarTabsProps> = ({ activePillar, setActivePillar }) => {
  const [selectedTier, setSelectedTier] = useState<number>(1);

  const tiers = [
    {
      level: 1,
      title: '1º PLANO: EXP. TURISTA',
      badge: 'Primer Plano',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      items: [
        { id: 'tourist-showcase' as ActivePillar, label: '🌟 Guía Turista & Ecoturismo', subtitle: 'Showcase Principal', icon: Compass },
        { id: 'turismo' as ActivePillar, label: '📍 Rutas Autoguiadas', subtitle: 'GeoExplorer', icon: Map },
        { id: 'gastronomia' as ActivePillar, label: '🥧 Pastes & Gastronomía', subtitle: 'Fondas Tradicionales', icon: Utensils },
        { id: 'cultura' as ActivePillar, label: '🏛️ Cultura & Leyendas', subtitle: 'Panteón Inglés & Minas', icon: Landmark },
        { id: 'mapa' as ActivePillar, label: '🗺️ Mapa Full-Screen', subtitle: 'Atmósferas & Capas', icon: Layers },
        { id: 'info' as ActivePillar, label: '📰 Noticias & Clima', subtitle: 'InfoMesh', icon: Newspaper },
      ]
    },
    {
      level: 2,
      title: '2º PLANO: CATÁLOGO & COMERCIO',
      badge: 'Segundo Plano',
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      items: [
        { id: 'comercio' as ActivePillar, label: '🛍️ Directorio Comercial', subtitle: 'TradeNode', icon: ShoppingBag },
        { id: 'tienda' as ActivePillar, label: '🛒 Tienda Nativa & Envíos', subtitle: 'Mercado Libre Sync', icon: Store },
        { id: 'pagos-p2p' as ActivePillar, label: '💳 Pagos Online P2P', subtitle: 'Comisiones & Pasarela', icon: CreditCard },
        { id: 'servicios' as ActivePillar, label: '🔧 Guías & Oficios', subtitle: 'Servicios con Costo', icon: Wrench },
      ]
    },
    {
      level: 3,
      title: '3º PLANO: PERFIL, MEDIOS & REGISTRO',
      badge: 'Tercer Plano',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      items: [
        { id: 'perfil' as ActivePillar, label: '👤 Perfil de Usuario', subtitle: 'Logros & Registro', icon: User },
        { id: 'chat-meet' as ActivePillar, label: '💬 Google Chat & Meet', subtitle: 'Canales & Videollamadas', icon: Video },
        { id: 'media' as ActivePillar, label: '📻 Podcasts, Música & Fotos', subtitle: 'Galería Media RDM', icon: Radio },
        { id: 'onboarding' as ActivePillar, label: '🏪 Registrar Negocio', subtitle: 'Verificación Onboarding', icon: Store },
      ]
    },
    {
      level: 4,
      title: '4º PLANO: GAMIFICACIÓN, PREMIUM & ADS',
      badge: 'Cuarto Plano',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      items: [
        { id: 'foro' as ActivePillar, label: '💬 Foro Cívico (Facebook-style)', subtitle: 'Comunidad & Upvotes', icon: MessageSquare },
        { id: 'membresias' as ActivePillar, label: '💳 Membresías & Cattleya Pay', subtitle: 'Planes Premium', icon: CreditCard },
        { id: 'publicidad' as ActivePillar, label: '📣 Banners Publicitarios', subtitle: 'Campañas Éticas', icon: Megaphone },
        { id: 'isabella' as ActivePillar, label: '🤖 ISABELLA AI Core', subtitle: '2.5 Flash Assistant', icon: Sparkles },
        { id: 'kernel' as ActivePillar, label: '⚙️ TAMV OS Kernel', subtitle: '7 Capas Digitales', icon: Activity },
        { id: 'readiness' as ActivePillar, label: '🛡️ Gobernanza', subtitle: 'Readiness 73%', icon: ShieldCheck },
        { id: 'manual' as ActivePillar, label: '📖 Manual de Diseño', subtitle: '25 Capítulos UI', icon: BookOpen },
      ]
    }
  ];

  const currentTier = tiers.find(t => t.level === selectedTier) || tiers[0];

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6 space-y-3">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Tier Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tiers.map(t => (
            <button
              key={t.level}
              onClick={() => setSelectedTier(t.level)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 whitespace-nowrap ${
                selectedTier === t.level
                  ? `${t.color} shadow-lg scale-105`
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>{t.badge}</span>
            </button>
          ))}
        </div>

        {/* Current Tier Sub-Items Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentTier.items.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePillar === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActivePillar(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md border-amber-300'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <div>
                  <div className="text-xs font-extrabold leading-none">{tab.label}</div>
                  <div className={`text-[9px] font-mono mt-0.5 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


