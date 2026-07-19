# Audio Gateway Deployment Guide

## Project Overview

This document covers the production deployment of the Heritage Audio Experience system, which integrates AI Gateway speech-to-text and text-to-speech capabilities with the RDM Digital Hub.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (TanStack Start)                 │
│  - HeritageAudioGallery (audio narrations with images)      │
│  - AdminAudioManager (content creation dashboard)            │
│  - AudioUploadTranscriber (voice-to-text for accessibility)  │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Express Server)                 │
│  POST /api/dg/audio/generate-speech  (TTS via AI Gateway)   │
│  POST /api/dg/audio/transcribe       (STT via AI Gateway)   │
│  GET /api/dg/audio/narrations        (list all narrations)  │
│  GET /api/dg/audio/narrations/:slug  (fetch by slug)        │
└─────────────────────────────────────────────────────────────┘
         ↓
         ├─→ Neon (PostgreSQL)
         │   - audio_sessions (metadata)
         │   - audio_transcriptions (text output)
         │   - ai_gateway_logs (audit trail)
         │   - heritage_audio_narrations (caching)
         │
         ├─→ Supabase Storage
         │   - heritage/{siteId}/*.mp3 (generated audio files)
         │
         └─→ Vercel AI Gateway
             - openai/tts-1 (text-to-speech)
             - openai/whisper-1 (speech-to-text)
```

## Pre-Deployment Checklist

### 1. Environment Variables

Verify all required environment variables are set in Vercel project settings:

**AI Gateway**
```
AI_GATEWAY_API_KEY=vck_xxxxx (obtained from Vercel dashboard)
```

**Database (Neon)**
```
DATABASE_URL=postgresql://user:pass@host/db (for Prisma)
NEON_POSTGRES_URL=postgresql://...  (pooled connection)
NEON_POSTGRES_URL_NO_SSL=postgresql://...  (for local dev)
```

**Supabase**
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sbp_xxxxx (service role for file uploads)
SUPABASE_ANON_KEY=eyJhbGc...  (anonymous key for client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx
```

### 2. Database Schema Migration

Before deploying, apply the audio schema changes to your Neon database:

```bash
# Generate Prisma migration
npx prisma migrate dev --name add_audio_schema

# Deploy to production
npx prisma migrate deploy
```

The migration will create:
- `HeritageAudioSession` - track audio processing sessions
- `AudioTranscription` - store text output from speech-to-text
- `AudioFile` - link to Supabase storage paths
- `AiGatewayLog` - audit trail of all AI API calls
- `HeritageAudioNarration` - cache narration metadata
- `AudioUsageMetrics` - track API usage per user per month

### 3. Supabase Storage Bucket

Create a new storage bucket for audio files:

```bash
# Using Supabase CLI
supabase buckets create audio --public=true

# Or create via dashboard:
# - Name: audio
# - Public: Yes
# - Max size: 100 MB (adjust as needed)
```

Configure bucket policy for public access:

```sql
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio');

CREATE POLICY "Allow service role upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio' AND auth.role() = 'service_role');
```

### 4. Neon Connection Pooling

For serverless environments (Vercel), use connection pooling:

```env
# Use pooled connection for API routes
DATABASE_URL=postgresql://user:pass@host:6543/db?sslmode=require

# Use non-pooled for migrations/CLI
DATABASE_URL_UNPOOLED=postgresql://user:pass@host:5432/db?sslmode=require
```

In `package.json` scripts, ensure migrations use the unpooled connection:

```json
{
  "prisma:migrate": "DATABASE_URL=$DATABASE_URL_UNPOOLED prisma migrate deploy"
}
```

### 5. Deploy to Vercel

```bash
# 1. Push code to GitHub
git add .
git commit -m "feat: add audio gateway integration"
git push origin main

# 2. Vercel auto-deploys from main branch
# Monitor deployment: https://vercel.com/dashboard

# 3. Verify environment variables are set in project settings
# - Settings → Environment Variables

# 4. After deployment, run database migrations:
vercel run prisma:migrate
```

## Testing Production Deployment

### Test Endpoints

1. **Health Check**
```bash
curl https://your-domain.vercel.app/api/dg/health
```

2. **Generate Speech**
```bash
curl -X POST https://your-domain.vercel.app/api/dg/audio/generate-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome to Real del Monte",
    "heritageSiteId": "site_001",
    "voiceId": "nova"
  }'
```

3. **Get Narrations**
```bash
curl https://your-domain.vercel.app/api/dg/audio/narrations?language=es&limit=10
```

4. **Fetch Specific Narration**
```bash
curl https://your-domain.vercel.app/api/dg/audio/narrations/real-del-monte
```

### Monitor Performance

Track in Vercel dashboard:
- API response times
- Function duration
- Error rates
- Cold start times

Use Neon dashboard to monitor:
- Database connections
- Query performance
- Connection pool status

## Production Optimization

### 1. Caching Strategy

**Browser Cache**
- MP3 files: 1 year (31536000 seconds)
- API responses: 5 minutes (300 seconds)

**CDN Cache**
- Vercel automatically caches static files
- Audio URLs should use Supabase Storage CDN

**Database Cache**
- Use DgCacheEntry for expensive queries
- Cache narration lists for 5 minutes

### 2. Rate Limiting

Implement per-user rate limiting to prevent abuse:

```typescript
// Example: 10 speech generations per minute per user
const RATE_LIMITS = {
  speech_generation: 10,
  transcription: 20,
  period_ms: 60000,
};
```

### 3. Error Handling

Implement graceful degradation:
- If AI Gateway fails, return cached audio
- If Supabase upload fails, log error but continue
- Show user-friendly error messages

### 4. Monitoring & Logging

Set up monitoring dashboards:

**Sentry** (error tracking)
```
VITE_SENTRY_DSN=https://xxx@xxxx.ingest.sentry.io/xxxx
```

**PostHog** (product analytics)
```
VITE_POSTHOG_KEY=phc_xxxxx
```

**Datadog/New Relic** (APM)
- Monitor API latency
- Track AI Gateway response times
- Alert on error spikes

## Standalone CLI Tool Deployment

The `/tools/audio-processor/` CLI can be run via:

1. **Vercel Cron Functions**
```json
{
  "crons": [{
    "path": "/api/cron/generate-heritage-narrations",
    "schedule": "0 2 * * *"
  }]
}
```

2. **GitHub Actions**
```yaml
name: Batch Audio Generation
on:
  schedule:
    - cron: '0 2 * * *'
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate narrations
        run: npx tsx tools/audio-processor/index.ts
```

## Cost Optimization

### AI Gateway Pricing (Vercel AI Gateway)

- OpenAI TTS-1: ~$0.015 per 1K characters
- OpenAI Whisper-1: ~$0.006 per minute of audio

### Supabase Storage

- Storage: $5 per 100GB
- Audio files typically 2-5 MB per narration

### Neon Database

- Per-project: $14/month
- Additional storage: $0.25/GB/month

### Vercel Functions

- Free: 100GB bandwidth/month
- Pro: $20/month + additional usage

### Cost Reduction Strategies

1. Pre-generate all common narrations to avoid repeat AI calls
2. Set audio cache TTL to 1 year
3. Use audio compression (64kbps MP3 instead of 128kbps)
4. Batch transcription requests
5. Implement request deduplication

## Rollback Procedure

If issues occur in production:

```bash
# 1. Revert database migrations
npx prisma migrate resolve --rolled-back add_audio_schema

# 2. Revert code
git revert <commit-hash>
git push origin main

# 3. Vercel auto-redeploys from main branch

# 4. Monitor error rates in dashboard
```

## Security Considerations

1. **API Authentication**
   - All audio endpoints require Supabase auth
   - Admin endpoints require ADMIN role

2. **File Access**
   - Supabase Storage files are public but signed URLs optional
   - Audio files can be served via CDN

3. **Rate Limiting**
   - Implement per-user limits to prevent abuse
   - Monitor AI Gateway API key usage

4. **Data Privacy**
   - Logs contain user IDs - handle per GDPR requirements
   - Transcriptions may contain PII - consider retention policies
   - Audit all AI Gateway usage

5. **Secret Management**
   - Rotate AI_GATEWAY_API_KEY annually
   - Use Vercel's encrypted environment variables
   - Never commit secrets to GitHub

## Support & Troubleshooting

### Common Issues

**Issue: "AI_GATEWAY_API_KEY not found"**
- Solution: Verify env var is set in Vercel project settings
- Check: Dashboard → Settings → Environment Variables

**Issue: "Storage upload failed"**
- Solution: Check Supabase bucket permissions
- Verify SUPABASE_SERVICE_ROLE_KEY is correct

**Issue: "Database connection timeout"**
- Solution: Check Neon connection pool status
- Verify DATABASE_URL uses pooled endpoint

**Issue: "Transcription confidence < 0.8"**
- Solution: Upload higher quality audio files
- Try different language setting

### Debugging

Enable debug logging:
```
DEBUG=*:audio npm run dev
```

Check Vercel logs:
```bash
vercel logs
```

Monitor database queries:
```bash
QUERY_LOG=* npm run dev
```

## Resources

- [Vercel AI Gateway Docs](https://sdk.vercel.ai)
- [OpenAI TTS Documentation](https://platform.openai.com/docs/guides/text-to-speech)
- [OpenAI Whisper Documentation](https://platform.openai.com/docs/guides/speech-to-text)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Neon PostgreSQL Docs](https://neon.tech/docs)

## Next Steps

1. Deploy to production
2. Run database migrations
3. Test all endpoints
4. Monitor performance
5. Gather user feedback
6. Optimize based on usage patterns
