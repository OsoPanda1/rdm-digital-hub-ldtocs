import { NextResponse } from "next/server";

const places = [
  { id: "1", name: "Museo de Medicina Laboral", cat: "museo", lat: 20.1295, lng: -98.6734 },
  { id: "2", name: "Panteón Inglés", cat: "historico", lat: 20.1310, lng: -98.6710 },
  { id: "3", name: "Mina de Acosta", cat: "mineria", lat: 20.1270, lng: -98.6750 },
  { id: "4", name: "Parroquia de la Asunción", cat: "arquitectura", lat: 20.1300, lng: -98.6720 },
  { id: "5", name: "Museo del Paste", cat: "gastronomia", lat: 20.1285, lng: -98.6738 },
  { id: "6", name: "Plaza de la Constitución", cat: "plaza", lat: 20.1298, lng: -98.6725 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get("cat");
  const filtered = cat ? places.filter((p) => p.cat === cat) : places;

  return NextResponse.json({
    ok: true,
    data: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString(),
  });
}
