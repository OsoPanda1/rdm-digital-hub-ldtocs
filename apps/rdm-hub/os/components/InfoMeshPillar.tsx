'use client';
import React, { useState } from 'react';
import { NEWS_ARTICLES, HISTORICAL_DOCUMENTS } from '../data/realDelMonteData';
import { VISITOR_FLOW_DATA } from '../data/chartData';
import { NewsArticle, HistoricalDocument } from '../types';
import { Newspaper, FileText, CloudFog, Send, CheckCircle2, Tag, Volume2, Search, X, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const InfoMeshPillar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<HistoricalDocument | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState('Noticia Comunitaria');
  const [reportText, setReportText] = useState('');
  const [reporterName, setReporterName] = useState('');

  const categories = ['Todas', 'Alerta Clima/Neblina', 'Crónica Histórica', 'Noticia Comunitaria', 'Aviso Municipal'];

  const filteredArticles = selectedCategory === 'Todas'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter(a => a.category === selectedCategory);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportText) return;

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setReportTitle('');
      setReportText('');
      setReporterName('');
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 p-6 sm:p-8 border border-amber-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-3.5 h-3.5" />
            Pilar 2.1 — RDM Información (InfoMesh)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Canal Oficial & Periódico Digital Soberano de Real del Monte
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Difusión veraz, crónicas de historia viva, archivo documental digitalizado e información en tiempo real para habitantes, productores y visitantes de la comarca minera.
          </p>
        </div>
      </div>

      {/* Filter Chips & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Enviar Crónica o Aviso Comunitario
        </button>
      </div>

      {/* Reader Engagement & Mountain Fog Days Analytics Chart */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif">
              Lectura de Crónicas Históricas & Registro de Días de Neblina
            </h3>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
            Estación RDM Edge
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Interacción comunitaria con las notas históricas (amarillo) comparado con los días de presencia de neblina densa en el monte (azul).
        </p>

        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VISITOR_FLOW_DATA}>
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="ciudadanos" name="Lectores Activos" stroke="#facc15" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="neblinaDias" name="Días de Neblina" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/50 transition-all shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  article.category === 'Alerta Clima/Neblina'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : article.category === 'Crónica Histórica'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {article.category}
                </span>
                <span>{article.date}</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-serif leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium text-slate-300">Por: {article.author}</span>
              <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                Leer artículo completo →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Archive Section */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              Archivo Documental & Registro Histórico Digitalizado
            </h3>
            <p className="text-xs text-slate-400">
              Manuscritos, bitácoras y decretos originales conservados en el kernel de RDM InfoMesh
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HISTORICAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-40 relative overflow-hidden bg-slate-950">
                <img
                  src={doc.imageUrl}
                  alt={doc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 font-mono text-[10px] px-2 py-1 rounded border border-amber-500/30">
                  {doc.era}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 block">Ref: {doc.archivalRef}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors font-serif leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] text-amber-400 font-semibold flex items-center justify-between">
                  <span>Inspeccionar Archivo</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-slate-400">• {selectedArticle.date}</span>
              </div>

              <h2 className="text-2xl font-bold text-white font-serif leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>Autor: <strong className="text-slate-200">{selectedArticle.author}</strong></span>
                <span>Validado por: <strong className="text-emerald-400">{selectedArticle.verifiedBy}</strong></span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed space-y-4">
              <p className="text-base font-medium text-amber-200/90 italic bg-amber-500/10 p-4 rounded-xl border-l-4 border-amber-500">
                "{selectedArticle.summary}"
              </p>
              <p>{selectedArticle.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {selectedArticle.tags.map(tag => (
                <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-400" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historical Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="bg-amber-500/20 text-amber-300 font-mono text-xs px-2.5 py-1 rounded border border-amber-500/30">
                Ref. Archivo: {selectedDoc.archivalRef}
              </span>
              <h2 className="text-2xl font-bold text-white font-serif leading-snug">
                {selectedDoc.title}
              </h2>
            </div>

            <div className="rounded-2xl overflow-hidden h-56 bg-slate-950 border border-slate-800">
              <img src={selectedDoc.imageUrl} alt={selectedDoc.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Contexto Histórico</span>
                <p className="leading-relaxed">{selectedDoc.historicalContext}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Ubicación del Manuscrito Físico</span>
                <p className="text-slate-200 font-medium">{selectedDoc.archiveLocation}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Report Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Enviar Crónica o Noticia Comunitario
              </h3>
              <p className="text-xs text-slate-400">
                Tu reporte será verificado por el comité cívico del kernel RDM InfoMesh antes de su publicación.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white font-serif">¡Reporte Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-200">
                  Gracias por colaborar en la infraestructura informativa soberana de Real del Monte.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Título de la Noticia / Crónica</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Ej. Restauración de la fuente de la Plaza Juárez..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Categoría</label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Noticia Comunitaria">Noticia Comunitaria</option>
                      <option value="Crónica Histórica">Crónica Histórica</option>
                      <option value="Aviso Municipal">Aviso Municipal</option>
                      <option value="Alerta Clima/Neblina">Alerta Clima/Neblina</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Tu Nombre o Seudónimo</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Ej. Vecino del Barrio de Acosta"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Contenido de la Noticia</label>
                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Escribe los detalles o reseña de lo sucedido..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                  >
                    Enviar a Verificación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
