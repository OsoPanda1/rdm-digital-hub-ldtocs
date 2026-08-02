'use client';
import React, { useState } from 'react';
import { REAL_DEL_MONTE_POIS, ECOTOURISM_SPOTS, TOURIST_PARKINGS, GUIDED_TOURS, MYTHS_AND_LEGENDS } from '../data/modulesData';
import { POINTS_OF_INTEREST } from '../data/realDelMonteData';
import { MapPin, Compass, Utensils, Landmark, Sparkles, Car, Ticket, BookOpen, Star, ChevronRight, CloudFog, ShieldCheck, Footprints, Heart, Camera, Radio } from 'lucide-react';

interface TouristMainShowcaseProps {
  onNavigateToTab: (pillar: string) => void;
}

export const TouristMainShowcase: React.FC<TouristMainShowcaseProps> = ({ onNavigateToTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'ecoturismo' | 'gastronomia' | 'historia' | 'leyendas' | 'museos' | 'estacionamientos' | 'recorridos'>('todos');
  const [selectedTour, setSelectedTour] = useState<any | null>(null);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Welcome Header - TripAdvisor / Expedia style */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 p-6 sm:p-10 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full opacity-20 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow">
            <Compass className="w-4 h-4 text-amber-400" />
            Primer Plano — Guía Oficial del Turista • Real del Monte Pueblo Mágico
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight leading-tight">
            Descubre Real del Monte:
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 mt-1">
              Neblina, Pastes, Minas & Leyendas Córnicas
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl font-sans">
            A 2,760 m.s.n.m. en la Comarca Minera de Hidalgo, vive la fusión anglo-mexicana: el origen del fútbol y del paste en México, bosques de oyamel con neblina mística y la calidez de sus artesanos.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-amber-400 text-lg font-extrabold font-serif block">2,760 m</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Altitud de Montaña</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-emerald-400 text-lg font-extrabold font-serif block">11°C</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Clima Fresco & Neblina</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-sky-400 text-lg font-extrabold font-serif block">4.9 ★</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Rating TripAdvisor</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-rose-400 text-lg font-extrabold font-serif block">1766</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Primer Huelga Minera</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Category Quick Selector Bar */}
      <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          onClick={() => setSelectedCategory('todos')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'todos' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🌟 Todo Real del Monte
        </button>
        <button
          onClick={() => setSelectedCategory('ecoturismo')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'ecoturismo' ? 'bg-emerald-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🌲 Ecoturismo & Naturaleza
        </button>
        <button
          onClick={() => setSelectedCategory('gastronomia')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'gastronomia' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🥧 Gastronomía & Pastes
        </button>
        <button
          onClick={() => setSelectedCategory('historia')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'historia' ? 'bg-sky-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          ⛏️ Historia & Cultura
        </button>
        <button
          onClick={() => setSelectedCategory('leyendas')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'leyendas' ? 'bg-purple-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          👻 Mitos & Leyendas
        </button>
        <button
          onClick={() => setSelectedCategory('museos')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'museos' ? 'bg-indigo-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🏛️ Museos de Sitio
        </button>
        <button
          onClick={() => setSelectedCategory('estacionamientos')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'estacionamientos' ? 'bg-rose-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🅿️ Estacionamientos
        </button>
        <button
          onClick={() => setSelectedCategory('recorridos')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            selectedCategory === 'recorridos' ? 'bg-yellow-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🚌 Recorridos Turísticos
        </button>
      </div>

      {/* Section 1: Real-time Parking Availability (Estacionamientos) */}
      {(selectedCategory === 'todos' || selectedCategory === 'estacionamientos') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-serif">
                  Estacionamientos en Tiempo Real (Cupo & Ubicación)
                </h2>
                <p className="text-xs text-slate-400">
                  Monitoreo satelital de lugares disponibles para autos y autobuses turísticos
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOURIST_PARKINGS.map(parking => (
              <div key={parking.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white font-serif">{parking.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                    parking.occupancyStatus === 'Disponible' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    parking.occupancyStatus === 'Moderado' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {parking.occupancyStatus}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Lugares libres:</span>
                    <strong className="text-amber-400 font-mono">{parking.spacesAvailable} / {parking.totalCapacity}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Tarifa por hora:</span>
                    <strong className="text-white font-mono">${parking.hourlyRateMXN} MXN</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">📍 {parking.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Ecotourism Highlights */}
      {(selectedCategory === 'todos' || selectedCategory === 'ecoturismo') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-serif">
                  Ecoturismo & Bosques de Oyamel
                </h2>
                <p className="text-xs text-slate-400">
                  Senderismo, tirolesas, presas y miradores a más de 2,800 msnm
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ECOTOURISM_SPOTS.map(spot => (
              <div key={spot.id} className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group">
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {spot.difficulty}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white font-serif">{spot.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{spot.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Precio entrada:</span>
                      <strong className="text-emerald-400 font-bold">${spot.feeMXN} MXN</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {spot.activities.map((act, i) => (
                        <span key={i} className="text-[9px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Myths & Legends (Mitos y Leyendas) */}
      {(selectedCategory === 'todos' || selectedCategory === 'leyendas') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-serif">
                  Mitos, Leyendas & Apariciones Mineras
                </h2>
                <p className="text-xs text-slate-400">
                  Relatos populares que cobraron vida en las noches de callejoneada y neblina
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('media')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              Escuchar Podcasts
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MYTHS_AND_LEGENDS.map(myth => (
              <div key={myth.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-3 shadow-xl hover:border-purple-500/40 transition-all">
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  📍 {myth.location}
                </span>
                <h3 className="text-base font-bold text-white font-serif">{myth.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{myth.story}</p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-mono">
                  Época: {myth.era}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Guided Tours (Recorridos Turísticos) */}
      {(selectedCategory === 'todos' || selectedCategory === 'recorridos') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-serif">
                  Recorridos Turísticos & Turibús Histórico
                </h2>
                <p className="text-xs text-slate-400">
                  Paseos guiados por minas, tiroteos de ópera, cementerio británico y degustaciones
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUIDED_TOURS.map(tour => (
              <div key={tour.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-mono font-bold">⏱️ {tour.duration}</span>
                    <span className="text-lg font-bold text-white font-mono">${tour.priceMXN} MXN</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">{tour.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{tour.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <span className="text-[11px] text-slate-400 font-mono block">Horarios: {tour.schedule}</span>
                  <button
                    onClick={() => setSelectedTour(tour)}
                    className="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    Reservar Lugar en Recorrido (${tour.priceMXN} MXN)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservation Confirmation Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedTour(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              ✕
            </button>
            <h3 className="text-lg font-bold text-white font-serif">Reserva de Recorrido Turístico</h3>
            <p className="text-xs text-slate-300">{selectedTour.title}</p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Precio por persona:</span>
                <span className="text-white font-bold">${selectedTour.priceMXN} MXN</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Punto de Salida:</span>
                <span className="text-amber-400 font-bold">Plaza Principal RDM</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('¡Reserva confirmada! Se ha enviado tu boleto digital.');
                setSelectedTour(null);
              }}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs cursor-pointer shadow-lg"
            >
              Confirmar y Pagar Boleto Online
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
