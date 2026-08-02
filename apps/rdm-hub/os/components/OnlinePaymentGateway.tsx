'use client';
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Sparkles, DollarSign, QrCode, ArrowRight, Building2, CheckCircle2, Copy, Receipt, Award, Calculator, ExternalLink, RefreshCw, Layers } from 'lucide-react';

interface PaymentTx {
  id: string;
  merchantName: string;
  merchantCategory: string;
  subtotal: number;
  platformFee: number;
  total: number;
  status: 'COMPLETADO' | 'PENDIENTE';
  date: string;
  paymentMethod: string;
}

export const OnlinePaymentGateway: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'checkout' | 'merchant-hub' | 'calculator'>('checkout');

  // Checkout Form State
  const [selectedMerchant, setSelectedMerchant] = useState<string>('Pastelería El Portal (Fundada 1928)');
  const [customMerchantName, setCustomMerchantName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('2x Pastes Tradicionales de Papa con Carne + 1x Café de Olla');
  const [baseAmount, setBaseAmount] = useState<number>(180);
  const [selectedMethod, setSelectedMethod] = useState<'cattleya' | 'card' | 'spei'>('cattleya');
  const [customerName, setCustomerName] = useState<string>('Visitante RDM');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Settlement & Transactions State
  const [transactions, setTransactions] = useState<PaymentTx[]>([
    {
      id: 'TX-RDM-8942',
      merchantName: 'Pastelería El Portal',
      merchantCategory: 'Gastronomía Tradicional',
      subtotal: 350.00,
      platformFee: 17.25, // 3.5% + $5
      total: 367.25,
      status: 'COMPLETADO',
      date: 'Hoy, 14:22 PM',
      paymentMethod: 'Cattleya Pay',
    },
    {
      id: 'TX-RDM-8941',
      merchantName: 'Mina de Acosta - Recorrido Guiado',
      merchantCategory: 'Turismo Histórico',
      subtotal: 500.00,
      platformFee: 22.50,
      total: 522.50,
      status: 'COMPLETADO',
      date: 'Hoy, 12:05 PM',
      paymentMethod: 'Tarjeta Crédito',
    },
    {
      id: 'TX-RDM-8940',
      merchantName: 'Joyería Minera La Plata',
      merchantCategory: 'Artesanías en Plata',
      subtotal: 1200.00,
      platformFee: 47.00,
      total: 1247.00,
      status: 'COMPLETADO',
      date: 'Ayer, 18:40 PM',
      paymentMethod: 'SPEI Digital',
    },
  ]);

  // Last completed transaction receipt modal or block
  const [lastReceipt, setLastReceipt] = useState<PaymentTx | null>(null);

  // Registered Local Businesses
  const merchants = [
    { name: 'Pastelería El Portal (Fundada 1928)', category: 'Gastronomía - Pastes' },
    { name: 'Mina de Acosta & Museo de Sitio', category: 'Turismo & Historia' },
    { name: 'Joyería Minera La Plata Real', category: 'Artesanías de Plata' },
    { name: 'Hotel Posada del Castillo', category: 'Hospedaje & Hotel' },
    { name: 'Restaurante El Minero de Altura', category: 'Gastronomía Regional' },
    { name: 'Guías de Montaña Peñas Cargadas', category: 'Ecoturismo' },
  ];

  // Fee calculation helper: 3.5% + $5.00 MXN platform fee
  const calculateFees = (amount: number) => {
    const feePercentage = 0.035;
    const fixedFee = 5.00;
    const fee = Math.round((amount * feePercentage + fixedFee) * 100) / 100;
    const merchantPayout = Math.round((amount) * 100) / 100;
    const grandTotal = Math.round((amount + fee) * 100) / 100;
    return { fee, merchantPayout, grandTotal };
  };

  const currentFees = calculateFees(baseAmount || 0);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseAmount || baseAmount <= 0) {
      alert('Ingresa un monto válido para procesar el pago.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const merchantToUse = customMerchantName.trim() || selectedMerchant;
      const { fee, grandTotal } = calculateFees(baseAmount);

      const newTx: PaymentTx = {
        id: `TX-RDM-${Math.floor(1000 + Math.random() * 9000)}`,
        merchantName: merchantToUse,
        merchantCategory: 'Comercio Local Verificado',
        subtotal: baseAmount,
        platformFee: fee,
        total: grandTotal,
        status: 'COMPLETADO',
        date: 'Ahora mismo',
        paymentMethod: selectedMethod === 'cattleya' ? 'Cattleya Pay' : selectedMethod === 'card' ? 'Tarjeta Bancaria' : 'SPEI Directo',
      };

      setTransactions([newTx, ...transactions]);
      setLastReceipt(newTx);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl overflow-hidden text-slate-100">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            Pasarela Digital de Pagos P2P & B2C Real del Monte
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Pagos Online entre Usuarios & Comercio Local
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Plataforma transparente de transferencias instantáneas para comercios, talleres de artesanía, restaurantes y servicios turísticos con cálculo automático de comisión de mantenimiento RDM Digital.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-pearl-card p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-2 shadow-sm">
        <button
          onClick={() => setActiveSubTab('checkout')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'checkout'
              ? 'bg-slate-950 text-amber-400 font-extrabold shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Procesar Pago Instantáneo
        </button>

        <button
          onClick={() => setActiveSubTab('merchant-hub')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'merchant-hub'
              ? 'bg-slate-950 text-emerald-400 font-extrabold shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-400" />
          Panel de Liquidaciones Comercios
        </button>

        <button
          onClick={() => setActiveSubTab('calculator')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'calculator'
              ? 'bg-slate-950 text-sky-400 font-extrabold shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Calculator className="w-4 h-4 text-sky-400" />
          Calculadora de Comisiones (3.5% + $5)
        </button>
      </div>

      {/* TAB 1: CHECKOUT ENGINE */}
      {activeSubTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-950 font-serif">
                Terminal Virtual de Pago P2P
              </h3>
              <p className="text-xs text-slate-600">
                Selecciona el comercio registrado o ingresa un vendedor para transferir directamente.
              </p>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Merchant Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  Negocio o Comercio Destino
                </label>
                <select
                  value={selectedMerchant}
                  onChange={(e) => {
                    setSelectedMerchant(e.target.value);
                    setCustomMerchantName('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                >
                  {merchants.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} — ({m.category})
                    </option>
                  ))}
                  <option value="CUSTOM">➕ Otro comercio no listado (Manual)</option>
                </select>

                {selectedMerchant === 'CUSTOM' && (
                  <input
                    type="text"
                    placeholder="Escribe el nombre del comercio local..."
                    value={customMerchantName}
                    onChange={(e) => setCustomMerchantName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 mt-2"
                  />
                )}
              </div>

              {/* Item Concept */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  Concepto o Descripción del Servicio/Producto
                </label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Ej: Consumo de pastes, recuerdo de plata, boleto de mina..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Amount & Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                    Monto Subtotal ($ MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">$</span>
                    <input
                      type="number"
                      value={baseAmount}
                      onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                    Nombre del Pagador
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cattleya')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedMethod === 'cattleya'
                        ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Cattleya Pay
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedMethod === 'card'
                        ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    Tarjeta Bancaria
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('spei')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedMethod === 'spei'
                        ? 'bg-slate-950 text-amber-400 border-amber-400 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-sky-500" />
                    SPEI QR Directo
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                {isProcessing
                  ? 'Autorizando Transferencia Segura...'
                  : `Pagar $${currentFees.grandTotal.toFixed(2)} MXN`}
              </button>
            </form>
          </div>

          {/* Breakdown & Receipt Side (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Fee Breakdown Box */}
            <div className="bg-slate-950 rounded-3xl border border-amber-500/40 p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Receipt className="w-4 h-4" />
                  Desglose Transparente de Tarifa
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                  RDM Platform Fee
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Monto Venta Negocio:</span>
                  <span className="font-bold text-white">${baseAmount.toFixed(2)} MXN</span>
                </div>

                <div className="flex justify-between text-amber-400 pt-1 border-t border-slate-800/80">
                  <span>Comisión RDM Digital (3.5% + $5):</span>
                  <span className="font-bold">+${currentFees.fee.toFixed(2)} MXN</span>
                </div>

                <div className="flex justify-between text-slate-400 text-[11px] italic pl-2 border-l-2 border-amber-500/40">
                  <span>↳ Mantenimiento & Servidores:</span>
                  <span>100% Sostenible</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-bold text-sm pt-2 border-t border-slate-800">
                  <span>Total a Pagar Visitante:</span>
                  <span>${currentFees.grandTotal.toFixed(2)} MXN</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Garantía de Soberanía RDM
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  El comercio recibe exactamente ${currentFees.merchantPayout.toFixed(2)} MXN sin retenciones sorpresivas.
                </p>
              </div>
            </div>

            {/* Last Transaction Receipt if available */}
            {lastReceipt && (
              <div className="bg-emerald-50 rounded-3xl border border-emerald-300 p-6 space-y-3 shadow-lg animate-fadeIn text-emerald-950">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ¡Pago Procesado Exitosamente!
                  </span>
                  <span className="font-mono text-[10px] text-emerald-800">{lastReceipt.id}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-950 text-sm">{lastReceipt.merchantName}</div>
                  <div className="text-slate-700">Monto Comercio: ${lastReceipt.subtotal.toFixed(2)} MXN</div>
                  <div className="text-slate-700 font-mono">Total Cobrado: ${lastReceipt.total.toFixed(2)} MXN</div>
                </div>

                <div className="pt-2 border-t border-emerald-200 text-[10px] text-emerald-900 font-mono flex items-center justify-between">
                  <span>Método: {lastReceipt.paymentMethod}</span>
                  <span>{lastReceipt.date}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MERCHANT HUB & SETTLEMENTS */}
      {activeSubTab === 'merchant-hub' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-2 shadow-md">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Procesado Comercio
              </span>
              <div className="text-3xl font-black text-slate-950 font-mono">$2,050.00 MXN</div>
              <p className="text-xs text-slate-500">Acumulado en transferencias directas</p>
            </div>

            <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-2 shadow-md">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Comisión Mantenimiento Plataforma
              </span>
              <div className="text-3xl font-black text-amber-800 font-mono">$86.75 MXN</div>
              <p className="text-xs text-slate-500">Mantenimiento de servidores RDM</p>
            </div>

            <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-2 shadow-md">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Abono Neto a Comercios
              </span>
              <div className="text-3xl font-black text-emerald-800 font-mono">$1,963.25 MXN</div>
              <p className="text-xs text-slate-500">Liquidación automática SPEI/Cattleya</p>
            </div>
          </div>

          {/* Historical Table */}
          <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-slate-950 font-serif">
              Historial de Transacciones & Liquidaciones P2P
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-2">ID Transacción</th>
                    <th className="py-3 px-2">Comercio</th>
                    <th className="py-3 px-2">Subtotal</th>
                    <th className="py-3 px-2">Comisión RDM</th>
                    <th className="py-3 px-2">Total Pagado</th>
                    <th className="py-3 px-2">Método</th>
                    <th className="py-3 px-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-3 px-2 font-mono font-bold text-slate-950">{tx.id}</td>
                      <td className="py-3 px-2 font-bold">{tx.merchantName}</td>
                      <td className="py-3 px-2 font-mono">${tx.subtotal.toFixed(2)}</td>
                      <td className="py-3 px-2 font-mono text-amber-800 font-bold">+${tx.platformFee.toFixed(2)}</td>
                      <td className="py-3 px-2 font-mono text-slate-950 font-black">${tx.total.toFixed(2)}</td>
                      <td className="py-3 px-2">{tx.paymentMethod}</td>
                      <td className="py-3 px-2">
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEE CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-bold text-slate-950 font-serif">Simulador de Comisión de Plataforma</h3>
            <p className="text-xs text-slate-600">
              Estructura transparente: 3.5% + $5.00 MXN para el sostenimiento autónomo de la infraestructura digital.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <label className="text-xs font-bold text-slate-900 block">Ingresa un Monto de Ejemplo ($ MXN)</label>
            <input
              type="number"
              value={baseAmount}
              onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
              className="w-full text-center text-3xl font-mono font-black py-3 rounded-xl bg-white border border-slate-300 text-slate-950 focus:outline-none focus:border-amber-500 shadow-inner"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Venta Negocio</span>
                <span className="text-lg font-bold text-slate-950 font-mono">${currentFees.merchantPayout.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Comisión RDM</span>
                <span className="text-lg font-bold text-amber-900 font-mono">+${currentFees.fee.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-950 text-white rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase block">Total Cliente</span>
                <span className="text-lg font-bold text-amber-300 font-mono">${currentFees.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
