import { NextResponse } from "next/server";

type PlaceCategory =
  | "museo"
  | "historico"
  | "mineria"
  | "arquitectura"
  | "gastronomia"
  | "plaza";

type Place = {
  id: string;
  name: string;
  cat: PlaceCategory;
  lat: number;
  lng: number;
};

type ApiResponse<T> = {
  ok: boolean;
  data: T;
  total: number;
  timestamp: string;
};

const PLACES: readonly Place[] = [
  { id: "1", name: "Museo de Medicina Laboral", cat: "museo", lat: 20.1295, lng: -98.6734 },
  { id: "2", name: "Panteón Inglés", cat: "historico", lat: 20.1310, lng: -98.6710 },
  { id: "3", name: "Mina de Acosta", cat: "mineria", lat: 20.1270, lng: -98.6750 },
  { id: "4", name: "Parroquia de la Asunción", cat: "arquitectura", lat: 20.1300, lng: -98.6720 },
  { id: "5", name: "Museo del Paste", cat: "gastronomia", lat: 20.1285, lng: -98.6738 },
  { id: "6", name: "Plaza de la Constitución", cat: "plaza", lat: 20.1298, lng: -98.6725 },
] as const;

const CATEGORY_SET = new Set<PlaceCategory>([
  "museo",
  "historico",
  "mineria",
  "arquitectura",
  "gastronomia",
  "plaza",
]);

function isPlaceCategory(value: string | null): value is PlaceCategory {
  return typeof value === "string" && CATEGORY_SET.has(value as PlaceCategory);
}

function getFilteredPlaces(cat: string | null): readonly Place[] {
  if (!isPlaceCategory(cat)) return PLACES;
  return PLACES.filter((place) => place.cat === cat);
}

function buildSuccessResponse(data: readonly Place[]): NextResponse<ApiResponse<readonly Place[]>> {
  return NextResponse.json({
    ok: true,
    data,
    total: data.length,
    timestamp: new Date().toISOString(),
  });
}

function buildErrorResponse(message = "Internal server error") {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cat = searchParams.get("cat");

    const data = getFilteredPlaces(cat);
    return buildSuccessResponse(data);
  } catch (error) {
    console.error("Places API error:", error);
    return buildErrorResponse();
  }
}
