/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { Router, Request, Response, NextFunction } from "express";
import { getDb, isDbAvailable } from "../lib/db-client";
import { territories, poiState } from "../../db/schema";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";
import { eq, ilike, sql, and, or } from "drizzle-orm";
import { apiSuccess, apiPaginated, apiError } from "../lib/api-response";
import { validate, schemas } from "../middlewares/validate";

type Place = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description?: string;
  address?: string;
  hours?: string;
  rating?: number;
  category?: string;
};

type Commerce = {
  id: string;
  name: string;
  category: string;
  membership: "comunidad" | "raiz" | "guardian";
  description?: string;
  phone?: string;
  address?: string;
  rating?: number;
};

const MOCK_PLACES: Place[] = [
  { id: "rdm-centro", name: "Real del Monte Centro", type: "historico", lat: 20.1432, lng: -98.6694, description: "Centro historico del pueblo magico de Real del Monte.", category: "monumento" },
  { id: "mina-acosta", name: "Mina de Acosta", type: "mineria", lat: 20.1421, lng: -98.6712, description: "Mina historica donde trabajaron los mineros cornish en el siglo XIX.", category: "mina" },
  { id: "panteon-ingles", name: "Panteon Ingles", type: "patrimonio", lat: 20.1455, lng: -98.6678, description: "Cementerio de la comunidad britanica, testimonio de la influencia cornish.", category: "monumento" },
  { id: "plaza-mina", name: "Plaza Mina", type: "plaza", lat: 20.1438, lng: -98.6688, description: "Plaza principal con monumento al minero.", category: "plaza" },
  { id: "callejon-beso", name: "Callejon del Beso", type: "turismo", lat: 20.1442, lng: -98.6700, description: "Callejón romantico con leyenda local.", category: "calle" },
  { id: "mirador-san-miguel", name: "Mirador de San Miguel", type: "turismo", lat: 20.1460, lng: -98.6670, description: "Mirador con vista panoramica del valle de Pachuca.", category: "mirador" },
  { id: "museo-francisco-rule", name: "Museo Francisco Rule", type: "cultura", lat: 20.1435, lng: -98.6695, description: "Museo de historia minera con maquinaria original.", category: "museo" },
  { id: "iglesia-san-francisco", name: "Iglesia de San Francisco", type: "religioso", lat: 20.1440, lng: -98.6690, description: "Parroquia colonia del siglo XVII.", category: "iglesia" },
];

const MOCK_COMMERCE: Commerce[] = [
  { id: "com-pasteria-real", name: "Pasteria La Plaza", category: "paste", membership: "raiz", description: "Pastes artesanales con receta original cornish.", phone: "771 123 4567", address: "Plaza Mina 3", rating: 4.8 },
  { id: "com-cafe-neblina", name: "Cafe Neblina", category: "cafe", membership: "raiz", description: "Cafe de especialidad de altura.", address: "Calle Hidalgo 12", rating: 4.6 },
  { id: "com-mesa-cornish", name: "La Mesa Cornish", category: "restaurante", membership: "guardian", description: "Restaurante de comida fusion cornish-hidalguense.", phone: "771 234 5678", rating: 4.7 },
  { id: "com-hotel-real", name: "Hotel Real de Minas", category: "hospedaje", membership: "guardian", description: "Hotel boutique en casona colonial.", phone: "771 345 6789", rating: 4.5 },
  { id: "com-tours-mineros", name: "Tours Mineros RDM", category: "tours", membership: "comunidad", description: "Recorridos guiados por las minas historicas.", rating: 4.4 },
  { id: "com-artesanias", name: "Artesanias del Monte", category: "souvenir", membership: "raiz", description: "Artesanias locales y textiles hechos a mano.", phone: "771 456 7890", rating: 4.3 },
  { id: "com-platerias", name: "Platerias Artesanales", category: "souvenir", membership: "comunidad", description: "Joyeria artesanal en plata herencia minera.", rating: 4.2 },
  { id: "com-murmullos", name: "Restaurant Los Murmullos", category: "restaurante", membership: "raiz", description: "Comida tradicional hidalguense con ingredientes locales.", phone: "771 567 8901", rating: 4.6 },
];

