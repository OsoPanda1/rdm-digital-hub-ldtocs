import { prisma } from "../../db.js";
import {
  experimental_generateSpeech,
  experimental_transcribe,
} from "ai";
import { createOpenAICompatibleModel } from "@ai-sdk/openai-compatible";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import type {
  HeritageAudioSession,
  AudioTranscription,
  AudioFile,
  AiGatewayLog,
} from "@prisma/client";

// Initialize Supabase Storage client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize AI Gateway models
const apiKey = process.env.AI_GATEWAY_API_KEY || "";

const speechModel = createOpenAICompatibleModel({
  modelId: "openai/tts-1",
  baseURL: "https://gateway.ai.cloudflare.com/v1/openai",
  apiKey,
});

const transcriptionModel = createOpenAICompatibleModel({
  modelId: "openai/whisper-1",
  baseURL: "https://gateway.ai.cloudflare.com/v1/openai",
  apiKey,
});

// ============================================
// Audio Service
// ============================================

export const audioService = {
  /**
   * Generate speech narration for a heritage site
   */
  async generateNarration(
    narrationText: string,
    heritageSiteId: string,
    supabaseUserId?: string,
    options?: { voiceId?: string; siteSlug?: string }
  ): Promise<{
    session: HeritageAudioSession;
    transcription?: AudioTranscription;
    audioFile?: AudioFile;
    error?: string;
  }> {
    const startTime = Date.now();
    const voiceId = options?.voiceId || "nova";

    try {
      // Step 1: Create audio session
      const session = await prisma.heritageAudioSession.create({
        data: {
          heritageSiteId,
          supabaseUserId,
          audioType: "NARRATION",
          gatewayModelVersion: "openai/tts-1",
        },
      });

      console.log(`[AudioService] Generating speech for session ${session.id}`);

      // Step 2: Generate speech via AI Gateway
      const speechResponse = await experimental_generateSpeech({
        model: speechModel as any,
        text: narrationText,
        voice: voiceId as any,
        outputFormat: "mp3",
      });

      const audioBuffer = await streamToBuffer(speechResponse);
      const latencyMs = Date.now() - startTime;

      // Step 3: Upload to Supabase Storage
      const fileName = `${heritageSiteId}_narration_${session.id}.mp3`;
      const storagePath = `heritage/${heritageSiteId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("audio")
        .upload(storagePath, audioBuffer, {
          contentType: "audio/mpeg",
          cacheControl: "31536000", // 1 year
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Step 4: Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("audio")
        .getPublicUrl(storagePath);

      // Step 5: Save audio file record
      const audioFile = await prisma.audioFile.create({
        data: {
          sessionId: session.id,
          supabasePath: storagePath,
          fileType: "mp3",
          sizeBytes: audioBuffer.length,
          publicUrl: publicUrlData?.publicUrl,
          durationSeconds: Math.round(audioBuffer.length / 24000), // Rough estimate
          checksumMd5: crypto
            .createHash("md5")
            .update(audioBuffer)
            .digest("hex"),
        },
      });

      // Step 6: Log AI Gateway usage
      await prisma.aiGatewayLog.create({
        data: {
          sessionId: session.id,
          supabaseUserId,
          operationType: "speech_generation",
          model: "openai/tts-1",
          outputTokens: Math.round(narrationText.split(/\s+/).length * 0.5), // Rough estimate
          latencyMs,
          status: "success",
          auditData: {
            voice: voiceId,
            outputFormat: "mp3",
            siteId: heritageSiteId,
          },
        },
      });

      // Step 7: Update heritage narration record if it exists
      if (options?.siteSlug) {
        await prisma.heritageAudioNarration.upsert({
          where: { slug: options.siteSlug },
          create: {
            slug: options.siteSlug,
            siteName: heritageSiteId,
            narrationText,
            voiceId,
            language: "es",
            lastGeneratedSessionId: session.id,
            audioVersions: {
              es_normal: audioFile.publicUrl,
            },
          },
          update: {
            lastGeneratedSessionId: session.id,
            audioVersions: {
              es_normal: audioFile.publicUrl,
            },
          },
        });
      }

      return { session, audioFile };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const latencyMs = Date.now() - startTime;

      // Log error
      const session = await prisma.heritageAudioSession.create({
        data: {
          heritageSiteId,
          supabaseUserId,
          audioType: "NARRATION",
        },
      });

      await prisma.aiGatewayLog.create({
        data: {
          sessionId: session.id,
          supabaseUserId,
          operationType: "speech_generation",
          model: "openai/tts-1",
          latencyMs,
          status: "error",
          errorMessage: errorMsg,
        },
      });

      return { session, error: errorMsg };
    }
  },

  /**
   * Transcribe audio file to text
   */
  async transcribeAudio(
    audioBuffer: Buffer,
    heritageSiteId: string,
    fileName: string,
    supabaseUserId?: string,
    language: string = "es"
  ): Promise<{
    session: HeritageAudioSession;
    transcription?: AudioTranscription;
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      // Step 1: Create audio session
      const session = await prisma.heritageAudioSession.create({
        data: {
          heritageSiteId,
          supabaseUserId,
          audioType: "USER_RECORDING",
          durationMs: audioBuffer.length * 8, // Rough estimate: 8ms per byte at 16kHz
          gatewayModelVersion: "openai/whisper-1",
        },
      });

      console.log(`[AudioService] Transcribing audio for session ${session.id}`);

      // Step 2: Upload to Supabase Storage for archival
      const storagePath = `heritage/${heritageSiteId}/recordings/${session.id}_${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("audio")
        .upload(storagePath, audioBuffer, {
          contentType: "audio/mpeg",
        });

      if (uploadError) {
        console.warn(`[AudioService] Storage backup failed: ${uploadError.message}`);
      }

      // Step 3: Save audio file record
      const audioFile = await prisma.audioFile.create({
        data: {
          sessionId: session.id,
          supabasePath: storagePath,
          fileType: "mp3",
          sizeBytes: audioBuffer.length,
          checksumMd5: crypto
            .createHash("md5")
            .update(audioBuffer)
            .digest("hex"),
        },
      });

      // Step 4: Transcribe via AI Gateway
      const audioFile_ = new File([audioBuffer], fileName, {
        type: "audio/mpeg",
      });

      const transcription_resp = await experimental_transcribe({
        model: transcriptionModel as any,
        file: audioFile_,
        language,
      });

      const latencyMs = Date.now() - startTime;

      // Step 5: Save transcription record
      const transcription = await prisma.audioTranscription.create({
        data: {
          sessionId: session.id,
          textContent: transcription_resp.text,
          confidenceScore:
            (transcription_resp as any).confidence || 0.95,
          detectedLanguage: language,
          latencyMs,
          tokensUsed: Math.round(
            transcription_resp.text.split(/\s+/).length * 1.3
          ),
        },
      });

      // Step 6: Log AI Gateway usage
      await prisma.aiGatewayLog.create({
        data: {
          sessionId: session.id,
          supabaseUserId,
          operationType: "transcription",
          model: "openai/whisper-1",
          inputTokens: Math.round(audioBuffer.length / 100),
          outputTokens: Math.round(
            transcription_resp.text.split(/\s+/).length
          ),
          latencyMs,
          status: "success",
          auditData: {
            language,
            fileName,
            siteId: heritageSiteId,
          },
        },
      });

      return { session, transcription };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const latencyMs = Date.now() - startTime;

      const session = await prisma.heritageAudioSession.create({
        data: {
          heritageSiteId,
          supabaseUserId,
          audioType: "USER_RECORDING",
        },
      });

      await prisma.aiGatewayLog.create({
        data: {
          sessionId: session.id,
          supabaseUserId,
          operationType: "transcription",
          model: "openai/whisper-1",
          latencyMs,
          status: "error",
          errorMessage: errorMsg,
        },
      });

      return { session, error: errorMsg };
    }
  },

  /**
   * Get heritage narration by slug
   */
  async getNarrationBySlug(
    slug: string
  ): Promise<{
    narration?: any;
    audioUrl?: string;
    transcriptions?: AudioTranscription[];
  }> {
    try {
      const narration = await prisma.heritageAudioNarration.findUnique({
        where: { slug },
      });

      if (!narration) {
        return {};
      }

      // Increment play count
      await prisma.heritageAudioNarration.update({
        where: { slug },
        data: { playCount: { increment: 1 } },
      });

      const audioVersions = narration.audioVersions as Record<string, string>;
      const audioUrl = audioVersions?.es_normal;

      return {
        narration: {
          ...narration,
          audioVersions: undefined,
        },
        audioUrl,
      };
    } catch (error) {
      console.error(`[AudioService] Failed to get narration: ${error}`);
      return {};
    }
  },

  /**
   * List all heritage narrations
   */
  async listNarrations(filters?: {
    language?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where = {
        language: filters?.language || "es",
        isActive: filters?.isActive !== undefined ? filters.isActive : true,
      };

      const narrations = await prisma.heritageAudioNarration.findMany({
        where,
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
        orderBy: { playCount: "desc" },
      });

      return narrations;
    } catch (error) {
      console.error(`[AudioService] Failed to list narrations: ${error}`);
      return [];
    }
  },

  /**
   * Get usage metrics for billing
   */
  async getUsageMetrics(supabaseUserId: string, billingPeriod: string) {
    try {
      const metrics = await prisma.audioUsageMetrics.findUnique({
        where: {
          supabaseUserId_operationType_billingPeriod: {
            supabaseUserId,
            operationType: "transcription",
            billingPeriod,
          },
        },
      });

      return metrics;
    } catch (error) {
      console.error(`[AudioService] Failed to get metrics: ${error}`);
      return null;
    }
  },
};

// ============================================
// Helpers
// ============================================

async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks);
}
