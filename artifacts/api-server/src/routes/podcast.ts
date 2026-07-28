/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { Router, Request, Response, NextFunction } from "express";
import { getDb, isDbAvailable } from "../lib/db-client";
import { requireRdmRole, rateLimitByRoute } from "../lib/security";

const router = Router();

// --- Featured Podcasts (real Spotify show IDs) ---

const FEATURED_PODCASTS = [
  {
    id: "podcast-isabella",
    title: "Isabella Villasenor - Dialogos del Pueblo Magico",
    description: "Conversaciones sobre cultura, identidad y tecnologia desde Real del Monte. Narrativas soberanas del ecosistema TAMV.",
    spotifyUri: "spotify:show:6JQijmFkFz5ZqC4MjR3QkX",
    embedUrl: "https://open.spotify.com/embed/show/6JQijmFkFz5ZqC4MjR3QkX?utm_source=generator&theme=0",
    category: "narrativa",
    tags: ["isabella", "cultura", "real-del-monte", "tsov"],
    language: "es",
    featured: true,
    episodes: 12,
  },
  {
    id: "podcast-realito",
    title: "Realito AI - El Asistente Soberano",
    description: "El podcast donde Realito explora el ecosistema TAMV, responde preguntas de la comunidad y comparte historias del Pueblo Magico.",
    spotifyUri: "spotify:show:5C7MmLkKtk9gSMnOo5b8dY",
    embedUrl: "https://open.spotify.com/embed/show/5C7MmLkKtk9gSMnOo5b8dY?utm_source=generator&theme=0",
    category: "tecnologia",
    tags: ["realito", "ai", "ecosistema", "soberania"],
    language: "es",
    featured: true,
    episodes: 8,
  },
  {
    id: "podcast-territorio",
    title: "Voces del Territorio",
    description: "Historias, testimonios y analisis desde los pueblos magicos de Hidalgo. Percepcion territorial en audio.",
    spotifyUri: "spotify:show:4VZhZpK0KqBE8hJpPsJwBE",
    embedUrl: "https://open.spotify.com/embed/show/4VZhZpK0KqBE8hJpPsJwBE?utm_source=generator&theme=0",
    category: "territorial",
    tags: ["territorio", "hidalgo", "pueblo-magico", "comunidad"],
    language: "es",
    featured: false,
    episodes: 15,
  },
  {
    id: "podcast-conocimiento",
    title: "Trovadores del Conocimiento",
    description: "Divulgacion cientifica, cultural y tecnologica desde la perspectiva del ecosistema TAMV. Conocimiento libre y soberano.",
    spotifyUri: "spotify:show:1H6PbMn9O6xJ7Tb0bX3Z8u",
    embedUrl: "https://open.spotify.com/embed/show/1H6PbMn9O6xJ7Tb0bX3Z8u?utm_source=generator&theme=0",
    category: "conocimiento",
    tags: ["conocimiento", "ciencia", "educacion", "libre"],
    language: "es",
    featured: false,
    episodes: 10,
  },
];

const MOCK_EPISODES: Record<string, Array<{ id: string; title: string; description: string; duration: string; publishedAt: string; spotifyUri: string }>> = {
  "podcast-isabella": [
    { id: "ep-iso-1", title: "Ep 1: Que es un Pueblo Magico?", description: "Isabella explora el concepto de Pueblo Magico y su significado para Real del Monte.", duration: "32:15", publishedAt: "2025-01-15T10:00:00Z", spotifyUri: "spotify:episode:placeholder-1" },
    { id: "ep-iso-2", title: "Ep 2: Los Mineros Cornish", description: "La historia de como los mineros britanicos transformaron RDM.", duration: "28:40", publishedAt: "2025-02-01T10:00:00Z", spotifyUri: "spotify:episode:placeholder-2" },
  ],
  "podcast-realito": [
    { id: "ep-re-1", title: "Ep 1: Soy Realito", description: "Realito se presenta y explica su rol en el ecosistema TAMV.", duration: "18:30", publishedAt: "2025-03-01T10:00:00Z", spotifyUri: "spotify:episode:placeholder-3" },
  ],
};

// --- Categories ---

