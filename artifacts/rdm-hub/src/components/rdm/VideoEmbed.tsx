// src/components/rdm/VideoEmbed.tsx
// RDM Digital Hub — YouTube Video Embed Component
// Two slots per page: hero (top) and mid-section.
// Props: youtubeId, title, className

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface VideoEmbedProps {
  /** YouTube video ID (the part after v= oryoutu.be/) */
  youtubeId: string;
  /** Video title for accessibility */
  title?: string;
  /** Variant: "hero" (full-width top) or "mid" (mid-section with context) */
  variant?: "hero" | "mid";
  /** Optional caption below the video */
  caption?: string;
  /** Custom className */
  className?: string;
}

const EMBED_BASE = "https://www.youtube-nocookie.com/embed";
const THUMBNAIL_BASE = "https://img.youtube.com/vi";

export function VideoEmbed({
  youtubeId,
  title = "Video de Real del Monte",
  variant = "mid",
  caption,
  className = "",
}: VideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = `${THUMBNAIL_BASE}/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `${EMBED_BASE}/${youtubeId}?rel=0&modestbranding=1&color=white`;

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {loaded ? (
            <iframe
              src={embedUrl}
              title={title}
              className="absolute inset-0 w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 w-full h-full group cursor-pointer"
              aria-label={`Reproducir: ${title}`}
            >
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play size={32} className="text-black ml-1" fill="black" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                <span className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  ▶ {title}
                </span>
              </div>
            </button>
          )}
        </div>
        {caption && (
          <p className="text-center text-muted-foreground text-sm mt-3 italic">
            {caption}
          </p>
        )}
      </motion.div>
    );
  }

  // Mid-section variant: smaller, with border
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={`relative w-full max-w-3xl mx-auto my-8 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Play size={16} className="text-[hsl(45,80%,55%)]" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
        </div>
      )}
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10" style={{ paddingBottom: "56.25%" }}>
        {loaded ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Reproducir: ${title}`}
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                <Play size={28} className="text-black ml-1" fill="black" />
              </div>
            </div>
          </button>
        )}
      </div>
      {caption && (
        <p className="text-center text-muted-foreground text-xs mt-2 italic">
          {caption}
        </p>
      )}
    </motion.div>
  );
}

export default VideoEmbed;
