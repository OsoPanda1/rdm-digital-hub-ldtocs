'use client';
import React, { useState, useEffect } from 'react';
import { TAMV_LAYERS } from '../data/realDelMonteData';
import { SystemEvent } from '../types';
import { Activity, Cpu, Shield, Database, Hash, Radio, Plus, RefreshCw, CheckCircle, Lock, Key, CreditCard, ShieldCheck, Sparkles, FileText } from 'lucide-react';

export const TamvKernelView: React.FC = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [accessCode, setAccessCode] = useState<string>('');
  const [accessError, setAccessError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching system events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchEvents();
    }
  }, [isUnlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === 'ADMIN' || accessCode.trim().toUpperCase() === 'INSTITUCIONAL' || accessCode.length >= 4) {
      setIsUnlocked(true);
      setAccessError(null);
    } else {
      setAccessError('Llave de acceso no válida. Ingrese una llave institucional activa.');
    }
  };

  const handleSimulateEvent = () => {
    const newEvt: SystemEvent = {
      id: `evt_sim_${Date.now()}`,
      timestamp: new Date().toISOString(),
      layer: 'Capa 2: Experiencia XR',
      source: 'GeoExplorer Edge Node',
      type: 'TOURIST_INTERACTION_PING',
      payload: { poiId: 'poi-panteon-ingles', altitude: 2800, userAgent: 'RDM-PWA-Soberano' },
      hash: Math.random().toString(16).slice(2, 18)
    };

    setEvents(prev => [newEvt, ...prev]);
  };

  if (!isUnlocked) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto py-6">
        {/* Institutional Lock Hero Card */}
        <div className="bg-pearl-card rounded-3xl p-8 border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-amber-400 shadow-xl border border-amber-500/40">
              <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300 uppercase tracking-widest">
              Acceso Restringido • Telemetría & Kernel TAMV OS
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif">
              Métricas, API & Documentación Técnica Acreditada
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              El acceso a los kernels de infraestructura, logs en tiempo real, especificaciones de la API soberana y telemetría de Real del Monte está reservado a <strong>administradores, instituciones públicas y desarrolladores autorizados</strong>.
            </p>

            {/* Form Access Code */}
            <form onSubmit={handleUnlock} className="w-full max-w-md pt-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Ingrese Llave Institucional o Código ADMIN"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 px-4 py-3 rounded-2xl text-slate-900 font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow-lg cursor-pointer"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  Acceder
                </button>
              </div>

              {accessError && (
                <p className="text-xs text-rose-600 font-semibold">{accessError}</p>
              )}
            </form>

            <div className="pt-6 border-t border-slate-200 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-left">
                ¿No cuenta con una llave? Puede solicitar la licencia de acceso institucional a APIs.
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-crystal px-5 py-2.5 rounded-xl text-slate-900 font-black text-xs flex items-center gap-2 border-amber-500/50 shadow-md cursor-pointer hover:border-amber-500"
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                Adquirir Licencia API ($1,200 MXN / Año)
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pearl-card p-6 rounded-3xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h4 className="font-bold text-slate-900 font-serif text-sm">Gobernanza Institucional</h4>
            <p className="text-xs text-slate-600">Acceso a auditorías de Nodo Cero, sincronización de comercio y actas municipales digitalizadas.</p>
          </div>

          <div className="bg-pearl-card p-6 rounded-3xl border border-slate-200 space-y-2">
            <FileText className="w-6 h-6 text-sky-600" />
            <h4 className="font-bold text-slate-900 font-serif text-sm">Documentación OpenAPI 3.0</h4>
            <p className="text-xs text-slate-600">Endpoints REST & GraphQL para consulta de POIs, ocupación de estacionamientos e impuestos turísticos.</p>
          </div>

          <div className="bg-pearl-card p-6 rounded-3xl border border-slate-200 space-y-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h4 className="font-bold text-slate-900 font-serif text-sm">ISABELLA AI API Access</h4>
            <p className="text-xs text-slate-600">Integración directa con el modelo conversacional para guías virtuales de turismo municipal.</p>
          </div>
        </div>

        {/* Modal Pago Licencia */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-pearl-card max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-5 text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold font-serif text-base">Licencia API Institucional RDM</h3>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Obtenga credenciales de desarrollo y llaves de acceso a las 7 capas del Kernel TAMV OS para Real del Monte.
                </p>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>Suscripción Anual Desarrollador/Gob.</span>
                    <span className="text-amber-700">$1,200 MXN</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1">
                    <li>Llaves de API ilimitadas</li>
                    <li>Soporte técnico preferente</li>
                    <li>Acceso al Bus de Eventos en tiempo real</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setIsUnlocked(true);
                    setShowPaymentModal(false);
                  }}
                  className="w-full py-3 bg-slate-950 text-amber-400 font-black rounded-2xl text-xs uppercase tracking-wider border border-amber-500/40 shadow-xl cursor-pointer hover:bg-slate-900"
                >
                  Simular Pago Cattleya Pay & Desbloquear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Acceso Autorizado • Credencial Institucional Activa
          </div>

          <button
            onClick={() => setIsUnlocked(false)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
          >
            <Lock className="w-3 h-3" /> Bloquear Sesión
          </button>
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Monitor de Infraestructura Soberana & Event Store en Vivo
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real del Monte opera como Nodo Cero con tolerancia a fallos, procesamiento event-driven por stream y registros transaccionales criptográficamente auditables.
          </p>
        </div>
      </div>

      {/* 7-Layer Federation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-lg">
            <Cpu className="w-5 h-5 text-amber-600" />
            Estructura de Capas (Capa 0 a Capa 7)
          </div>
          <span className="text-xs text-slate-500 font-mono">Kernel v2.4-Soberano • Self-Hosted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TAMV_LAYERS.map((layer) => {
            const isSelected = selectedLayerIndex === layer.layerNumber;

            return (
              <div
                key={layer.layerNumber}
                onClick={() => setSelectedLayerIndex(isSelected ? null : layer.layerNumber)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-slate-950 text-white border-amber-400 ring-2 ring-amber-400/50 shadow-xl'
                    : 'bg-pearl-card border-slate-200 text-slate-900 hover:border-amber-400'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-amber-100 text-amber-900 font-mono text-[10px] px-2 py-0.5 rounded-md font-black">
                      Capa {layer.layerNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      layer.status === 'OPERATIONAL'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {layer.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-serif leading-snug">{layer.title}</h4>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {layer.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2 text-[10px] font-mono">
                  <div className="flex flex-wrap gap-1">
                    {layer.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Store Live Stream Monitor */}
      <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xl text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              Stream Event Store & Bus de Eventos Auditables
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-950">
              Logs de Eventos del Kernel RDM Digital en Tiempo Real
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEvents}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Actualizar eventos"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingEvents ? 'animate-spin text-amber-600' : ''}`} />
            </button>
            <button
              onClick={handleSimulateEvent}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer border border-amber-500/30"
            >
              <Plus className="w-4 h-4" />
              Simular Evento
            </button>
          </div>
        </div>

        {/* Event List Table / Stream */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono hover:border-amber-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-600 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-amber-800 font-black">{evt.type}</span>
                  <span>• {evt.layer}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Hash className="w-3 h-3" /> {evt.hash.slice(0, 10)}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-800 flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-slate-500">Origen: <strong className="text-slate-900">{evt.source}</strong></span>
                <span className="text-slate-500">Payload: <code className="text-amber-900">{JSON.stringify(evt.payload)}</code></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

