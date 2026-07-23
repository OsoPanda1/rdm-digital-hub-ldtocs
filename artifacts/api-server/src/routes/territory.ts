import { Router, type IRouter } from "express";
const router: IRouter = Router();

type Place = { id: string; name: string; type: string; lat: number; lng: number }
type Commerce = { id: string; name: string; category: string; membership: "comunidad" | "raiz" | "guardian" }

function parseAskBody(body: unknown): { message: string } {
  if (!body || typeof body !== "object" || typeof (body as { message?: unknown }).message !== "string") {
    throw new Error("message is required")
  }
  const message = (body as { message: string }).message.trim()
  if (!message || message.length > 2000) throw new Error("message must be between 1 and 2000 characters")
  return { message }
}

const places: Place[] = [
  { id: "rdm-centro", name: "Real del Monte Centro", type: "historico", lat: 20.1432, lng: -98.6694 },
  { id: "mina-acosta", name: "Mina de Acosta", type: "mineria", lat: 20.1421, lng: -98.6712 },
  { id: "panteon-ingles", name: "Panteón Inglés", type: "patrimonio", lat: 20.1455, lng: -98.6678 },
];

const commerce: Commerce[] = [
  { id: "com-pasteria-real", name: "Pastería La Plaza", category: "paste", membership: "raiz" },
  { id: "com-cafe-neblina", name: "Café Neblina", category: "cafe", membership: "raiz" },
  { id: "com-mesa-cornish", name: "La Mesa Cornish", category: "restaurante", membership: "guardian" },
];

router.get("/places", (_req, res) => {
  res.json({ success: true, data: places });
});

router.get("/commerce", (_req, res) => {
  res.json({ success: true, data: commerce });
});

router.post("/ai/ask", (req, res) => {
  const { message } = parseAskBody(req.body);
  res.json({
    success: true,
    data: {
      response: `Isabella operativo territorial: ${message}\nLugares priorizados: ${places.map((place) => place.name).join(", ")}`,
    },
  });
});

export default router;
