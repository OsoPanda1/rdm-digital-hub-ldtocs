import type { Router } from "express";

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

// Datos mock de territorio y comercios.
// En el futuro, estos deberían venir de tus módulos de data (atlas, rdmTerritoryPOIs, comercios-catalog, etc.).
const places: Place[] = [
  {
    id: "rdm-centro",
    name: "Real del Monte Centro",
    type: "historico",
    lat: 20.1432,
    lng: -98.6694,
  },
  {
    id: "mina-acosta",
    name: "Mina de Acosta",
    type: "mineria",
    lat: 20.1421,
    lng: -98.6712,
  },
  {
    id: "panteon-ingles",
    name: "Panteón Inglés",
    type: "patrimonio",
    lat: 20.1455,
    lng: -98.6678,
  },
];

const commerce: Commerce[] = [
  {
    id: "com-pasteria-real",
    name: "Pastería La Plaza",
    category: "paste",
    membership: "raiz",
  },
  {
    id: "com-cafe-neblina",
    name: "Café Neblina",
    category: "cafe",
    membership: "raiz",
  },
  {
    id: "com-mesa-cornish",
    name: "La Mesa Cornish",
    category: "restaurante",
    membership: "guardian",
  },
];

// Registro modular de rutas territoriales.
// Se usa desde routes/index.ts: registerTerritoryRoutes(router).
export function registerTerritoryRoutes(router: Router) {
  // Listado de lugares territoriales (mock).
  router.get("/territory/places", (_req, res) => {
    res.status(200).json({
      success: true,
      data: places,
    });
  });

  // Listado de comercios afiliados (mock).
  router.get("/territory/commerce", (_req, res) => {
    res.status(200).json({
      success: true,
      data: commerce,
    });
  });

  // Endpoint de IA territorial — delega al pipeline de Isabella.
  // Para uso completo, enviar a POST /api/isabella/chat.
  router.post("/territory/ai/ask", (req, res, next) => {
    try {
      const { message } = parseAskBody(req.body);

      // Clasificación básica de intención para respuesta territorial
      const lower = (message ?? "").toLowerCase();
      const isGastronomia = /comida|paste|café|chocolate|mezcal|restaur/i.test(lower);
      const isTurismo = /turis|visita|lugar|ruta|tour|sender/i.test(lower);
      const isHistoria = /histor|miner|colonial|pasado/i.test(lower);

      let response: string;
      if (isGastronomia) {
        response = `Isabella recomienda: ${places.filter((p) => p.category === "gastronomia").map((p) => p.name).join(", ")}. La gastronomía es patrimonio vivo de Real del Monte.`;
      } else if (isTurismo) {
        response = `Isabella recomienda: ${places.slice(0, 3).map((p) => p.name).join(", ")}. Cada visita fortalece la memoria colectiva del territorio.`;
      } else if (isHistoria) {
        response = `Real del Monte tiene una historia minera fascinante desde el siglo XVI. Los mineros británicos dejaron una huella profunda en nuestra cultura y gastronomía.`;
      } else {
        response = `Isabella operativo territorial: ${message}\nLugares priorizados: ${places.map((place) => place.name).join(", ")}`;
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
