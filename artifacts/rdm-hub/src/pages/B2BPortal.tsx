/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, Check, ArrowRight, Crown, Building2, Sparkles,
  X, ChevronDown, ChevronUp, MessageCircle, Phone, Mail,
  Star, Quote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const B2B_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    period: "mes",
    icon: <Store className="h-6 w-6" />,
    recommended: false,
    features: [
      "Listado en Directorio Digital",
      "Ficha de negocio con fotos",
      "Horarios y ubicación en mapa",
      "Soporte por correo electrónico",
      "Estadísticas básicas mensuales",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 799,
    period: "mes",
    icon: <TrendingUp className="h-6 w-6" />,
    recommended: true,
    features: [
      "Todo del plan Starter",
      "Posición destacada en Directorio",
      "Promociones y ofertas visibles",
      "Panel de analytics avanzado",
      "Integración con WhatsApp Business",
      "Realito recomendación prioritaria",
      "Soporte prioritario por chat",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1999,
    period: "mes",
    icon: <Crown className="h-6 w-6" />,
    recommended: false,
    features: [
      "Todo del plan Growth",
      "Banner publicitario rotativo",
      "Gestión de reseñas y respuestas",
      "Dashboard de inteligencia de negocio",
      "API acceso para integraciones",
      "Consultoría mensual de negocio digital",
      "Soporte dedicado 24/7",
      "Acceso anticipado a nuevas funciones",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "María Elena Rodríguez",
    business: "Pastes El Portal",
    text: "Desde que me uní a la federación B2B, mis ventas aumentaron un 40%. El directorio digital es increíble para atraer turistas.",
    rating: 5,
  },
  {
    name: "Carlos Hernández",
    business: "Hotel Real del Monte",
    text: "El plan Growth nos permitió conectar directamente con visitantes. Las reservas directas sin comisión de OTA son un cambio total.",
    rating: 5,
  },
  {
    name: "Ana Sofía Pérez",
    business: "Artesanías Mineras",
    text: "La integración con WhatsApp Business revolucionó mi atención al cliente. Recibo pedidos por mensaje directo todos los días.",
    rating: 4,
  },
];

const FAQ_ITEMS = [
  {
    q: "¿Qué es la Federación Comercial B2B?",
    a: "Es un ecosistema digital que conecta a los comercios de Real del Monte con turistas y residentes a través de un directorio inteligente, herramientas de marketing y analytics de negocio.",
  },
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí, puedes actualizar o reducir tu plan en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación y se ajusta la diferencia de forma proporcional.",
  },
  {
    q: "¿Cómo funciona la recomendación de Realito?",
    a: "Realito es nuestro asistente inteligente que recomienda negocios a los usuarios basándose en ubicación, preferencias, reseñas y patrones de comportamiento. Los planes superiores tienen mayor prioridad.",
  },
  {
    q: "¿Necesito conocimientos técnicos?",
    a: "No. La plataforma está diseñada para ser intuitiva. Solo necesitas subir fotos de tu negocio y mantener tu información actualizada. Nosotros nos encargamos del resto.",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Aceptamos tarjetas de crédito/débito, transferencia SPEI, y pagos en efectivo en puntos autorizados de Real del Monte. La facturación es mensual con cobro automático.",
  },
];

