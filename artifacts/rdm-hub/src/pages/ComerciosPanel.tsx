/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Store, Eye, Star, MessageSquare, Coins, TrendingUp,
  ExternalLink, PenLine, BarChart3, Award, ChevronRight,
  Calendar, Loader2, AlertCircle, Plus
} from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { useRDMAuth } from "@/contexts/RDMAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  category: string;
  owner_id: string;
  status: string;
  plan?: string;
  created_at: string;
  [key: string]: unknown;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  author_name: string;
  created_at: string;
}

const MOCK_VISITS = [42, 38, 55, 67, 49, 73, 61];
const MOCK_SOURCES = [
  { name: "Directo", pct: 45 },
  { name: "Búsqueda", pct: 30 },
  { name: "Social", pct: 25 },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ComerciosPanel() {
  const { user, loading: authLoading } = useRDMAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const fetchBusinessData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from("businesses" as never)
        .select("*")
        .eq("owner_id", user.id)
        .single();
      if (fetchErr) {
        console.error("[ComerciosPanel] fetch error:", fetchErr);
        setBusiness(null);
      } else {
        setBusiness(data as unknown as Business);
      }
    } catch (e) {
      console.error("[ComerciosPanel] unexpected:", e);
      setError("No se pudieron cargar los datos del negocio.");
    }

    try {
      const { data: revData } = await supabase
        .from("business_reviews" as never)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (revData) setReviews(revData as unknown as Review[]);
    } catch {
      // table may not exist yet
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) fetchBusinessData();
  }, [authLoading, fetchBusinessData]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const savePromo = () => {
    if (!promoTitle.trim()) {
      toast.error("Ingresa un título para la promoción");
      return;
    }
    const promos = JSON.parse(localStorage.getItem("rdm_promos") || "[]");
    promos.push({
      title: promoTitle,
      description: promoDesc,
      created: new Date().toISOString(),
      businessId: business?.id,
    });
    localStorage.setItem("rdm_promos", JSON.stringify(promos));
    toast.success("Promoción guardada localmente");
    setPromoTitle("");
    setPromoDesc("");
    setShowPromoForm(false);
  };

  if (authLoading || loading) {
    return (
      <RDMLayout>
        <div className="container mx-auto px-4 pt-28 pb-20 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Cargando panel de comerciante...</p>
          </div>
        </div>
      </RDMLayout>
    );
  }

  if (!user) {
    return (
      <RDMLayout>
        <div className="container mx-auto px-4 pt-28 pb-20 flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md w-full p-8 text-center space-y-4">
            <Store className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-bold">Acceso Requerido</h2>
            <p className="text-sm text-muted-foreground">
              Inicia sesión para acceder a tu panel de comerciante.
            </p>
            <Button onClick={() => navigate("/auth")}>Iniciar Sesión</Button>
          </Card>
        </div>
      </RDMLayout>
    );
  }

  return (
    <RDMLayout>
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1">
              Panel de Comerciante
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Store className="h-7 w-7" />
              {business?.name ?? "Mi Negocio"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">
                {business?.category || "Sin categoría"}
              </Badge>
              {business?.plan && (
                <Badge className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                  {business.plan}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Activo
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/negocios-portal")}>
            <PenLine className="h-4 w-4 mr-1" />
            Editar Perfil
          </Button>
        </header>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={<Eye className="h-5 w-5 text-blue-400" />}
            label="Visitas este mes"
            value={business?.id ? "N/A" : "N/A"}
            sub="Próximamente"
          />
          <KPICard
            icon={<Star className="h-5 w-5 text-amber-400" />}
            label="Reseñas recibidas"
            value={String(reviews.length)}
            sub={reviews.length > 0 ? "Totales" : "Sin reseñas aún"}
          />
          <KPICard
            icon={<MessageSquare className="h-5 w-5 text-emerald-400" />}
            label="Calificación promedio"
            value={avgRating ?? "N/A"}
            sub={avgRating ? `de 5 estrellas` : "Sin calificación"}
          />
          <KPICard
            icon={<Coins className="h-5 w-5 text-purple-400" />}
            label="Realitos generados"
            value="0"
            sub="Próximamente"
          />
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon={<PenLine className="h-6 w-6" />}
            label="Editar Perfil"
            desc="Modifica la información de tu negocio"
            onClick={() => navigate("/negocios-portal")}
          />
          <QuickAction
            icon={<ExternalLink className="h-6 w-6" />}
            label="Ver en Directorio"
            desc="Consulta tu listing público"
            onClick={() => navigate("/directorio")}
          />
          <QuickAction
            icon={<Plus className="h-6 w-6" />}
            label="Crear Promoción"
            desc="Publica una oferta especial"
            onClick={() => setShowPromoForm(!showPromoForm)}
          />
          <QuickAction
            icon={<BarChart3 className="h-6 w-6" />}
            label="Estadísticas"
            desc="Métricas y análisis detallados"
            onClick={() => setActiveSection(activeSection === "analytics" ? null : "analytics")}
          />
        </section>

        {/* Promo Creation Form */}
        {showPromoForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Crear Promoción</h3>
              <Input
                placeholder="Título de la promoción"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
              />
              <Input
                placeholder="Descripción (opcional)"
                value={promoDesc}
                onChange={(e) => setPromoDesc(e.target.value)}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={savePromo}>Guardar</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPromoForm(false)}>
                  Cancelar
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Analytics Section */}
        {activeSection === "analytics" && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Bar Chart - Visits per Day */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Visitas por día (últimos 7 días)
              </h3>
              <div className="flex items-end gap-2 h-40">
                {MOCK_VISITS.map((v, i) => {
                  const max = Math.max(...MOCK_VISITS);
                  const h = (v / max) * 100;
                  const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">{v}</span>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500"
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-muted-foreground">{dayNames[i]}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">
                Datos simulados — Analytics reales próximamente
              </p>
            </Card>

            {/* Traffic Sources */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Fuentes de tráfico</h3>
              <div className="space-y-4">
                {MOCK_SOURCES.map((src) => (
                  <div key={src.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{src.name}</span>
                      <span className="text-muted-foreground">{src.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${src.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                Datos simulados — Integración con analytics real próximamente
              </p>
            </Card>
          </motion.section>
        )}

        {/* Recent Reviews */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            Reseñas Recientes
          </h2>
          {reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                Las reseñas de tus clientes aparecerán aquí. Próximamente.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{r.author_name}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                  <span className="text-[10px] text-muted-foreground mt-2 block">
                    {new Date(r.created_at).toLocaleDateString("es-MX")}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Plan Status */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-amber-500" />
              <div>
                <h3 className="font-semibold">Estado del Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {business?.plan
                    ? `Plan ${business.plan} — Activo`
                    : "Sin plan activo — Registra tu negocio para empezar"}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/b2b")}
            >
              {business?.plan ? "Mejorar Plan" : "Ver Planes"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </RDMLayout>
  );
}

function KPICard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card className="p-4 sm:p-5 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </Card>
  );
}

function QuickAction({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left p-4 sm:p-5 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
    >
      <div className="text-primary mb-3 group-hover:scale-110 transition-transform inline-block">
        {icon}
      </div>
      <h3 className="font-semibold text-sm">{label}</h3>
      <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
    </button>
  );
}
