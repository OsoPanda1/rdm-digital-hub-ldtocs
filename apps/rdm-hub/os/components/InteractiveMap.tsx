'use client';
import React, { useState } from 'react';
import { POINTS_OF_INTEREST, SELF_GUIDED_ROUTES } from '../data/realDelMonteData';
import { POI, SelfGuidedRoute } from '../types';
import { MapPin, Navigation, Volume2, Clock, DollarSign, Mountain, CheckCircle2, Play, Pause } from 'lucide-react';

interface InteractiveMapProps {
  selectedPoiId: string | null;
  onSelectPoi: (poi: POI) => void;
  activeRoute: SelfGuidedRoute | null;
  onSelectRoute: (route: SelfGuidedRoute | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedPoiId,
  onSelectPoi,
  activeRoute,
  onSelectRoute
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const poiCategories = ['Todos', 'Mina & Patrimonio', 'Gastronomía & Pastes', 'Templo & Leyenda', 'Mirador & Naturaleza'];

  const filteredPois = activeCategory === 'Todos'
    ? POINTS_OF_INTEREST
    : POINTS_OF_INTEREST.filter(p => p.category === activeCategory);

  const currentPoi = POINTS_OF_INTEREST.find(p => p.id === selectedPoiId) || POINTS_OF_INTEREST[0];

  // Map coordinate projection helper to canvas percentage (bounds for Real del Monte area)
  // Lat range ~20.138 to 20.162, Lng range ~ -98.676 to -98.658
  const projectCoords = (coords: { lat: number; lng: number }) => {
    const minLat = 20.135;
    const maxLat = 20.165;
    const minLng = -98.678;
    const maxLng = -98.656;

    const y = 100 - ((coords.lat - minLat) / (maxLat - minLat)) * 100;
    const x = ((coords.lng - minLng) / (maxLng - minLng)) * 100;

    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-4 h-4" />
            Mapa Georreferenciado & Explorador RDM GeoExplorer
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            Exploración Territorial de Real del Monte (2,760 msnm)
          </h3>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {poiCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas Container (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 relative h-[420px] overflow-hidden shadow-inner flex items-center justify-center group">
          {/* Topographic Grid Lines Simulation */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#f59e0b 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px'
            }}
          />

          {/* Contour elevation line art styling */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 50 Q 150 20 300 80 T 600 50" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 50 180 Q 200 120 400 220 T 700 150" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <path d="M 10 320 Q 250 250 500 350 T 800 300" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" />
          </svg>

          {/* Active Route Path Line Overlay */}
          {activeRoute && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <polyline
                points={POINTS_OF_INTEREST
                  .filter(p => activeRoute.poiIds.includes(p.id))
                  .map(p => {
                    const projected = projectCoords(p.coords);
                    return `${projected.x * 4.5},${projected.y * 3.8}`; // Scale approximation
                  })
                  .join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>Zona Central Real del Monte</span>
            {activeRoute && (
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                Ruta Activa: {activeRoute.title}
              </span>
            )}
          </div>

          {/* Interactive POI Markers */}
          {filteredPois.map((poi) => {
            const projected = projectCoords(poi.coords);
            const isSelected = selectedPoiId === poi.id;
            const isInActiveRoute = activeRoute?.poiIds.includes(poi.id);

            return (
              <button
                key={poi.id}
                onClick={() => onSelectPoi(poi)}
                style={{ top: `${projected.y}%`, left: `${projected.x}%` }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group/marker ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className="relative">
                  {/* Ping Animation for Selected Marker */}
                  {isSelected && (
                    <span className="animate-ping absolute -inset-2 rounded-full bg-emerald-400 opacity-75" />
                  )}

                  <div className={`p-2 rounded-full border shadow-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30'
                      : isInActiveRoute
                      ? 'bg-amber-500 text-slate-950 border-white'
                      : 'bg-slate-900 text-amber-400 border-slate-700 hover:border-amber-400'
                  }`}>
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>

                  {/* Marker Hover/Selected Tooltip */}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl pointer-events-none transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover/marker:opacity-100'
                  }`}>
                    {poi.name}
                    <span className="text-amber-400 font-mono block text-[9px]">{poi.altitudeMeters} msnm</span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Map Controls & Reset Route */}
          {activeRoute && (
            <button
              onClick={() => onSelectRoute(null)}
              className="absolute bottom-3 left-3 z-20 bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-800 transition-colors"
            >
              ✕ Desactivar Trazado de Ruta
            </button>
          )}
        </div>

        {/* Selected POI Detail Sidebar Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900 border border-slate-800">
              <img src={currentPoi.image} alt={currentPoi.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentPoi.category}
                </span>
                <span className="bg-slate-900/90 text-amber-400 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                  ⚡ {currentPoi.altitudeMeters} m.s.n.m.
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white font-serif">{currentPoi.name}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentPoi.fullDesc}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Duración: {currentPoi.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Costo: {currentPoi.entranceFee}</span>
              </div>
            </div>

            {/* Audio Guide Simulator */}
            {currentPoi.audioGuideTitle && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    Audioguía Oficial
                  </span>
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 italic">"{currentPoi.audioGuideTitle}"</p>
                {isPlayingAudio && (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono animate-pulse">
                    <span>🔊 Reproduciendo audio histórico...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Destacados</span>
            <div className="flex flex-wrap gap-1.5">
              {currentPoi.highlights.map(h => (
                <span key={h} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
