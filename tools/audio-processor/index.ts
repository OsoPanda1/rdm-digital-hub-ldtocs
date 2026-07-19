import "dotenv/config";
import { experimental_generateSpeech, experimental_transcribe } from "ai";
import { createOpenAICompatibleModel } from "@ai-sdk/openai-compatible";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

// ============================================
// Configuration & Types
// ============================================

interface AudioProcessingResult {
  id: string;
  type: "speech_generation" | "transcription";
  status: "success" | "error";
  input?: string;
  output?: string | Buffer;
  filePath?: string;
  duration?: number;
  confidence?: number;
  language?: string;
  error?: string;
  timestamp: string;
}

interface HeritageNarration {
  siteId: string;
  siteName: string;
  description: string;
  language?: string;
}

// ============================================
// Initialize AI Gateway
// ============================================

const apiKey = process.env.AI_GATEWAY_API_KEY;
if (!apiKey) {
  throw new Error("AI_GATEWAY_API_KEY environment variable is required");
}

// Create gateway models compatible with AI SDK
const speechModel = createOpenAICompatibleModel({
  modelId: "openai/tts-1",
  baseURL: "https://gateway.ai.cloudflare.com/v1/openai",
  apiKey: apiKey,
});

const transcriptionModel = createOpenAICompatibleModel({
  modelId: "openai/whisper-1",
  baseURL: "https://gateway.ai.cloudflare.com/v1/openai",
  apiKey: apiKey,
});

// ============================================
// Audio Output Directory
// ============================================

const outputDir = process.env.AUDIO_OUTPUT_DIR || "./audio_output";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============================================
// Core Functions
// ============================================

/**
 * Convert text to speech for heritage site narrations
 * Uses OpenAI TTS-1 model via AI Gateway
 */
async function generateHeritageNarration(
  narration: HeritageNarration
): Promise<AudioProcessingResult> {
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  try {
    console.log(
      `[${timestamp}] Generating speech for heritage site: ${narration.siteName}`
    );

    const speechResponse = await experimental_generateSpeech({
      model: speechModel as any,
      text: narration.description,
      voice: "alloy", // OpenAI TTS voices: alloy, echo, fable, onyx, nova, shimmer
      outputFormat: "mp3",
    });

    // Convert stream to buffer
    const audioBuffer = await streamToBuffer(speechResponse);

    // Save to file
    const fileName = `${narration.siteId}_narration_${id}.mp3`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, audioBuffer);

    console.log(`✓ Speech generated and saved to ${filePath}`);

    return {
      id,
      type: "speech_generation",
      status: "success",
      input: narration.description.substring(0, 100) + "...",
      output: audioBuffer,
      filePath,
      duration: audioBuffer.length, // Approximate duration indicator
      timestamp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Speech generation failed: ${errorMessage}`);

    return {
      id,
      type: "speech_generation",
      status: "error",
      input: narration.description.substring(0, 100) + "...",
      error: errorMessage,
      timestamp,
    };
  }
}

/**
 * Transcribe audio file to text
 * Uses OpenAI Whisper model via AI Gateway
 */
async function transcribeHeritageAudio(
  audioFilePath: string
): Promise<AudioProcessingResult> {
  const id = uuidv4();
  const timestamp = new Date().toISOString();

  try {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    console.log(`[${timestamp}] Transcribing audio: ${audioFilePath}`);

    const audioBuffer = fs.readFileSync(audioFilePath);

    // Create a File-like object for AI SDK
    const audioFile = new File([audioBuffer], path.basename(audioFilePath), {
      type: "audio/mpeg",
    });

    const transcription = await experimental_transcribe({
      model: transcriptionModel as any,
      file: audioFile,
      language: "es", // Spanish - can be customized per request
    });

    console.log(`✓ Transcription complete: "${transcription.text}"`);

    return {
      id,
      type: "transcription",
      status: "success",
      input: path.basename(audioFilePath),
      output: transcription.text,
      confidence: (transcription as any).confidence || 0.95,
      language: "es",
      timestamp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Transcription failed: ${errorMessage}`);

    return {
      id,
      type: "transcription",
      status: "error",
      input: path.basename(audioFilePath),
      error: errorMessage,
      timestamp,
    };
  }
}

