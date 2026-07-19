# RDM Digital - Heritage Audio Processor CLI

A standalone command-line tool for generating speech narrations and transcribing audio files for heritage sites in the Real del Monte tourism platform.

## Features

- **Text-to-Speech (TTS)**: Convert heritage site descriptions to high-quality audio narrations
- **Speech-to-Text (STT)**: Transcribe audio files to text for accessibility and indexing
- **Batch Processing**: Generate multiple narrations in a single run
- **Error Handling**: Graceful error handling with detailed logging
- **AI Gateway Integration**: Uses Vercel's AI Gateway for OpenAI models

## Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your AI_GATEWAY_API_KEY
echo "AI_GATEWAY_API_KEY=your_key_here" >> .env.local
```

## Configuration

Create a `.env.local` file with the following variables:

```env
# Required
AI_GATEWAY_API_KEY=vck_xxxxx

# Optional
AUDIO_OUTPUT_DIR=./audio_output
DEBUG=false
```

### Environment Variables

- **AI_GATEWAY_API_KEY** (required): Your Vercel AI Gateway API key
- **AUDIO_OUTPUT_DIR** (optional): Directory where audio files will be saved (default: `./audio_output`)
- **DEBUG** (optional): Enable debug logging (default: `false`)

## Usage

### Run Demo

```bash
npm run test
```

This will:
1. Generate speech narrations for sample heritage sites
2. Save MP3 files to `./audio_output`
3. Transcribe the generated audio back to text
4. Display processing results

### Development

```bash
npm run dev
```

Watches for file changes and re-runs the processor.

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` folder.

### Production

```bash
npm start
```

Runs the compiled JavaScript.

## Project Structure

```
tools/audio-processor/
├── index.ts           # Main CLI entry point
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── .env.example       # Environment variables template
├── .env.local         # Your local secrets (not committed)
└── audio_output/      # Generated audio files (git-ignored)
```

## Example Output

```
🎙️  RDM Digital - Heritage Audio Processor
================================================== ================================================

TEST 1: Text-to-Speech Generation
──────────────────────────────────────
[2024-01-15T10:30:45.123Z] Generating speech for heritage site: Real del Monte Historic Town
✓ Speech generated and saved to ./audio_output/site_001_narration_abc123.mp3

📊 Speech Generation Results:
  1. [✓] Real del Monte is a historic mining town...
     Path: ./audio_output/site_001_narration_abc123.mp3

TEST 2: Speech-to-Text Transcription
──────────────────────────────────────
[2024-01-15T10:30:52.456Z] Transcribing audio: ./audio_output/site_001_narration_abc123.mp3
✓ Transcription complete: "Real del Monte is a historic mining town..."

📊 Transcription Result:
  Status: success
  Text: "Real del Monte is a historic mining town in Hidalgo, Mexico..."
  Confidence: 0.98

📈 Processing Summary
──────────────────────────────────────
✓ Successful: 1 / 1
✗ Failed: 0 / 1
📁 Output Directory: ./audio_output
```

## API Integration

To integrate the processor with the main RDM Digital API:

### Option 1: Vercel Cron Function

Create `/api/cron/generate-narrations.ts`:

```typescript
import { type VercelRequest, type VercelResponse } from "@vercel/node";
import { audioService } from "@/server/src/data-gateway/audio/audio.service";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sites = [
      {
        siteId: "site_001",
        siteName: "Real del Monte",
        description: "...",
      },
      // Add more sites
    ];

    for (const site of sites) {
      await audioService.generateNarration(site.description, site.siteId);
    }

    res.status(200).json({ message: "Narrations generated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Processing failed",
      });
  }
}
```

Deploy with:

```bash
# vercel.json
{
  "crons": [{
    "path": "/api/cron/generate-narrations",
    "schedule": "0 2 * * *"
  }]
}
```

### Option 2: GitHub Actions Workflow

Create `.github/workflows/generate-narrations.yml`:

