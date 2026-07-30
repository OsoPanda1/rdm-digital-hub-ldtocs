import { NextResponse } from "next/server";
import { eventos } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ ok: true, data: eventos });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEvent = {
      date: body.date || "Próximamente",
      title: body.title,
      loc: body.loc || "Por confirmar",
    };
    eventos.push(newEvent);
    return NextResponse.json({ ok: true, data: newEvent }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
}
