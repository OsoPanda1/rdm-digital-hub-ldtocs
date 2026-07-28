/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useRef } from "react";
import { Coins, TrendingUp, Users, Building2, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

const KPI_DATA = [
  { label: "Ingresos Totales", value: 22000, prefix: "$", suffix: " MXN", trend: 12.5, up: true },
  { label: "Comercios Activos", value: 47, prefix: "", suffix: "", trend: 8.3, up: true },
  { label: "Transacciones del Mes", value: 312, prefix: "", suffix: "", trend: 15.2, up: true },
  { label: "Impacto Social Estimado", value: 185000, prefix: "$", suffix: " MXN", trend: 3.1, up: false },
];

const REVENUE_BREAKDOWN = [
  { label: "Suscripciones de comercio", pct: 40, color: "bg-primary" },
  { label: "Servicios turísticos", pct: 25, color: "bg-emerald-500" },
  { label: "Productos digitales", pct: 20, color: "bg-violet-500" },
  { label: "Patrocinios", pct: 15, color: "bg-amber-500" },
];

const MONTHLY_TREND = [
  { month: "Ene", value: 12400 },
  { month: "Feb", value: 14200 },
  { month: "Mar", value: 15800 },
  { month: "Abr", value: 18100 },
  { month: "May", value: 19500 },
  { month: "Jun", value: 22000 },
];

const TRANSACTIONS = [
  { desc: "Suscripción Premium — Café La Esperanza", amount: 299, type: "income" },
  { desc: "Comisión por venta — Paste artesanal (x12)", amount: 84, type: "income" },
  { desc: "Reparto FairSplit — Creadores de contenido", amount: -4200, type: "distribution" },
  { desc: "Fondo Comunitario — Restauración Panteón Inglés", amount: -1500, type: "fund" },
  { desc: "Suscripción Advance — Hostal Minero", amount: 799, type: "income" },
  { desc: "Servicio turístico — Tour Las Minas", amount: 450, type: "income" },
];

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [target, duration]);
  return value;
}

function formatMXN(n: number) {
  return n.toLocaleString("es-MX", { style: n > 0 && KPI_DATA[0] ? undefined : undefined, maximumFractionDigits: 0 });
}

function KpiCard({ kpi }: { kpi: (typeof KPI_DATA)[0] }) {
  const animatedValue = useCountUp(kpi.value);
  const display = `${kpi.prefix}${formatMXN(animatedValue)}${kpi.suffix}`;
  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-5 hover:border-primary/20 transition-all">
      <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-foreground">{display}</span>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-emerald-500" : "text-rose-500"}`}>
          {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {kpi.trend}%
        </span>
      </div>
    </div>
  );
}

export default function EconomiaFederada() {
  const maxMonthly = Math.max(...MONTHLY_TREND.map((m) => m.value));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-emerald-950/5 to-primary/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-500/10">
              <Coins className="h-5 w-5 text-emerald-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Economía Federada</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Sistema FairSplit de reparto justo — 30+ formas de monetización ética para el ecosistema Real del Monte.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* KPIs */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI_DATA.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Desglose de Ingresos</h2>
          <div className="rounded-xl border border-border/40 bg-card/40 p-6 space-y-4">
            {REVENUE_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-muted-foreground">{item.pct}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Capital Flow */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Flujo de Capital</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 rounded-xl border border-border/40 bg-card/40 p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Fondeo Inicial</p>
              <p className="text-lg font-bold text-foreground">TAMV → Ingresos</p>
              <p className="text-sm text-muted-foreground mt-1">Comercio, turismo, productos digitales</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-primary md:rotate-0 rotate-90" />
            </div>
            <div className="flex-1 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Distribución</p>
              <p className="text-lg font-bold text-primary">Phoenix Fund</p>
              <p className="text-sm text-muted-foreground mt-1">Motor de reparto FairSplit</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-primary md:rotate-0 rotate-90" />
            </div>
            <div className="flex-1 rounded-xl border border-border/40 bg-card/40 p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Comunidad</p>
              <p className="text-lg font-bold text-foreground">Redistribución</p>
              <p className="text-sm text-muted-foreground mt-1">70% creadores · 25% fondo comunitario · 5% plataforma</p>
            </div>
          </div>
        </section>

        {/* Monthly Trend */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Tendencia Mensual (2026)</h2>
          <div className="rounded-xl border border-border/40 bg-card/40 p-6">
            <div className="flex items-end gap-3 h-48">
              {MONTHLY_TREND.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    ${formatMXN(m.value)}
                  </span>
                  <div className="w-full relative" style={{ height: `${(m.value / maxMonthly) * 120}px` }}>
                    <div className="absolute inset-0 rounded-t-md bg-gradient-to-t from-primary/80 to-primary/40 transition-all duration-700" />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Transacciones Recientes</h2>
          <div className="rounded-xl border border-border/40 bg-card/40 divide-y divide-border/30">
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors">
                <span className="text-sm text-foreground">{tx.desc}</span>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}${formatMXN(Math.abs(tx.amount))} MXN
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