```yaml
name: Generate Heritage Narrations
on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm ci

      - name: Generate narrations
        env:
          AI_GATEWAY_API_KEY: ${{ secrets.AI_GATEWAY_API_KEY }}
        run: npx tsx tools/audio-processor/index.ts
```

### Option 3: Server-Side Generation

Call from your Express API:

```typescript
import { audioService } from "@/server/src/data-gateway/audio/audio.service";

app.post("/api/admin/generate-narration", async (req, res) => {
  const { siteName, siteId, description, voiceId } = req.body;

  const result = await audioService.generateNarration(
    description,
    siteId,
    req.user?.id,
    { voiceId, siteSlug: siteName.toLowerCase().replace(/ /g, "-") }
  );

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  res.json(result);
});
```

## Performance Considerations

### Audio File Sizes

Typical MP3 file sizes (at 128kbps):
- 1 minute of speech: ~1 MB
- 3 minutes (typical narration): ~3 MB

### AI Gateway Costs

Approximate costs per operation:
- Text-to-Speech: $0.015 per 1,000 characters
- Speech-to-Text: $0.006 per minute of audio

### Caching Strategy

- Cache generated audio for 1 year (31536000s)
- Re-use narrations across deployments
- Batch generate all narrations monthly

## Troubleshooting

### "AI_GATEWAY_API_KEY is missing"

```bash
# Check environment variable is set
echo $AI_GATEWAY_API_KEY

# If empty, update .env.local
echo "AI_GATEWAY_API_KEY=vck_xxxxx" > .env.local
```

### "Failed to generate speech"

1. Verify API key is valid
2. Check internet connection
3. Ensure text is not too long (max ~2000 characters per request)
4. Try with a different voice

### "Transcription confidence is low"

1. Upload higher quality audio files
2. Try different language setting
3. Reduce background noise
4. Ensure audio is mono (not stereo)

## Development Workflow

### Adding New Heritage Sites

Edit `index.ts` and add sites to `DEMO_HERITAGE_SITES`:

```typescript
const DEMO_HERITAGE_SITES: HeritageNarration[] = [
  {
    siteId: "site_004",
    siteName: "New Heritage Site",
    description: "Compelling description of the site...",
    language: "es",
  },
  // ...
];
```

### Customizing Voices

Available voices via OpenAI TTS-1:
- `alloy` - Neutral, professional
- `echo` - Deep, dramatic
- `fable` - Storytelling style
- `onyx` - Mature male voice
- `nova` - Friendly female voice
- `shimmer` - Bright, energetic

## API Reference

### generateNarration()

Generate speech for a heritage site description.

```typescript
const result = await audioService.generateNarration(
  narrationText: string,
  heritageSiteId: string,
  supabaseUserId?: string,
  options?: { voiceId?: string; siteSlug?: string }
): Promise<{
  session: HeritageAudioSession;
  audioFile?: AudioFile;
  error?: string;
}>
```

### transcribeAudio()

Transcribe audio file to text.

```typescript
const result = await audioService.transcribeAudio(
  audioBuffer: Buffer,
  heritageSiteId: string,
  fileName: string,
  supabaseUserId?: string,
  language: string = "es"
): Promise<{
  session: HeritageAudioSession;
  transcription?: AudioTranscription;
  error?: string;
}>
```

## Contributing

To add new features or improve the processor:

1. Create a feature branch
2. Make changes to `index.ts` or `audio.service.ts`
3. Test locally with `npm run dev`
4. Submit a pull request

## License

Part of RDM Digital Hub - All rights reserved.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the deployment guide: `/docs/AUDIO_GATEWAY_DEPLOYMENT.md`
3. Contact the development team

## Resources

- [AI SDK Documentation](https://sdk.vercel.ai)
- [OpenAI TTS Documentation](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI Whisper Documentation](https://platform.openai.com/docs/guides/speech-to-text)
- [Vercel AI Gateway](https://sdk.vercel.ai/docs/ai-gateway)
