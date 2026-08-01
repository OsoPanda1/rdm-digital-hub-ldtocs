"use client";

import { useState, useMemo } from "react";
import { Search, Store } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { BusinessCard } from "@/components/cards";
import { useNegocios } from "@/hooks/use-negocios";
import { categoryMeta } from "@/lib/images";
import { ECONOMY_HERO } from "@/lib/images";

export default function DirectorioPage() {
  const [activeCat, setActiveCat] = useState("Todos");
  const [query, setQuery] = useState("");
  const { data: negocios, isLoading } = useNegocios();

  const categories = useMemo(() => {
    if (!negocios) return ["Todos"];
    return ["Todos", ...[...new Set(negocios.map((b) => b.cat))]];
  }, [negocios]);

  const filtered = useMemo(() => {
    if (!negocios) return [];
    const q = query.trim().toLowerCase();
    return negocios.filter((b) => {
      const byCat = activeCat === "Todos" || b.cat === activeCat;
      const byQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [negocios, activeCat, query]);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Economía local"
        title="Directorio de negocios"
        subtitle="Pasteurías, cafés, hospedaje, artesanías y servicios del pueblo mágico."
        image={ECONOMY_HERO}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border ${
                  activeCat === cat
                    ? "bg-[#c8a356]/15 border-[#c8a356]/60 text-[#c8a356]"
                    : "border-[#2a2d35] text-[#9ca3af] hover:text-[#e8e6e0] hover:border-[#3a3e49]"
                }`}
              >
                {cat === "Todos" ? `Todos (${negocios?.length ?? 0})` : `${categoryMeta(cat).label} (${negocios?.filter((b) => b.cat === cat).length ?? 0})`}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar negocio o dirección…"
              className="w-full pl-9 pr-4 py-2.5 bg-[#121418] border border-[#2a2d35] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a356]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#2a2d35] bg-[#121418] overflow-hidden">
                <div className="h-40 animate-pulse bg-[#1a1d24]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-24 rounded bg-[#1a1d24] animate-pulse" />
                  <div className="h-5 w-2/3 rounded bg-[#1a1d24] animate-pulse" />
                  <div className="h-3 w-full rounded bg-[#1a1d24] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
            <Store className="h-8 w-8 mx-auto text-[#6b7280]" />
            <p className="font-medium">Sin resultados</p>
            <p className="text-sm text-[#9ca3af]">Ajusta el filtro o la búsqueda.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#9ca3af]">
              {filtered.length} {filtered.length === 1 ? "negocio" : "negocios"} en el directorio
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((biz) => (
                <BusinessCard key={biz.id} biz={biz} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
