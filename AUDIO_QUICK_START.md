# Audio Gateway - Quick Start Guide

## 5-Minute Setup

### 1. Copy Heritage Audio Components

```bash
# Components are already in your project at:
/src/components/audio/
  - HeritageSpeechPlayer.tsx
  - AudioUploadTranscriber.tsx
  - AdminAudioManager.tsx
  - AudioGallery.tsx
  - index.ts
```

### 2. Use Components in Your Pages

```tsx
import {
  AudioGallery,
  HeritageSpeechPlayer,
  AudioUploadTranscriber,
  AdminAudioManager,
} from "@/components/audio";

export function MyHeritagePage() {
  return (
    <div>
      {/* Show all heritage sites */}
      <AudioGallery language="es" />

      {/* Or individual components */}
      <HeritageSpeechPlayer
        siteName="Real del Monte"
        narrationText="Historic mining town..."
        audioUrl="https://..."
        imageUrl="https://..."
      />
    </div>
  );
}
```

### 3. Run Database Migrations

```bash
# Create tables in Neon
npx prisma migrate deploy

# Or generate migration from schema
npx prisma migrate dev --name audio_schema
```

### 4. Set Environment Variables in Vercel

Go to **Settings → Environment Variables** and add:

```
AI_GATEWAY_API_KEY=vck_xxxxx
SUPABASE_SERVICE_ROLE_KEY=sbp_xxxxx
```

The other vars should already be set.

### 5. Deploy

```bash
git push origin main
# Vercel auto-deploys
```

## API Endpoints

### Public Endpoints (No Auth)

```bash
# Get all narrations
GET /api/dg/audio/narrations?language=es&limit=10

# Get specific narration
GET /api/dg/audio/narrations/real-del-monte
```

### Protected Endpoints (Requires Auth)

```bash
# Generate speech from text
POST /api/dg/audio/generate-speech
{
  "text": "Heritage site description",
  "heritageSiteId": "site_001",
  "voiceId": "nova",
  "siteSlug": "site-slug"
}

# Transcribe audio file
POST /api/dg/audio/transcribe
FormData: {
  "audio": File,
  "heritageSiteId": "site_001",
  "language": "es"
}
```

## Component Props

### HeritageSpeechPlayer

```tsx
<HeritageSpeechPlayer
  audioUrl="https://..."              // Required: MP3 URL
  narrationText="Description..."      // Required
  siteName="Heritage Site Name"       // Required
  imageUrl="https://..."              // Optional: site image
  language="es"                       // Optional: language code
  onPlay={() => {}}                   // Optional: callback
  onPause={() => {}}                  // Optional: callback
/>
```

### AudioUploadTranscriber

```tsx
<AudioUploadTranscriber
  heritageSiteId="site_001"          // Required
  language="es"                       // Optional
  onTranscriptionComplete={(text, confidence) => {}}
  onError={(error) => {}}
/>
```

### AdminAudioManager

```tsx
<AdminAudioManager
  onNarrationCreated={(narration) => {
    console.log("Created:", narration);
  }}
/>
```

### AudioGallery

```tsx
<AudioGallery
  language="es"                       // Optional
  images={[]}                         // Optional: override images
/>
```

## Common Tasks

### Generate a Narration Programmatically

```tsx
const response = await fetch("/api/dg/audio/generate-speech", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "Heritage site description",
    heritageSiteId: "site_001",
    voiceId: "nova",
    siteSlug: "site-slug",
  }),
});

const { audioFile } = await response.json();
console.log("Audio URL:", audioFile.publicUrl);
```

### Transcribe Audio Programmatically

```tsx
const formData = new FormData();
formData.append("audio", audioFile);
formData.append("heritageSiteId", "site_001");
formData.append("language", "es");

const response = await fetch("/api/dg/audio/transcribe", {
  method: "POST",
  body: formData,
});

const { text, confidence } = await response.json();
console.log("Transcribed:", text);
console.log("Confidence:", confidence);
```

### Display All Heritage Narrations

```tsx
const [narrations, setNarrations] = useState([]);

useEffect(() => {
  fetch("/api/dg/audio/narrations?language=es")
    .then((r) => r.json())
    .then((data) => setNarrations(data.data));
}, []);

return (
  <div>
    {narrations.map((n) => (
      <div key={n.slug}>
        <h3>{n.siteName}</h3>
        <audio src={n.audioVersions.es_normal} controls />
      </div>
    ))}
  </div>
);
```

## CLI Tool Usage

```bash
# Navigate to CLI
cd tools/audio-processor

# Install
npm install

# Setup env
cp .env.example .env.local
# Add AI_GATEWAY_API_KEY to .env.local

# Run
npm run test

# This generates MP3s for demo sites in ./audio_output/
```

## Database Tables

| Table | Purpose |
|-------|---------|
| HeritageAudioSession | Track processing sessions |
| AudioTranscription | Store transcribed text |
| AudioFile | Link to Supabase storage |
| AiGatewayLog | Audit trail of API calls |
| HeritageAudioNarration | Cache narration metadata |
| AudioUsageMetrics | Track API usage/costs |

## Debugging

### Check if API is working

```bash
curl https://your-domain.vercel.app/api/dg/audio/narrations
```

### Check database

```bash
# View sessions
SELECT * FROM "HeritageAudioSession" LIMIT 10;

# View transcriptions
SELECT * FROM "AudioTranscription" LIMIT 10;

# View API logs
SELECT * FROM "AiGatewayLog" LIMIT 10;
```

### Check storage

In Supabase Dashboard:
- Storage → audio → browse files
- Should see .mp3 files in heritage/ folder

## Performance Tips

1. **Cache audio**: Browser caches MP3s for 1 year
2. **Pre-generate**: Create narrations batch via CLI tool
3. **Lazy-load**: Load gallery images only when visible
4. **Monitor costs**: Check AiGatewayLog for usage

## Cost Breakdown (Monthly Estimates)

| Service | Cost |
|---------|------|
| AI Gateway (TTS/STT) | $3 |
| Supabase Storage | $5 |
| Neon Database | $14 |
| Vercel Pro | $20 |
| **Total** | **~$42** |

## Helpful Links

- [Audio Implementation Summary](./AUDIO_GATEWAY_IMPLEMENTATION_SUMMARY.md)
- [Deployment Guide](./docs/AUDIO_GATEWAY_DEPLOYMENT.md)
- [CLI Tool README](./tools/audio-processor/README.md)
- [AI SDK Docs](https://sdk.vercel.ai)
- [Supabase Docs](https://supabase.com/docs)

## Troubleshooting

**Q: "AI_GATEWAY_API_KEY not found"**
A: Add to Vercel project settings → Environment Variables

**Q: "Audio upload fails"**
A: Check Supabase bucket exists (audio) and is public

**Q: "Low transcription confidence"**
A: Use higher quality audio files, try different language

**Q: "Database connection timeout"**
A: Check Neon pooled connection is used (pooler endpoint)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Run database migrations
3. ✅ Test API endpoints
4. ✅ Generate sample narrations
5. ✅ Visit HeritageAudio demo page
6. ✅ Upload audio files for transcription
7. ✅ Create new narrations via admin panel
8. ✅ Monitor usage and costs

---

**Ready to go live?** Follow [AUDIO_GATEWAY_DEPLOYMENT.md](./docs/AUDIO_GATEWAY_DEPLOYMENT.md) for complete production checklist.
