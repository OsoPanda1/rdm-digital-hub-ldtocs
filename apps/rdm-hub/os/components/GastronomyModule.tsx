'use client';
import React, { useState } from 'react';
import { GASTRONOMY_SPOTS } from '../data/modulesData';
import { GastronomySpot } from '../types';
import { Utensils, ShieldCheck, Phone, MapPin, ExternalLink, Clock, Sparkles, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const GastronomyModule: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [certifiedOnly, setCertifiedOnly] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<GastronomySpot | null>(null);

  const types = ['Todos', 'Pastequería Histórica', 'Restaurante Minero', 'Fonda de Tradición', 'Café & Panadería'];

  const filteredSpots = GASTRONOMY_SPOTS.filter(spot => {
    const matchesType = selectedType === 'Todos' || spot.type === selectedType;
    const matchesCert = !certifiedOnly || spot.hasPasteCertificate;
    return matchesType && matchesCert;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            Módulo Gastronómico & Tradición Minera del Paste
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Directorio de Gastronomía & Pastequerías Certificadas
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Descubre las recetas heredadas de las familias mineras de Cornwall de 1824, el auténtico paste de papa con carne picada a mano y las fondas tradicionales de Real del Monte.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === type
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={certifiedOnly}
            onChange={(e) => setCertifiedOnly(e.target.checked)}
            className="rounded text-amber-400 focus:ring-0"
          />
          <Award className="w-4 h-4 text-amber-400" />
          Solo Paste Auténtico Certificado
        </label>
      </div>

      {/* Grid of Spots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSpots.map(spot => (
          <div
            key={spot.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={spot.image}
                alt={spot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {spot.hasPasteCertificate && (
                <div className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sello Paste Auténtico 1824
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-serif">
                <span className="font-bold text-base text-amber-300">{spot.name}</span>
                <span className="bg-slate-900/80 px-2 py-0.5 rounded text-amber-400 font-mono font-bold text-xs">
                  ★ {spot.rating}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {spot.address}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{spot.priceRange}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Especialidad: <span className="text-white font-medium">{spot.specialty}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {spot.recommendedDishes.map((dish, i) => (
                    <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                      • {dish}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {spot.hours}
                </div>

                <div className="flex items-center gap-2">
                  {spot.mercadoLibreLink && (
                    <a
                      href={spot.mercadoLibreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-[11px] font-bold border border-yellow-400/30 flex items-center gap-1 transition-all"
                    >
                      Mercado Libre
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedSpot(spot)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-md"
                  >
                    Ver Menú
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedSpot(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">{selectedSpot.name}</h3>
                <span className="text-xs text-amber-400 font-mono">{selectedSpot.type}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Establecimiento tradicional de Real del Monte con menú original y opción de entrega a domicilio.
            </p>

            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400">Platillos Recomendados:</h4>
              <ul className="space-y-1 text-xs text-slate-200">
                {selectedSpot.recommendedDishes.map((dish, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {dish}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3">
              <span className="text-slate-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                {selectedSpot.phone}
              </span>
              <button
                onClick={() => setSelectedSpot(null)}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
