'use client';
import React, { useState } from 'react';
import { CartItem, TransactionReceipt } from '../types';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2, Copy, Check } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cattleya Sovereign Ledger');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalHeritageFee = cartItems.reduce(
    (sum, item) => sum + (item.product.price * item.quantity * (item.product.heritageFundPercent / 100)),
    0
  );

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || isProcessing) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/cattleya/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          totalAmount,
          buyerName: buyerName.trim() || 'Visitante RDM',
          paymentMethod
        })
      });

      const data = await res.json();

      if (data.success) {
        setReceipt({
          orderId: data.orderId,
          txHash: data.txHash,
          buyerName: buyerName.trim() || 'Visitante RDM',
          totalAmount: data.totalAmount,
          heritageFee: data.heritageFee,
          items: [...cartItems],
          timestamp: data.timestamp,
          protocol: data.ledgerReceipt.protocol,
          sovereigntyProof: data.ledgerReceipt.sovereigntyProof
        });
        onClearCart();
      }
    } catch (err) {
      console.error('Error processing Cattleya Pay transaction:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cattleya Pay — Ledger Transaccional Soberano
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            Carrito de Comercio Local Real del Monte
          </h3>
        </div>

        {receipt ? (
          /* Printable / Verifiable Transaction Receipt */
          <div className="space-y-5 p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs">
            <div className="text-center space-y-2 pb-4 border-b border-slate-800">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white font-serif">¡Transacción Confirmada & Asentada!</h4>
              <p className="text-slate-400">Comprobante de Pago Cívico y Retribución Patrimonial</p>
            </div>

            <div className="space-y-2 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Orden ID:</span>
                <span className="text-amber-400 font-bold">{receipt.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prueba de Soberanía:</span>
                <span className="text-emerald-400 font-bold">{receipt.sovereigntyProof}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Hash de Transacción:</span>
                <button
                  onClick={() => handleCopyHash(receipt.txHash)}
                  className="text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  {receipt.txHash.slice(0, 12)}...
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comprador:</span>
                <span className="text-white">{receipt.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha/Hora:</span>
                <span className="text-slate-400">{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Artículos Adquiridos</span>
              {receipt.items.map(item => (
                <div key={item.product.id} className="flex justify-between text-slate-300">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span className="font-mono">${item.product.price * item.quantity} MXN</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-1">
              <div className="flex justify-between font-bold text-emerald-300">
                <span>Fondo de Conservación de Real del Monte:</span>
                <span className="font-mono">${receipt.heritageFee.toFixed(2)} MXN</span>
              </div>
              <p className="text-[10px] text-emerald-200/80 leading-relaxed">
                Reinvertido automáticamente en el Panteón Inglés y socavones de plata de la Mina de Acosta.
              </p>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
              <span className="text-sm font-bold text-white">Monto Total Liquidado:</span>
              <span className="text-xl font-extrabold text-amber-400 font-mono">${receipt.totalAmount} MXN</span>
            </div>

            <button
              onClick={() => {
                setReceipt(null);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-colors cursor-pointer"
            >
              Cerrar Comprobante
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Tu carrito de productos y servicios artesanales está vacío.</p>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="space-y-5 text-xs">
            {/* Cart Items List */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 max-w-[60%]">
                    <h5 className="font-bold text-white text-xs truncate">{item.product.name}</h5>
                    <span className="text-[10px] text-slate-400 block">{item.product.shopName}</span>
                    <span className="text-amber-400 font-mono font-bold">${item.product.price} MXN c/u</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:text-white text-slate-400"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono font-bold text-white">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:text-white text-slate-400"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, -item.quantity)}
                      className="p-1.5 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Heritage Contribution Breakdown */}
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-200 text-[11px]">Contribución al Fondo del Patrimonio:</span>
              </div>
              <span className="font-mono font-bold text-emerald-300">${totalHeritageFee.toFixed(2)} MXN</span>
            </div>

            {/* Buyer Form Fields */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nombre o Apodo del Comprador</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ej. Visitante de Ciudad de México"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Pasarela / Medio</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cattleya Sovereign Ledger">Cattleya Sovereign Ledger</option>
                  <option value="Tarjeta / CoDi Simulado">Tarjeta / CoDi Simulado</option>
                  <option value="Transferencia Cívica Directa">Transferencia Cívica Directa</option>
                </select>
              </div>
            </div>

            {/* Total Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Total a Pagar</span>
                <span className="text-2xl font-black text-amber-400 font-mono">${totalAmount} MXN</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                {isProcessing ? 'Liquidando en Ledger...' : 'Liquidar con Cattleya Pay'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