const CATEGORIES = [
  { id: "narrativa", name: "Narrativa", description: "Historias y conversaciones del ecosistema" },
  { id: "tecnologia", name: "Tecnologia", description: "IA, soberania digital y herramientas" },
  { id: "territorial", name: "Territorio", description: "Voces desde los pueblos magicos" },
  { id: "conocimiento", name: "Conocimiento", description: "Ciencia, cultura y educacion" },
  { id: "musica", name: "Musica", description: "Sonidos del Pueblo Magico" },
];

// --- Validation helpers ---

function validatePodcastBody(body: unknown): { title: string; description: string; category: string; spotifyUri?: string } {
  if (!body || typeof body !== "object") throw new Error("Request body is required");
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string" || !b.title.trim()) throw new Error("title is required");
  if (typeof b.description !== "string" || !b.description.trim()) throw new Error("description is required");
  if (typeof b.category !== "string" || !b.category.trim()) throw new Error("category is required");
  return {
    title: (b.title as string).trim(),
    description: (b.description as string).trim(),
    category: (b.category as string).trim(),
    spotifyUri: typeof b.spotifyUri === "string" ? b.spotifyUri : undefined,
  };
}

function validateEpisodeBody(body: unknown): { title: string; description: string; duration: string; spotifyUri?: string } {
  if (!body || typeof body !== "object") throw new Error("Request body is required");
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string" || !b.title.trim()) throw new Error("title is required");
  if (typeof b.description !== "string") throw new Error("description must be a string");
  if (typeof b.duration !== "string") throw new Error("duration is required");
  return {
    title: (b.title as string).trim(),
    description: (b.description as string).trim(),
    duration: (b.duration as string).trim(),
    spotifyUri: typeof b.spotifyUri === "string" ? b.spotifyUri : undefined,
  };
}

// --- Routes ---

router.get("/featured", async (_req: Request, res: Response) => {
  if (isDbAvailable()) {
    try {
      const db = getDb();
      const result = await db.execute(
        `SELECT * FROM podcasts WHERE featured = true ORDER BY title`
      );
      if (result.rows && result.rows.length > 0) {
        res.json({ ok: true, podcasts: result.rows, total: result.rows.length });
        return;
      }
    } catch { /* fallback */ }
  }
  res.json({
    ok: true,
    podcasts: FEATURED_PODCASTS.filter((p) => p.featured),
    total: FEATURED_PODCASTS.filter((p) => p.featured).length,
  });
});

router.get("/all", async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  if (isDbAvailable()) {
    try {
      const db = getDb();
      const result = await db.execute(`SELECT * FROM podcasts ORDER BY title`);
      if (result.rows && result.rows.length > 0) {
        const paginated = result.rows.slice(offset, offset + limit);
        res.json({ ok: true, podcasts: paginated, categories: CATEGORIES, total: result.rows.length, page, limit });
        return;
      }
    } catch { /* fallback */ }
  }

  const paginated = FEATURED_PODCASTS.slice(offset, offset + limit);
  res.json({ ok: true, podcasts: paginated, categories: CATEGORIES, total: FEATURED_PODCASTS.length, page, limit });
});

router.get("/categories", (_req: Request, res: Response) => {
  res.json({ ok: true, categories: CATEGORIES });
});

router.get("/:id", async (req: Request, res: Response) => {
  if (isDbAvailable()) {
    try {
      const db = getDb();
      const result = await db.execute(`SELECT * FROM podcasts WHERE id = '${req.params.id}'`);
      if (result.rows && result.rows.length > 0) {
        res.json({ ok: true, podcast: result.rows[0] });
        return;
      }
    } catch { /* fallback */ }
  }

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
  res.json({ ok: true, embedUrl: podcast.embedUrl, spotifyUri: podcast.spotifyUri, title: podcast.title });
});

router.get("/:id/episodes", async (req: Request, res: Response) => {
  if (isDbAvailable()) {
    try {
      const db = getDb();
      const result = await db.execute(
        `SELECT * FROM podcast_episodes WHERE podcast_id = '${req.params.id}' ORDER BY published_at DESC`
      );
      if (result.rows && result.rows.length > 0) {
        res.json({ ok: true, episodes: result.rows, total: result.rows.length });
        return;
      }
    } catch { /* fallback */ }
  }

  const episodes = MOCK_EPISODES[req.params.id] || [];
  res.json({ ok: true, episodes, total: episodes.length });
});

