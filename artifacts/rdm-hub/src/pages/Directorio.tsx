/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { useState, useMemo, useEffect, useCallback } from "react";
import GradientSeparator from "@/components/GradientSeparator";
import { SEOMeta, PAGE_SEO } from "@/components/SEOMeta";
import { AuroraBackground } from "@/components/VisualEffects";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Store, Sparkles, Star, Phone, MapPin, Clock,
  ChevronLeft, Globe, Instagram, ArrowUpDown, Loader2,
  AlertTriangle, X, MessageSquare,
} from "lucide-react";
import { useLoadingTimeout } from "@/hooks/useLoadingTimeout";

import pasteriasImg from "@/assets/pasterias.png";
import plateriasImg from "@/assets/platerias.png";
import artesaniasImg from "@/assets/artesanias.png";
import sanitariosImg from "@/assets/sanitarios.png";
import minaImg from "@/assets/mina-acosta.webp";
import callesImg from "@/assets/calles-colonial.webp";
import rdm1 from "@/assets/rdm1.jpeg";
import rdm2 from "@/assets/rdm2.jpeg";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface Business {
  id?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  isPremium: boolean;
  rating: number;
  phone?: string;
  address?: string;
  hours?: string;
  website?: string;
  instagram?: string;
  lat?: number;
  lng?: number;
  reviews?: { author: string; text: string; rating: number; date: string }[];
  created_at?: string;
}

const FALLBACK_BUSINESSES: Business[] = [
  { id: "fb-1", name: "Pastes El Portal", category: "Restaurantes", description: "Los pastes mas tradicionales desde 1985. Sabores clasicos y nuevas creaciones.", image: pasteriasImg, isPremium: true, rating: 4.9, phone: "771 123 4567", address: "Calle 5 de Mayo 12, Centro", hours: "Lun-Dom 8:00-21:00" },
  { id: "fb-2", name: "Hotel Real de Minas", category: "Turismo", description: "Hotel boutique en casona colonial restaurada con vista a la montana.", image: callesImg, isPremium: true, rating: 4.7, phone: "771 234 5678", address: "Camino a la Aurora s/n", hours: "24 horas" },
  { id: "fb-3", name: "Tours Mineros RDM", category: "Turismo", description: "Recorridos guiados por las minas historicas con expertos en historia local.", image: minaImg, isPremium: false, rating: 4.5, address: "Plaza Mina s/n" },
  { id: "fb-4", name: "Cafe La Neblina", category: "Restaurantes", description: "Cafe artesanal de altura con los mejores postres y vista al bosque.", image: rdm1, isPremium: false, rating: 4.4, hours: "Mar-Dom 9:00-19:00" },
  { id: "fb-5", name: "Artesanias del Monte", category: "Tiendas", description: "Artesanias locales, textiles y recuerdos autenticos hechos a mano.", image: artesaniasImg, isPremium: true, rating: 4.6, phone: "771 345 6789", address: "Calle Hidalgo 45" },
  { id: "fb-6", name: "Platerias Artesanales", category: "Tiendas", description: "Joyeria artesanal en plata, herencia minera de Real del Monte.", image: plateriasImg, isPremium: false, rating: 4.3, address: "Calle Matamoros 22" },
  { id: "fb-7", name: "Servicios Turisticos", category: "Servicios", description: "Informacion turistica, sanitarios y puntos de asistencia al visitante.", image: sanitariosImg, isPremium: false, rating: 4.2, address: "Plaza de Armas" },
  { id: "fb-8", name: "Restaurant Los Murmullos", category: "Restaurantes", description: "Comida tradicional hidalguense con ingredientes locales frescos.", image: rdm2, isPremium: true, rating: 4.5, phone: "771 456 7890", address: "Calle Galeana 8", hours: "Mar-Dom 12:00-22:00" },
];

