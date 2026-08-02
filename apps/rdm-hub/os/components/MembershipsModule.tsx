'use client';
import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/modulesData';
import { MembershipPlan } from '../types';
import { CreditCard, ShieldCheck, CheckCircle2, HeartHandshake, Sparkles, ChevronRight, Lock } from 'lucide-react';

export const MembershipsModule: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setSelectedPlan(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-indigo-500/30 shadow-2xl overflow-hidden text-center sm:text-left">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5" />
            Membresías Soberanas & Pasarela Cattleya Pay
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Planes de Membresía & Apoyo al Patrimonio Minero
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Suscríbete como explorador cultural o comerciante verificado para financiar directamente la restauración de fachadas, el mantenimiento de minas y la infraestructura digital soberana.
          </p>
        </div>
      </div>

      {/* Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_PLANS.map(plan => (
          <div
            key={plan.id}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${plan.badgeColor}`}>
                {plan.targetRole}
              </span>

              <div>
                <h3 className="text-xl font-bold text-white font-serif">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">${plan.monthlyFeeMXN}</span>
                  <span className="text-xs text-slate-400 font-mono">MXN / mes</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  O ${plan.annualFeeMXN} MXN / año (-17% ahorro)
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Beneficios Incluidos:
                </span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {plan.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                  Fondo de Conservación:
                </span>
                <span className="font-bold text-amber-300">{plan.heritageFundAllocationPercent}%</span>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                Suscribirme con Cattleya Pay
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              Checkout Seguro Cattleya Pay
            </div>

            <h3 className="text-xl font-bold text-white font-serif">{selectedPlan.name}</h3>

            {paymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="font-bold text-base">¡Membresía Activada!</p>
                <p className="text-[11px] text-slate-300">
                  Tu pase de socio cívico ha sido registrado en el ledger de Real del Monte.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Monto mensual:</span>
                    <span className="text-white font-bold">${selectedPlan.monthlyFeeMXN} MXN</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Aporte directo patrimonio:</span>
                    <span className="text-amber-400 font-bold">${(selectedPlan.monthlyFeeMXN * selectedPlan.heritageFundAllocationPercent / 100).toFixed(2)} MXN</span>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Nombre en la Tarjeta"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Número de Tarjeta / Cattleya Token"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="MM/AA"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                  <input
                    type="password"
                    required
                    placeholder="CVC"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  Confirmar Suscripción (${selectedPlan.monthlyFeeMXN} MXN/mes)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
