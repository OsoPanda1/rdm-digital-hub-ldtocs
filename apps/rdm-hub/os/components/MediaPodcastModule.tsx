'use client';
import React, { useState } from 'react';
import { PODCAST_EPISODES, MEDIA_GALLERY } from '../data/modulesData';
import { Play, Pause, Radio, Image as ImageIcon, Video, Volume2, Heart, Share2, Sparkles, Headphones, Music } from 'lucide-react';

export const MediaPodcastModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'podcast' | 'galeria'>('podcast');
  const [playingEpisodeId, setPlayingEpisodeId] = useState<string | null>(PODCAST_EPISODES[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');

  const currentEpisode = PODCAST_EPISODES.find(e => e.id === playingEpisodeId) || PODCAST_EPISODES[0];

  const galleryFilters = ['Todos', 'Fotos', 'Videos', 'Paisajes', 'Patrimonio', 'Gastronomía'];

  const filteredMedia = MEDIA_GALLERY.filter(item => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Fotos') return item.type === 'foto';
    if (selectedFilter === 'Videos') return item.type === 'video';
    return item.category === selectedFilter;
  });

  const togglePlay = (id: string) => {
    if (playingEpisodeId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayingEpisodeId(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-rose-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            Tercer Plano — Medios, Podcasts, Música & Galería RDM
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Radio Cívica, Historias de Minas & Galería Audiovisual
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sumérgete en la sonoridad y las imágenes de Real del Monte: episodios narrados sobre fantasmas del Panteón Inglés, la huelga minera de 1766, la música de bandas tradicionales y videos 4K de la neblina.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('podcast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'podcast'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Podcasts & Música ({PODCAST_EPISODES.length})
          </button>
          <button
            onClick={() => setActiveTab('galeria')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'galeria'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Galería de Fotos & Videos ({MEDIA_GALLERY.length})
          </button>
        </div>
      </div>

      {activeTab === 'podcast' ? (
        <div className="space-y-6">
          {/* Active Player Card */}
          <div className="bg-slate-900 rounded-3xl border border-rose-500/40 p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 relative shadow-xl">
              <img src={currentEpisode.coverUrl} alt={currentEpisode.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Music className="w-10 h-10 text-white/80 animate-pulse" />
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                  {currentEpisode.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">Duración: {currentEpisode.duration}</span>
              </div>

              <h3 className="text-xl font-bold text-white font-serif">{currentEpisode.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                {currentEpisode.description}
              </p>

              {/* Player Progress Bar Mock */}
              <div className="space-y-1.5 pt-2">
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full bg-rose-500 ${isPlaying ? 'w-1/3 animate-pulse' : 'w-0'} transition-all duration-500`} />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{isPlaying ? '08:42' : '00:00'}</span>
                  <span>{currentEpisode.duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                <button
                  onClick={() => togglePlay(currentEpisode.id)}
                  className="px-6 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isPlaying ? 'Pausar Reproducción' : 'Reproducir Ahora'}
                </button>

                <div className="flex items-center gap-2 text-slate-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-mono text-slate-300">Narrador: {currentEpisode.host}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Episode List Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-serif uppercase tracking-wider">
              Episodios Recomendados de Real del Monte
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PODCAST_EPISODES.map(ep => {
                const isSelected = playingEpisodeId === ep.id;

                return (
                  <div
                    key={ep.id}
                    className={`bg-slate-900 rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/20 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={ep.coverUrl} alt={ep.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="text-[10px] text-rose-400 font-mono font-bold block">{ep.category}</span>
                        <h5 className="text-xs font-bold text-white font-serif">{ep.title}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">{ep.duration} • {ep.host}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePlay(ep.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected && isPlaying
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Gallery Tab */
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {galleryFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedFilter === filter
                    ? 'bg-rose-500 text-white font-extrabold shadow'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map(item => (
              <div
                key={item.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-rose-500/40 transition-all group"
              >
                <div className="relative h-52 overflow-hidden bg-slate-950">
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                    {item.type === 'video' ? <Video className="w-3.5 h-3.5 text-rose-400" /> : <ImageIcon className="w-3.5 h-3.5 text-amber-400" />}
                    {item.type === 'video' ? 'Video HD' : 'Fotografía'}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">
                    Autor: {item.author}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-rose-400 font-mono font-bold block">{item.category}</span>
                  <h4 className="text-sm font-bold text-white font-serif">{item.title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> {item.likes} Me gusta
                    </span>
                    <button className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" /> Compartir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
