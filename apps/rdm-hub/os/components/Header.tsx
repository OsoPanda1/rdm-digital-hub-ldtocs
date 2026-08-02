'use client';
import React, { useState } from 'react';
import { ActivePillar, UserRoleMode, AppLanguage } from '../types';
import { CloudFog, ShieldCheck, ShoppingBag, Radio, Sparkles, MapPin, BookOpen, Globe, User, Lock, Heart, CreditCard } from 'lucide-react';

interface HeaderProps {
  activePillar: ActivePillar;
  setActivePillar: (pillar: ActivePillar) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenDonation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePillar,
  setActivePillar,
  cartCount,
  onOpenCart,
  onOpenDonation
}) => {
  const [userRole, setUserRole] = useState<UserRoleMode>('Turista');
  const [lang, setLang] = useState<AppLanguage>('ES');

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-2xl">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Plataforma Soberana • Pueblo Mágico
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Real del Monte, Hgo. (2,760 msnm)
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:flex items-center gap-1 text-sky-300">
            <CloudFog className="w-3.5 h-3.5 text-sky-400" />
            11°C • Clima de Montaña
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* User Role Selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-700/80 text-amber-300 font-medium">
            <User className="w-3 h-3 text-amber-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRoleMode)}
              className="bg-transparent text-amber-300 focus:outline-none text-[11px] font-bold cursor-pointer"
            >
              <option value="Turista" className="bg-slate-900 text-slate-100">Modo Turista</option>
              <option value="Ciudadano" className="bg-slate-900 text-slate-100">Modo Ciudadano</option>
              <option value="Operador Cívico" className="bg-slate-900 text-slate-100">Modo Operador Cívico</option>
              <option value="Auditor TAMV" className="bg-slate-900 text-slate-100">Modo Admin / Institucional</option>
            </select>
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ES' ? 'EN' : 'ES')}
            className="flex items-center gap-1 btn-crystal-dark px-2.5 py-0.5 rounded-lg text-[11px] text-slate-200 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-sky-400" />
            {lang}
          </button>

          <span className="bg-slate-900 px-2 py-0.5 rounded text-[11px] border border-slate-800 text-slate-400 font-mono hidden md:inline">
            Acreditación L1-L4
          </span>

          {/* Donation Quick Button */}
          {onOpenDonation && (
            <button
              onClick={onOpenDonation}
              className="px-2.5 py-0.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer shadow-md"
            >
              <Heart className="w-3 h-3 fill-white" />
              Donar
            </button>
          )}

          <button
            onClick={() => setActivePillar('isabella')}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ISABELLA AI
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActivePillar('tourist-showcase')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-slate-900 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg tracking-wider">
                RDM
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-serif">
                  REAL DEL MONTE <span className="text-amber-400 font-sans font-extrabold">DIGITAL</span>
                </h1>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase tracking-wider">
                  Blanco Perlado
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Ecosistema Turístico, Comercial & Patrimonial RDM
              </p>
            </div>
          </div>

          {/* Mobile Cart Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl btn-crystal-dark text-slate-200"
              title="Carrito Cattleya Pay"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Action Navigation Buttons with Crystal Clear & Iridescent Glow */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActivePillar('tourist-showcase')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'tourist-showcase'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300 ring-2 ring-amber-400/50'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            🌟 Inicio Turístico
          </button>

          <button
            onClick={() => setActivePillar('turismo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'turismo'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            📍 Rutas & Atractivos
          </button>

          <button
            onClick={() => setActivePillar('comercio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'comercio'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            🛍️ Comercio & Tienda
          </button>

          <button
            onClick={() => setActivePillar('pagos-p2p')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'pagos-p2p'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            💳 Pagos P2P & Negocios
          </button>

          <button
            onClick={() => setActivePillar('chat-meet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'chat-meet'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            💬 Google Chat & Meet
          </button>

          <button
            onClick={() => setActivePillar('media')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activePillar === 'media'
                ? 'bg-amber-400 text-slate-950 font-black shadow-lg border border-amber-300'
                : 'btn-crystal-dark text-slate-200'
            }`}
          >
            📻 Podcasts & Media
          </button>

          <button
            onClick={() => setActivePillar('kernel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              activePillar === 'kernel'
                ? 'bg-indigo-600 text-white font-extrabold shadow-md'
                : 'bg-slate-900/90 text-amber-400/90 border-slate-700/80 hover:border-amber-500'
            }`}
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <Radio className="w-3.5 h-3.5" />
            Métricas & APIs (Lock)
          </button>

          {/* Desktop Cart Button */}
          <button
            onClick={onOpenCart}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl btn-crystal-dark text-amber-300 border-amber-500/40 text-xs font-extrabold ml-1"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Cattleya Pay
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

