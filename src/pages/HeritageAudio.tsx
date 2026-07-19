import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HeritageSpeechPlayer,
  AudioUploadTranscriber,
  AdminAudioManager,
  AudioGallery,
} from "@/components/audio";

/**
 * HeritageAudio - Main page showcasing all audio features
 * Integrates speech-to-text and text-to-speech for heritage site narrations
 */
export default function HeritageAudio() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [transcribedText, setTranscribedText] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Heritage Audio Experience
          </h1>
          <p className="text-amber-100 text-lg">
            AI-powered narrations and transcriptions for Real del Monte's cultural treasures
          </p>
          <div className="mt-4 flex gap-4 text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full">
              🎙️ Text-to-Speech
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full">
              🎤 Speech-to-Text
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full">
              🌍 Multi-Language
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs Navigation */}
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="transcribe">Transcribe</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
          </TabsList>

          {/* Gallery Tab - Shows all heritage sites with audio */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Heritage Sites Gallery
              </h2>
              <p className="text-slate-600 mb-4">
                Explore all heritage sites with AI-generated narrations and imagery
              </p>
              <AudioGallery language="es" />
            </div>
          </TabsContent>

          {/* Transcribe Tab - Upload audio and transcribe */}
          <TabsContent value="transcribe" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transcriber */}
              <div>
                <AudioUploadTranscriber
                  heritageSiteId="demo_site"
                  onTranscriptionComplete={(text, confidence) => {
                    setTranscribedText(text);
                  }}
                  language="es"
                />
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    About Speech-to-Text
                  </h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Upload heritage site descriptions, visitor feedback, or guided tour recordings to automatically transcribe them into searchable text. Powered by OpenAI Whisper via AI Gateway.
                  </p>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      <strong>Supported Formats:</strong> MP3, WAV, M4A, FLAC, OGG
                    </p>
                    <p>
                      <strong>Max File Size:</strong> 25MB
                    </p>
                    <p>
                      <strong>Languages:</strong> 90+ languages including Spanish,
                      English, French
                    </p>
                  </div>
                </div>

                {/* Transcription Result */}
                {transcribedText && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Transcribed Text
                    </h3>
                    <p className="text-sm text-green-800">{transcribedText}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Admin Tab - Create narrations */}
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Manager */}
              <div className="lg:col-span-2">
                <AdminAudioManager
                  onNarrationCreated={(narration) => {
                    console.log("Narration created:", narration);
                  }}
                />
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3">
                    Creating Narrations
                  </h3>
                  <ol className="space-y-2 text-sm text-amber-800 list-decimal list-inside">
                    <li>Enter heritage site information</li>
                    <li>Write a compelling description (50+ characters)</li>
                    <li>Select a voice style and language</li>
                    <li>Click "Generate Narration"</li>
                    <li>Preview the audio</li>
                    <li>Audio appears in public gallery</li>
                  </ol>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Voice Options
                  </h3>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>
                      <strong>Alloy:</strong> Professional narrator
                    </li>
                    <li>
                      <strong>Echo:</strong> Deep, dramatic voice
                    </li>
                    <li>
                      <strong>Fable:</strong> Storytelling style
                    </li>
                    <li>
                      <strong>Nova:</strong> Friendly female voice
                    </li>
                    <li>
                      <strong>Shimmer:</strong> Bright, energetic
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Demo Tab - Interactive examples */}
          <TabsContent value="demo" className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Interactive Demo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Example 1: Narration */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Example: Heritage Site Narration
                  </h3>
                  <p className="text-sm text-amber-800 mb-4">
                    Click play to hear an AI-generated narration of a heritage site:
                  </p>

                  <HeritageSpeechPlayer
                    siteName="Real del Monte - Historic Town"
                    narrationText="Real del Monte is a historic mining town in Hidalgo, Mexico, founded in the 18th century. Known for its colonial architecture, colorful buildings, and rich cultural heritage. The town is famous for being where the first soccer match in Latin America took place."
                    audioUrl="" // Would be populated from API
                    language="es"
                  />
                </div>

                {/* Example 2: Features */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      🎙️ Text-to-Speech Features
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>✓ 6 voice options</li>
                      <li>✓ Multiple languages</li>
                      <li>✓ Natural pronunciation</li>
                      <li>✓ High-quality MP3 output</li>
                      <li>✓ Automatic caching</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">
                      🎤 Speech-to-Text Features
                    </h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>✓ 90+ languages</li>
                      <li>✓ High accuracy</li>
                      <li>✓ Timestamp support</li>
                      <li>✓ Confidence scores</li>
                      <li>✓ Batch processing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="mt-6 p-6 bg-slate-100 rounded-lg border border-slate-300">
                <h3 className="font-semibold text-slate-900 mb-3">
                  Technical Stack
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">AI Models</p>
                    <p className="text-slate-600">
                      OpenAI TTS-1 &amp; Whisper-1
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">API Gateway</p>
                    <p className="text-slate-600">Vercel AI Gateway</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Storage</p>
                    <p className="text-slate-600">Supabase Storage</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Database</p>
                    <p className="text-slate-600">Neon PostgreSQL</p>
                  </div>
                </div>
              </div>

              {/* API Documentation */}
              <div className="mt-6 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  API Endpoints
                </h3>
                <div className="space-y-2 font-mono text-xs text-indigo-800">
                  <p>POST /api/dg/audio/generate-speech - Create narration</p>
                  <p>POST /api/dg/audio/transcribe - Transcribe audio</p>
                  <p>GET /api/dg/audio/narrations/:slug - Get narration</p>
                  <p>GET /api/dg/audio/narrations - List all narrations</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            Heritage Audio Experience - Powered by AI Gateway & Vercel
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Part of RDM Digital Hub for cultural preservation and tourism
          </p>
        </div>
      </div>
    </div>
  );
}
