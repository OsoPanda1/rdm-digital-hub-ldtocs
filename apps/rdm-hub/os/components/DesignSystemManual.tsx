'use client';
import React, { useState } from 'react';
import { MANUAL_CHAPTERS, ManualChapter } from '../data/manualData';
import { VISITOR_FLOW_DATA, ROUTE_ELEVATION_DATA, HOURLY_HEATMAP_DATA, HERITAGE_DISTRIBUTION_DATA } from '../data/chartData';
import {
  BookOpen,
  Palette,
  Type,
  Layout,
  MousePointer,
  Layers,
  Sparkles,
  Search,
  Check,
  Copy,
  Sliders,
  Code,
  BarChart2,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Volume2,
  HelpCircle,
  Eye,
  Terminal,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const DesignSystemManual: React.FC = () => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('cap-01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [liveTestText, setLiveTestText] = useState<string>('Real del Monte — Pueblo Mágico');
  const [isMotionActive, setIsMotionActive] = useState<boolean>(false);

  const categories = ['Todos', 'Fundamentos', 'Sistema de Diseño', 'Componentes UI', 'Patrones de Eje', 'Visualización de Datos', 'Motion & Accesibilidad', 'Especificaciones Técnicas'];

  const filteredChapters = MANUAL_CHAPTERS.filter(ch => {
    const matchesCategory = selectedCategory === 'Todos' || ch.category === selectedCategory;
    const matchesSearch = ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ch.guidelines.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeChapter = MANUAL_CHAPTERS.find(ch => ch.id === selectedChapterId) || MANUAL_CHAPTERS[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-900">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl overflow-hidden text-slate-100">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Manual & Guía de Sistema de Diseño RDM Digital (25 Capítulos)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Especificación Estética & Sistema de Visualización Territorial
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Normativa de diseño, paletas de color minero-neblina, tipografías, componentes interactivos, visualizaciones de datos y tokens de Tailwind CSS para la plataforma soberana de Real del Monte.
          </p>
        </div>
      </div>

      {/* Filter & Chapter Search Bar */}
      <div className="bg-pearl-card p-4 rounded-3xl border border-slate-200 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por capítulo o concepto..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chapter Workspace (Split 4 cols index / 8 cols chapter detail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chapter Index List (4 cols) */}
        <div className="lg:col-span-4 bg-pearl-card rounded-3xl border border-slate-200 p-4 space-y-3 max-h-[720px] overflow-y-auto scrollbar-thin shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 px-2 pb-2 border-b border-slate-200">
            <span>Índice de Capítulos ({filteredChapters.length})</span>
            <span className="font-mono text-[10px] text-slate-500">v2.4 Spec</span>
          </div>

          <div className="space-y-1.5">
            {filteredChapters.map((ch) => {
              const isSelected = selectedChapterId === ch.id;

              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col space-y-1 ${
                    isSelected
                      ? 'bg-slate-950 text-white border-amber-400 shadow-lg'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-600 font-black">Cap. {ch.chapterNum.toString().padStart(2, '0')}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ch.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold font-serif leading-snug line-clamp-1">{ch.title.split(': ')[1] || ch.title}</h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chapter Detail & Live Playground (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-pearl-card rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xl">
            {/* Header Title */}
            <div className="space-y-2 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-amber-100 text-amber-900 font-mono font-bold px-3 py-1 rounded-full border border-amber-300">
                  Capítulo {activeChapter.chapterNum.toString().padStart(2, '0')} de 25
                </span>
                <span className="text-slate-500 text-xs font-mono">{activeChapter.category}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-950 font-serif">{activeChapter.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{activeChapter.summary}</p>
            </div>

            {/* Guidelines List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lineamientos & Reglas Técnicas de Implementación
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                {activeChapter.guidelines.map((g, i) => (
                  <li key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Live Component Playground / Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sky-600" />
                Demostración Interactiva en Vivo
              </h4>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden">
                {/* Visual rendering based on previewType */}
                {activeChapter.previewType === 'color' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                      <div className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700 mb-2" />
                      <span className="font-bold block">Navy / Slate 950</span>
                      <span className="text-[10px] text-slate-500">#020617</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-amber-800 shadow-sm">
                      <div className="w-full h-12 rounded-xl bg-amber-400 mb-2" />
                      <span className="font-bold block">Oro Minero</span>
                      <span className="text-[10px] text-slate-500">#FACC15</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-emerald-800 shadow-sm">
                      <div className="w-full h-12 rounded-xl bg-emerald-600 mb-2" />
                      <span className="font-bold block">Verde Patrimonio</span>
                      <span className="text-[10px] text-slate-500">#059669</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-sky-800 shadow-sm">
                      <div className="w-full h-12 rounded-xl bg-sky-500 mb-2" />
                      <span className="font-bold block">Azul Neblina</span>
                      <span className="text-[10px] text-slate-500">#0EA5E9</span>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'typography' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={liveTestText}
                        onChange={(e) => setLiveTestText(e.target.value)}
                        placeholder="Prueba texto personalizado..."
                        className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <h1 className="text-3xl font-serif font-bold text-slate-950">{liveTestText}</h1>
                      <h2 className="text-xl font-serif font-semibold text-amber-800">{liveTestText} — H2 Subtítulo</h2>
                      <p className="text-xs font-sans text-slate-600 leading-relaxed max-w-xl">
                        Cuerpo de texto en Plus Jakarta Sans optimizado para la lectura móvil de crónicas mineras y guías gastronómicas del paste.
                      </p>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'button' && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer">
                      ✨ Botón Primario Gold
                    </button>
                    <button className="px-5 py-2.5 rounded-xl btn-crystal text-slate-900 font-extrabold text-xs shadow-md transition-all cursor-pointer border-slate-300 hover:border-amber-500">
                      🔮 Crystal Clear Iridiscente
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer">
                      ⚙️ Outline Navy
                    </button>
                  </div>
                )}

                {activeChapter.previewType === 'input' && (
                  <div className="max-w-md space-y-3">
                    <label className="text-xs font-bold text-slate-900 block">Consulta de Prueba</label>
                    <input
                      type="text"
                      placeholder="Escribe tu consulta a ISABELLA AI..."
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-300 font-bold">
                        ✨ ¿Cuál es la historia del Paste?
                      </span>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-sm">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                        Mina & Patrimonio
                      </span>
                      <h4 className="text-sm font-bold text-slate-950 font-serif">Mina de Acosta</h4>
                      <p className="text-xs text-slate-600">Tiro de mina de 400 metros de profundidad.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-emerald-300 p-4 space-y-2 shadow-sm">
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        Verificado RDM
                      </span>
                      <h4 className="text-sm font-bold text-slate-950 font-serif">Pastes El Portal</h4>
                      <p className="text-xs text-slate-600">Receta original de 1928 con chile serrano.</p>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'badge' && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 whitespace-nowrap">
                      ✓ Paste Auténtico
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 whitespace-nowrap">
                      ★ 4.9 Excelente
                    </span>
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-300 whitespace-nowrap">
                      ☁️ 11°C Neblina
                    </span>
                  </div>
                )}

                {activeChapter.previewType === 'chart' && (
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-950 font-serif">Afluencia Turística Mensual (Recharts)</h5>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={VISITOR_FLOW_DATA}>
                          <defs>
                            <linearGradient id="colorTuristas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }} />
                          <Area type="monotone" dataKey="turistas" stroke="#d97706" fillOpacity={1} fill="url(#colorTuristas)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'motion' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setIsMotionActive(!isMotionActive)}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Probar Animación Ease-Out (200ms)
                    </button>
                    <div className={`p-4 rounded-2xl bg-white border border-slate-300 transition-all duration-300 ease-out ${
                      isMotionActive ? 'scale-105 border-amber-500 shadow-xl' : ''
                    }`}>
                      <p className="text-xs text-slate-800">
                        {isMotionActive ? '✨ Micro-interacción activada (200ms ease-out)' : 'Estado reposo por defecto'}
                      </p>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'token' && (
                  <div className="space-y-2 font-mono text-xs text-slate-900">
                    <p className="text-slate-500">// Configuration Token JSON</p>
                    <pre className="p-3 bg-white rounded-xl text-slate-800 border border-slate-200 text-[11px] overflow-x-auto">
                      {JSON.stringify({
                        theme: "RDM Digital Blanco Perlado",
                        baseBg: "#f6f8fb",
                        goldAccent: "#D97706",
                        navyHeader: "#020617"
                      }, null, 2)}
                    </pre>
                  </div>
                )}

                {activeChapter.previewType === 'modal' && (
                  <div className="p-4 rounded-2xl bg-white border border-emerald-400 text-xs space-y-2 shadow-sm">
                    <span className="text-emerald-800 font-bold font-mono">Recibo Cattleya Pay Simulado</span>
                    <div className="flex justify-between text-slate-700">
                      <span>Hash de Soberanía:</span>
                      <span className="font-mono text-amber-800 font-bold">#0x8f2a9c1</span>
                    </div>
                  </div>
                )}

                {activeChapter.previewType === 'layout' && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                    <div className="h-6 rounded bg-slate-950 flex items-center justify-between px-3 text-[10px] text-amber-300 font-bold">
                      <span>Header Ticker RDM</span>
                      <span>Nodo Cero Activo</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 h-20">
                      <div className="bg-slate-50 rounded border border-slate-200 p-2 text-[10px] text-amber-800 font-bold">InfoMesh</div>
                      <div className="bg-slate-50 rounded border border-slate-200 p-2 text-[10px] text-emerald-800 font-bold">GeoExplorer</div>
                      <div className="bg-slate-50 rounded border border-slate-200 p-2 text-[10px] text-sky-800 font-bold">TradeNode</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tailwind Tokens & CSS Output Code Block */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  Tokens de Tailwind & Snippet React
                </h4>
                <button
                  onClick={() => handleCopyCode(activeChapter.codeSnippet)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-slate-900"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? '¡Copiado!' : 'Copiar Snippet'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pb-2">
                {activeChapter.tailwindTokens.map(token => (
                  <span key={token} className="bg-slate-100 text-slate-800 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200 font-bold">
                    {token}
                  </span>
                ))}
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{activeChapter.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

