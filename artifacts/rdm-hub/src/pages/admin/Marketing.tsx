/**
 * Panel de Marketing Digital — RDM Digital Hub
 * Herramienta interna para gestión de campañas, banners y analíticas
 * de comercios registrados en la plataforma.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Eye, MousePointer,
  Plus, Edit, Trash2, Radio, Star, Megaphone,
  Store, ChevronRight, Calendar, Target, Zap,
  DollarSign, Image, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BUSINESSES = [
  { id: "1", name: "Restaurante El Minero", category: "GASTRONOMIA", tier: "premium", active: true, views: 1240, clicks: 87, conversions: 12 },
  { id: "2", name: "Platería Reyes",        category: "PLATERIA",     tier: "advance", active: true, views: 890,  clicks: 62, conversions: 8  },
  { id: "3", name: "Hostal de la Montaña", category: "HOSPEDAJE",    tier: "premium", active: true, views: 2100, clicks: 134, conversions: 21 },
  { id: "4", name: "Café del Pueblo",       category: "GASTRONOMIA", tier: "free",    active: true, views: 430,  clicks: 28, conversions: 3  },
  { id: "5", name: "Tours Real del Monte",  category: "TURISMO",     tier: "advance", active: false, views: 670, clicks: 41, conversions: 6  },
];

const MOCK_CAMPAIGNS = [
  {
    id: "c1", business_id: "1", business: "Restaurante El Minero",
    title: "Menú del Día — Pastes Auténticos",
    status: "active", impressions: 4820, clicks: 312, ctr: 6.5,
    start: "2026-07-01", end: "2026-07-31", budget: 500,
  },
  {
    id: "c2", business_id: "3", business: "Hostal de la Montaña",
    title: "Fin de semana en la sierra — 20% off",
    status: "active", impressions: 3100, clicks: 198, ctr: 6.4,
    start: "2026-07-15", end: "2026-08-15", budget: 800,
  },
  {
    id: "c3", business_id: "2", business: "Platería Reyes",
    title: "Colección verano 2026 — Plata Real del Monte",
    status: "draft", impressions: 0, clicks: 0, ctr: 0,
    start: "2026-08-01", end: "2026-08-31", budget: 400,
  },
];

const MOCK_BANNERS = [
  { id: "b1", campaign_id: "c1", business: "Restaurante El Minero", tagline: "El sabor auténtico del pueblo mágico", cta: "Ver menú", active: true, slot: 1 },
  { id: "b2", campaign_id: "c2", business: "Hostal de la Montaña",  tagline: "Duerme en la sierra con todo incluido",  cta: "Reservar",  active: true, slot: 2 },
  { id: "b3", campaign_id: "c3", business: "Platería Reyes",         tagline: "Joyería artesanal — Plata de Real",      cta: "Ver colección", active: false, slot: null },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, trend, color }: {
  icon: typeof BarChart3; label: string; value: string | number; trend?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-[oklch(0.18_0.025_260)] p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400" style={{ fontFamily: "var(--font-body)" }}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-body)" }}>{label}</p>
    </motion.div>
  );
}

function CampaignRow({ campaign }: { campaign: typeof MOCK_CAMPAIGNS[0] }) {
  const statusColor = campaign.status === "active" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    : "text-amber-400 bg-amber-400/10 border-amber-400/20";
  const statusLabel = campaign.status === "active" ? "Activa" : "Borrador";
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all bg-white/2 hover:bg-white/5">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>
          {campaign.title}
        </p>
        <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
          {campaign.business} · {campaign.start} → {campaign.end}
        </p>
      </div>
      <div className="flex items-center gap-6 text-center">
        <div>
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>
            {campaign.impressions.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/40">Impresiones</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>
            {campaign.clicks.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/40">Clics</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[hsl(var(--rdm-amber))]" style={{ fontFamily: "var(--font-mono)" }}>
            {campaign.ctr.toFixed(1)}%
          </p>
          <p className="text-[10px] text-white/40">CTR</p>
        </div>
        <Badge className={`text-[10px] border ${statusColor} bg-transparent`}>
          {statusLabel}
        </Badge>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketingPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [newCampaign, setNewCampaign] = useState({ title: "", business: "", budget: "", start: "", end: "", tagline: "", cta: "" });

  const totalImpressions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = MOCK_CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active").length;
  const avgCtr = totalClicks > 0 && totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";

  const handleCreateCampaign = () => {
    toast({ title: "Campaña creada (modo demo)", description: "Con Supabase activo, se guardaría en la base de datos." });
    setNewCampaign({ title: "", business: "", budget: "", start: "", end: "", tagline: "", cta: "" });
  };

  return (
    <RDMLayout>
      <div className="min-h-screen bg-[oklch(0.13_0.02_260)]">
        <div className="container mx-auto px-4 md:px-8 pt-24 pb-16 max-w-6xl">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 text-[hsl(var(--rdm-amber))] text-xs uppercase tracking-widest mb-2">
              <Megaphone className="w-4 h-4" />
              <span style={{ fontFamily: "var(--font-body)" }}>Centro de Marketing Digital</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Marketing <span className="text-[hsl(var(--rdm-amber))]">RDM Hub</span>
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Gestión de campañas publicitarias, banners y analíticas de comercios registrados.
            </p>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 border border-white/10 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4 mr-2" /> Resumen
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Target className="w-4 h-4 mr-2" /> Campañas
              </TabsTrigger>
              <TabsTrigger value="banners" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Image className="w-4 h-4 mr-2" /> Banners
              </TabsTrigger>
              <TabsTrigger value="businesses" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Store className="w-4 h-4 mr-2" /> Comercios
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-[hsl(var(--rdm-amber))] data-[state=active]:text-black">
                <Plus className="w-4 h-4 mr-2" /> Nueva Campaña
              </TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Eye} label="Impresiones totales" value={totalImpressions.toLocaleString()} trend="+18%" color="hsl(var(--rdm-amber))" />
                <StatCard icon={MousePointer} label="Clics totales" value={totalClicks.toLocaleString()} trend="+12%" color="hsl(152 60% 45%)" />
                <StatCard icon={TrendingUp} label="CTR promedio" value={`${avgCtr}%`} trend="+0.8pp" color="hsl(210 80% 55%)" />
                <StatCard icon={Zap} label="Campañas activas" value={activeCampaigns} color="hsl(270 60% 60%)" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
                <h3 className="font-semibold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Campañas en curso
                </h3>
                <div className="space-y-3">
                  {MOCK_CAMPAIGNS.filter((c) => c.status === "active").map((c) => (
                    <CampaignRow key={c.id} campaign={c} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Campaigns */}
            <TabsContent value="campaigns">
              <div className="space-y-3">
                {MOCK_CAMPAIGNS.map((c) => (
                  <CampaignRow key={c.id} campaign={c} />
                ))}
              </div>
            </TabsContent>

            {/* Banners */}
            <TabsContent value="banners">
              <div className="mb-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span style={{ fontFamily: "var(--font-body)" }}>
                  Los banners rotan automáticamente cada 30 minutos. Se muestran 2 simultáneamente en la plataforma.
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {MOCK_BANNERS.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-white/10 bg-white/2 p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm" style={{ fontFamily: "var(--font-display)" }}>
                          {b.business}
                        </p>
                        <p className="text-xs text-white/50 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                          {b.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.slot !== null && (
                          <Badge className="text-[10px] border border-amber-500/30 text-amber-400 bg-transparent">
                            Slot {b.slot}
                          </Badge>
                        )}
                        {b.active ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-white/20" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-white/10 text-white/70" style={{ fontFamily: "var(--font-body)" }}>
                        CTA: {b.cta}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-[10px] border ${b.active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" : "border-white/10 text-white/30"}`}>
                        {b.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Businesses */}
            <TabsContent value="businesses">
              <div className="space-y-3">
                {MOCK_BUSINESSES.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all bg-white/2 hover:bg-white/5">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(var(--rdm-amber)/0.1)] flex items-center justify-center">
                      <Store className="w-5 h-5 text-[hsl(var(--rdm-amber))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm" style={{ fontFamily: "var(--font-display)" }}>
                        {b.name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
                        {b.category} · {b.tier}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>{b.views.toLocaleString()}</p>
                        <p className="text-[10px] text-white/40">Vistas</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>{b.clicks}</p>
                        <p className="text-[10px] text-white/40">Clics</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-400" style={{ fontFamily: "var(--font-mono)" }}>{b.conversions}</p>
                        <p className="text-[10px] text-white/40">Convers.</p>
                      </div>
                      <Badge className={`text-[10px] border ${b.active ? "border-emerald-500/30 text-emerald-400 bg-transparent" : "border-white/10 text-white/30 bg-transparent"}`}>
                        {b.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* New Campaign */}
            <TabsContent value="new">
              <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/2 p-6">
                <h3 className="font-semibold text-white mb-6 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Crear nueva campaña publicitaria
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "var(--font-body)" }}>
                      Comercio
                    </label>
                    <Select onValueChange={(v) => setNewCampaign((p) => ({ ...p, business: v }))}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Seleccionar comercio..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_BUSINESSES.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Título de campaña</label>
                    <Input
                      value={newCampaign.title}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, title: e.target.value }))}
                      placeholder="ej. Menú del Día — Julio 2026"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Tagline del banner</label>
                    <Input
                      value={newCampaign.tagline}
                      onChange={(e) => setNewCampaign((p) => ({ ...p, tagline: e.target.value }))}
                      placeholder="ej. El sabor auténtico del pueblo mágico"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Fecha inicio</label>
                      <Input type="date" value={newCampaign.start} onChange={(e) => setNewCampaign((p) => ({ ...p, start: e.target.value }))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Fecha fin</label>
                      <Input type="date" value={newCampaign.end} onChange={(e) => setNewCampaign((p) => ({ ...p, end: e.target.value }))} className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Presupuesto (MXN)</label>
                    <Input type="number" value={newCampaign.budget} onChange={(e) => setNewCampaign((p) => ({ ...p, budget: e.target.value }))} placeholder="500" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
                  </div>
                  <Button
                    onClick={handleCreateCampaign}
                    className="w-full bg-[hsl(var(--rdm-amber))] text-black font-bold hover:opacity-90"
                    disabled={!newCampaign.title || !newCampaign.business}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Campaña
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RDMLayout>
  );
}
