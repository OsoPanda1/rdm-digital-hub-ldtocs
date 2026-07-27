// ────────────────────────────────────────────────────────────────
// Podcast Routes — Spotify Integration
// Replaces TAMV 92.5 FM Radio with Spotify podcast embeds.
// ────────────────────────────────────────────────────────────────

import { Router, Request, Response } from "express";

const router = Router();

// ── Featured Podcasts (curated by Isabella) ────────────────────

const FEATURED_PODCASTS = [
  {
    id: "podcast-isabella",
    title: "Isabella Villaseñor — Diálogos del Pueblo Mágico",
    description: "Conversaciones sobre cultura, identidad y tecnología desde Real del Monte. Narrativas soberanas del ecosistema TAMV.",
    spotifyUri: "spotify:show:6JQijmFkFz5ZqC4MjR3QkX",
    embedUrl: "https://open.spotify.com/embed/show/6JQijmFkFz5ZqC4MjR3QkX?utm_source=generator&theme=0",
    category: "narrativa",
    tags: ["isabella", "cultura", "real-del-monte", "tsov"],
    language: "es",
    featured: true,
  },
  {
    id: "podcast-realito",
    title: "Realito AI — El Asistente Soberano",
    description: "El podcast donde Realito explora el ecosistema TAMV, responde preguntas de la comunidad y comparte historias del Pueblo Mágico.",
    spotifyUri: "spotify:show:placeholder-realito",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-realito?utm_source=generator&theme=0",
    category: "tecnologia",
    tags: ["realito", "ai", "ecosistema", "soberania"],
    language: "es",
    featured: true,
  },
  {
    id: "podcast-territorio",
    title: "Voces del Territorio",
    description: "Historias, testimonios y análisis desde los pueblos mágicos de Hidalgo. Percepción territorial en audio.",
    spotifyUri: "spotify:show:placeholder-territorio",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-territorio?utm_source=generator&theme=0",
    category: "territorial",
    tags: ["territorio", "hidalgo", "pueblo-magico", "comunidad"],
    language: "es",
    featured: false,
  },
  {
    id: "podcast-conocimiento",
    title: "Trovadores del Conocimiento",
    description: "Divulgación científica, cultural y tecnológica desde la perspectiva del ecosistema TAMV. Conocimiento libre y soberano.",
    spotifyUri: "spotify:show:placeholder-conocimiento",
    embedUrl: "https://open.spotify.com/embed/show/placeholder-conocimiento?utm_source=generator&theme=0",
    category: "conocimiento",
    tags: ["conocimiento", "ciencia", "educacion", "libre"],
    language: "es",
    featured: false,
  },
];

// ── Podcast Categories ─────────────────────────────────────────

const CATEGORIES = [
  { id: "narrativa", name: "Narrativa", description: "Historias y conversaciones del ecosistema" },
  { id: "tecnologia", name: "Tecnología", description: "IA, soberanía digital y herramientas" },
  { id: "territorial", name: "Territorio", description: "Voces desde los pueblos mágicos" },
  { id: "conocimiento", name: "Conocimiento", description: "Ciencia, cultura y educación" },
  { id: "musica", name: "Música", description: "Sonidos del Pueblo Mágico" },
];

// ── Routes ─────────────────────────────────────────────────────

router.get("/featured", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    podcasts: FEATURED_PODCASTS.filter((p) => p.featured),
    total: FEATURED_PODCASTS.filter((p) => p.featured).length,
  });
});

router.get("/all", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    podcasts: FEATURED_PODCASTS,
    categories: CATEGORIES,
    total: FEATURED_PODCASTS.length,
  });
});

router.get("/categories", (_req: Request, res: Response) => {
  res.json({ ok: true, categories: CATEGORIES });
});

router.get("/:id", (req: Request, res: Response) => {
  const podcast = FEATURED_PODCASTS.find((p) => p.id === req.params.id);
  if (!podcast) {
    res.status(404).json({ ok: false, error: "Podcast not found." });
    return;
  }
  res.json({ ok: true, podcast });
});

router.get("/:id/embed", (req: Request, res: Response) => {
  const podcast = FEATURED_PODCASTS.find((p) => p.id === req.params.id);
  if (!podcast) {
    res.status(404).json({ ok: false, error: "Podcast not found." });
    return;
  }
  res.json({
    ok: true,
    embedUrl: podcast.embedUrl,
    spotifyUri: podcast.spotifyUri,
    title: podcast.title,
  });
});

export function registerPodcastRoutes(app: Router): void {
  app.use("/api/podcast", router);
}

export default router;
