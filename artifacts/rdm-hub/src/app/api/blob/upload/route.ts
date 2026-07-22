// Vercel Blob is not available on Replit.
// File uploads should be handled via Replit Object Storage (see object-storage skill).
// This stub returns 501 so callers know to use the alternative upload endpoint.
import { getCorsHeaders, handleCors } from "@/lib/cors";

export async function POST(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;

  return new Response(
    JSON.stringify({
      error: "Vercel Blob is not available in this environment. Use /api/storage/upload instead.",
    }),
    {
      status: 501,
      headers: { "content-type": "application/json", ...getCorsHeaders(request) },
    },
  );
}

export async function OPTIONS(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;
  return new Response(null, { status: 204 });
}
