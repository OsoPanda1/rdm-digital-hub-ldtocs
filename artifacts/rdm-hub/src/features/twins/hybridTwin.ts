/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import type { MapMarkerData } from "@/features/places/mapTypes";

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

// ============================================================================
// TYPES
// ============================================================================

export type TwinSource =
  | "eclipse-ditto"
  | "open-twins"
  | "forge-digital-twin"
  | "smart-hotel-iot"
  | "underrun-sim"
  | "awesome-digital-twins";

export interface TwinSignal {
  source: TwinSource;
  markerId: string;
  throughputPerMinute: number;
  latencyMs: number;
  health: "healthy" | "degraded" | "offline";
  confidence: number;
  mode: "historical" | "realtime" | "simulated";
}

export interface TwinOverlaySummary {
  source: TwinSource;
  displayName: string;
  healthScore: number;
  throughputPerMinute: number;
  avgLatencyMs: number;
  incidents: number;
  modeMix: Record<TwinSignal["mode"], number>;
}

export interface TwinScene {
  id: string;
  name: string;
  description: string;
  sensors: TwinSensor[];
  createdAt: string;
  updatedAt: string;
}

export interface TwinSensor {
  id: string;
  type: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  current: number;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  unit: string;
  timestamp: string;
  quality: "good" | "uncertain" | "bad";
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function getTwinSignals(twinId: string): Promise<TwinSignal[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/digital-twins/${twinId}/signals`, { credentials: 'include' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return generateFallbackSignals([
      { id: twinId, name: twinId, category: 'default', lat: 20.14, lng: -98.67, description: '', image: '', type: 'place', isPremium: false, status: 'Activo' },
    ]);
  }
}

export async function getTwinScenes(): Promise<TwinScene[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/digital-twins/scenes`, { credentials: 'include' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return [
      {
        id: 'scene-rdm-centro',
        name: 'Real del Monte Centro',
        description: 'Escena digital del centro historico con sensores ambientales y de flujo.',
        sensors: [
          { id: 's-temp-01', type: 'temperature', name: 'Temperatura', unit: 'C', min: -5, max: 35, current: 14.2 },
          { id: 's-hum-01', type: 'humidity', name: 'Humedad', unit: '%', min: 0, max: 100, current: 68 },
          { id: 's-flow-01', type: 'flow', name: 'Flujo peatonal', unit: 'personas/h', min: 0, max: 500, current: 127 },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'scene-mina-acosta',
        name: 'Mina de Acosta',
        description: 'Monitoreo de condiciones subterraneas de la mina historica.',
        sensors: [
          { id: 's-temp-02', type: 'temperature', name: 'Temperatura', unit: 'C', min: 5, max: 30, current: 12.8 },
          { id: 's-co2-01', type: 'gas', name: 'CO2', unit: 'ppm', min: 0, max: 5000, current: 420 },
          { id: 's-vib-01', type: 'vibration', name: 'Vibracion', unit: 'mm/s', min: 0, max: 50, current: 2.1 },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

export async function getTwinDetail(twinId: string): Promise<TwinScene | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/digital-twins/${twinId}`, { credentials: 'include' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    const scenes = await getTwinScenes();
    return scenes.find((s) => s.id === twinId) ?? null;
  }
}

export async function createSensorReading(twinId: string, data: { sensorId: string; value: number; unit: string }): Promise<SensorReading | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/digital-twins/${twinId}/readings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { sensorId: data.sensorId, value: data.value, unit: data.unit, timestamp: new Date().toISOString(), quality: 'good' };
  }
}

export async function getTwinHistory(twinId: string, sensorType: string, timeRange: string): Promise<SensorReading[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/digital-twins/${twinId}/history?sensorType=${sensorType}&range=${timeRange}`, { credentials: 'include' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    const now = Date.now();
    return Array.from({ length: 24 }, (_, i) => ({
      sensorId: `${sensorType}-${twinId}`,
      value: Math.round((Math.sin(i * 0.5) * 10 + 20) * 100) / 100,
      unit: 'C',
      timestamp: new Date(now - (23 - i) * 3600000).toISOString(),
      quality: 'good' as const,
    }));
  }
}

// ============================================================================
// FALLBACK GENERATION
// ============================================================================

const sourceNames: Record<TwinSource, string> = {
  "eclipse-ditto": "Eclipse Ditto",
  "open-twins": "OpenTwins",
  "forge-digital-twin": "Autodesk Forge",
  "smart-hotel-iot": "SmartHotel360 IoT",
  "underrun-sim": "Underrun Simulation",
  "awesome-digital-twins": "Awesome Digital Twins",
};

function seededValue(seed: string, min: number, max: number) {
  const hash = Array.from(seed).reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 3), 0);
  const ratio = (Math.sin(hash) + 1) / 2;
  return min + ratio * (max - min);
}

export function generateFallbackSignals(markers: MapMarkerData[]): TwinSignal[] {
  const sources: TwinSource[] = [
    "eclipse-ditto", "open-twins", "forge-digital-twin",
    "smart-hotel-iot", "underrun-sim", "awesome-digital-twins",
  ];

  return markers.flatMap((marker) =>
    sources.map((source) => {
      const latencyMs = Math.round(seededValue(`${source}-${marker.id}-latency`, 45, 340));
      const throughputPerMinute = Math.round(seededValue(`${source}-${marker.id}-throughput`, 12, marker.isPremium ? 145 : 84));
      const confidence = Number(seededValue(`${source}-${marker.id}-confidence`, 0.72, 0.98).toFixed(2));
      const health: TwinSignal["health"] =
        latencyMs < 120 && confidence > 0.85 ? "healthy" : latencyMs < 240 ? "degraded" : "offline";
      const mode: TwinSignal["mode"] =
        source === "underrun-sim" ? "simulated" : source === "awesome-digital-twins" ? "historical" : "realtime";

      return { source, markerId: marker.id, latencyMs, throughputPerMinute, health, confidence, mode };
    }),
  );
}

// Keep backward compatibility
export function synthesizeTwinSignals(markers: MapMarkerData[]): TwinSignal[] {
  return generateFallbackSignals(markers);
}

export function buildTwinOverlaySummary(signals: TwinSignal[]): TwinOverlaySummary[] {
  const grouped = new Map<TwinSource, TwinSignal[]>();
  for (const signal of signals) {
    if (!grouped.has(signal.source)) grouped.set(signal.source, []);
    grouped.get(signal.source)?.push(signal);
  }

  return Array.from(grouped.entries()).map(([source, items]) => {
    const throughputPerMinute = items.reduce((total, item) => total + item.throughputPerMinute, 0);
    const avgLatencyMs = Math.round(items.reduce((total, item) => total + item.latencyMs, 0) / Math.max(1, items.length));
    const incidents = items.filter((item) => item.health !== "healthy").length;
    const healthScore = Math.max(0, 100 - incidents * 8 - Math.round(avgLatencyMs / 20));
    const modeMix: Record<TwinSignal["mode"], number> = {
      historical: items.filter((item) => item.mode === "historical").length,
      realtime: items.filter((item) => item.mode === "realtime").length,
      simulated: items.filter((item) => item.mode === "simulated").length,
    };

    return { source, displayName: sourceNames[source], healthScore, throughputPerMinute, avgLatencyMs, incidents, modeMix };
  });
}

export function buildRecommendedActions(summaries: TwinOverlaySummary[]) {
  return summaries
    .filter((summary) => summary.healthScore < 80 || summary.avgLatencyMs > 180)
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 4)
    .map((summary) => {
      if (summary.source === "eclipse-ditto") return `Sincronizar twins de Eclipse Ditto con cola de eventos prioritaria (${summary.avgLatencyMs}ms).`;
      if (summary.source === "forge-digital-twin") return `Reducir tamano de geometrias en Autodesk Forge para bajar latencia de render.`;
      if (summary.source === "smart-hotel-iot") return `Ajustar frecuencia de telemetria de SmartHotel360 IoT para estabilizar throughput.`;
      if (summary.source === "open-twins") return `Validar conectores semanticos de OpenTwins y reintentos para incidentes detectados.`;
      if (summary.source === "underrun-sim") return `Recalibrar capa de simulacion Underrun para mantener coherencia con datos reales.`;
      return `Actualizar catalogo de patrones desde Awesome Digital Twins para reforzar modelos hibridos.`;
    });
}
