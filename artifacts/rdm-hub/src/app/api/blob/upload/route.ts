// Vercel Blob is not available on Replit.
// File uploads should be handled via Replit Object Storage (see object-storage skill)
// or another storage provider configured for this environment.

import { getCorsHeaders, handleCors } from "@/lib/cors";

export async function POST(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;

  return new Response(
    JSON.stringify({ error: "File upload via Vercel Blob is not supported on Replit. Configure an alternative storage provider." }),
    { status: 501, headers: { "content-type": "application/json", ...getCorsHeaders(request) } }
  );
}
