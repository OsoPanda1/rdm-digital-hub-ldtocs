import Link from "next/link";
import { Clock, MapPin, Phone, Route as RouteIcon, Mountain, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryMeta } from "@/lib/images";
import { SmartImage } from "@/components/smart-image";
import type { Place } from "@/hooks/use-places";
import type { Business } from "@/hooks/use-negocios";
import type { Event } from "@/hooks/use-eventos";
import type { Route as RouteT } from "@/hooks/use-rutas";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function CategoryBadge({ cat, className }: { cat?: string; className?: string }) {
  const meta = categoryMeta(cat);
  return (
    <span className={cn("text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium", meta.badge, className)}>
      {meta.label}
    </span>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 hover:shadow-[0_0_30px_-8px_rgba(200,163,86,0.25)] transition-all duration-300">
      <SmartImage src={place.image_url} category={place.cat} alt={place.name} className="h-44" overlay />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge cat={place.cat} />
          <span className="text-[#6b7280] text-xs">{place.lat?.toFixed(3)}, {place.lng?.toFixed(3)}</span>
        </div>
        <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{place.name}</h3>
        <p className="text-sm text-[#9ca3af] line-clamp-2">{place.description}</p>
        <div className="flex items-center gap-1.5 text-xs text-[#6b7280] pt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{place.address}</span>
        </div>
      </div>
    </article>
  );
}

export function BusinessCard({ biz }: { biz: Business }) {
  return (
    <article className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 hover:shadow-[0_0_30px_-8px_rgba(200,163,86,0.25)] transition-all duration-300">
      <SmartImage src={biz.image_url} category={biz.cat} alt={biz.name} className="h-40" overlay />
      <div className="p-5 space-y-3">
        <CategoryBadge cat={biz.cat} />
        <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{biz.name}</h3>
        <p className="text-sm text-[#9ca3af] line-clamp-2">{biz.description}</p>
        <div className="flex flex-col gap-1.5 text-xs text-[#6b7280] pt-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{biz.address}</span>
          </div>
          {biz.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{biz.phone}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function EventDate({ date }: { date: string }) {
  const d = new Date(date);
  const day = format(d, "dd");
  const month = format(d, "MMM", { locale: es }).toUpperCase();
  return (
    <div className="absolute top-3 left-3 flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-[#0a0b0e]/85 backdrop-blur border border-[#c8a356]/40">
      <span className="text-lg font-bold text-[#d4b26a] leading-none">{day}</span>
      <span className="text-[10px] tracking-wider text-[#9ca3af]">{month}</span>
    </div>
  );
}

export function EventCard({ ev, showStatus = true }: { ev: Event; showStatus?: boolean }) {
  const past = new Date(ev.date) < new Date();
  return (
    <article className={cn(
      "group relative border rounded-2xl overflow-hidden bg-[#121418] transition-all duration-300",
      past ? "border-[#2a2d35] opacity-75 hover:opacity-100" : "border-[#c8a356]/40 hover:border-[#c8a356] hover:shadow-[0_0_30px_-8px_rgba(200,163,86,0.3)]"
    )}>
      <SmartImage src={ev.image_url} category={ev.category} alt={ev.title} className="h-40" overlay />
      <EventDate date={ev.date} />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge cat={ev.category} />
          {showStatus && (past ? (
            <span className="text-[11px] text-[#6b7280]">Finalizado</span>
          ) : (
            <span className="text-[11px] text-emerald-400">Próximo</span>
          ))}
        </div>
        <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{ev.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{ev.location}</span>
        </div>
        <p className="text-sm text-[#9ca3af] line-clamp-2">{ev.description}</p>
      </div>
    </article>
  );
}

export function RouteCard({ ruta }: { ruta: RouteT }) {
  return (
    <article className="group border border-[#2a2d35] rounded-2xl overflow-hidden bg-[#121418] hover:border-[#c8a356]/60 hover:shadow-[0_0_30px_-8px_rgba(200,163,86,0.25)] transition-all duration-300">
      <SmartImage src={ruta.image_url} category={ruta.category} alt={ruta.name} className="h-40" overlay />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge cat={ruta.category} />
          <span className="text-xs text-[#6b7280]">{ruta.distance} km</span>
        </div>
        <h3 className="font-serif text-lg font-bold group-hover:text-[#d4b26a] transition-colors">{ruta.name}</h3>
        <p className="text-sm text-[#9ca3af] line-clamp-2">{ruta.description}</p>
        <div className="flex items-center gap-4 text-xs text-[#6b7280] pt-1">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {ruta.duration}</span>
          <span className="inline-flex items-center gap-1.5"><Mountain className="h-3.5 w-3.5" /> {ruta.category}</span>
        </div>
      </div>
    </article>
  );
}

export function LinkArrow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#d4b26a] hover:text-[#e8c478] transition-colors"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

export { RouteIcon };
