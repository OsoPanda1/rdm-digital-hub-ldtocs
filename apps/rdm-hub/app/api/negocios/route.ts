import { NextResponse } from "next/server";
import { negocios } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");
  const filtered = cat ? negocios.filter((b) => b.cat === cat) : negocios;

  return NextResponse.json({ ok: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBiz = {
      name: body.name,
      cat: body.cat || "General",
      desc: body.desc || "",
    };
    negocios.push(newBiz);
    return NextResponse.json({ ok: true, data: newBiz }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
}