const RDM_KNOWLEDGE: Record<string, { answer: string; sources: string[]; relatedPlaces: string[]; followUp: string[] }> = {
  "mina|mineria|minero|minas": {
    answer: "Real del Monte tiene una rica historia minera que comenzo en el siglo XVI. Los mineros britanicos (cornish) llegaron en 1824 trayendo tecnicas avanzadas de mineria que transformaron la region. La Mina de Acosta y la Mina La Dificultad son los sitios mas emblematicos. Los cornish tambien trajeron sus paste (pastes), su musica y sus tradiciones.",
    sources: ["Archivo Historico de Hidalgo", "Museo Francisco Rule", "INEGI"],
    relatedPlaces: ["Mina de Acosta", "Museo Francisco Rule", "Plaza Mina"],
    followUp: ["Quieres visitar la Mina de Acosta?", "Conoce el Museo Francisco Rule", "Que son los pastes cornish?"],
  },
  "paste|pastes|gastronomia|comida|restaurante|cafe|comer": {
    answer: "Los pastes son el platillo mas emblematico de Real del Monte, herencia directa de los mineros cornish (pasties). En 1824 los mineros britanicos trajeron esta tradicion. Los mejores lugares para probarlos son Pasteria La Plaza, Pastes El Portal y La Mesa Cornish. La gastronomia local combina sabores cornish con ingredientes hidalguenses.",
    sources: ["Directorio de Negocios RDM", "Camara de Comercio de Pachuca"],
    relatedPlaces: ["Pasteria La Plaza", "Pastes El Portal", "La Mesa Cornish"],
    followUp: ["Conoce el directorio completo de restaurantes", "Historia de los pastes en RDM"],
  },
  "panteon|cementerio|ingles|britanico|cornish|tumbas": {
    answer: "El Panteon Ingles es uno de los sitios mas singulares de Real del Monte. Fue el cementerio de la comunidad britanica que se establecio en el siglo XIX. Contiene tumbas con inscripciones en ingles y es testimonio de la influencia cultural britanica en la region. Se encuentra en la parte alta del pueblo con vista al valle.",
    sources: ["Patrimonio Cultural de Hidalgo", "Archivo Parroquial"],
    relatedPlaces: ["Panteon Ingles", "Iglesia de San Francisco", "Real del Monte Centro"],
    followUp: ["Visita la Iglesia de San Francisco", "Conoce mas sobre la historia britanica"],
  },
  "turismo|visita|lugar|ruta|tour|sendero|recorrer": {
    answer: "Real del Monte ofrece multiples rutas turisticas: la Ruta Minera (minas historicas), la Ruta Cornish (patrimonio britanico), la Ruta Gastronomica (pastes y restaurantes) y la Ruta Natural (miradores y senderos). Tours Mineros RDM ofrece recorridos guiados con expertos en historia local. El mirador de San Miguel ofrece la mejor vista panoramica.",
    sources: ["Oficina de Turismo RDM", "Tours Mineros RDM"],
    relatedPlaces: ["Mirador de San Miguel", "Mina de Acosta", "Callejon del Beso"],
    followUp: ["Quieres reservar un tour?", "Conoce los miradores de RDM"],
  },
  "historia|historico|colonial|pasado|siglo|xix|xvi": {
    answer: "Real del Monte fue fundado en el siglo XVI y se convirtio en un centro minero importante. En 1824, mineros britanicos de Cornwall llegaron para modernizar la mineria, trayendo tecnicas como el sistema de columnas de agua. Esta influencia se refleja en la arquitectura, gastronomia y tradiciones del pueblo, declarado Pueblo Magico en 2001.",
    sources: ["INEGI", "Archivo General de la Nacion", "Gobierno del Estado de Hidalgo"],
    relatedPlaces: ["Real del Monte Centro", "Museo Francisco Rule", "Panteon Ingles"],
    followUp: ["Conoce el Museo Francisco Rule", "Visita el Panteon Ingles"],
  },
  "iglesia|parroquia|san francisco|religioso|templo": {
    answer: "La Iglesia de San Francisco es la parroquia principal de Real del Monte, construida en el siglo XVII. Destaca por su arquitectura colonial y su interior con retablos barrocos. Es centro de las festividades religiosas mas importantes del pueblo, incluyendo la Semana Santa con procesiones de tamborileros.",
    sources: ["Parroquia de San Francisco", "Turismo Hidalgo"],
    relatedPlaces: ["Iglesia de San Francisco", "Real del Monte Centro"],
    followUp: ["Conoce las tradiciones de Semana Santa", "Visita el centro historico"],
  },
  "museo|francisco rule|exhibicion|maquinaria": {
    answer: "El Museo Francisco Rule alberga una coleccion de maquinaria minera original del siglo XIX, incluyendo bombas de agua, carros de mina y herramientas utilizadas por los mineros cornish. El edificio es una antigua casona minera restaurada. Es el mejor lugar para entender la historia tecnica de la mineria en la region.",
    sources: ["Museo Francisco Rule", "Secretaria de Cultura"],
    relatedPlaces: ["Museo Francisco Rule", "Mina de Acosta"],
    followUp: ["Visita la Mina de Acosta", "Conoce la historia minera"],
  },
  "mirador|vista|panoramica|valle|paisaje": {
    answer: "El Mirador de San Miguel ofrece la mejor vista panoramica del valle de Pachuca y Real del Monte. Desde aqui se pueden observar las montanas circundantes, el pueblo colonial y los antiguos campos de mineria. Es ideal para fotografica al atardecer.",
    sources: ["Turismo RDM"],
    relatedPlaces: ["Mirador de San Miguel", "Cerro de San Miguel"],
    followUp: ["Conoce otras vistas de RDM", "Rutas de senderismo"],
  },
  "callejon|beso|leyenda|romantico": {
    answer: "El Callejon del Beso es uno de los sitios mas romanticos de Real del Monte. Segun la leyenda, dos enamorados de familias rivales se besaban desde los balcones opuestos que estan casi tocandose. El callejon es un pasaje estrecho con arquitectura colonial bien conservada.",
    sources: ["Leyendas de Hidalgo", "Turismo RDM"],
    relatedPlaces: ["Callejon del Beso", "Real del Monte Centro"],
    followUp: ["Conoce mas leyendas de RDM", "Recorre el centro historico"],
  },
  "plata|plateria|joyeria|artesania|artesano": {
    answer: "La tradicion platera de Real del Monte data de la epoca minera. Los artesanos locales crean joyeria y piezas decorativas en plata, aprovechando la herencia metalurgica de la region. Las Platerias Artesanales y las tiendas del centro ofrecen piezas unicas hechas a mano.",
    sources: ["Directorio de Artesanos RDM"],
    relatedPlaces: ["Platerias Artesanales", "Artesanias del Monte"],
    followUp: ["Visita las tiendas de artesanias", "Conoce el proceso artesanal"],
  },
  "hospedaje|hotel|alojamiento|dormir|noche": {
    answer: "Real del Monte ofrece opciones de hospedaje que van desde hoteles boutique en casonas coloniales hasta cabañas en la sierra. El Hotel Real de Minas es la opcion premium con vista a la montana. Tambien hay opciones economicas en el centro historico.",
    sources: ["Directorio de Hospedaje RDM"],
    relatedPlaces: ["Hotel Real de Minas"],
    followUp: ["Ver disponibilidad del Hotel Real de Minas", "Opciones economicas en RDM"],
  },
  "tambor|tamborileros|semana santa|procesion|musica": {
    answer: "Los Tamborileros de Real del Monte son una tradicion unica en Mexico. Durante la Semana Santa, desfilan por las calles del pueblo tocando tambores y flautas en un estilo que mezcla tradiciones cornish con catolicismo mexicano. Esta tradicion esta declarada Patrimonio Cultural Intangible.",
    sources: ["Instituto Nacional de Antropologia e Historia"],
    relatedPlaces: ["Iglesia de San Francisco", "Real del Monte Centro"],
    followUp: ["Conoce los tamborileros", "Festividades de Semana Santa"],
  },
  "clima|temperatura|tiempo|lluvia|nieve": {
    answer: "Real del Monte se encuentra a 2,800 metros de altitud, con un clima fresco todo el ano. La temperatura promedio es de 12-16°C. En invierno puede nevar y las temperaturas bajan a 0°C. El clima es ideal para la gastronomia caliente de los pastes.",
    sources: ["Servicio Meteorologico Nacional"],
    relatedPlaces: ["Mirador de San Miguel"],
    followUp: ["Mejor epoca para visitar RDM", "Que llevar en tu visita"],
  },
  "ecommerce|negocio|comercio|tienda|local": {
    answer: "El Directorio de Negocios de RDM Digital lista los comercios verificados de la comunidad. Encontraras restaurantes, tiendas de artesanias, servicios turisticos y mas. Cada negocio esta verificado por la comunidad y cuenta con calificaciones y resenas.",
    sources: ["Directorio RDM Digital"],
    relatedPlaces: [],
    followUp: ["Explora el directorio completo", "Registra tu negocio"],
  },
  "ecosistema|tsov|tamv|digital|tecnologia|soberania": {
    answer: "Real del Monte es el nucleo del ecosistema TAMV (Territorio Autogestionado de Soberania Virtual), una iniciativa que combina tecnologia digital con soberania comunitaria. El ecosistema incluye inteligencia artificial (Isabella, Realito), economia de prestigio territorial y redes federadas de nodos edge, fog y cloud.",
    sources: ["TAMV Whitepaper", "Documentacion del Ecosistema"],
    relatedPlaces: ["Real del Monte Centro"],
    followUp: ["Conoce a Isabella", "Entiende la economia de prestigio"],
  },
};

