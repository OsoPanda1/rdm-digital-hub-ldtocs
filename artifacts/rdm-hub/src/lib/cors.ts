/**
 * CORS utilities for API routes
 * Provides unified CORS handling for server-side and edge functions
 */

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://www.visitarealdelmonte.online",
    "https://visitarealdelmonte.online",
    "http://localhost:5173",
    "http://localhost:3000",
  ];
  
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-Id",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: Request): Response | null {
  if (request.method === "OPTIONS") {
    const headers = getCorsHeaders(request);
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  }
  return null;
}

export function corsJsonResponse(
  request: Request,
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      ...getCorsHeaders(request),
      ...(extraHeaders || {}),
    },
  });
}