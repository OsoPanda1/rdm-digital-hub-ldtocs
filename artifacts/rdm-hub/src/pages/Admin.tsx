/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, Activity, ScrollText, Save, Loader2, UserPlus, Store, Plus, Pencil, Trash2, X, MapPin, Phone, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole, logAudit, type AppRole } from "@/hooks/useUserRole";
import { MusicAdminPanel } from "@/components/admin/MusicAdminPanel";

// â”€â”€ Admin email pre-authorized â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ADMIN_EMAIL = "tamvonlinenetwork@outlook.es";

type Threshold = { id: string; federation_key: string; federation_name: string; max_latency_ms: number; min_integrity: number; max_offline: number; };
type RoleRow = { id: string; user_id: string; role: AppRole; created_at: string };
type AuditRow = { id: string; actor_email: string | null; action: string; resource: string; detail: unknown; created_at: string };

export default function Admin() {
  const { isAdmin, loading, userId } = useUserRole();
  const [bootstrapNeeded, setBootstrapNeeded] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      if ((count ?? 0) === 0) setBootstrapNeeded(true);
    })();
  }, [userId]);

  const bootstrap = async () => {
    if (!userId) return;
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) { toast.error(error.message); return; }
    await logAudit("role.bootstrap", "user_roles", { user_id: userId });
    toast.success("Eres administrador. Recarga la página.");
    setTimeout(() => location.reload(), 800);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xs font-mono">Cargandoâ€¦</div>;
  if (!userId) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-28 px-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl border border-gold/20 p-8 text-center">
          <Shield className="h-10 w-10 text-gold mx-auto mb-3" />
          <h1 className="text-2xl font-display font-bold mb-2">Panel de Administración</h1>
          {bootstrapNeeded ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">No hay administradores. Asume el rol fundador.</p>
              <button onClick={bootstrap} className="inline-flex items-center gap-2 rounded-xl gradient-gold px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
                <UserPlus className="h-4 w-4" /> Convertirme en Admin
              </button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Tu cuenta no tiene permisos administrativos.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/80">Consola Soberana</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Panel de <span className="text-gradient-gold">Administración</span></h1>
          <p className="mt-2 text-sm text-muted-foreground">Gestión de las 7 federaciones, roles, auditoría y catálogo musical.</p>
        </motion.div>

        <BusinessManagerSection />
        <ThresholdsSection />
        <RolesSection />
        <MusicAdminPanel />
        <AuditSection />
      </div>
    </div>
  );
}

// â”€â”€ Business Manager â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Business = {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  lat?: number;
  lng?: number;
  active: boolean;
};

const BUSINESS_CATS = ["gastronomia","hospedaje","artesanias","servicios-turisticos","comercio","entretenimiento","otro"];

