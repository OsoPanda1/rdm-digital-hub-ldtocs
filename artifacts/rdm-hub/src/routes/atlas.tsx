// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Layers, Search, X, Navigation, Star, Zap, Clock, Globe, Compass, ChevronLeft } from "lucide-react";
import { UnifiedMap, RDM_BOUNDS } from "@/components/visualization";
import { HEPTA_LAYERS, federationColor } from "@/lib/federation";
import { REAL_DEL_MONTE_SITES } from "@/lib/kernel";
import { fastDistance } from "@/core/geo/haversine.fast";

// Real del Monte federated nodes
const NODES = [
  { id: "nodo-cero", name: "Nodo Cero · Plaza Principal", lat: 20.143, lon: -98.668, fed: "fed4_local_government", category: "gobernanza" },
  { id: "panteon-ingles", name: "Panteón Inglés", lat: 20.148, lon: -98.671, fed: "fed2_tourism_culture", category: "historia" },
  { id: "mina-acosta", name: "Mina La Acosta", lat: 20.139, lon: -98.674, fed: "fed5_tech_infra", category: "historia" },
  { id: "iglesia-veracruz", name: "Iglesia Veracruz", lat: 20.141, lon: -98.667, fed: "fed3_academia_science", category: "cultura" },
  { id: "mercado", name: "Mercado Soberano", lat: 20.144, lon: -98.664, fed: "fed1_commerce_local", category: "comercio" },
  { id: "puente-mineros", name: "Puente Los Mineros", lat: 20.137, lon: -98.669, fed: "fed6_community_orgs", category: "patrimonio" },
  { id: "ipfs-anchor", name: "Anclaje IPFS · Cerro El Hiloche", lat: 20.151, lon: -98.66, fed: "fed1_commerce_local", category: "infraestructura" },
] as const;

export const Route = createFileRoute("/atlas")({
  head: () => ({
    meta: [
      { title: "Atlas Territorial · Gemelo Digital · RDM" },
      { name: "description", content: "Cartografía soberana de Real del Monte con nodos federados georeferenciados." },
      { property: "og:title", content: "Atlas Territorial · RDM Digital" },
    ],
  }),
  component: AtlasPage,
});

