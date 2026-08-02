'use client';
import React, { useState } from 'react';
import { POINTS_OF_INTEREST, SELF_GUIDED_ROUTES, TRADITIONAL_EVENTS } from '../data/realDelMonteData';
import { ROUTE_ELEVATION_DATA, HOURLY_HEATMAP_DATA } from '../data/chartData';
import { POI, SelfGuidedRoute } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { Map, Footprints, Calendar, CloudFog, Compass, Sparkles, CheckCircle2, ArrowRight, Mountain, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const GeoExplorerPillar: React.FC = () => {
  const [selectedPoi, setSelectedPoi] = useState<POI>(POINTS_OF_INTEREST[0]);
  const [activeRoute, setActiveRoute] = useState<SelfGuidedRoute | null>(SELF_GUIDED_ROUTES[0]);

  const handleSelectRoute = (route: SelfGuidedRoute | null) => {
    setActiveRoute(route);
    if (route && route.poiIds.length > 0) {
      const poi = POINTS_OF_INTEREST.find(p => p.id === route.poiIds[0]);
      if (poi) setSelectedPoi(poi);
    }
  };

  const elevationPoints = activeRoute ? ROUTE_ELEVATION_DATA[activeRoute.id] || ROUTE_ELEVATION_DATA['ruta-plata-minas'] : ROUTE_ELEVATION_DATA['ruta-plata-minas'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 p-6 sm:p-8 border border-emerald-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Map className="w-3.5 h-3.5" />
            Pilar 2.2 — RDM Turismo (GeoExplorer & Rutas Autoguiadas)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Patrimonio, Georreferenciación & Rutas de la Comarca Minera
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Explora las minas históricas de plata, el Panteón Inglés, los parajes de oyamel del Cedral y los talleres tradicionales del Paste Hidalguense a 2,760 m.s.n.m.
          </p>
        </div>
      </div>

      {/* Real-time Mountain Weather Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <CloudFog className="w-6 h-6 text-sky-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Atmósfera</span>
            <span className="font-bold text-slate-200">Neblina & Chipichipi</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <Compass className="w-6 h-6 text-amber-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Altitud Media</span>
            <span className="font-bold text-amber-300 font-mono">2,760 m.s.n.m.</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <Sparkles className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Clima Térmico</span>
            <span className="font-bold text-emerald-300">11°C Fresco</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <Map className="w-6 h-6 text-indigo-400" />
          <div>
            <span className="text-slate-400 block text-[10px]">Estado Pueblo Mágico</span>
            <span className="font-bold text-indigo-300">Pueblo Mágico Activo</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Component */}
      <InteractiveMap
        selectedPoiId={selectedPoi.id}
        onSelectPoi={setSelectedPoi}
        activeRoute={activeRoute}
        onSelectRoute={handleSelectRoute}
      />

      {/* Recharts Elevation Profile & Visitor Heatmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Elevation Profile Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-serif">
                Perfil de Elevación & Altimetría (m.s.n.m.)
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
              {activeRoute ? activeRoute.title : 'Ruta Seleccionada'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Comportamiento de la altitud a lo largo del trayecto desde los 2,750 msnm hasta las cumbres de oyamel.
          </p>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={elevationPoints}>
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="locationName" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis domain={[2700, 2900]} stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(val: any) => [`${val} m.s.n.m.`, 'Altitud']}
                />
                <Area type="monotone" dataKey="altitudeMsnm" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#elevationGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Visitor Heatmap Bar Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-serif">
                Densidad Peatonal Horaria en Rutas
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
              Nodos Edge RDM
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Afluencia estimada de caminantes por hora en el Centro Histórico vs los parajes del Cedral.
          </p>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_HEATMAP_DATA}>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="peatonesCentro" name="Centro Histórico" fill="#facc15" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peatonesMinas" name="Mina de Acosta" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Self-Guided Routes Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              Itinerarios & Rutas Autoguiadas
            </h3>
            <p className="text-xs text-slate-400">
              Circuitos pedestres georreferenciados con audioguías e historia minera
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SELF_GUIDED_ROUTES.map((route) => {
            const isRouteActive = activeRoute?.id === route.id;

            return (
              <div
                key={route.id}
                className={`bg-slate-900 rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isRouteActive
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-950 relative">
                    <img src={route.headerImage} alt={route.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      {route.difficulty}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-serif leading-snug">{route.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{route.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>⏱️ {route.duration}</span>
                    <span>📍 {route.distanceKm} km</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRoute(isRouteActive ? null : route)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isRouteActive
                      ? 'bg-rose-900/80 text-rose-200 hover:bg-rose-800'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isRouteActive ? 'Desactivar Ruta' : 'Trazar en Mapa Interactivo'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traditional Events Calendar Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              Agenda de Eventos Tradicionales & Festivales
            </h3>
            <p className="text-xs text-slate-400">
              Fiestas patronales, festivales gastronómicos y callejonadas de leyendas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRADITIONAL_EVENTS.map((event) => (
            <div key={event.id} className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                  {event.category}
                </span>
                {event.isOfficial && (
                  <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Oficial RDM
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-base font-bold text-white font-serif leading-snug">{event.name}</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">📅 {event.dateStr}</p>
                <p className="text-xs text-slate-500 font-medium">📍 {event.locationName}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
