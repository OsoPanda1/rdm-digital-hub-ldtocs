'use client';
import React, { useState } from 'react';
import { POINTS_OF_INTEREST, ARTISAN_SHOPS } from '../data/realDelMonteData';
import { GASTRONOMY_SPOTS } from '../data/modulesData';
import { MapPin, Layers, Sun, Moon, CloudFog, Navigation, Filter, Info, ChevronRight, X } from 'lucide-react';

export const FullScreenMapModule: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'turismo' | 'gastronomia' | 'comercio'>('all');
  const [weatherMode, setWeatherMode] = useState<'dia' | 'noche' | 'neblina'>('neblina');
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  const pois = activeLayer === 'all' || activeLayer === 'turismo' ? POINTS_OF_INTEREST : [];
  const gastronomy = activeLayer === 'all' || activeLayer === 'gastronomia' ? GASTRONOMY_SPOTS : [];
  const shops = activeLayer === 'all' || activeLayer === 'comercio' ? ARTISAN_SHOPS : [];


  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Control Bar */}
      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Capas del Mapa:
          </span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeLayer === 'all' ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Todas las Capas
          </button>
          <button
            onClick={() => setActiveLayer('turismo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeLayer === 'turismo' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Atractivos & Minas
          </button>
          <button
            onClick={() => setActiveLayer('gastronomia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeLayer === 'gastronomia' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Pastes & Gastronomía
          </button>
          <button
            onClick={() => setActiveLayer('comercio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeLayer === 'comercio' ? 'bg-purple-400 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Comercios & Platería
          </button>
        </div>

        {/* Atmosphere selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setWeatherMode('dia')}
            className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
              weatherMode === 'dia' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
            title="Vista Día"
          >
            <Sun className="w-3.5 h-3.5" />
            Día
          </button>
          <button
            onClick={() => setWeatherMode('neblina')}
            className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
              weatherMode === 'neblina' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
            }`}
            title="Atmósfera de Neblina"
          >
            <CloudFog className="w-3.5 h-3.5" />
            Neblina
          </button>
          <button
            onClick={() => setWeatherMode('noche')}
            className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
              weatherMode === 'noche' ? 'bg-indigo-500 text-white' : 'text-slate-400'
            }`}
            title="Vista Noche"
          >
            <Moon className="w-3.5 h-3.5" />
            Noche
          </button>
        </div>
      </div>

      {/* Map Canvas Canvas Container */}
      <div className={`relative h-[600px] w-full rounded-3xl border border-slate-800 overflow-hidden shadow-2xl transition-all duration-700 ${
        weatherMode === 'noche' ? 'bg-slate-950' : weatherMode === 'neblina' ? 'bg-slate-900/90' : 'bg-slate-800'
      }`}>
        {/* Background Atmosphere Overlays */}
        {weatherMode === 'neblina' && (
          <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-[2px] pointer-events-none z-10 animate-pulse duration-[4000ms]" />
        )}

        {/* Grid Map Vector Mock Background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Interactive Pin Layer */}
        <div className="relative z-20 w-full h-full p-8 flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full border border-slate-800/80 rounded-2xl bg-slate-950/60 p-6 flex items-center justify-center">
            <p className="absolute top-4 left-4 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              Coordenadas: 20.1386° N, 98.6738° W • Altitud 2,760m
            </p>

            {/* Render POI Pins */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-2xl">
              {pois.map((poi, idx) => (
                <button
                  key={poi.id}
                  onClick={() => setSelectedPin({ ...poi, layerType: 'Atractivo' })}
                  className="p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all hover:scale-105 cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">Atractivo</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-serif group-hover:text-amber-300">{poi.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{poi.shortDesc}</p>
                </button>
              ))}

              {gastronomy.map((gast) => (
                <button
                  key={gast.id}
                  onClick={() => setSelectedPin({ ...gast, layerType: 'Gastronomía' })}
                  className="p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all hover:scale-105 cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Gastronomía</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-serif group-hover:text-emerald-300">{gast.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{gast.specialty}</p>
                </button>
              ))}

              {shops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => setSelectedPin({ ...shop, layerType: 'Comercio' })}
                  className="p-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition-all hover:scale-105 cursor-pointer shadow-lg space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">Comercio</span>
                  </div>
                  <h4 className="text-xs font-bold text-white font-serif group-hover:text-purple-300">{shop.name}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{shop.address}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Popup Modal */}
        {selectedPin && (
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 z-30 bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-400 border border-slate-800">
                {selectedPin.layerType}
              </span>
              <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-white font-serif">{selectedPin.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPin.fullDesc || selectedPin.description || selectedPin.specialty || selectedPin.shortDesc}
            </p>

            <button
              onClick={() => setSelectedPin(null)}
              className="w-full py-2 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
            >
              Cerrar Ficha
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
