'use client';
import React, { useState } from 'react';
import { AD_CAMPAIGN_DATA } from '../data/modulesData';
import { AdCampaign } from '../types';
import { Megaphone, ShieldCheck, Eye, MousePointerClick, TrendingUp, Plus, Send } from 'lucide-react';

export const AdsModule: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(AD_CAMPAIGN_DATA);
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [advertiser, setAdvertiser] = useState<string>('');
  const [format, setFormat] = useState<AdCampaign['format']>('Destacado en Mapa');
  const [budget, setBudget] = useState<number>(2000);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !advertiser) return;

    const newAd: AdCampaign = {
      id: `ad-${Date.now()}`,
      title,
      advertiser,
      format,
      status: 'Activa',
      impressions: 120,
      clicks: 8,
      ctrPercent: 6.6,
      budgetMXN: budget,
      spentMXN: 50,
      startDate: '2026-08-01',
      endDate: '2026-08-31'
    };

    setCampaigns([newAd, ...campaigns]);
    setShowCreate(false);
    setTitle('');
    setAdvertiser('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-yellow-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-yellow-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5" />
            Publicidad Ética & Promoción Comunitaria
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Panel de Anuncios & Métricas de Conversión
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Promociona eventos culturales, talleres de platería o tus especialidades gastronómicas en el mapa interactivo y directorio sin rastreo invasivo de datos.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white font-serif">Mis Campañas Activas ({campaigns.length})</h3>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          Crear Campaña Ética
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map(ad => (
          <div key={ad.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                  {ad.format}
                </span>
                <h4 className="text-base font-bold text-white font-serif mt-1">{ad.title}</h4>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
                {ad.status}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Anunciante: <span className="text-white font-bold">{ad.advertiser}</span>
            </p>

            <div className="grid grid-cols-3 gap-2 text-center bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Impresiones</span>
                <span className="text-sky-400 font-bold">{ad.impressions.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Clics</span>
                <span className="text-amber-400 font-bold">{ad.clicks.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CTR</span>
                <span className="text-emerald-400 font-bold">{ad.ctrPercent}%</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
              <span>Presupuesto: <strong className="text-white">${ad.budgetMXN} MXN</strong></span>
              <span>Invertido: <strong className="text-amber-300">${ad.spentMXN} MXN</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white font-serif">Nueva Campaña Ética</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nombre de la Campaña</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Promoción Paste de Manzana..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Nombre del Anunciante</label>
                <input
                  type="text"
                  required
                  value={advertiser}
                  onChange={(e) => setAdvertiser(e.target.value)}
                  placeholder="Ej. Pastequería El Portal"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Formato</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-yellow-400"
                >
                  <option value="Destacado en Mapa">Destacado en Mapa Interactivo</option>
                  <option value="Tarjeta de Experiencia">Tarjeta de Experiencia</option>
                  <option value="Banner Clima">Banner de Alerta Clima / Neblina</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Presupuesto (MXN)</label>
                <input
                  type="number"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                Lanzar Campaña Promocional
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