function BusinessManagerSection() {
  const [items, setItems]     = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Partial<Business> | null>(null);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from("businesses").select("*").order("name");
    setLoading(false);
    if (!error) setItems((data ?? []) as Business[]);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.name?.trim()) { toast.error("El nombre es requerido"); return; }
    setSaving(true);
    const payload = {
      name: editing.name, category: editing.category || "otro",
      description: editing.description || "", address: editing.address || "",
      phone: editing.phone || null, website: editing.website || null,
      lat: editing.lat ? Number(editing.lat) : null, lng: editing.lng ? Number(editing.lng) : null,
      active: editing.active ?? true,
    };
    const { error } = editing.id
      ? await (supabase as any).from("businesses").update(payload).eq("id", editing.id)
      : await (supabase as any).from("businesses").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Negocio actualizado" : "Negocio creado");
    setEditing(null);
    load();
  };

  const toggle = async (b: Business) => {
    await (supabase as any).from("businesses").update({ active: !b.active }).eq("id", b.id);
    load();
  };

  const remove = async (b: Business) => {
    if (!confirm(`¿Eliminar "${b.name}"?`)) return;
    await (supabase as any).from("businesses").delete().eq("id", b.id);
    toast.success("Negocio eliminado");
    load();
  };

  const field = (k: keyof Business, label: string, type = "text", opts?: string[]) => (
    <div key={k} className="flex flex-col gap-1">
      <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</label>
      {opts ? (
        <select value={(editing as any)?.[k] ?? ""} onChange={e => setEditing(ed => ({ ...ed, [k]: e.target.value }))}
          className="rounded-lg bg-background/60 border border-border/30 px-3 py-2 text-sm">
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={(editing as any)?.[k] ?? ""} onChange={e => setEditing(ed => ({ ...ed, [k]: e.target.value }))}
          className="rounded-lg bg-background/60 border border-border/30 px-3 py-2 text-sm" />
      )}
    </div>
  );

  return (
    <section className="glass-card rounded-2xl border border-border/20 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-display font-bold flex items-center gap-2">
          <Store className="h-4 w-4 text-[hsl(var(--rdm-amber))]" /> Gestión de Negocios
          <span className="text-xs font-mono text-muted-foreground ml-2">({items.length} registrados)</span>
        </h2>
        <button onClick={() => setEditing({ active: true, category: "gastronomia" })}
          className="inline-flex items-center gap-1.5 rounded-xl gradient-gold px-4 py-2 text-xs font-semibold text-primary-foreground shadow-gold">
          <Plus className="h-3.5 w-3.5" /> Agregar negocio
        </button>
      </div>

      {/* Edit / create modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div initial={{ opacity:0,scale:0.95 }} animate={{ opacity:1,scale:1 }}
            className="w-full max-w-lg rounded-2xl border border-border/40 bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold">{editing.id ? "Editar" : "Nuevo"} Negocio</h3>
              <button onClick={() => setEditing(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {field("name", "Nombre del negocio")}
              {field("category", "Categoría", "text", BUSINESS_CATS)}
              {field("address", "Dirección")}
              {field("phone", "Teléfono", "tel")}
              {field("website", "Sitio web", "url")}
              {field("lat", "Latitud", "number")}
              {field("lng", "Longitud", "number")}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Descripción</label>
                <textarea value={editing.description ?? ""} rows={3}
                  onChange={e => setEditing(ed => ({ ...ed, description: e.target.value }))}
                  className="rounded-lg bg-background/60 border border-border/30 px-3 py-2 text-sm resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.active ?? true}
                  onChange={e => setEditing(ed => ({ ...ed, active: e.target.checked }))} />
                Negocio activo (visible en el directorio)
              </label>
            </div>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-border/40 text-sm">Cancelar</button>
              <button onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl gradient-gold text-sm font-semibold text-primary-foreground shadow-gold disabled:opacity-50">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-gold" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <Store className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No hay negocios registrados aún.</p>
          <p className="text-xs mt-1">Haz clic en "Agregar negocio" para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/20">
              <tr>
                <th className="text-left py-2 font-mono">Negocio</th>
                <th className="text-left py-2 font-mono">Categoría</th>
                <th className="text-left py-2 font-mono hidden md:table-cell">Contacto</th>
                <th className="py-2 font-mono">Estado</th>
                <th className="py-2 font-mono">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(b => (
                <tr key={b.id} className="border-b border-border/10 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5">
                    <p className="font-display font-semibold">{b.name}</p>
                    {b.address && <p className="text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-2.5 w-2.5" />{b.address}</p>}
                  </td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] border border-gold/20 text-gold font-mono">{b.category}</span>
                  </td>
                  <td className="py-2.5 hidden md:table-cell text-muted-foreground">
                    {b.phone && <p className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" />{b.phone}</p>}
                    {b.website && <p className="flex items-center gap-1"><Globe className="h-2.5 w-2.5" />{b.website}</p>}
                  </td>
                  <td className="py-2.5 text-center">
                    <button onClick={() => toggle(b)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-colors ${b.active ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" : "border-red-500/40 text-red-400 bg-red-500/10"}`}>
                      {b.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditing(b)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button onClick={() => remove(b)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" title="Eliminar">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ThresholdsSection() {
  const [rows, setRows] = useState<Threshold[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("federation_thresholds").select("*").order("federation_key");
    setRows((data ?? []) as Threshold[]);
  };
  useEffect(() => { load(); }, []);

  const update = (id: string, k: keyof Threshold, v: number) => setRows((rs) => rs.map((r) => r.id === id ? { ...r, [k]: v } : r));
  const save = async (r: Threshold) => {
    setSaving(r.id);
    const { error } = await supabase.from("federation_thresholds").update({
      max_latency_ms: r.max_latency_ms, min_integrity: r.min_integrity, max_offline: r.max_offline,
    }).eq("id", r.id);
    setSaving(null);
    if (error) { toast.error(error.message); return; }
    await logAudit("threshold.update", "federation_thresholds", r);
    toast.success(`${r.federation_name} actualizado`);
  };

  return (
    <section className="glass-card rounded-2xl border border-border/20 p-6">
      <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-4"><Activity className="h-4 w-4 text-electric" /> Umbrales de las 7 Federaciones</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/20">
            <tr><th className="text-left py-2">Federación</th><th>Latencia máx (ms)</th><th>Integridad mín</th><th>Offline máx</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/10">
                <td className="py-2 font-display">{r.federation_name}</td>
                <td><input type="number" value={r.max_latency_ms} onChange={(e) => update(r.id, "max_latency_ms", Number(e.target.value))} className="w-24 rounded bg-background/60 border border-border/30 px-2 py-1 text-center" /></td>
                <td><input type="number" step="0.05" value={r.min_integrity} onChange={(e) => update(r.id, "min_integrity", Number(e.target.value))} className="w-24 rounded bg-background/60 border border-border/30 px-2 py-1 text-center" /></td>
                <td><input type="number" value={r.max_offline} onChange={(e) => update(r.id, "max_offline", Number(e.target.value))} className="w-20 rounded bg-background/60 border border-border/30 px-2 py-1 text-center" /></td>
                <td className="text-right">
                  <button onClick={() => save(r)} disabled={saving === r.id} className="inline-flex items-center gap-1 rounded-lg gradient-gold px-3 py-1.5 text-[10px] font-semibold text-primary-foreground shadow-gold disabled:opacity-50">
                    {saving === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />} Guardar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RolesSection() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("operador");
  const [rows, setRows] = useState<RoleRow[]>([]);

  const load = async () => {
    const { data } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false }).limit(50);
    setRows((data ?? []) as RoleRow[]);
  };
  useEffect(() => { load(); }, []);

  const assign = async () => {
    if (!email.trim()) return;
    // Look up profile by email pattern (display_name fallback)
    const { data: prof } = await supabase.from("profiles").select("user_id, display_name").ilike("display_name", email.trim()).limit(1);
    const uid = prof?.[0]?.user_id;
    if (!uid) { toast.error("Usuario no encontrado por display_name. Pídeles que se registren y usa el ID."); return; }
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
    if (error) { toast.error(error.message); return; }
    await logAudit("role.assign", "user_roles", { user_id: uid, role });
    toast.success("Rol asignado");
    setEmail(""); load();
  };

  const revoke = async (r: RoleRow) => {
    await supabase.from("user_roles").delete().eq("id", r.id);
    await logAudit("role.revoke", "user_roles", r);
    load();
  };

  return (
    <section className="glass-card rounded-2xl border border-border/20 p-6">
      <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-4"><Users className="h-4 w-4 text-teal" /> Roles & Permisos</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="display_name del usuario" className="flex-1 rounded-xl bg-background/60 border border-border/30 px-3 py-2 text-sm" />
        <select value={role} onChange={(e) => setRole(e.target.value as AppRole)} className="rounded-xl bg-background/60 border border-border/30 px-3 py-2 text-sm">
          <option value="admin">admin</option><option value="operador">operador</option><option value="lector">lector</option>
        </select>
        <button onClick={assign} className="rounded-xl gradient-gold px-4 py-2 text-xs font-semibold text-primary-foreground shadow-gold">Asignar</button>
      </div>
      <ul className="divide-y divide-border/20">
        {rows.map((r) => (
          <li key={r.id} className="py-2 flex items-center justify-between text-xs font-mono">
            <span>{r.user_id.slice(0, 8)}â€¦ · <span className="text-gold">{r.role}</span></span>
            <button onClick={() => revoke(r)} className="text-red-400 hover:underline">revocar</button>
          </li>
        ))}
        {!rows.length && <p className="text-xs text-muted-foreground py-2">Sin roles asignados.</p>}
      </ul>
    </section>
  );
}

function AuditSection() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(50);
      setRows((data ?? []) as AuditRow[]);
    })();
  }, []);
  return (
    <section className="glass-card rounded-2xl border border-border/20 p-6">
      <h2 className="text-lg font-display font-bold flex items-center gap-2 mb-4"><ScrollText className="h-4 w-4 text-amber-400" /> Auditoría reciente</h2>
      <ul className="space-y-1.5 max-h-96 overflow-y-auto">
        {rows.map((r) => (
          <li key={r.id} className="text-[11px] font-mono flex items-center justify-between border-b border-border/10 pb-1">
            <span><span className="text-gold">{r.action}</span> <span className="text-muted-foreground">· {r.resource}</span></span>
            <span className="text-muted-foreground">{r.actor_email ?? "â€”"} · {new Date(r.created_at).toLocaleString("es-MX")}</span>
          </li>
        ))}
        {!rows.length && <p className="text-xs text-muted-foreground">Sin eventos aún.</p>}
      </ul>
    </section>
  );
}
