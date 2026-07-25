// ────────────────────────────────────────────────────────────────
// F3 — Turismo Inteligente
// POIs, rutas dinámicas, geofencing cultural, mapas de calor
// ────────────────────────────────────────────────────────────────

export interface POI {
  id: string;
  name: string;
  description: string;
  category: "monumento" | "museo" | "restaurante" | "tienda" | "evento" | "naturaleza";
  lat: number;
  lng: number;
  rating: number;
  territory: string;
}

export interface TurismoRoute {
  id: string;
  name: string;
  description: string;
  stops: string[];
  distanceKm: number;
  estimatedMinutes: number;
  category: "cultural" | "gastronomica" | "aventura" | "historica";
}

export interface TurismoF3 {
  getPOIs(limit?: number): Promise<POI[]>;
  addPOI(poi: Omit<POI, "id">): Promise<POI>;
  getRoutes(category?: string): Promise<TurismoRoute[]>;
  addRoute(route: Omit<TurismoRoute, "id">): Promise<TurismoRoute>;
  getHeatmap(): Promise<{ lat: number; lng: number; intensity: number }[]>;
  stats(): Promise<{ totalPOIs: number; totalRoutes: number; byCategory: Record<string, number> }>;
}

export function createTurismoF3(): TurismoF3 {
  const pois = new Map<string, POI>();
  const routes = new Map<string, TurismoRoute>();

  const defaultPOIs: Omit<POI, "id">[] = [
    { name: "Mina de Acosta", description: "Mina histórica colonial de plata", category: "museo", lat: 20.1833, lng: -98.6667, rating: 4.7, territory: "Real del Monte" },
    { name: "Panteón Inglés", description: "Cementerio histórico de mineros británicos", category: "monumento", lat: 20.1820, lng: -98.6650, rating: 4.5, territory: "Real del Monte" },
    { name: "Museo del Paste", description: "Museo del paste y la minería", category: "museo", lat: 20.1815, lng: -98.6680, rating: 4.6, territory: "Real del Monte" },
  ];

  const defaultRoutes: Omit<TurismoRoute, "id">[] = [
    { name: "Ruta Minera Colonial", description: "Recorrido por los sitios mineros históricos", stops: ["mina-acosta", "panteon-ingles", "museo-paste"], distanceKm: 2.5, estimatedMinutes: 120, category: "historica" },
  ];

  for (const poi of defaultPOIs) {
    const id = `poi-${Math.random().toString(36).slice(2, 8)}`;
    pois.set(id, { ...poi, id });
  }
  for (const route of defaultRoutes) {
    const id = `route-${Math.random().toString(36).slice(2, 8)}`;
    routes.set(id, { ...route, id });
  }

  return {
    async getPOIs(limit = 50) { return Array.from(pois.values()).slice(0, limit); },
    async addPOI(poi) {
      const id = `poi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const full: POI = { ...poi, id };
      pois.set(id, full);
      return full;
    },
    async getRoutes(category) {
      const all = Array.from(routes.values());
      return category ? all.filter((r) => r.category === category) : all;
    },
    async addRoute(route) {
      const id = `route-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const full: TurismoRoute = { ...route, id };
      routes.set(id, full);
      return full;
    },
    async getHeatmap() {
      return Array.from(pois.values()).map((p) => ({ lat: p.lat, lng: p.lng, intensity: p.rating / 5 }));
    },
    async stats() {
      const byCategory: Record<string, number> = {};
      for (const [, p] of pois) byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
      return { totalPOIs: pois.size, totalRoutes: routes.size, byCategory };
    },
  };
}