/**
 * Helper: Convert ReadableStream to Buffer
 */
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
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

/**
 * Batch process heritage site narrations
 */
async function batchGenerateNarrations(
  sites: HeritageNarration[]
): Promise<AudioProcessingResult[]> {
  const results: AudioProcessingResult[] = [];

  console.log(`\n📝 Starting batch audio generation for ${sites.length} heritage sites...\n`);

  for (const site of sites) {
    const result = await generateHeritageNarration(site);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}

// ============================================
// Demo: Example Heritage Sites
// ============================================

const DEMO_HERITAGE_SITES: HeritageNarration[] = [
  {
    siteId: "site_001",
    siteName: "Real del Monte Historic Town",
    description:
      "Real del Monte is a historic mining town in Hidalgo, Mexico, founded in the 18th century. Known for its colonial architecture, colorful buildings, and rich cultural heritage. The town is famous for being where the first soccer match in Latin America took place. It represents an important chapter in Mexico's industrial history.",
    language: "es",
  },
  {
    siteId: "site_002",
    siteName: "El Bosque de Oyamel",
    description:
      "El Bosque de Oyamel is an enchanting forest sanctuary featuring majestic fir trees. This natural reserve serves as a critical habitat for monarch butterflies during their migration. The misty forest creates a mystical atmosphere and offers visitors a chance to connect with nature in one of Mexico's most precious ecosystems.",
    language: "es",
  },
  {
    siteId: "site_003",
    siteName: "Museo Mina la Dificultad",
    description:
      "The Mining Museum exhibits the heritage of silver mining in the region. Through preserved equipment and historical artifacts, visitors can experience the life of miners who shaped the town's history. The museum showcases the technological evolution of mining practices over centuries.",
    language: "es",
  },
];

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log("🎙️  RDM Digital - Heritage Audio Processor");
  console.log("━".repeat(50));
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Output Directory: ${outputDir}\n`);

  // Test 1: Generate speech for heritage sites
  console.log("TEST 1: Text-to-Speech Generation");
  console.log("─".repeat(50));

  const speechResults = await batchGenerateNarrations(DEMO_HERITAGE_SITES);

  console.log("\n📊 Speech Generation Results:");
  speechResults.forEach((result, index) => {
    const status = result.status === "success" ? "✓" : "✗";
    console.log(`  ${index + 1}. [${status}] ${result.input}`);
    if (result.filePath) console.log(`     Path: ${result.filePath}`);
    if (result.error) console.log(`     Error: ${result.error}`);
  });

  // Test 2: Transcribe the first generated audio
  console.log("\n\nTEST 2: Speech-to-Text Transcription");
  console.log("─".repeat(50));

  const generatedAudioFile = speechResults
    .filter((r) => r.status === "success" && r.filePath)
    .map((r) => r.filePath)[0];

  if (generatedAudioFile) {
    const transcriptionResult = await transcribeHeritageAudio(generatedAudioFile);

    console.log("\n📊 Transcription Result:");
    console.log(`  Status: ${transcriptionResult.status}`);
    if (transcriptionResult.output) {
      console.log(`  Text: "${transcriptionResult.output}"`);
      console.log(`  Confidence: ${(transcriptionResult.confidence || 0).toFixed(2)}`);
    }
    if (transcriptionResult.error) {
      console.log(`  Error: ${transcriptionResult.error}`);
    }
  } else {
    console.log("⚠️  No generated audio files to transcribe (speech generation may have failed)");
  }

  // Summary
  console.log("\n\n📈 Processing Summary");
  console.log("─".repeat(50));
  const successCount = speechResults.filter((r) => r.status === "success").length;
  console.log(`✓ Successful: ${successCount} / ${speechResults.length}`);
  console.log(`✗ Failed: ${speechResults.length - successCount} / ${speechResults.length}`);
  console.log(`📁 Output Directory: ${outputDir}`);
  console.log("\n✨ Audio processing complete!");
}

// Execute main function
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
