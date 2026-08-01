"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/hooks/use-places";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-[#6b7280] text-sm">
      Cargando mapa del territorio…
    </div>
  ),
});

const RDM_CENTER: [number, number] = [20.1381, -98.6732];

export function TerritoryMap({ places }: { places: Place[] }) {
  const valid = places.filter((p) => p.lat && p.lng);

  return (
    <div className="relative z-0 h-[420px] sm:h-[520px] rounded-2xl overflow-hidden border border-[#2a2d35] shadow-[0_0_40px_-15px_rgba(200,163,86,0.3)]">
      <MapView places={valid} center={RDM_CENTER} zoom={14} />
      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg border border-[#2a2d35] bg-[#0a0b0e]/85 backdrop-blur px-3 py-2 text-xs text-[#9ca3af]">
        {valid.length} puntos de interés en el territorio
      </div>
    </div>
  );
}
