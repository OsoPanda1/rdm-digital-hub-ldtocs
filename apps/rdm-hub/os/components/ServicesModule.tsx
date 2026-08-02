'use client';
import React, { useState } from 'react';
import { SERVICES_CATALOG } from '../data/modulesData';
import { ServiceListing } from '../types';
import { Wrench, ShieldCheck, Phone, CheckCircle2, Star, Clock, UserCheck, Send } from 'lucide-react';

export const ServicesModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [requestService, setRequestService] = useState<ServiceListing | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const categories = ['Todos', 'Guías de Montaña', 'Transporte & Mulas', 'Oficios & Mantenimiento', 'Fotografía & Tours'];

  const filteredServices = SERVICES_CATALOG.filter(service => {
    return selectedCategory === 'Todos' || service.category === selectedCategory;
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setRequestService(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-emerald-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            Catálogo de Servicios Prácticos & Guías Locales
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Oficios, Guías de Montaña & Transportes Certificados
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Conecta directamente con guías mineros experimentados, transporte 4x4 en El Cedral, mantenimientos rústicos y oficios certificados por la red comunitaria TAMV.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-400 text-slate-950 font-extrabold shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List of Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {service.category}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  ${service.hourlyRateMXN} MXN / hr
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={service.image}
                  alt={service.providerName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white font-serif">{service.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                    {service.providerName}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {service.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {service.rating} ({service.completedJobs} trabajos)
                </span>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                  {service.availability}
                </span>
              </div>

              <button
                onClick={() => setRequestService(service)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                Solicitar Servicio Directo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Request Modal */}
      {requestService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setRequestService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white font-serif">
              Solicitud de Servicio: {requestService.title}
            </h3>

            {requestSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold">¡Solicitud enviada con éxito!</p>
                <p className="text-[11px] text-slate-300">
                  {requestService.providerName} te contactará a través de la red soberana en menos de 15 minutos.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre o Identificador"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Teléfono o WhatsApp"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles del servicio (Fecha, número de personas, requerimientos especiales)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Confirmar Solicitud ($0 Comisión Intermediaria)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
