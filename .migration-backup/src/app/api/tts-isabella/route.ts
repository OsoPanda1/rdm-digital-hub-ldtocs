import { supabase } from "@/integrations/supabase/client";

interface TTSRequest {
  text: string;
  context?: {
    federation?: string;
    useCase?: string;
    language?: string;
  };
}

interface TTSResponse {
  audioUrl: string;
  mode: "local" | "cloud";
}

const EDGE_TTS_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts-isabella`;

export async function POST(request: Request) {
  try {
    const body = await request.json() as TTSRequest;
    const { text, context } = body;

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (text.length > 5000) {
      return new Response(JSON.stringify({ error: "Text too long (max 5000 chars)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(EDGE_TTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        text: text.trim(),
        context: {
          federation: context?.federation ?? "F6",
          useCase: context?.useCase ?? "general",
          language: context?.language ?? "es-MX",
        },
        userId: session?.user?.id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `TTS request failed with status ${response.status}`);
    }

    const data = await response.json() as TTSResponse;

    if (!data.audioUrl) {
      throw new Error("Edge Function did not return audioUrl");
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[TTS API] Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}