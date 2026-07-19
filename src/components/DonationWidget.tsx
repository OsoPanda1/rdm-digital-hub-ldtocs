'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowRight } from 'lucide-react';

export interface DonationWidgetProps {
  pageSection?: 'footer' | 'sidebar' | 'inline' | 'modal';
  displayText?: string;
  minAmount?: number;
  maxAmount?: number;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export default function DonationWidget({
  pageSection = 'footer',
  displayText = 'Apoya el patrimonio de Real del Monte',
  minAmount = 1,
  maxAmount = 1000,
}: DonationWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const isValidAmount = finalAmount >= minAmount && finalAmount <= maxAmount;

  const handleDonate = async () => {
    if (!isValidAmount) return;

    // Here you would integrate with Stripe
    try {
      setSubmitted(true);
      // Simulate stripe checkout
      setTimeout(() => {
        setIsOpen(false);
        setStep('select');
        setSubmitted(false);
        setSelectedAmount(25);
        setCustomAmount('');
      }, 1500);
    } catch (error) {
      console.error('Donation error:', error);
    }
  };

  const containerClass =
    pageSection === 'footer'
      ? 'w-full'
      : pageSection === 'sidebar'
        ? 'w-full'
        : pageSection === 'inline'
          ? 'inline-block'
          : '';

  if (pageSection === 'modal' && !isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open donation widget"
      >
        <Heart className="w-6 h-6 fill-current" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && pageSection === 'modal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => !submitted && setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[hsl(var(--background))] border border-[hsl(var(--border))] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--font-display)' }}>
                Donativos
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <Heart className="w-6 h-6 fill-emerald-500 text-emerald-500" />
                </motion.div>
                <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">¡Gracias!</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Tu donativo de ${finalAmount} ayudará a preservar el patrimonio de Real del Monte.
                </p>
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  {displayText}
                </p>

                {step === 'select' ? (
                  <div className="space-y-4">
                    {/* Preset amounts */}
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_AMOUNTS.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                          }}
                          className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                            selectedAmount === amount && !customAmount
                              ? 'bg-[hsl(var(--rdm-amber))] text-white'
                              : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                          }`}
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                        Otro monto
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[hsl(var(--muted-foreground))]">$</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(0);
                          }}
                          min={minAmount}
                          max={maxAmount}
                          placeholder="Ingresa cantidad"
                          className="flex-1 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rdm-amber))]"
                          style={{ fontFamily: 'var(--font-body)' }}
                        />
                      </div>
                    </div>

                    {/* Next button */}
                    <button
                      onClick={() => setStep('details')}
                      disabled={!isValidAmount}
                      className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                        isValidAmount
                          ? 'bg-[hsl(var(--rdm-amber))] text-white hover:shadow-lg'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] cursor-not-allowed'
                      }`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Email input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--rdm-amber))]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-[hsl(var(--muted))] rounded-lg p-3 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-[hsl(var(--muted-foreground))]">Monto a donar:</span>
                        <span className="font-semibold text-[hsl(var(--foreground))]">${finalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[hsl(var(--muted-foreground))]">Procesado por:</span>
                        <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Stripe</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep('select')}
                        className="flex-1 py-2 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-semibold hover:bg-[hsl(var(--muted))] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleDonate}
                        disabled={!email}
                        className="flex-1 py-2 rounded-lg bg-[hsl(var(--rdm-amber))] text-white font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Donar ${finalAmount}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Footer or inline version */}
      {isOpen || pageSection !== 'modal' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-4 md:p-6 ${containerClass}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--font-display)' }}>
                  Apoya Real del Monte
                </h3>
                <p className="text-xs md:text-sm text-[hsl(var(--muted-foreground))] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                  {displayText}
                </p>
              </div>
            </div>
            {pageSection !== 'modal' && (
              <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors flex-shrink-0"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Donar
              </button>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
