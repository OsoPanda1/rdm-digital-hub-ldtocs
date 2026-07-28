/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Play, Square, Clock, Navigation, Gauge, Route, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const HISTORY_KEY = "rdm-route-history";

interface Waypoint {
  lat: number;
  lng: number;
  timestamp: number;
  altitude?: number | null;
}

interface SavedRoute {
  id: string;
  name: string;
  category: string;
  waypoints: Waypoint[];
  distance: number;
  duration: number;
  savedAt: string;
}

const CATEGORIES = ["Turismo", "Ciclismo", "Senderismo", "Minero"] as const;

function haversineDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function totalDistance(wps: Waypoint[]): number {
  let dist = 0;
  for (let i = 1; i < wps.length; i++) {
    dist += haversineDistance(wps[i - 1], wps[i]);
  }
  return dist;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function loadHistory(): SavedRoute[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(routes: SavedRoute[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(routes));
  } catch {
    // ignore
  }
}

export default function RouteTracker() {
  const [tracking, setTracking] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [routeName, setRouteName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [history, setHistory] = useState<SavedRoute[]>(loadHistory);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const distance = totalDistance(waypoints);
  const durationSec = elapsed;
  const avgSpeed = durationSec > 0 ? (distance / (durationSec / 3600)) : 0;

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalización no disponible en este dispositivo");
      return;
    }
    setGeoError(null);
    setTracking(true);
    setWaypoints([]);
    setElapsed(0);
    setRouteName(`Ruta ${new Date().toLocaleDateString("es-MX")} ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`);

    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const wp: Waypoint = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
          altitude: pos.coords.altitude,
        };
        setCurrentPosition({ lat: wp.lat, lng: wp.lng });
        setWaypoints((prev) => [...prev, wp]);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError("Permiso de ubicación denegado. Habilita la ubicación en tu navegador.");
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError("Ubicación no disponible. Verifica tu conexión GPS.");
            break;
          case err.TIMEOUT:
            setGeoError("Tiempo de espera agotado para obtener ubicación.");
            break;
          default:
            setGeoError("Error desconocido al obtener ubicación.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    toast.success("Rastreo iniciado");
  }, []);

  const stopTracking = useCallback(() => {
    setTracking(false);
    if (watchIdRef.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    toast.info("Rastreo detenido");
  }, []);

  const saveRoute = useCallback(async () => {
    if (waypoints.length < 2) {
      toast.error("Se necesitan al menos 2 puntos para guardar una ruta");
      return;
    }
    setSaving(true);
    const routeData: SavedRoute = {
      id: crypto.randomUUID(),
      name: routeName || `Ruta ${new Date().toLocaleDateString("es-MX")}`,
      category,
      waypoints,
      distance,
      duration: durationSec,
      savedAt: new Date().toISOString(),
    };

    try {
      fetch(`${API_BASE}/v1/gamification/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "page_visit",
          payload: { route: routeData, module: "route_tracker" },
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // non-critical
    }

    try {
      if (typeof window !== "undefined") {
        const { error } = await supabase.from("routes").insert({
          name: routeData.name,
          category: routeData.category,
          waypoints: routeData.waypoints,
          distance: routeData.distance,
          duration: routeData.duration,
        });
        if (error) throw error;
      }
    } catch {
      // Supabase may not be configured — localStorage is the MVP fallback
    }

    const updatedHistory = [routeData, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    setSaving(false);
    toast.success(`Ruta "${routeData.name}" guardada`);
  }, [waypoints, routeName, category, distance, durationSec, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
    toast.info("Historial limpiado");
  }, []);

  const removeRoute = useCallback((id: string) => {
    const updated = history.filter((r) => r.id !== id);
    setHistory(updated);
    saveHistory(updated);
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {geoError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 font-mono">
          {geoError}
        </div>
      )}

      {/* Main Tracking Card */}
      <div className="glass-card rounded-2xl p-6 border border-border/20">
        {/* Start/Stop Button + Map */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Map Area */}
          <div className="flex-1 min-h-[200px] rounded-xl bg-secondary/10 border border-border/10 flex items-center justify-center relative overflow-hidden">
            {currentPosition ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Simple CSS grid map */}
                <div className="absolute inset-0 opacity-10">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="absolute border-[var(--color-border)]" style={{ left: `${i * 5}%`, top: 0, bottom: 0, width: "1px", opacity: 0.3 }} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute border-[var(--color-border)]" style={{ top: `${i * 5}%`, left: 0, right: 0, height: "1px", opacity: 0.3 }} />
                  ))}
                </div>
                {/* Current position marker */}
                <div className={`w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg z-10 ${tracking ? "animate-ping" : ""}`} style={{ animationDuration: "2s" }} />
                {tracking && (
                  <div className="absolute w-16 h-16 rounded-full border-2 border-emerald-500/30 animate-ping z-5" style={{ animationDuration: "2s" }} />
                )}
                {/* Waypoint trail */}
                {waypoints.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {waypoints.length > 1 && (
                      <polyline
                        points={waypoints.map((wp, i) => {
                          const minLat = Math.min(...waypoints.map((w) => w.lat));
                          const maxLat = Math.max(...waypoints.map((w) => w.lat));
                          const minLng = Math.min(...waypoints.map((w) => w.lng));
                          const maxLng = Math.max(...waypoints.map((w) => w.lng));
                          const rangeLat = maxLat - minLat || 0.001;
                          const rangeLng = maxLng - minLng || 0.001;
                          const x = 10 + ((wp.lng - minLng) / rangeLng) * 80;
                          const y = 90 - ((wp.lat - minLat) / rangeLat) * 80;
                          return `${x},${y}`;
                        }).join(" ")}
                        fill="none"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth="0.5"
                        opacity="0.6"
                      />
                    )}
                  </svg>
                )}
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground bg-background/60 px-2 py-1 rounded backdrop-blur">
                  {currentPosition.lat.toFixed(5)}, {currentPosition.lng.toFixed(5)}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>{tracking ? "Esperando señal GPS..." : "Inicia el rastreo para ver tu posición"}</p>
              </div>
            )}
          </div>

          {/* Controls & Stats */}
          <div className="flex flex-col gap-4 md:w-64">
            {/* Start/Stop Button */}
            <button
              onClick={tracking ? stopTracking : startTracking}
              className={`w-full h-20 rounded-2xl border-2 flex items-center justify-center gap-3 text-lg font-display font-bold transition-all duration-300 ${
                tracking
                  ? "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                  : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30"
              }`}
            >
              {tracking ? (
                <>
                  <Square className="h-6 w-6" />
                  Detener
                </>
              ) : (
                <>
                  <Play className="h-6 w-6" />
                  Iniciar Rastreo
                </>
              )}
            </button>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-secondary/10 border border-border/10 p-3 text-center">
                <Navigation className="h-4 w-4 mx-auto mb-1 text-gold" />
                <p className="text-lg font-display font-bold">{distance.toFixed(2)}</p>
                <p className="text-[10px] text-muted-foreground font-mono">KM</p>
              </div>
              <div className="rounded-xl bg-secondary/10 border border-border/10 p-3 text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-electric" />
                <p className="text-lg font-display font-bold">{formatDuration(durationSec)}</p>
                <p className="text-[10px] text-muted-foreground font-mono">TIEMPO</p>
              </div>
              <div className="rounded-xl bg-secondary/10 border border-border/10 p-3 text-center">
                <Gauge className="h-4 w-4 mx-auto mb-1 text-copper" />
                <p className="text-lg font-display font-bold">{avgSpeed.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground font-mono">KM/H</p>
              </div>
              <div className="rounded-xl bg-secondary/10 border border-border/10 p-3 text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1 text-teal" />
                <p className={`text-lg font-display font-bold ${tracking ? "text-emerald-400" : ""}`}>{waypoints.length}</p>
                <p className="text-[10px] text-muted-foreground font-mono">PUNTOS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Info & Save */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Nombre de la ruta"
            className="flex-1 rounded-xl bg-secondary/20 border border-border/20 px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl bg-secondary/20 border border-border/20 px-4 py-2.5 text-sm font-body text-foreground focus:outline-none focus:border-gold/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={saveRoute}
            disabled={waypoints.length < 2 || saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gold/20 border border-gold/40 px-5 py-2.5 text-sm font-display font-bold text-gold hover:bg-gold/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="glass-card rounded-2xl border border-border/20 overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-gold" />
            <span className="text-sm font-display font-bold">Historial de Rutas ({history.length})</span>
          </div>
          {showHistory ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showHistory && (
          <div className="px-5 pb-5 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No hay rutas guardadas aún</p>
            ) : (
              <>
                {history.map((route) => (
                  <div key={route.id} className="flex items-center justify-between rounded-xl bg-secondary/10 border border-border/10 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-display font-bold truncate">{route.name}</p>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">{route.category}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-[11px] font-mono text-muted-foreground">
                        <span>{new Date(route.savedAt).toLocaleDateString("es-MX")}</span>
                        <span>{route.distance.toFixed(2)} km</span>
                        <span>{formatDuration(route.duration)}</span>
                        <span>{route.waypoints.length} pts</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeRoute(route.id)}
                      className="ml-3 p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearHistory}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-mono text-red-400 hover:bg-red-500/10 transition"
                >
                  <Trash2 className="h-3 w-3" />
                  Limpiar historial
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
