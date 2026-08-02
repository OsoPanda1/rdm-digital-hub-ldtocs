'use client';
import React, { useState } from 'react';
import { FORUM_THREADS, FORUM_POSTS } from '../data/modulesData';
import { ForumThread, ForumPost } from '../types';
import { MessageSquare, ThumbsUp, CheckCircle2, MessageCircle, Plus, Send, User, Tag, Sparkles } from 'lucide-react';

export const ForumModule: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>(FORUM_THREADS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeThread, setActiveThread] = useState<ForumThread | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newPostText, setNewPostText] = useState<string>('');

  // New Thread Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<ForumThread['category']>('Propuestas Urbanas');
  const [newContent, setNewContent] = useState<string>('');

  const categories = ['Todas', 'Propuestas Urbanas', 'Patrimonio & Conservación', 'Turismo Responsable', 'Historias & Mitos'];

  const filteredThreads = threads.filter(t => {
    return selectedCategory === 'Todas' || t.category === selectedCategory;
  });

  const handleUpvoteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: ForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      author: 'Vecino_Ciudadano',
      authorRole: 'Ciudadano',
      createdAt: 'Justo ahora',
      upvotes: 1,
      repliesCount: 0,
      solved: false,
      content: newContent,
      tags: ['Comunidad', 'RDM']
    };

    setThreads([created, ...threads]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            Foro Cívico RDM & Co-creación Territorial
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Asamblea Digital & Diálogo Abierto de Real del Monte
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Espacio moderado de conversación cívica, conservación del patrimonio histórico, propuestas urbanas e iniciativas comunitarias respaldadas en la red TAMV.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white font-extrabold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Crear Nueva Publicación
        </button>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.map(thread => (
          <div
            key={thread.id}
            onClick={() => setActiveThread(thread)}
            className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-purple-500/40 transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-purple-500/20 text-purple-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30">
                  {thread.category}
                </span>
                {thread.solved && (
                  <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Propuesta Aprobada
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Por <span className="text-amber-300 font-bold">{thread.author}</span> ({thread.authorRole}) • {thread.createdAt}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-serif group-hover:text-purple-300 transition-colors">
                {thread.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {thread.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2">
                {thread.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleUpvoteThread(thread.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold font-mono transition-all border border-slate-800 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {thread.upvotes}
                </button>

                <span className="flex items-center gap-1 text-slate-400 font-mono">
                  <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
                  {thread.repliesCount} respuestas
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Thread Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setActiveThread(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-4">
              <span className="bg-purple-500/20 text-purple-300 font-mono text-xs px-2.5 py-0.5 rounded-full border border-purple-500/30">
                {activeThread.category}
              </span>
              <h3 className="text-xl font-bold text-white font-serif">{activeThread.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{activeThread.content}</p>
            </div>

            {/* Replies List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Respuestas Cívicas
              </h4>

              {FORUM_POSTS.filter(p => p.threadId === activeThread.id).map(post => (
                <div key={post.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-amber-300">{post.author} ({post.authorRole})</span>
                    <span>{post.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-200">{post.content}</p>
                </div>
              ))}
            </div>

            {/* Response Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Escribe tu respuesta a la asamblea cívica..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-400"
                />
                <button className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                  Responder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white font-serif">Nueva Publicación Cívica</h3>

            <form onSubmit={handleCreateThread} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Título del Tema</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Propuesta de señalética victoriana..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value="Propuestas Urbanas">Propuestas Urbanas</option>
                  <option value="Patrimonio & Conservación">Patrimonio & Conservación</option>
                  <option value="Turismo Responsable">Turismo Responsable</option>
                  <option value="Historias & Mitos">Historias & Mitos</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Contenido</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe la propuesta o tema de discusión..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                Publicar en Foro Cívico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
