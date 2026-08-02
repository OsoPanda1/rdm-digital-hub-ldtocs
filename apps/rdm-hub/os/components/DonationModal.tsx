'use client';
import React, { useState } from 'react';
import { Heart, ShieldCheck, Check, Sparkles, Copy, DollarSign, Building2, Landmark, Award, X, CreditCard, QrCode } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedCause, setSelectedCause] = useState<string>('patrimonio');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorMessage, setDonorMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cattleya' | 'spei'>('cattleya');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<{
    txHash: string;
    amount: number;
    cause: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  const causes = [
    {
      id: 'patrimonio',
      title: '🏛️ Conservación Mina Acosta & San Ramón',
      desc: 'Restauración de tiros mineros históricos del Siglo XIX y mantenimiento de museos de sitio.',
      icon: Landmark,
    },
    {
      id: 'artesanos',
      title: '🥧 Fondo de Apoyo a Pasteleros Tradicionales',
      desc: 'Becas para preservar la receta artesanal del paste y maquinaria sustentable para pequeños hornos.',
      icon: Award,
    },
    {
      id: 'ecologia',
      title: '🌲 Ecoturismo & Bosques de Peñas Cargadas',
      desc: 'Reforestación, señalización ecológica y conservación de senderos en el Pueblo Mágico.',
      icon: Building2,
    },
  ];

  const presets = [50, 100, 250, 500, 1000];

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      alert('Por favor ingresa un monto válido de donación.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompletedTx({
        txHash: `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`,
        amount: finalAmount,
        cause: causes.find((c) => c.id === selectedCause)?.title || 'Patrimonio RDM',
        date: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }),
      });
    }, 1200);
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    alert('Hash de la donación copiado al portapapeles');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleIn text-slate-900 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            Apoya al Pueblo Mágico de Real del Monte
          </div>
          <h2 className="text-2xl font-black text-slate-950 font-serif tracking-tight">
            Fondo de Conservación & Donaciones Directas
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tu contribución apoya directamente a los talleres artesanales de paste, la restauración de minas históricas y la infraestructura turística sostenible.
          </p>
        </div>

        {!completedTx ? (
          <form onSubmit={handleDonateSubmit} className="space-y-5">
            {/* Cause Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                1. Selecciona la Causa o Proyecto
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {causes.map((c) => {
                  const isSelected = selectedCause === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setSelectedCause(c.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-slate-950 text-white border-amber-400 shadow-lg'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs">{c.title}</div>
                        <div className={`text-[11px] leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {c.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                2. Selecciona o Ingresa el Monto ($ MXN)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {presets.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => {
                      setAmount(p);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      amount === p && !customAmount
                        ? 'bg-amber-400 text-slate-950 border-amber-500 font-extrabold shadow-md'
                        : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>

              <div className="relative pt-1">
                <span className="absolute left-3.5 top-3.5 text-xs font-bold text-slate-500">$</span>
                <input
                  type="number"
                  placeholder="Otro monto personalizado (MXN)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Donor Details */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                3. Datos del Donante (Opcional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tu Nombre / Organización"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="email"
                  placeholder="Correo para Recibo Digital"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Dedicatoria o mensaje para la comunidad (opcional)..."
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                4. Pasarela de Pago Segura
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cattleya')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'cattleya'
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Cattleya Pay
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Tarjeta Crédito/Déb
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('spei')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === 'spei'
                      ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-sky-500" />
                  SPEI / QR
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-slate-950 text-slate-950" />
              {isProcessing
                ? 'Procesando Donación Segura...'
                : `Realizar Donación de $${customAmount ? customAmount : amount} MXN`}
            </button>
          </form>
        ) : (
          /* Receipt View */
          <div className="space-y-5 text-center py-2 animate-fadeIn">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 border border-emerald-300 mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-950 font-serif">¡Muchas Gracias por tu Donación!</h3>
              <p className="text-xs text-slate-600">
                Tu generoso apoyo impulsa directamente la conservación de Real del Monte.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Monto Aportado:</span>
                <span className="font-bold text-slate-950 text-sm">${completedTx.amount} MXN</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Destino:</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{completedTx.cause}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Fecha & Hora:</span>
                <span className="text-slate-700">{completedTx.date}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Hash de Soberanía:</span>
                <button
                  type="button"
                  onClick={() => copyTxHash(completedTx.txHash)}
                  className="text-[10px] text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {completedTx.txHash}
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCompletedTx(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Hacer Otra Donación
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs cursor-pointer shadow-md"
              >
                Cerrar & Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
