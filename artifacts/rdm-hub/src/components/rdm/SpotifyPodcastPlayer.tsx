// ────────────────────────────────────────────────────────────────
// SpotifyPodcastPlayer — Spotify Embed Player
// Replaces the AzuraCast RadioPlayer with Spotify podcast embeds.
// ────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, ChevronDown, ChevronUp, ExternalLink, Pause, Play } from "lucide-react";

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  spotifyUri: string;
  embedUrl: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

interface SpotifyPodcastPlayerProps {
  podcast: PodcastEpisode;
  compact?: boolean;
  className?: string;
}

export function SpotifyPodcastPlayer({ podcast, compact = false, className = "" }: SpotifyPodcastPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (compact) {
    return (
      <div className={`rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 p-3">
          <button
            onClick={handleTogglePlay}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{podcast.title}</p>
            <p className="text-[10px] text-muted-foreground truncate">{podcast.description}</p>
          </div>
          <button
            onClick={handleToggleExpand}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3">
                <iframe
                  src={podcast.embedUrl}
                  width="100%"
                  height={compact ? 152 : 352}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                  title={podcast.title}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-600/10 flex items-center justify-center">
            <Headphones className="w-7 h-7 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground">{podcast.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{podcast.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/10 text-green-600">
                Spotify Podcast
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                {podcast.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <iframe
          src={podcast.embedUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          title={podcast.title}
        />
      </div>

      <div className="px-6 pb-6 flex items-center gap-3">
        <a
          href={`https://open.spotify.com/show/${podcast.spotifyUri.split(":").pop()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir en Spotify
        </a>
        <div className="flex flex-wrap gap-1.5">
          {podcast.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
