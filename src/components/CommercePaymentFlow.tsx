import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowRight,
  Shield,
  Lock,
  DollarSign,
  Package,
} from "lucide-react";
import { toast } from "sonner";

interface CommercePaymentFlowProps {
  merchantName: string;
  plan: "basic" | "standard" | "premium";
  onPaymentComplete?: (sessionId: string) => void;
}

const PLANS = {
  basic: { name: "Emprendedor", price: 499, features: ["Perfil básico", "3 fotos", "2 redes sociales"] },
  standard: { name: "Establecido", price: 999, features: ["Perfil completo", "10 fotos", "5 redes sociales", "Analíticas"] },
  premium: { name: "Élite", price: 1999, features: ["Todo incluido", "Ilimitado", "API access", "Soporte 24/7"] },
};

export function CommercePaymentFlow({
  merchantName,
  plan,
  onPaymentComplete,
}: CommercePaymentFlowProps) {
  const [step, setStep] = useState<"plan" | "review" | "payment" | "success">("plan");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [cardData, setCardData] = useState({ last4: "", brand: "" });

  const currentPlan = PLANS[plan];
  const total = currentPlan.price;
  const tax = Math.round(total * 0.16);
  const subtotal = total;
  const finalTotal = subtotal + tax;

  const handleProcessPayment = async () => {
    if (!email) {
      toast.error("Por favor ingresa tu correo");
      return;
    }

    setLoading(true);
    try {
      // Simulated payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful response
      const sessionId = `session_${Date.now()}`;
      setCardData({ last4: "4242", brand: "Visa" });
      setStep("success");
      onPaymentComplete?.(sessionId);

      toast.success("Pago procesado exitosamente");
    } catch (error: any) {
      toast.error(error.message || "Error al procesar pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {["plan", "review", "payment", "success"].map((s, i) => (
            <div key={s} className="flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold ${
                  step === s
                    ? "bg-amber-500 text-white shadow-lg"
                    : (["plan", "review", "payment", "success"].indexOf(step) > i
                        ? "bg-green-500 text-white"
                        : "bg-slate-700 text-slate-400")
                }`}
                animate={{ scale: step === s ? 1.1 : 1 }}
              >
                {i + 1}
              </motion.div>
              {i < 3 && (
                <div
                  className={`h-1 w-12 mx-2 ${
                    ["plan", "review", "payment", "success"].indexOf(step) > i
                      ? "bg-green-500"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Plan Selection */}
        {step === "plan" && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-2xl text-white mb-2">Plan Seleccionado</h3>
              <p className="text-slate-400 text-sm">Revisa los detalles de tu plan</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="font-display text-3xl text-white mb-1">{currentPlan.name}</h4>
                  <p className="text-slate-400 text-sm">para {merchantName}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-4xl text-amber-400">${total}</div>
                  <p className="text-xs text-slate-500">MXN / mes</p>
                </div>
              </div>

              <div className="space-y-3 mb-8 pb-8 border-b border-slate-700">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IVA (16%)</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between font-display text-lg text-white pt-2 border-t border-slate-700">
                  <span>Total</span>
                  <span className="text-amber-400">${finalTotal}</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => setStep("review")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-body font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* Review */}
        {step === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-2xl text-white mb-2">Revisar Información</h3>
              <p className="text-slate-400 text-sm">Verifica los datos antes de pagar</p>
            </div>

            {/* Merchant Info */}
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 space-y-4">
              <h4 className="font-display text-amber-400">Información de Comerciante</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nombre</span>
                  <span className="text-white">{merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan</span>
                  <span className="text-white">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monto</span>
                  <span className="text-amber-400 font-bold">${finalTotal}</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-green-400 font-medium">Pago Seguro</p>
                <p className="text-green-400/70 text-xs">Tus datos están encriptados y protegidos por Stripe</p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => setStep("plan")}
                whileHover={{ scale: 1.02 }}
                className="flex-1 py-3 rounded-lg bg-slate-700 text-white font-body font-bold hover:bg-slate-600 transition-colors"
              >
                Atrás
              </motion.button>
              <motion.button
                onClick={() => setStep("payment")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-body font-bold flex items-center justify-center gap-2 hover:shadow-lg"
              >
                Pagar <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Payment Form */}
        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-2xl text-white mb-2">Datos de Pago</h3>
              <p className="text-slate-400 text-sm">Ingresa tu información de tarjeta</p>
            </div>

            <div className="rounded-xl bg-slate-800 border border-slate-700 p-8 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-body text-slate-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="comercio@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Card Info Demo */}
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 border border-slate-600">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <p className="text-sm text-slate-300">Tarjeta de Prueba (Demo)</p>
                </div>
                <p className="font-mono text-lg text-white mb-4">4242 4242 4242 4242</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                  <div>
                    <p>Vencimiento</p>
                    <p className="text-white font-mono">12/25</p>
                  </div>
                  <div>
                    <p>CVC</p>
                    <p className="text-white font-mono">123</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-400 font-medium">Modo Demo</p>
                  <p className="text-blue-400/70 text-xs">Usa los datos de tarjeta de prueba arriba. En producción usarás Stripe Checkout.</p>
                </div>
              </div>

              {/* Security Footer */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Encriptado y seguro</span>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={() => setStep("review")}
                whileHover={{ scale: 1.02 }}
                className="flex-1 py-3 rounded-lg bg-slate-700 text-white font-body font-bold hover:bg-slate-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Atrás
              </motion.button>
              <motion.button
                onClick={handleProcessPayment}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-body font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" /> Pagar ${finalTotal}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <motion.div
              className="w-24 h-24 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle className="w-12 h-12 text-green-400" />
            </motion.div>

            <div>
              <h3 className="font-display text-3xl text-white mb-2">¡Pago Exitoso!</h3>
              <p className="text-slate-400">Tu cuenta está activada y lista</p>
            </div>

            <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="text-white font-bold">{currentPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ID de Transacción</span>
                <span className="text-white font-mono text-sm">TXN{Date.now()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Monto Pagado</span>
                <span className="text-amber-400 font-bold">${finalTotal}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-body font-bold flex items-center justify-center gap-2 hover:shadow-lg"
            >
              <Package className="w-4 h-4" /> Ir al Tablero
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
