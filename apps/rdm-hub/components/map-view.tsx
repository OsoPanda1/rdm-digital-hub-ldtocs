"use client";

import { MapContainer, TileLayer, Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/hooks/use-places";

const goldPin = L.divIcon({
  html: '<div class="rdm-pin"><span>🪙</span></div>',
  className: "rdm-pin-wrapper",
  iconSize: [34, 34],
  iconAnchor: [17, 30],
  popupAnchor: [0, -28],
});

interface MapViewProps {
  places: Place[];
  center: [number, number];
  zoom?: number;
}

export default function MapView({ places, center, zoom = 14 }: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {places.map(
        (p) =>
          p.lat &&
          p.lng && (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={goldPin}>
              <Tooltip>{p.name}</Tooltip>
              <Popup>
                <div className="space-y-1.5" style={{ minWidth: 190 }}>
                  <p className="font-bold font-serif text-[15px]" style={{ color: "#d4b26a", margin: 0 }}>
                    {p.name}
                  </p>
                  <p className="text-[12px] leading-snug" style={{ color: "#9ca3af", margin: 0 }}>
                    {p.description}
                  </p>
                  {p.address && (
                    <p className="text-[11px]" style={{ color: "#6b7280", margin: 0 }}>
                      📍 {p.address}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}