function AtlasPage() {
  const { mapRef, state, setActiveLayer, clearFog, connectionState, isReady } = UnifiedMap({
    containerId: "atlas-map",
    initialCenter: RDM_BOUNDS.center,
    initialZoom: RDM_BOUNDS.zoom,
    enableFogOfWar: true,
    enableRealtime: true,
    enableUserLocation: true,
    onPOIClick: (poi) => console.log('[Atlas] POI clicked:', poi),
    onBoundsChange: (bounds) => console.log('[Atlas] Bounds:', bounds.toString()),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<typeof NODES[0] | null>(null);
  const [expandedSidebar, setExpandedSidebar] = useState(false);

  const filteredNodes = NODES.filter((n) => {
    if (activeCategory && n.category !== activeCategory) return false;
    if (searchQuery && !n.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [...new Set(NODES.map(n => n.category))].sort();

  const handlePOIClick = (poi: typeof NODES[0]) => {
    setSelectedPOI(selectedPOI?.id === poi.id ? null : poi);
  };

  return (
    <section className="min-h-screen bg-background">
      {/* Map Container */}
      <div className="relative h-[calc(100vh-4rem)] w-full" ref={mapRef} id="atlas-map">
        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/95 backdrop-blur">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-display text-xl text-ink">Inicializando Atlas Territorial...</p>
              <p className="text-sm text-muted-foreground mt-1">Cargando capas federadas y niebla de guerra</p>
            </div>
          </div>
        )}

        {/* Header Overlay */}
        <div className="absolute inset-x-0 top-0 z-20 p-4 pointer-events-none">
          <div className="container mx-auto pointer-events-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background/90 backdrop-blur border-hairline shadow-card">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-sovereign text-accent">II · Atlas</p>
                  <h1 className="font-display text-2xl md:text-3xl text-ink">Atlas <span className="text-gradient-copper italic">Territorial</span></h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-hairline bg-card/90 backdrop-blur shadow-card text-xs">
                  <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-success' : connectionState === 'connecting' ? 'bg-warning animate-pulse' : 'bg-destructive'}`} />
                  <span className="text-muted-foreground capitalize">{connectionState}</span>
                </div>
                <button
                  onClick={() => setExpandedSidebar(!expandedSidebar)}
                  className="p-2 rounded-xl bg-background/90 backdrop-blur border-hairline shadow-card hover:bg-secondary"
                  aria-label={expandedSidebar ? "Colapsar panel" : "Expandir panel"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="rounded-full border-hairline bg-card/90 backdrop-blur shadow-card p-1.5 flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar nodo, lugar, federación..."
                className="bg-transparent text-sm focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} aria-label="Limpiar búsqueda">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Location Button */}
        <div className="absolute bottom-6 right-4 z-20 pointer-events-none">
          <button
            onClick={() => setSelectedPOI(null)}
            className="pointer-events-auto rounded-full border-hairline bg-card/90 backdrop-blur p-2 text-accent hover:bg-secondary shadow-card"
            aria-label="Mi ubicación"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* Fog Skip Button */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <button
            onClick={clearFog}
            className="pointer-events-auto rounded-full border border-amber-200/40 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-amber-100/80 backdrop-blur-md hover:border-amber-200/70 hover:text-amber-100 transition-all"
          >
            Saltar niebla
          </button>
        </div>
      </div>

      {/* Sidebar - Expandable */}
      <motion.aside
        initial={{ x: expandedSidebar ? 0 : 380, opacity: expandedSidebar ? 1 : 0 }}
        animate={{ x: expandedSidebar ? 0 : 380, opacity: expandedSidebar ? 1 : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full z-30 bg-background border-l border-hairline shadow-2xl overflow-y-auto"
        style={{ width: expandedSidebar ? 380 : 0 }}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-mono text-[9px] tracking-sovereign text-accent">Nodos federados</p>
                <h3 className="font-display text-lg text-ink">{filteredNodes.length} de {NODES.length}</h3>
              </div>
            </div>
            <button
              onClick={() => setExpandedSidebar(false)}
              className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-hairline space-y-3">
            {/* Category Filter */}
            <div>
              <p className="font-mono text-[9px] tracking-sovereign text-muted-foreground mb-2">Categorías</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`px-2.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all ${
                    !activeCategory
                      ? "bg-foreground text-background"
                      : "border-hairline bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="w-3 h-3 mr-1 inline-block" /> Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-2.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all ${
                      activeCategory === cat
                        ? "bg-secondary text-foreground"
                        : "border-hairline bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Federation Filter */}
            <div>
              <p className="font-mono text-[9px] tracking-sovereign text-muted-foreground mb-2">Federación</p>
              <div className="flex flex-wrap gap-1.5">
                {HEPTA_LAYERS.map((layer) => (
                  <button
                    key={layer.key}
                    onClick={() => setActiveCategory(layer.key)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all border-hairline"
                    style={{
                      backgroundColor: activeCategory === layer.key ? layer.color : 'transparent',
                      color: activeCategory === layer.key ? '#0f172a' : undefined,
                      borderColor: activeCategory === layer.key ? layer.color : undefined,
                    }}
                  >
                    <span className="text-lg">{layer.glyph}</span>
                    {layer.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nodes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredNodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No se encontraron nodos</p>
              </div>
            ) : (
              filteredNodes.map((node) => {
                const color = federationColor(node.fed);
                const isSelected = selectedPOI?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => handlePOIClick(node)}
                    className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-all ${
                      isSelected
                        ? "border-accent shadow-[0_0_0_2px_hsl(var(--accent)/0.35)] bg-accent/5"
                        : "border-hairline bg-card hover:shadow-card"
                    }`}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-sm text-ink truncate">{node.name}</div>
                      <div className="font-mono text-[10px] tracking-sovereign mt-1" style={{ color }}>
                        {HEPTA_LAYERS.find(l => l.key === node.fed)?.name || node.fed}
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-1">
                        {node.lat.toFixed(4)}, {node.lon.toFixed(4)}
                      </div>
                    </div>
                    {isSelected && (
                      <Star className="w-4 h-4 text-accent flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Selected POI Detail */}
          {selectedPOI && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-t border-hairline bg-background/50 backdrop-blur"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: federationColor(selectedPOI.fed) }}>
                    <MapPin className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-display text-base text-ink">{selectedPOI.name}</h4>
                    <p className="font-mono text-[10px] tracking-sovereign" style={{ color: federationColor(selectedPOI.fed) }}>
                      {HEPTA_LAYERS.find(l => l.key === selectedPOI!.fed)?.name || selectedPOI.fed}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedPOI(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Coordenadas: {selectedPOI.lat.toFixed(6)}, {selectedPOI.lon.toFixed(6)}
              </p>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Federación: {HEPTA_LAYERS.find(l => l.key === selectedPOI!.fed)?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Categoría: {selectedPOI.category}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </section>
  );
}
