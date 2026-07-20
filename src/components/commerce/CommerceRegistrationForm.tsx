'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CommerceFormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  category: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  images?: File[];
  plan: 'basic' | 'premium' | 'enterprise';
}

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 99,
    description: 'Perfil en la plataforma',
    features: ['Perfil básico', '3 imágenes', 'Información de contacto'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    description: 'Más visibilidad',
    recommended: true,
    features: ['Perfil destacado', '10 imágenes', 'Análisis de visitas', 'Promociones rotativas'],
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 599,
    description: 'Control total',
    features: ['Todo Premium', 'Streaming prioritario', 'Dashboard avanzado', 'Soporte directo'],
  },
];

export function CommerceRegistrationForm() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CommerceFormData>({
    defaultValues: {
      plan: 'premium',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = selectedPlan === 'basic' ? 3 : selectedPlan === 'premium' ? 10 : 20;
    
    if (images.length + files.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes para este plan`);
      return;
    }

    setImages([...images, ...files]);
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CommerceFormData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Step 3: Process payment
    if (step === 3) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'images' && value) {
            formData.append(key, String(value));
          }
        });

        images.forEach((img, idx) => {
          formData.append(`image_${idx}`, img);
        });

        // Create Stripe session
        const res = await fetch('/api/commerce/register', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (!res.ok) throw new Error('Error registering commerce');

        const { checkoutUrl } = await res.json();
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } catch (error) {
        console.error('[v0] Commerce registration error:', error);
        toast.error('Error en el registro. Intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            className={`flex-1 h-1 rounded-full transition-all ${
              s <= step ? 'bg-amber-400' : 'bg-slate-700'
            }`}
            layoutId={`progress-${s}`}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-display text-3xl text-white mb-2">
          {step === 1 && 'Información del Negocio'}
          {step === 2 && 'Selecciona tu Plan'}
          {step === 3 && 'Confirmación y Pago'}
        </h2>
        <p className="text-slate-400">
          {step === 1 && 'Cuéntanos sobre tu comercio'}
          {step === 2 && 'Elige el plan que mejor se adapte a ti'}
          {step === 3 && 'Revisa y completa el pago'}
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Business Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre del negocio
                </label>
                <input
                  {...register('businessName', { required: true })}
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Ej: Pastes El Portal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre del propietario
                </label>
                <input
                  {...register('ownerName', { required: true })}
                  type="text"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  placeholder="contacto@negocio.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Teléfono
                </label>
                <input
                  {...register('phone', { required: true })}
                  type="tel"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  placeholder="+52..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Categoría
                </label>
                <select
                  {...register('category', { required: true })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="gastronomia">Gastronomía</option>
                  <option value="alojamiento">Alojamiento</option>
                  <option value="artesania">Artesanía</option>
                  <option value="turismo">Turismo</option>
                  <option value="cultura">Cultura</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Descripción
                </label>
                <textarea
                  {...register('description', { required: true })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  rows={4}
                  placeholder="Cuéntanos sobre tu negocio..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">
                  Imágenes de tu negocio (máximo {selectedPlan === 'basic' ? 3 : selectedPlan === 'premium' ? 10 : 20})
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <ImagePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      Haz clic para subir imágenes
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-700"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 p-1 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                {plan.recommended && (
                  <div className="text-center mb-2">
                    <span className="bg-amber-400 text-slate-900 px-2 py-1 rounded text-xs font-bold">
                      RECOMENDADO
                    </span>
                  </div>
                )}
                <h3 className="font-display text-xl text-white mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-amber-400 mb-3">
                  ${plan.price}
                  <span className="text-sm text-slate-400">/mes</span>
                </p>
                <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 p-6 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <div className="flex gap-4 mb-6">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Resumen de registro</h3>
                <p className="text-sm text-slate-400">
                  Serás redirigido a Stripe para completar el pago de forma segura.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Plan seleccionado</p>
                <p className="text-lg font-semibold text-white">
                  {plans.find((p) => p.id === selectedPlan)?.name}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Monto a pagar</p>
                <p className="text-lg font-semibold text-amber-400">
                  ${plans.find((p) => p.id === selectedPlan)?.price} MXN
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Atrás
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isLoading
                ? 'bg-slate-700 text-slate-400'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 hover:from-amber-500 hover:to-yellow-500'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 3 ? 'Ir al pago' : 'Siguiente'}
          </button>
        </div>
      </form>
    </div>
  );
}