const CATEGORIES = ["Todos", "Restaurantes", "Tiendas", "Servicios", "Turismo", "Cultura"];
type SortOption = "name" | "rating" | "newest";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= Math.round(rating) ? "text-gold-400 fill-gold-400" : "text-silver-600"}`}
        />
      ))}
      <span className="ml-1 text-xs text-silver-400">{rating.toFixed(1)}</span>
    </div>
  );
}

const DirectorioPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const showSlowLoad = useLoadingTimeout(loading, 5000);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/businesses?select=*&order=name.asc`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (!res.ok) throw new Error("Supabase query failed");
        const data = await res.json();
        if (data && data.length > 0) {
          setBusinesses(data.map((b: Record<string, unknown>) => ({
            id: b.id as string,
            name: (b.name as string) || "",
            category: (b.category as string) || "Servicios",
            description: (b.description as string) || "",
            image: (b.image_url as string) || pasteriasImg,
            isPremium: (b.is_premium as boolean) || false,
            rating: (b.rating as number) || 4.0,
            phone: b.phone as string | undefined,
            address: b.address as string | undefined,
            hours: b.hours as string | undefined,
            website: b.website as string | undefined,
            instagram: b.instagram as string | undefined,
            lat: b.lat as number | undefined,
            lng: b.lng as number | undefined,
            reviews: b.reviews as Business["reviews"],
            created_at: b.created_at as string | undefined,
          })));
          return;
        }
      }
      setBusinesses(FALLBACK_BUSINESSES);
    } catch {
      setBusinesses(FALLBACK_BUSINESSES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const filteredBusinesses = useMemo(() => {
    let result = businesses.filter((biz) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        biz.name.toLowerCase().includes(q) ||
        biz.description.toLowerCase().includes(q) ||
        biz.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "Todos" || biz.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "newest") result.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    else result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [businesses, searchQuery, activeCategory, sortBy]);

  const expandedBusiness = expandedId ? businesses.find((b) => (b.id ?? b.name) === expandedId) : null;

  return (
    <RDMLayout>
      <SEOMeta {...(PAGE_SEO.directorio ?? { title: "Directorio de Negocios | RDM Digital", description: "Comercios, hoteles, restaurantes y servicios de Real del Monte." })} />
      <div className="min-h-screen bg-background">
        <section className="relative overflow-hidden pt-24 pb-16">
          <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${callesImg})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-night-900/80 via-night-900/70 to-night-900" />
          <AuroraBackground />
          <div className="dust-particles" />
          <div className="relative mx-auto max-w-6xl px-6 py-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                <Store className="h-3.5 w-3.5 text-gold-400" />
                <span>Negocios Verificados</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl leading-tight">
                <span className="block">Directorio de</span>
                <span className="block animate-gradient-text text-glow-gold" style={{ backgroundImage: "linear-gradient(135deg, hsl(43,80%,55%) 0%, hsl(35,70%,65%) 25%, hsl(43,80%,55%) 50%, hsl(25,60%,50%) 75%, hsl(43,80%,55%) 100%)", backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Negocios</span>
              </h1>
              <p className="max-w-2xl text-base text-silver-400 md:text-lg leading-relaxed">Comercios, hoteles, restaurantes y servicios recomendados por la comunidad de Real del Monte.</p>
            </motion.div>
          </div>
        </section>

        <GradientSeparator animated />

        <section className="relative py-10">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-silver-500" />
                <input type="text" placeholder="Buscar negocios..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-silver-200 placeholder:text-silver-500 backdrop-blur-sm focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 transition-all duration-300" />
              </div>

              <div className="hidden md:flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${activeCategory === cat ? "bg-gold-400/20 text-gold-400 border border-gold-400/30" : "border border-white/10 bg-white/5 text-silver-400 hover:bg-white/10 hover:text-silver-200"}`}>{cat}</button>
                ))}
              </div>

              <div className="md:hidden">
                <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-silver-300">
                  <ArrowUpDown className="h-4 w-4" />Filtro: {activeCategory}
                </button>
                {mobileFilterOpen && (
                  <div className="mt-2 p-2 rounded-xl border border-white/10 bg-night-900/90 backdrop-blur-sm space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => { setActiveCategory(cat); setMobileFilterOpen(false); }} className={`block w-full text-left rounded-lg px-3 py-2 text-sm ${activeCategory === cat ? "bg-gold-400/20 text-gold-400" : "text-silver-400 hover:bg-white/5"}`}>{cat}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-silver-500">
                  <ArrowUpDown className="h-3 w-3" />
                  <span>Ordenar:</span>
                  {([["name", "Nombre"], ["rating", "Rating"], ["newest", "Mas recientes"]] as [SortOption, string][]).map(([val, label]) => (
                    <button key={val} onClick={() => setSortBy(val)} className={`px-2 py-1 rounded ${sortBy === val ? "text-gold-400 bg-gold-400/10" : "hover:text-silver-300"}`}>{label}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex items-center gap-2 mb-6 text-sm text-silver-500">
            <Sparkles className="h-3.5 w-3.5 text-gold-400/60" />
            <span>Mostrando {filteredBusinesses.length} de {businesses.length} comercios</span>
          </div>

          {loading ? (
            <div>
              <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}</div>
              {showSlowLoad && (
                <p className="text-muted-foreground text-sm text-center mt-4">Cargando... esto está tardando más de lo esperado</p>
              )}
            </div>
          ) : error ? (
            <div className="text-center py-16 rounded-2xl border border-red-500/20 bg-red-500/5">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-300 text-lg">{error}</p>
              <button onClick={fetchBusinesses} className="mt-4 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors">Reintentar</button>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
              <Store className="h-12 w-12 text-silver-500 mx-auto mb-4" />
              <p className="text-silver-400 text-lg">No se encontraron comercios.</p>
              <p className="text-silver-500 text-sm mt-2">Intenta con otros terminos de busqueda o categoria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredBusinesses.map((biz, i) => {
                  const bizId = biz.id ?? biz.name;
                  const isExpanded = expandedId === bizId;
                  return (
                    <motion.div key={bizId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: i * 0.05 }} onClick={() => setExpandedId(isExpanded ? null : bizId)} className={`group rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${biz.isPremium ? "border-gold-400/20 bg-gold-400/5 shadow-premium" : "border-white/10 bg-white/5 hover:border-white/20"} ${isExpanded ? "ring-1 ring-gold-400/30" : ""}`}>
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                          <img src={biz.image} alt={biz.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-serif text-base font-semibold text-foreground truncate">{biz.name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-medium text-silver-300 shrink-0">{biz.category}</span>
                          </div>
                          <StarRating rating={biz.rating} />
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{biz.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-silver-500">
                            {biz.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{biz.phone}</span>}
                            {biz.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{biz.address}</span>}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                              <p className="text-sm text-silver-300 leading-relaxed">{biz.description}</p>
                              {biz.hours && (
                                <div className="flex items-center gap-2 text-sm text-silver-400">
                                  <Clock className="h-4 w-4 text-gold-400/60" /><span>{biz.hours}</span>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {biz.phone && <a href={`tel:${biz.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/15 text-gold-400 text-sm font-medium hover:bg-gold-400/25 transition-colors"><Phone className="h-4 w-4" />Llamar</a>}
                                {biz.lat && biz.lng && <a href={`https://www.google.com/maps?q=${biz.lat},${biz.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-silver-300 text-sm font-medium hover:bg-white/15 transition-colors"><MapPin className="h-4 w-4" />Ubicar</a>}
                                {biz.website && <a href={biz.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-silver-300 text-sm font-medium hover:bg-white/15 transition-colors"><Globe className="h-4 w-4" />Web</a>}
                                {biz.instagram && <a href={`https://instagram.com/${biz.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-silver-300 text-sm font-medium hover:bg-white/15 transition-colors"><Instagram className="h-4 w-4" />Instagram</a>}
                              </div>
                              {biz.reviews && biz.reviews.length > 0 && (
                                <div className="space-y-2">
                                  <h4 className="text-xs font-semibold text-silver-400 uppercase tracking-wide flex items-center gap-1"><MessageSquare className="h-3 w-3" />Resenas ({biz.reviews.length})</h4>
                                  {biz.reviews.map((r, ri) => (
                                    <div key={ri} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-silver-300">{r.author}</span>
                                        <StarRating rating={r.rating} />
                                      </div>
                                      <p className="text-xs text-silver-400">{r.text}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </RDMLayout>
  );
};

export default DirectorioPage;
