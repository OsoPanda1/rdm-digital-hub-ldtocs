import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const traceId = req.headers.get("x-trace-id") || crypto.randomUUID();
  res.headers.set("x-trace-id", traceId);
  res.headers.set("x-node-id", process.env.NEXT_PUBLIC_NODE_ID || "nd-0000");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
