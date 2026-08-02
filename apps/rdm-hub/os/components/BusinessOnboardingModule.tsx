'use client';
import React, { useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, ChevronRight, Upload, ExternalLink, Sparkles, Building2 } from 'lucide-react';

export const BusinessOnboardingModule: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState<string>('');
  const [category, setCategory] = useState<string>('Pastequería Tradicional');
  const [ownerName, setOwnerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [wantsMLSync, setWantsMLSync] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-sky-500/30 shadow-2xl overflow-hidden text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Store className="w-3.5 h-3.5" />
          Onboarding de Negocio & Digitalización Local
        </div>
        <h2 className="text-2xl font-extrabold text-white font-serif">
          Registra tu Establecimiento en la Red RDM Digital
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          Publica tus productos, pastes o artesanías en el mapa interactivo, la Tienda Nativa Soberana y sincroniza publicaciones de Mercado Libre.
        </p>
      </div>

      {submitted ? (
        <div className="bg-slate-900 p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-bold text-white font-serif">¡Solicitud de Registro Recibida!</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
            El Consejo Cívico RDM y la red Cattleya Pay han recibido la información de <span className="font-bold text-amber-300">{businessName}</span>. En un plazo máximo de 24 horas recibirás tu sello QR de Verificación Soberana.
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(1); }}
            className="px-6 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs cursor-pointer hover:bg-sky-300 transition-all"
          >
            Registrar Otro Negocio
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Step Tracker */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-mono">
            <span className={step >= 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}>1. Datos Básicos</span>
            <span className={step >= 2 ? 'text-amber-400 font-bold' : 'text-slate-500'}>2. Verificación RDM</span>
            <span className={step >= 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}>3. Sincronización & Mercado Libre</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Nombre Comercial del Negocio</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Pastequería La Tradición Minera"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Categoría Principal</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="Pastequería Tradicional">Pastequería Tradicional</option>
                    <option value="Platería & Taller">Platería & Taller</option>
                    <option value="Gastronomía & Café">Gastronomía & Café</option>
                    <option value="Hospedaje & Cabaña">Hospedaje & Cabaña</option>
                    <option value="Guías & Excursiones">Guías & Excursiones</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Nombre del Titular / Propietario</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Doña Beatriz Acosta"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  Siguiente: Verificación
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Teléfono o WhatsApp Comercial</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 771 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Dirección o Referencia Física en Real del Monte</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Portal Principal #12, Centro Histórico"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-2">
                  <Upload className="w-6 h-6 text-sky-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">Comprobante de Domicilio o Permiso Municipal (Opcional)</p>
                  <p className="text-[10px] text-slate-500">Formato PDF, PNG o JPG hasta 10MB</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/2 py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Siguiente: Catálogo
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Descripción Breve de tus Productos o Servicios</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Especialidad en pastes artesanales, plata ley .925..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <label className="flex items-center gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsMLSync}
                    onChange={(e) => setWantsMLSync(e.target.checked)}
                    className="rounded text-yellow-400 focus:ring-0"
                  />
                  <div>
                    <span className="font-bold block">Sincronizar con Mercado Libre</span>
                    <span className="text-[10px] text-slate-400">Permite enlace directo para envíos nacionales conservando la comisión del Fondo Patrimonial RDM.</span>
                  </div>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    Finalizar Registro
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
