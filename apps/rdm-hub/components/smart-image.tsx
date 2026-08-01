"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { categoryMeta } from "@/lib/images";

interface SmartImageProps {
  src?: string | null;
  alt?: string;
  category?: string;
  className?: string;
  overlay?: boolean;
}

export function SmartImage({ src, alt = "", category, className, overlay = false }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const meta = categoryMeta(category);

  if (!src || failed) {
    return (
      <div
        aria-label={alt}
        className={cn(
          "relative flex items-center justify-center bg-gradient-to-br overflow-hidden",
          meta.gradient,
          className
        )}
      >
        <span className="text-4xl sm:text-5xl drop-shadow-lg" aria-hidden>
          {meta.emoji}
        </span>
        <div className="absolute inset-0 bg-[#0a0b0e]/25" aria-hidden />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-[#121418]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/45 to-transparent" aria-hidden />
      )}
    </div>
  );
}
