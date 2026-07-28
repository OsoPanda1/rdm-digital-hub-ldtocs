/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Podcast Page â€” Spotify Podcasts (replaces Archivo Sonoro / FM Radio)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, Search, Globe, Mic } from "lucide-react";
import { SpotifyPodcastPlayer, type PodcastEpisode } from "@/components/rdm/SpotifyPodcastPlayer";

const API_BASE = import.meta.env.VITE_API_URL || "";

const FALLBACK_PODCASTS: PodcastEpisode[] = [
  {
    id: "podcast-isabella",
    title: "Isabella VillaseÃ±or â€” DiÃ¡logos del Pueblo MÃ¡gico",
    description: "Conversaciones sobre cultura, identidad y tecnologÃ­a desde Real del Monte. Narrativas soberanas del ecosistema TAMV.",
    spotifyUri: "spotify:show:6JQijmFkFz5ZqC4MjR3QkX",
    embedUrl: "https://open.spotify.com/embed/show/6JQijmFkFz5ZqC4MjR3QkX?utm_source=generator&theme=0",
    category: "narrativa",
    tags: ["isabella", "cultura", "real-del-monte", "tsov"],
    featured: true,
  },
  {
    id: "podcast-realito",
    title: "Realito AI â€” El Asistente Soberano",
    description: "El podcast donde Realito explora el ecosistema TAMV, responde preguntas de la comunidad y comparte historias del Pueblo MÃ¡gico.",
    spotifyUri: "spotify:show:placeholder-realito",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-realito?utm_source=generator&theme=0",
    category: "tecnologia",
    tags: ["realito", "ai", "ecosistema", "soberania"],
    featured: true,
  },
  {
    id: "podcast-territorio",
    title: "Voces del Territorio",
    description: "Historias, testimonios y anÃ¡lisis desde los pueblos mÃ¡gicos de Hidalgo. PercepciÃ³n territorial en audio.",
    spotifyUri: "spotify:show:placeholder-territorio",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-territorio?utm_source=generator&theme=0",
    category: "territorial",
    tags: ["territorio", "hidalgo", "pueblo-magico", "comunidad"],
    featured: false,
  },
  {
    id: "podcast-conocimiento",
    title: "Trovadores del Conocimiento",
    description: "DivulgaciÃ³n cientÃ­fica, cultural y tecnolÃ³gica desde la perspectiva del ecosistema TAMV. Conocimiento libre y soberano.",
    spotifyUri: "spotify:show:placeholder-conocimiento",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-conocimiento?utm_source=generator&theme=0",
    category: "conocimiento",
    tags: ["conocimiento", "ciencia", "educacion", "libre"],
    featured: false,
  },
];

const CATEGORIES = [
  { id: "all", name: "Todos", icon: Globe },
  { id: "narrativa", name: "Narrativa", icon: Mic },
  { id: "tecnologia", name: "TecnologÃ­a", icon: Headphones },
  { id: "territorial", name: "Territorio", icon: Globe },
  { id: "conocimiento", name: "Conocimiento", icon: Search },
];

export default function Podcast() {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(FALLBACK_PODCASTS);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/podcast/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.podcasts) setPodcasts(data.podcasts);
      })
      .catch(() => {});
  }, []);

  const filtered = podcasts.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const allFiltered = filtered;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-900/20 via-background to-background border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Podcast</h1>
                <p className="text-sm text-green-600 font-medium">Spotify Ã— TAMV Ecosistema</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mt-4">
              Voces del Pueblo MÃ¡gico en Spotify. Narrativas soberanas, conocimiento libre y percepciÃ³n territorial en audio.
            </p>
          </motion.div>

          {/* Search */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar podcasts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600/50 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Destacados</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((podcast) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SpotifyPodcastPlayer podcast={podcast} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Podcasts */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {activeCategory === "all" ? "Todos los Podcasts" : CATEGORIES.find((c) => c.id === activeCategory)?.name}
        </h2>
        {allFiltered.length === 0 ? (
          <div className="text-center py-16">
            <Headphones className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No se encontraron podcasts con esos criterios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFiltered.map((podcast) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <SpotifyPodcastPlayer podcast={podcast} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
