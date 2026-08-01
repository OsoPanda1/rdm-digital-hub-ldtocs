"use client";

import { useMemo, useState } from "react";
import { Search, Store } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { BusinessCard } from "@/components/cards";
import { useNegocios } from "@/hooks/use-negocios";
import { categoryMeta, ECONOMY_HERO } from "@/lib/images";

type CategoryName = "Todos" | string;

export default function DirectorioPage() {
  const [activeCat, setActiveCat] = useState<CategoryName>("Todos");
  const [query, setQuery] = useState("");
  const { data: negocios, isLoading } = useNegocios();

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const biz of negocios ?? []) {
      counts.set(biz.cat, (counts.get(biz.cat) ?? 0) + 1);
    }

    return counts;
  }, [negocios]);

  const categories = useMemo<CategoryName[]>(() => {
    if (!negocios?.length) return ["Todos"];

    const uniqueCategories = [...new Set(negocios.map((biz) => biz.cat))];
    return ["Todos", ...uniqueCategories];
  }, [negocios]);

  const filteredBusinesses = useMemo(() => {
    if (!negocios?.length) return [];

    const normalizedQuery = query.trim().toLowerCase();

    return negocios.filter((biz) => {
      const matchesCategory = activeCat === "Todos" || biz.cat === activeCat;
      const matchesQuery =
        !normalizedQuery ||
        biz.name.toLowerCase().includes(normalizedQuery) ||
        biz.description?.toLowerCase().includes(normalizedQuery) ||
        biz.address?.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [negocios, activeCat, query]);

  const totalBusinesses = negocios?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f2efe8]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(200,163,86,0.10),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18%)]" />

      <PageHero
        eyebrow="Economía local"
        title="Directorio de negocios"
        subtitle="Pasteurías, cafés, hospedaje, artesanías y servicios del pueblo mágico."
        image={ECONOMY_HERO}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/8 bg-white/[0.02] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[#a7adb8]">
                <span className="h-2 w-2 rounded-full bg-[#c8a356] shadow-[0_0_16px_rgba(200,163,86,0.55)]" />
                <span>{totalBusinesses} negocios registrados</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => {
                  const isActive = activeCat === cat;
                  const count =
                    cat === "Todos"
                      ? totalBusinesses
                      : categoryCounts.get(cat) ?? 0;

                  const label = cat === "Todos" ? "Todos" : categoryMeta(cat).label;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCat(cat)}
                      aria-pressed={isActive}
                      className={[
                        "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-[#c8a356]/30 focus:ring-offset-2 focus:ring-offset-[#07080b]",
                        isActive
                          ? "border-[#c8a356]/40 bg-[#c8a356] text-[#0a0b0e] shadow-[0_12px_30px_rgba(200,163,86,0.18)]"
                          : "border-white/8 bg-white/[0.03] text-[#cdd2dc] hover:border-white/14 hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                    >
                      <span>{label}</span>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          isActive ? "bg-black/10 text-black/70" : "bg-white/6 text-[#a7adb8]",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative w-full xl:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c828f]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar negocio, giro o dirección…"
                className={[
                  "w-full rounded-2xl border border-white/8 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-[#f2efe8]",
                  "placeholder:text-[#7c828f] shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
                  "transition-all duration-300 focus:border-[#c8a356]/35 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#c8a356]/20",
                ].join(" ")}
              />
            </div>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]"
                  >
                    <div className="h-44 animate-pulse bg-white/[0.05]" />
                    <div className="space-y-4 p-6">
                      <div className="h-3 w-24 animate-pulse rounded-full bg-white/[0.06]" />
                      <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
                      <div className="h-3 w-full animate-pulse rounded-full
