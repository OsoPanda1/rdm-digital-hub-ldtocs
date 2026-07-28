/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Search, BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Article = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  updatedAt: string;
};

const CATEGORIES = ["Historia", "Cultura", "Geografía", "Personajes", "Tradiciones"] as const;

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Historia de las Minas de Real del Monte",
    category: "Historia",
    excerpt: "Las minas de Real del Monte fueron descubiertas en 1552 por Bartolomé de Medina, marcando el inicio de una era de riqueza minera que transformó la región de Hidalgo y estableció a Real del Monte como uno de los centros mineros más importantes de la Nueva España.",
    updatedAt: "2026-07-15",
  },
  {
    id: "2",
    title: "La Pasteada: Tradición Centenaria",
    category: "Tradiciones",
    excerpt: "Cada año, durante la primera quincena de octubre, Real del Monte se viste de gala para celebrar el Paste, un evento cultural y gastronómico que honra la tradición pasteca heredada de los mineros británicos que llegaron al pueblo en el siglo XIX.",
    updatedAt: "2026-07-10",
  },
  {
    id: "3",
    title: "El Panteón Inglés",
    category: "Historia",
    excerpt: "Ubicado en las faldas del cerro de San Regis, el Panteón Inglés es un testimonio de la comunidad británica que habité Real del Monte. Sus tumbas victorianas y epitafios en inglés cuentan la historia de mineros, ingenieros y sus familias.",
    updatedAt: "2026-06-28",
  },
  {
    id: "4",
    title: "Festival del Paste",
    category: "Fiestas",
    excerpt: "El Festival del Paste reúne a miles de visitantes en un festín de sabores, música y tradición. Con más de 30 puestos de paste tradicionales, conciertos en vivo y actividades culturales, es el evento más importante del calendario turístico local.",
    updatedAt: "2026-07-05",
  },
  {
    id: "5",
    title: "El Malacate Minero",
    category: "Historia",
    excerpt: "El Malacate es una máquina elevadora de origen británico que se utilizó para extraer mineral de las profundidades de las minas. El ejemplar mejor conservado se encuentra en la Mina El Encino, hoy museo viviente de la ingeniería minera del siglo XIX.",
    updatedAt: "2026-06-20",
  },
  {
    id: "6",
    title: "Callejón del Beso - Leyenda y Realidad",
    category: "Leyendas",
    excerpt: "La famosa leyenda del Callejón del Beso relata la historia de dos amantes separados por la rivalidad de sus familias. Los balcones tan cercanos que podían besarse se encuentran en la calle Real, y la historia sigue cautivando a visitantes de todo México.",
    updatedAt: "2026-07-12",
  },
  {
    id: "7",
    title: "La Sierra de Pachuca",
    category: "Geografía",
    excerpt: "La Sierra de Pachuca, parte de la Sierra Madre Oriental, enmarca Real del Monte con sus bosques de oyamel y pino. A más de 2,700 metros sobre el nivel del mar, este ecosistema alberga una biodiversidad única y paisajes de ensueño que inspiraron a generaciones de artistas.",
    updatedAt: "2026-06-18",
  },
  {
    id: "8",
    title: "Museo Francisco Rule",
    category: "Cultura",
    excerpt: "Ubicado en una antigua casona minera del siglo XIX, el Museo Francisco Rule alberga una colección de más de 300 piezas arqueológicas de las culturas tequitl, tolteca y azteca, junto con fotografías históricas de la época minera de Real del Monte.",
    updatedAt: "2026-07-01",
  },
  {
    id: "9",
    title: "Real del Monte Pueblo Mágico",
    category: "Cultura",
    excerpt: "Declarado Pueblo Mágico en 2001, Real del Monte combina su riqueza minera histórica con tradiciones vivas como las pasteadas, la arquitectura colonial inglesa y un entorno natural privilegiado que lo convierten en un destino turístico único en México.",
    updatedAt: "2026-07-08",
  },
  {
    id: "10",
    title: "La Tradición Minera Anglo-Mexicana",
    category: "Historia",
    excerpt: "En 1824, el gobierno mexicano invitó a mineros británicos a revivir las abandonadas minas de Real del Monte. Estos ingenieros trajeron tecnología de vanguardia, el pasty británico y costumbres que fusionaron con la cultura local, creando una identidad única.",
    updatedAt: "2026-06-25",
  },
  {
    id: "11",
    title: "Gastronomía de la Sierra",
    category: "Gastronomía",
    excerpt: "La cocina de la Sierra de Pachuca mezcla sabores prehispánicos con influencias europeas. Desde los paste tradicionales hasta los tacos de mano de plátano, pasando por el pulque curado y los dulces de cajeta, cada platillo cuenta una historia de fusión cultural.",
    updatedAt: "2026-07-14",
  },
  {
    id: "12",
    title: "Artesanías y Cultura Popular",
    category: "Cultura",
    excerpt: "Los artesanos de Real del Monte preservan tradiciones como la elaboración de paste artesanal, la cerámica vidriada de Pachuca y las bordadas de punto de cruz que decoran los trajes típicos. Cada pieza lleva consigo siglos de conocimiento transmitido de generación en generación.",
    updatedAt: "2026-06-30",
  },
];

const PAGE_SIZE = 6;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

function categoryColor(c: string) {
  const map: Record<string, string> = {
    Historia: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    Cultura: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
    Geografía: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    Personajes: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    Tradiciones: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
    Leyendas: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400",
    Gastronomía: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    Fiestas: "bg-pink-500/15 text-pink-700 dark:text-pink-400",
  };
  return map[c] ?? "bg-muted text-muted-foreground";
}

export default function EnciclopediaUniversal() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return ARTICLES.filter((a) => {
      const matchesCategory = !activeCategory || a.category === activeCategory;
      const matchesQuery =
        !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [debouncedQuery, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, activeCategory]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveCategory(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Enciclopedia Universal</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Base de conocimiento integrada de Real del Monte — historia, cultura, tradiciones y más.
          </p>

          {/* Search */}
          <div className="relative mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artículos..."
              className="w-full rounded-lg border border-border/50 bg-card/50 pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            {(query || activeCategory) && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-48 shrink-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Categorías
            </h3>
            <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                  !activeCategory
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Todas ({ARTICLES.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = ARTICLES.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                      activeCategory === cat
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {filtered.length} artículo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
              {(debouncedQuery || activeCategory) && (
                <button
                  onClick={clearSearch}
                  className="text-xs text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-border/40 bg-card/30 p-5 space-y-3">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">Sin resultados</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No se encontraron artículos que coincidan con tu búsqueda. Intenta con otros términos.
                </p>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Grid */}
            {!isLoading && filtered.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map((article) => (
                    <article
                      key={article.id}
                      className="group rounded-xl border border-border/40 bg-card/30 p-5 hover:border-primary/30 hover:bg-card/60 transition-all cursor-pointer"
                    >
                      <Badge className={`mb-3 ${categoryColor(article.category)} border-0`} variant="outline">
                        {article.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground/70">
                          {formatDate(article.updatedAt)}
                        </span>
                        <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                          Leer más →
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                          page === i + 1
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