export default function B2BPortal() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    setSubmitted(false);
    setForm({ nombre: "", empresa: "", email: "", telefono: "", mensaje: "" });
  };

  const handleSubmit = () => {
    if (!form.nombre.trim() || !form.empresa.trim() || !form.email.trim()) {
      toast.error("Completa nombre, empresa y email");
      return;
    }
    const interests = JSON.parse(localStorage.getItem("rdm_b2b_interests") || "[]");
    interests.push({
      ...form,
      planId: selectedPlan,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("rdm_b2b_interests", JSON.stringify(interests));

    fetch(`${import.meta.env.VITE_API_URL || "/api"}/v1/business/register-interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, planId: selectedPlan }),
    }).catch(() => {});

    setSubmitted(true);
    toast.success("Solicitud registrada correctamente");
  };

  return (
    <div className="space-y-12 sm:space-y-16 max-w-[1400px] mx-auto px-4 sm:px-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center pt-12 sm:pt-20 pb-4"
      >
        <Badge variant="outline" className="mb-4 text-[10px] font-mono uppercase tracking-[0.25em]">
          Economía Local
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Ecosistema B2B
        </h1>
        <p className="text-lg sm:text-xl text-primary mt-2 font-semibold">
          Conecta tu negocio con Real del Monte
        </p>
        <p className="text-sm text-muted-foreground mt-3 max-w-2xl mx-auto">
          Planes de suscripción sectorial para comercios de Real del Monte.
          Digitaliza tu negocio y llega a miles de visitantes.
        </p>
      </motion.section>

      {/* Plans Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {B2B_PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className={cn(
              "relative rounded-2xl p-7 transition-all duration-300",
              plan.recommended
                ? "border-2 border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/10"
                : "border bg-card hover:border-primary/20"
            )}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white px-3">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Recomendado
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "p-2 rounded-lg",
                plan.recommended ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
              )}>
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>

            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-4xl font-bold">
                ${plan.price.toLocaleString("es-MX")}
              </span>
              <span className="text-xs text-muted-foreground">MXN/{plan.period}</span>
            </div>

            <div className="border-t pt-4 space-y-3 mb-6">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-2">
                  <div className="flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded bg-emerald-500/10">
                    <Check className="h-2.5 w-2.5 text-emerald-500" />
                  </div>
                  <span className="text-xs">{f}</span>
                </div>
              ))}
            </div>

            <Button
              className={cn(
                "w-full rounded-xl h-11 text-sm font-semibold transition-all duration-300",
                plan.recommended
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "bg-secondary/50 hover:bg-secondary"
              )}
              onClick={() => handleSubscribe(plan.id)}
            >
              Suscribirse
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </motion.div>
        ))}
      </section>

      {/* Subscribe Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogClose asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold">¡Gracias!</h3>
              <p className="text-sm text-muted-foreground">
                Te contactaremos pronto para activar tu plan{" "}
                {B2B_PLANS.find((p) => p.id === selectedPlan)?.name}.
              </p>
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Cerrar
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle>
                  Suscribirse — Plan {B2B_PLANS.find((p) => p.id === selectedPlan)?.name}
                </DialogTitle>
                <DialogDescription>
                  Completa tus datos y nos pondremos en contacto contigo.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <Input
                  placeholder="Tu nombre *"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
                <Input
                  placeholder="Nombre del negocio *"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
                <Input
                  placeholder="Mensaje adicional (opcional)"
                  value={form.mensaje}
                  onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                />
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Solicitar Suscripción
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Testimonials */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">
          Lo que dicen nuestros comercios
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <Quote className="h-6 w-6 text-primary/30 mb-3" />
                <p className="text-sm text-muted-foreground flex-1 mb-4">
                  "{t.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.business}</p>
                  <div className="flex items-center gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "h-3 w-3",
                          j < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-4 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* DAO Note */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-teal-500/20 bg-teal-500/5 p-8 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(174 62% 47%), transparent 70%)",
          }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
            <Building2 className="h-6 w-6 text-teal-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-teal-500">Gobernanza DAO RDM</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Las cuotas, beneficios y reglas comerciales son ajustadas por la DAO de Real del Monte,
              sin modificar la arquitectura base TAMV. Los ingresos se liquidan y reportan en dashboards
              específicos de RDM, garantizando soberanía económica total del territorio.
            </p>
          </div>
        </div>
      </motion.section>

      {/* CTA Footer */}
      <section className="text-center py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          ¿Listo para digitalizar tu negocio?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Únete a la red de comercios más innovadora de Real del Monte.
        </p>
        <Button size="lg" onClick={() => handleSubscribe("growth")}>
          <Sparkles className="h-4 w-4 mr-2" />
          Empezar Ahora
        </Button>
      </section>
    </div>
  );
}

function TrendingUp(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
