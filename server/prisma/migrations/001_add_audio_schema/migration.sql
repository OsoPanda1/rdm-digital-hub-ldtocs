-- CreateEnum for AudioType
CREATE TYPE "AudioType" AS ENUM ('NARRATION', 'USER_RECORDING', 'TOUR_GUIDE', 'ACCESSIBILITY');

-- Create HeritageAudioSession table
CREATE TABLE "HeritageAudioSession" (
    "id" TEXT NOT NULL,
    "supabaseUserId" TEXT,
    "heritageSiteId" TEXT NOT NULL,
    "audioType" "AudioType" NOT NULL DEFAULT 'NARRATION',
    "durationMs" INTEGER,
    "gatewayModelVersion" VARCHAR,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeritageAudioSession_pkey" PRIMARY KEY ("id")
);

-- Create AudioTranscription table
CREATE TABLE "AudioTranscription" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "textContent" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "detectedLanguage" VARCHAR NOT NULL DEFAULT 'es',
    "tokensUsed" INTEGER,
    "latencyMs" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioTranscription_pkey" PRIMARY KEY ("id")
);

-- Create AudioFile table
CREATE TABLE "AudioFile" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "supabasePath" VARCHAR NOT NULL,
    "fileType" VARCHAR NOT NULL DEFAULT 'mp3',
    "sizeBytes" INTEGER NOT NULL,
    "publicUrl" VARCHAR,
    "durationSeconds" INTEGER,
    "checksumMd5" VARCHAR,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);

-- Create AiGatewayLog table
CREATE TABLE "AiGatewayLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "supabaseUserId" VARCHAR,
    "operationType" VARCHAR NOT NULL DEFAULT 'speech_generation',
    "model" VARCHAR NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "latencyMs" INTEGER NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'success',
    "errorMessage" VARCHAR,
    "errorCode" VARCHAR,
    "auditData" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiGatewayLog_pkey" PRIMARY KEY ("id")
);

-- Create HeritageAudioNarration table
CREATE TABLE "HeritageAudioNarration" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR NOT NULL,
    "siteName" VARCHAR NOT NULL,
    "siteDescription" VARCHAR,
    "narrationText" TEXT NOT NULL,
    "language" VARCHAR NOT NULL DEFAULT 'es',
    "voiceId" VARCHAR NOT NULL DEFAULT 'nova',
    "lastGeneratedSessionId" VARCHAR,
    "audioVersions" JSONB NOT NULL DEFAULT '{}',
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeritageAudioNarration_pkey" PRIMARY KEY ("id")
);

-- Create AudioUsageMetrics table
CREATE TABLE "AudioUsageMetrics" (
    "id" TEXT NOT NULL,
    "supabaseUserId" VARCHAR,
    "operationType" VARCHAR NOT NULL DEFAULT 'transcription',
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "billingPeriod" VARCHAR NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioUsageMetrics_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX "HeritageAudioSession_heritageSiteId_createdAt_idx" ON "HeritageAudioSession"("heritageSiteId", "createdAt");
CREATE INDEX "HeritageAudioSession_audioType_createdAt_idx" ON "HeritageAudioSession"("audioType", "createdAt");
CREATE INDEX "HeritageAudioSession_supabaseUserId_createdAt_idx" ON "HeritageAudioSession"("supabaseUserId", "createdAt");

CREATE INDEX "AudioTranscription_sessionId_createdAt_idx" ON "AudioTranscription"("sessionId", "createdAt");
CREATE INDEX "AudioTranscription_detectedLanguage_idx" ON "AudioTranscription"("detectedLanguage");

CREATE INDEX "AudioFile_sessionId_createdAt_idx" ON "AudioFile"("sessionId", "createdAt");
CREATE UNIQUE INDEX "AudioFile_supabasePath_key" ON "AudioFile"("supabasePath");

CREATE INDEX "AiGatewayLog_operationType_status_createdAt_idx" ON "AiGatewayLog"("operationType", "status", "createdAt");
CREATE INDEX "AiGatewayLog_supabaseUserId_createdAt_idx" ON "AiGatewayLog"("supabaseUserId", "createdAt");
CREATE INDEX "AiGatewayLog_status_createdAt_idx" ON "AiGatewayLog"("status", "createdAt");
CREATE INDEX "AiGatewayLog_model_createdAt_idx" ON "AiGatewayLog"("model", "createdAt");

CREATE UNIQUE INDEX "HeritageAudioNarration_slug_key" ON "HeritageAudioNarration"("slug");
CREATE INDEX "HeritageAudioNarration_isActive_createdAt_idx" ON "HeritageAudioNarration"("isActive", "createdAt");
CREATE INDEX "HeritageAudioNarration_language_idx" ON "HeritageAudioNarration"("language");

CREATE UNIQUE INDEX "AudioUsageMetrics_supabaseUserId_operationType_billingPeriod_key" ON "AudioUsageMetrics"("supabaseUserId", "operationType", "billingPeriod");
CREATE INDEX "AudioUsageMetrics_billingPeriod_createdAt_idx" ON "AudioUsageMetrics"("billingPeriod", "createdAt");

-- Add foreign key constraints
ALTER TABLE "AudioTranscription" ADD CONSTRAINT "AudioTranscription_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "HeritageAudioSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AudioFile" ADD CONSTRAINT "AudioFile_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "HeritageAudioSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AiGatewayLog" ADD CONSTRAINT "AiGatewayLog_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "HeritageAudioSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
