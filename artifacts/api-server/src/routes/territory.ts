import type { Router } from "express";
import { validate, schemas } from "../middlewares/validate";
import { getDb, isDbAvailable } from "../lib/db-client";
import { territories, poiState } from "../../db/schema";
import { requireRdmRole } from "../lib/security";

type Place = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
};

type Commerce = {
  id: string;
  name: string;
  category: string;
  membership: "comunidad" | "raiz" | "guardian";
};

function parseAskBody(body: unknown): { message: string } {
  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { message?: unknown }).message !== "string"
  ) {
    throw new Error("message is required");
  }

  const message = (body as { message: string }).message.trim();

  if (!message || message.length > 2000) {
    throw new Error("message must be between 1 and 2000 characters");
  }

  return { message };
}

// Fallback mock data — used only when DATABASE_URL is not set (dev mode).
const MOCK_PLACES: Place[] = [
  { id: "rdm-centro", name: "Real del Monte Centro", type: "historico", lat: 20.1432, lng: -98.6694 },
  { id: "mina-acosta", name: "Mina de Acosta", type: "mineria", lat: 20.1421, lng: -98.6712 },
  { id: "panteon-ingles", name: "Panteón Inglés", type: "patrimonio", lat: 20.1455, lng: -98.6678 },
];

const MOCK_COMMERCE: Commerce[] = [
  { id: "com-pasteria-real", name: "Pastería La Plaza", category: "paste", membership: "raiz" },
  { id: "com-cafe-neblina", name: "Café Neblina", category: "cafe", membership: "raiz" },
  { id: "com-mesa-cornish", name: "La Mesa Cornish", category: "restaurante", membership: "guardian" },
];

export function registerTerritoryRoutes(router: Router) {
  // Listado de lugares territoriales — DB-backed when available, mock fallback in dev.
  router.get("/territory/places", async (_req, res, next) => {
    try {
      if (!isDbAvailable()) {
        res.status(200).json({ success: true, data: MOCK_PLACES });
        return;
      }
      const db = getDb();
      const rows = await db.select().from(territories).limit(50);
      const places = rows.map((r) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        lat: r.lat ?? 0,
        lng: r.lng ?? 0,
      }));
      res.status(200).json({ success: true, data: places.length > 0 ? places : MOCK_PLACES });
    } catch (err) { next(err); }
  });

  // Listado de comercios afiliados — mock (no commerce table yet).
  router.get("/territory/commerce", (_req, res) => {
    res.status(200).json({ success: true, data: MOCK_COMMERCE });
  });

  // Endpoint de IA territorial — delega al pipeline de Isabella.
  router.post("/territory/ai/ask", requireRdmRole("user"), validate(schemas.territoryAiAsk), (req, res, next) => {
    try {
      const { message } = parseAskBody(req.body);

      const lower = (message ?? "").toLowerCase();
      const isGastronomia = /comida|paste|café|chocolate|mezcal|restaur/i.test(lower);
      const isTurismo = /turis|visita|lugar|ruta|tour|sender/i.test(lower);
      const isHistoria = /histor|miner|colonial|pasado/i.test(lower);

      let response: string;
      if (isGastronomia) {
        response = `Isabella recomienda: ${MOCK_COMMERCE.map((p) => p.name).join(", ")}. La gastronomía es patrimonio vivo de Real del Monte.`;
      } else if (isTurismo) {
        response = `Isabella recomienda: ${MOCK_PLACES.slice(0, 3).map((p) => p.name).join(", ")}. Cada visita fortalece la memoria colectiva del territorio.`;
      } else if (isHistoria) {
        response = `Real del Monte tiene una historia minera fascinante desde el siglo XVI. Los mineros británicos dejaron una huella profunda en nuestra cultura y gastronomía.`;
      } else {
        response = `Isabella operativo territorial: ${message}\nLugares priorizados: ${MOCK_PLACES.map((place) => place.name).join(", ")}`;
      }

      res.status(200).json({
        success: true,
        data: {
          response,
          mode: "NORMAL",
          note: "Endpoint legacy. Para funcionalidad completa, use POST /api/isabella/chat",
        },
      });
    } catch (err) {
      next(err);
    }
  });
}
