import { put } from "@vercel/blob";
import { getCorsHeaders, handleCors } from "@/lib/cors";

export async function POST(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "content-type": "application/json", ...getCorsHeaders(request) },
      });
    }

    if (!path) {
      return new Response(JSON.stringify({ error: "No path provided" }), {
        status: 400,
        headers: { "content-type": "application/json", ...getCorsHeaders(request) },
      });
    }

    // Upload to Vercel Blob
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return new Response(JSON.stringify({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
    }), {
      status: 200,
      headers: { "content-type": "application/json", ...getCorsHeaders(request) },
    });
  } catch (err) {
    console.error("[blob/upload] error", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json", ...getCorsHeaders(request) },
    });
  }
}

export async function OPTIONS(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;
  return new Response(null, { status: 204 });
}