function matchKnowledge(message: string): { answer: string; sources: string[]; relatedPlaces: string[]; followUp: string[] } | null {
  const lower = message.toLowerCase();
  for (const [pattern, knowledge] of Object.entries(RDM_KNOWLEDGE)) {
    const keywords = pattern.split("|");
    if (keywords.some((kw) => lower.includes(kw))) {
      return knowledge;
    }
  }
  return null;
}

export function registerTerritoryRoutes(router: Router) {
  router.get("/territory/places", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";
      const offset = (page - 1) * limit;

      if (!isDbAvailable()) {
        let filtered = MOCK_PLACES;
        if (search) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description ?? "").toLowerCase().includes(search.toLowerCase()));
        if (category) filtered = filtered.filter((p) => p.type === category);
        const total = filtered.length;
        const data = filtered.slice(offset, offset + limit);
        res.status(200).json(apiPaginated(data, total, page, limit));
        return;
      }

      const db = getDb();
      const conditions = [];
      if (search) conditions.push(or(ilike(territories.name, `%${search}%`), ilike(territories.type, `%${search}%`)));
      if (category) conditions.push(eq(territories.type, category));

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countResult = await db.select({ count: sql<number>`count(*)::int` }).from(territories).where(whereClause);
      const total = countResult[0]?.count ?? 0;

      const rows = await db.select().from(territories).where(whereClause).limit(limit).offset(offset);
      const places = rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        lat: r.lat ?? 0,
        lng: r.lng ?? 0,
        description: (r.metaJson as Record<string, unknown>)?.description as string | undefined,
        address: (r.metaJson as Record<string, unknown>)?.address as string | undefined,
        hours: (r.metaJson as Record<string, unknown>)?.hours as string | undefined,
        rating: (r.metaJson as Record<string, unknown>)?.rating as number | undefined,
        category: (r.metaJson as Record<string, unknown>)?.category as string | undefined,
      }));

      res.status(200).json(apiPaginated(places.length > 0 ? places : MOCK_PLACES, total || MOCK_PLACES.length, page, limit));
    } catch (err) { next(err); }
  });

  router.get("/territory/commerce", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";

      const db = getDb();
      if (db && isDbAvailable()) {
        try {
          const rows = await db.select().from(territories).where(eq(territories.type, "commerce")).limit(50);
          if (rows.length > 0) {
            let commerce = rows.map((r) => ({
              id: r.id,
              name: r.name,
              category: r.type,
              membership: "comunidad" as const,
              description: (r.metaJson as Record<string, unknown>)?.description as string | undefined,
              phone: (r.metaJson as Record<string, unknown>)?.phone as string | undefined,
              address: (r.metaJson as Record<string, unknown>)?.address as string | undefined,
              rating: (r.metaJson as Record<string, unknown>)?.rating as number | undefined,
            }));
            if (search) commerce = commerce.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
            if (category) commerce = commerce.filter((c) => c.category === category);
            res.status(200).json(apiSuccess(commerce));
            return;
          }
        } catch { /* fallback */ }
      }

      let filtered = MOCK_COMMERCE;
      if (search) filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.description ?? "").toLowerCase().includes(search.toLowerCase()));
      if (category) filtered = filtered.filter((c) => c.category === category);
      res.status(200).json(apiSuccess(filtered));
    } catch (err) { next(err); }
  });

  router.post("/territory/ai/ask", requireRdmRole("user"), rateLimitByRoute({ name: "territory-ai-ask", limit: 30 }), validate(schemas.territoryAiAsk), (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;
      const matched = matchKnowledge(message);

      if (matched) {
        res.status(200).json(apiSuccess({
          response: matched.answer,
          sources: matched.sources,
          relatedPlaces: matched.relatedPlaces,
          followUpSuggestions: matched.followUp,
          mode: "NORMAL",
          confidence: 0.85,
        }));
        return;
      }

      res.status(200).json(apiSuccess({
        response: `Isabella territorial operativo: "${message}". Aun estoy aprendiendo sobre Real del Monte. Prueba preguntar sobre mineria, paste, turismo, historia o el panteon ingles.`,
        sources: [],
        relatedPlaces: MOCK_PLACES.slice(0, 3).map((p) => p.name),
        followUpSuggestions: ["Cuentame sobre la historia minera", "Que lugares puedo visitar?", "Donde comer pastes?"],
        mode: "NORMAL",
        confidence: 0.4,
      }));
    } catch (err) { next(err); }
  });

  router.get("/territory/stats", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (isDbAvailable()) {
        const db = getDb();
        try {
          const [placeCount] = await db.select({ count: sql<number>`count(*)::int` }).from(territories);
          const [poiCount] = await db.select({ count: sql<number>`count(*)::int` }).from(poiState);
          res.status(200).json(apiSuccess({
            totalPlaces: placeCount?.count ?? MOCK_PLACES.length,
            totalCommerce: MOCK_COMMERCE.length,
            totalReviews: poiCount?.count ?? 42,
            lastUpdated: new Date().toISOString(),
          }));
          return;
        } catch { /* fallback */ }
      }

      res.status(200).json(apiSuccess({
        totalPlaces: MOCK_PLACES.length,
        totalCommerce: MOCK_COMMERCE.length,
        totalReviews: 42,
        lastUpdated: new Date().toISOString(),
      }));
    } catch (err) { next(err); }
  });
}