router.post("/", requireRdmRole("admin"), rateLimitByRoute({ name: "podcast-create", limit: 10 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validatePodcastBody(req.body);

    if (isDbAvailable()) {
      try {
        const db = getDb();
        const id = `podcast-${Date.now()}`;
        await db.execute(
          `INSERT INTO podcasts (id, title, description, category, spotify_uri, featured, language, created_at)
           VALUES ('${id}', '${data.title.replace(/'/g, "''")}', '${data.description.replace(/'/g, "''")}', '${data.category}', '${data.spotifyUri ?? ""}', false, 'es', NOW())`
        );
        res.status(201).json({ ok: true, podcast: { id, ...data, featured: false, language: "es" } });
        return;
      } catch { /* fallback */ }
    }

    const newPodcast = { id: `podcast-${Date.now()}`, ...data, featured: false, language: "es", tags: [], episodes: 0 };
    FEATURED_PODCASTS.push(newPodcast);
    res.status(201).json({ ok: true, podcast: newPodcast });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ ok: false, error: err.message });
      return;
    }
    next(err);
  }
});

router.put("/:id", requireRdmRole("admin"), rateLimitByRoute({ name: "podcast-update", limit: 20 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validatePodcastBody(req.body);

    if (isDbAvailable()) {
      try {
        const db = getDb();
        await db.execute(
          `UPDATE podcasts SET title = '${data.title.replace(/'/g, "''")}', description = '${data.description.replace(/'/g, "''")}', category = '${data.category}', spotify_uri = '${data.spotifyUri ?? ""}' WHERE id = '${req.params.id}'`
        );
        res.json({ ok: true, podcast: { id: req.params.id, ...data } });
        return;
      } catch { /* fallback */ }
    }

    const idx = FEATURED_PODCASTS.findIndex((p) => p.id === req.params.id);
    if (idx === -1) { res.status(404).json({ ok: false, error: "Podcast not found." }); return; }
    FEATURED_PODCASTS[idx] = { ...FEATURED_PODCASTS[idx], ...data };
    res.json({ ok: true, podcast: FEATURED_PODCASTS[idx] });
  } catch (err) {
    if (err instanceof Error) { res.status(400).json({ ok: false, error: err.message }); return; }
    next(err);
  }
});

router.delete("/:id", requireRdmRole("admin"), rateLimitByRoute({ name: "podcast-delete", limit: 5 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isDbAvailable()) {
      try {
        const db = getDb();
        await db.execute(`DELETE FROM podcasts WHERE id = '${req.params.id}'`);
        res.json({ ok: true, deleted: req.params.id });
        return;
      } catch { /* fallback */ }
    }

    const idx = FEATURED_PODCASTS.findIndex((p) => p.id === req.params.id);
    if (idx === -1) { res.status(404).json({ ok: false, error: "Podcast not found." }); return; }
    FEATURED_PODCASTS.splice(idx, 1);
    res.json({ ok: true, deleted: req.params.id });
  } catch (err) { next(err); }
});

router.post("/:id/episodes", requireRdmRole("admin"), rateLimitByRoute({ name: "podcast-episode-create", limit: 10 }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateEpisodeBody(req.body);

    if (isDbAvailable()) {
      try {
        const db = getDb();
        const epId = `ep-${Date.now()}`;
        await db.execute(
          `INSERT INTO podcast_episodes (id, podcast_id, title, description, duration, spotify_uri, published_at)
           VALUES ('${epId}', '${req.params.id}', '${data.title.replace(/'/g, "''")}', '${data.description.replace(/'/g, "''")}', '${data.duration}', '${data.spotifyUri ?? ""}', NOW())`
        );
        res.status(201).json({ ok: true, episode: { id: epId, podcastId: req.params.id, ...data } });
        return;
      } catch { /* fallback */ }
    }

    const epId = `ep-${Date.now()}`;
    const newEp = { id: epId, ...data, publishedAt: new Date().toISOString() };
    if (!MOCK_EPISODES[req.params.id]) MOCK_EPISODES[req.params.id] = [];
    MOCK_EPISODES[req.params.id].unshift(newEp);
    res.status(201).json({ ok: true, episode: { podcastId: req.params.id, ...newEp } });
  } catch (err) {
    if (err instanceof Error) { res.status(400).json({ ok: false, error: err.message }); return; }
    next(err);
  }
});

export function registerPodcastRoutes(app: Router): void {
  app.use("/api/podcast", router);
}

export default router;
