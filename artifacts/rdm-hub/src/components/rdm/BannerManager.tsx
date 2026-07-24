// src/components/rdm/BannerManager.tsx
// RDM Digital Hub — Route-aware banner placement system
// Automatically renders contextual banners based on current route.
// 80 banners distributed across all pages and sections.

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getBannersForRoute, type BannerDefinition } from "./banners-data";

const DISMISS_KEY = "rdm_banners_dismissed";
const ROTATION_INTERVAL = 30 * 60 * 1000; // 30 minutes

function getDismissedSet(): Set<number> {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function addDismissed(id: number) {
  const dismissed = getDismissedSet();
  dismissed.add(id);
  localStorage.setItem(DISMISS_KEY, JSON.stringify([...dismissed]));
}

interface BannerCardProps {
  banner: BannerDefinition;
  onDismiss: (id: number) => void;
}

function BannerCard({ banner, onDismiss }: BannerCardProps) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    if (banner.routes.length > 0) {
      navigate(banner.routes[0]);
    }
  }, [banner.routes, navigate]);

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleClick(); }}
      role="button"
      tabIndex={0}
      className={`relative group cursor-pointer overflow-hidden rounded-xl ${banner.gradient} text-white p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 ${banner.featured ? "md:col-span-2" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(banner.id); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Cerrar banner"
      >
        ×
      </button>

      <div className="relative z-10 flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{banner.icon}</span>
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight">{banner.title}</div>
          <div className="text-xs text-white/70 mt-0.5 line-clamp-2">{banner.subtitle}</div>
          {banner.featured && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium uppercase tracking-wider">
              Destacado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function BannerManager() {
  const location = useLocation();
  const [banners, setBanners] = useState<BannerDefinition[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(getDismissedSet);
  const [rotationKey, setRotationKey] = useState(0);

  // Refetch banners on route change
  useEffect(() => {
    const current = getBannersForRoute(location.pathname, 4);
    setBanners(current);
    setDismissed(getDismissedSet());
  }, [location.pathname]);

  // Rotation timer — reshuffle banners every 30 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setRotationKey((k) => k + 1);
      const current = getBannersForRoute(location.pathname, 4);
      setBanners(current);
    }, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [location.pathname]);

  const handleDismiss = useCallback((id: number) => {
    addDismissed(id);
    setDismissed((prev) => new Set(prev).add(id));
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Don't render on admin pages, auth pages, or not-found
  const HIDDEN_PREFIXES = ["/admin", "/auth", "/login", "/register"];
  if (HIDDEN_PREFIXES.some((p) => location.pathname.startsWith(p)) || location.pathname === "/not-found") {
    return null;
  }

  const visibleBanners = banners.filter((b) => !dismissed.has(b.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className="w-full px-4 py-3" data-banner-manager>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" key={rotationKey}>
          {visibleBanners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} onDismiss={handleDismiss} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BannerManager;
