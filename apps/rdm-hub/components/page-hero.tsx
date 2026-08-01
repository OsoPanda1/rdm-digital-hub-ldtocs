import type { ReactNode } from "react";
import { SmartImage } from "@/components/smart-image";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageCategory?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, image, imageCategory, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#2a2d35]">
      <div className="absolute inset-0">
        <SmartImage src={image} category={imageCategory} alt="" className="h-full w-full" overlay />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/70 to-[#0a0b0e]/30" aria-hidden />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl space-y-4 animate-fade-up">
          {eyebrow && (
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-[#d4b26a]">
              <span className="h-px w-8 bg-[#c8a356]" aria-hidden />
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg text-[#d4d0c8]/90 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
