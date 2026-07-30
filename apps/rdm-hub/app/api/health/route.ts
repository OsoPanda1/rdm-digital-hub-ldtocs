import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    node: process.env.NEXT_PUBLIC_NODE_ID || "nd-0000",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    region: process.env.VERCEL_REGION || "local",
  });
}
