import { useState, useEffect } from "react";
import { Play, Volume2, Loader } from "lucide-react";
import { HeritageSpeechPlayer } from "./HeritageSpeechPlayer";

interface HeritageNarration {
  slug: string;
  siteName: string;
  narrationText: string;
  audioVersions: Record<string, string>;
  language: string;
  playCount: number;
  isActive: boolean;
}

interface AudioGalleryProps {
  images?: Array<{ url: string; alt: string; slug: string }>;
  language?: string;
}

/**
 * AudioGallery - Display heritage sites with narrations and images
 * Integrates your provided heritage photos with generated audio narrations
 */
export function AudioGallery({
  images = [],
  language = "es",
}: AudioGalleryProps) {
  const [narrations, setNarrations] = useState<HeritageNarration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNarration, setSelectedNarration] =
    useState<HeritageNarration | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default heritage sites with images
  const defaultHeritageSites = [
    {
      slug: "real-del-monte",
      siteName: "Real del Monte - Historic Mining Town",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto6.jpg-UU90e8FXsFPR2bjTdhi8YqG2nh3xJJ.webp",
      description:
        "Real del Monte is a historic mining town in Hidalgo, Mexico, founded in the 18th century. Known for its colonial architecture, colorful buildings, and rich cultural heritage.",
    },
    {
      slug: "bosque-oyamel",
      siteName: "El Bosque de Oyamel - Sacred Forest",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto8-2EhbhygxcPt66OcY9uJGhNPhvByOGy.jpg",
      description:
        "El Bosque de Oyamel is an enchanting forest sanctuary featuring majestic fir trees and serving as a critical habitat for monarch butterflies during migration.",
    },
    {
      slug: "museo-mina",
      siteName: "Museo Mina la Dificultad",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto4-iDIRynKcoLIFNUFLIvrwV0l9ORmZAp.jpg",
      description:
        "The Mining Museum exhibits the heritage of silver mining in the region through preserved equipment and historical artifacts spanning centuries.",
    },
    {
      slug: "mina-de-plata",
      siteName: "Historic Silver Mine - La Dificultad",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto3-yjvRzlTgDZ.jpg",
      description:
        "An iconic landmark featuring the historic industrial architecture of silver mining operations, symbolizing the region's economic heritage.",
    },
    {
      slug: "roca-sagrada",
      siteName: "Rock Formation - Sacred Landmark",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto5.jpg-sL2Zk8MCFeMBJKYJXkR3KXcYVyrbIO.png",
      description:
        "An impressive natural rock formation that holds cultural significance and geological interest for visitors exploring the region.",
    },
    {
      slug: "cementerio-historico",
      siteName: "Historic Cemetery - Cultural Heritage",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto7-fmRCKzEukbAQIIbIfWT7UTfRFQCb6y.jpg",
      description:
        "The historic cemetery preserves the memory of generations with beautifully carved headstones reflecting local artistic traditions.",
    },
  ];

  useEffect(() => {
    fetchNarrations();
  }, [language]);

  const fetchNarrations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/dg/audio/narrations?language=${language}&limit=100`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch narrations");
      }

      const result = await response.json();
      setNarrations(result.data || []);
    } catch (err) {
      console.error("[AudioGallery] Error fetching narrations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load narrations"
      );
      // Show defaults even if API fails
      setNarrations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Merge API narrations with default sites
  const combinedSites = defaultHeritageSites.map((site) => {
    const apiNarration = narrations.find((n) => n.slug === site.slug);
    const audioUrl = apiNarration?.audioVersions?.es_normal;

    return {
      ...site,
      audioUrl: audioUrl || undefined,
      playCount: apiNarration?.playCount || 0,
      narrationText: apiNarration?.narrationText || site.description,
    };
  });

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Heritage Audio Gallery</h1>
          <p className="text-amber-100 mt-2">
            Explore the cultural treasures of Real del Monte with guided audio narrations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && !narrations.length && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-900 text-sm">
            <p className="font-medium">Note:</p>
            <p>
              {error} - Displaying local heritage sites. API narrations will load once connected.
            </p>
          </div>
        )}

        {/* Player View */}
        {selectedNarration && (
          <div className="mb-8">
            <button
              onClick={() => setSelectedNarration(null)}
              className="mb-4 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Back to gallery
            </button>

            <HeritageSpeechPlayer
              audioUrl={selectedNarration.audioVersions?.es_normal || ""}
              narrationText={selectedNarration.narrationText}
              siteName={selectedNarration.siteName}
              imageUrl={combinedSites.find((s) => s.slug === selectedNarration.slug)?.image}
              language={selectedNarration.language}
            />
          </div>
        )}

        {/* Gallery Grid */}
        {!selectedNarration && (
          <>
            {isLoading && !narrations.length ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combinedSites.map((site) => (
                  <div
                    key={site.slug}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-shadow cursor-pointer group"
                    onClick={() => {
                      const narration = narrations.find(
                        (n) => n.slug === site.slug
                      ) || {
                        slug: site.slug,
                        siteName: site.siteName,
                        narrationText: site.narrationText,
                        audioVersions: site.audioUrl ? { es_normal: site.audioUrl } : {},
                        language: "es",
                        playCount: site.playCount,
                        isActive: true,
                      };
                      setSelectedNarration(narration);
                    }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      {site.image ? (
                        <img
                          src={site.image}
                          alt={site.siteName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                          <span className="text-slate-600">No image</span>
                        </div>
                      )}

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full">
                          <Play className="w-6 h-6 text-amber-600 fill-amber-600" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-2">
                        {site.siteName}
                      </h3>

                      <p className="text-xs md:text-sm text-slate-600 mt-2 line-clamp-3">
                        {site.narrationText}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Volume2 className="w-3 h-3" />
                          {site.audioUrl ? "Audio Available" : "Coming Soon"}
                        </div>
                        {site.playCount > 0 && (
                          <div className="text-xs text-slate-500">
                            {site.playCount} plays
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && narrations.length === 0 && defaultHeritageSites.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">
                  No heritage narrations available yet. Check back soon!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-100 border-t border-slate-200 mt-8 py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {combinedSites.length}
            </div>
            <div className="text-sm text-slate-600">Heritage Sites</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {narrations.length > 0 ? narrations.length : defaultHeritageSites.length}
            </div>
            <div className="text-sm text-slate-600">Narrations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {combinedSites.reduce((sum, site) => sum + (site.playCount || 0), 0)}
            </div>
            <div className="text-sm text-slate-600">Total Plays</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioGallery;
