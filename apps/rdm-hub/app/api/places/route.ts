import { NextResponse } from "next/server";
import { lugares } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");
  const filtered = cat ? lugares.filter((p) => p.cat === cat) : lugares;

  return NextResponse.json({ ok: true, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPlace = {
      id: String(Date.now()),
      name: body.name,
      cat: body.cat || "general",
      desc: body.desc || "",
    };
    lugares.push(newPlace);
    return NextResponse.json({ ok: true, data: newPlace }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
}
