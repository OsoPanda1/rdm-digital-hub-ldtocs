import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import type { AuthenticatedRequest } from "../../types/auth.js";
import { audioService } from "../audio/audio.service.js";
import { auditService } from "../services/audit.service.js";

const router = Router();

// ============================================
// Public Routes (no auth required for read)
// ============================================

/**
 * GET /api/audio/narrations/:slug
 * Fetch heritage narration by slug with audio URL
 */
router.get("/narrations/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    const result = await audioService.getNarrationBySlug(slug);

    if (!result.narration) {
      return res.status(404).json({ error: "Narration not found" });
    }

    // Log access
    await auditService.logAccess({
      userId: (req as any).user?.id,
      endpoint: `/audio/narrations/${slug}`,
      method: "GET",
      statusCode: 200,
    });

    return res.json(result);
  } catch (error) {
    console.error("[AudioRoutes] Get narration error:", error);
    return res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : "Failed to fetch narration",
      });
  }
});

/**
 * GET /api/audio/narrations
 * List all heritage narrations (paginated)
 */
router.get("/narrations", async (req, res) => {
  try {
    const { language = "es", limit = 50, offset = 0 } = req.query;

    const narrations = await audioService.listNarrations({
      language: String(language),
      isActive: true,
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
    });

    await auditService.logAccess({
      userId: (req as any).user?.id,
      endpoint: "/audio/narrations",
      method: "GET",
      statusCode: 200,
    });

    return res.json({ data: narrations, count: narrations.length });
  } catch (error) {
    console.error("[AudioRoutes] List narrations error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to list narrations",
    });
  }
});

// ============================================
// Protected Routes (auth required)
// ============================================

router.use(requireAuth);

/**
 * POST /api/audio/generate-speech
 * Generate speech narration from text (admin only)
 * Body: {
 *   text: string,
 *   heritageSiteId: string,
 *   voiceId?: string (default: 'nova'),
 *   siteSlug?: string
 * }
 */
router.post("/generate-speech", async (req: AuthenticatedRequest, res) => {
  try {
    const { text, heritageSiteId, voiceId, siteSlug } = req.body;

    if (!text || !heritageSiteId) {
      return res.status(400).json({
        error: "text and heritageSiteId are required",
      });
    }

    const result = await audioService.generateNarration(
      text,
      heritageSiteId,
      req.user?.id,
      { voiceId, siteSlug }
    );

    if (result.error) {
      await auditService.logAccess({
        userId: req.user?.id,
        endpoint: "/audio/generate-speech",
        method: "POST",
        statusCode: 500,
        params: { heritageSiteId, textLength: text.length },
      });

      return res.status(500).json({ error: result.error });
    }

    await auditService.logAccess({
      userId: req.user?.id,
      endpoint: "/audio/generate-speech",
      method: "POST",
      statusCode: 200,
      params: { heritageSiteId, textLength: text.length },
    });

    return res.json({
      session: result.session,
      audioFile: result.audioFile,
      audioUrl: result.audioFile?.publicUrl,
    });
  } catch (error) {
    console.error("[AudioRoutes] Generate speech error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to generate speech",
    });
  }
});

/**
 * POST /api/audio/transcribe
 * Transcribe audio file to text
 * Body: FormData with 'audio' file and 'heritageSiteId' field
 */
router.post("/transcribe", async (req: AuthenticatedRequest, res) => {
  try {
    // Note: This assumes multipart/form-data middleware is configured
    // For production, integrate multer or similar

    const { heritageSiteId, language = "es" } = req.body;

    if (!heritageSiteId) {
      return res.status(400).json({ error: "heritageSiteId is required" });
    }

    // Check if file was uploaded (implementation depends on middleware)
    // For now, we'll demonstrate the structure
    const audioBuffer = (req as any).file?.buffer;

    if (!audioBuffer) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const result = await audioService.transcribeAudio(
      audioBuffer,
      heritageSiteId,
      (req as any).file.originalname || "audio.mp3",
      req.user?.id,
      language
    );

    if (result.error) {
      await auditService.logAccess({
        userId: req.user?.id,
        endpoint: "/audio/transcribe",
        method: "POST",
        statusCode: 500,
        params: { heritageSiteId },
      });

      return res.status(500).json({ error: result.error });
    }

    await auditService.logAccess({
      userId: req.user?.id,
      endpoint: "/audio/transcribe",
      method: "POST",
      statusCode: 200,
      params: { heritageSiteId },
    });

    return res.json({
      session: result.session,
      transcription: result.transcription,
      text: result.transcription?.textContent,
      confidence: result.transcription?.confidenceScore,
    });
  } catch (error) {
    console.error("[AudioRoutes] Transcribe error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to transcribe audio",
    });
  }
});

/**
 * GET /api/audio/sessions/:sessionId
 * Get audio session details
 */
router.get("/sessions/:sessionId", async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;

    // In production, add prisma query to get session
    // and verify user owns it

    await auditService.logAccess({
      userId: req.user?.id,
      endpoint: `/audio/sessions/${sessionId}`,
      method: "GET",
      statusCode: 200,
    });

    return res.json({
      message: "Session endpoint (not yet implemented)",
    });
  } catch (error) {
    console.error("[AudioRoutes] Get session error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch session",
    });
  }
});

/**
 * GET /api/audio/usage-metrics
 * Get current billing period usage
 */
router.get("/usage-metrics", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const today = new Date();
    const billingPeriod = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    const metrics = await audioService.getUsageMetrics(userId, billingPeriod);

    await auditService.logAccess({
      userId,
      endpoint: "/audio/usage-metrics",
      method: "GET",
      statusCode: 200,
    });

    return res.json({ metrics });
  } catch (error) {
    console.error("[AudioRoutes] Get metrics error:", error);
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch metrics",
    });
  }
});

export default router;
