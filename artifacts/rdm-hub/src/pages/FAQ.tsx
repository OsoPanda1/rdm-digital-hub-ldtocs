/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Search, MessageCircle } from "lucide-react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta } from "@/components/SEOMeta";

type FaqItemData = { q: string; a: string };
type FaqGroup = { group: string; key: string; items: FaqItemData[] };

const FAQ_GROUPS: FaqGroup[] = [
  {
    group: "Turismo y experiencia",
    key: "turismo",
    items: [
      { q: "Â¿QuÃ© es Real del Monte?", a: "Real del Monte (Mineral del Monte) es un Pueblo MÃ¡gico de Hidalgo, MÃ©xico, cÃ©lebre por su herencia minera, la influencia inglesa de Cornualles, los pastes, el PanteÃ³n InglÃ©s y su clima de montaÃ±a a 2,700 m de altitud." },
      { q: "Â¿CÃ³mo uso el mapa interactivo?", a: "En la pÃ¡gina de inicio, secciÃ³n Mapa, puedes ver sitios, museos, ecoturismo y comercios. Usa el botÃ³n â€œCentrar en mÃ­â€ para activar tu geolocalizaciÃ³n y filtra por categorÃ­a y tipo de lugar." },
      { q: "Â¿QuÃ© son las rutas turÃ­sticas?", a: "Son recorridos temÃ¡ticos (patrimonio, gastronomÃ­a, miradores, nocturna, romÃ¡ntica, platera y mÃ¡s) que conectan historias, lugares y comercios locales en una sola experiencia guiada." },
    ],
  },
  {
    group: "Historia, mitos y cultura",
    key: "historia",
    items: [
      { q: "Â¿Por quÃ© hay influencia inglesa en Real del Monte?", a: "En el siglo XIX, mineros de Cornualles (Inglaterra) llegaron para trabajar las minas. Dejaron el fÃºtbol, el paste y el PanteÃ³n InglÃ©s, Ãºnicos en MÃ©xico por orientar las tumbas hacia su tierra natal." },
      { q: "Â¿CuÃ¡les son las leyendas mÃ¡s conocidas?", a: "Destacan las PeÃ±as Cargadas, los relatos de tÃºneles encantados de las minas y apariciones del PanteÃ³n InglÃ©s. EncuÃ©ntralas en la secciÃ³n Mitos y Leyendas del Plano I." },
      { q: "Â¿QuÃ© es el paste?", a: "Es una empanada horneada heredada del Cornish pasty inglÃ©s, hoy sÃ­mbolo gastronÃ³mico del pueblo, con rellenos tradicionales (papa con carne) y dulces." },
    ],
  },
  {
    group: "Cuenta, perfil y comunidad",
    key: "comunidad",
    items: [
      { q: "Â¿Necesito registrarme?", a: "Puedes explorar gran parte del contenido sin cuenta. Para participar en la comunidad, gestionar tu perfil, activar membresÃ­as o usar la Mina necesitas iniciar sesiÃ³n." },
      { q: "Â¿CÃ³mo edito mi perfil?", a: "Entra a Mi Perfil desde el menÃº o el botÃ³n Cuenta. AhÃ­ puedes actualizar tu nombre para mostrar y tu avatar, y revisar tu membresÃ­a y progreso minero." },
      { q: "Â¿Mis datos estÃ¡n protegidos?", a: "SÃ­. La plataforma usa autenticaciÃ³n segura y polÃ­ticas de acceso por fila (RLS): cada usuario solo puede ver y editar su propia informaciÃ³n." },
    ],
  },
  {
    group: "MembresÃ­as y gamificaciÃ³n",
    key: "membresias",
    items: [
      { q: "Â¿QuÃ© incluye la membresÃ­a Minero RDM?", a: "Por $129 MXN al mes obtienes acceso completo a la Mina, donde acumulas minerales y puntos que puedes canjear por productos reales: pastes, refrescos, joyerÃ­a de plata, hospedaje, cenas y paseos." },
      { q: "Â¿CÃ³mo funciona la Mina?", a: "Cada extracciÃ³n consume energÃ­a (que se regenera con el tiempo) y otorga minerales con distinta probabilidad. Los minerales se convierten en puntos canjeables en el catÃ¡logo de recompensas." },
      { q: "Â¿CÃ³mo canjeo mis puntos?", a: "Desde la secciÃ³n de recompensas de la Mina selecciona el producto disponible; si tienes puntos suficientes y hay stock, se genera tu canje." },
    ],
  },
  {
    group: "Comercios y pagos",
    key: "pagos",
    items: [
      { q: "Tengo un negocio, Â¿cÃ³mo aparezco en el catÃ¡logo?", a: "Usa Registrar Comercio para dar de alta tu negocio, elegir categorÃ­a y completar el pago de activaciÃ³n. Tras la confirmaciÃ³n, un administrador aprueba y se publica tu ficha en el catÃ¡logo." },
      { q: "Â¿CÃ³mo se manejan los pagos?", a: "Los pagos se procesan de forma segura mediante nuestra pasarela en lÃ­nea. Al confirmarse el pago, la publicaciÃ³n de tu comercio queda lista para aprobaciÃ³n y activaciÃ³n." },
      { q: "Â¿QuÃ© son las donaciones?", a: "Las donaciones apoyan la digitalizaciÃ³n del pueblo y la visibilidad de los negocios locales. Puedes contribuir desde la secciÃ³n Apoya RDM." },
    ],
  },
];

const CATEGORIES = [
  { key: null, label: "Todas" },
  ...FAQ_GROUPS.map((g) => ({ key: g.key, label: g.group })),
];

function FaqItem({ q, a }: FaqItemData) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-surface-strong overflow-hidden transition-shadow hover:shadow-[0_8px_30px_-12px_hsla(195,100%,60%,0.35)]">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-body text-sm text-white/95 md:text-base">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-cyan-200 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_GROUPS.filter((g) => !activeCat || g.key === activeCat)
      .map((g) => ({
        ...g,
        items: q ? g.items.filter((it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)) : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }, [query, activeCat]);

  const totalResults = results.reduce((acc, g) => acc + g.items.length, 0);

  const askRealito = () => {
    window.dispatchEvent(new CustomEvent("rdm:realito-open", { detail: { question: query } }));
  };

  return (
    <RDMLayout>
      <SEOMeta title="Preguntas Frecuentes Â· RDM Digital" description="Centro de ayuda con artÃ­culos por categorÃ­a sobre turismo, historia, comunidad, membresÃ­as y pagos en Real del Monte, con buscador inteligente." />
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/landscape-fog.jpg" alt="Paisaje de Real del Monte" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <section className="pb-20 pt-8">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
              <HelpCircle className="h-3.5 w-3.5" /> Plano II Â· Centro de Ayuda
            </span>
            <h1 className="mb-3 text-4xl font-bold uppercase leading-[0.9] tracking-tighter md:text-5xl">
              Preguntas <span className="text-gradient-cyan">Frecuentes</span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              ArtÃ­culos por categorÃ­a sobre turismo, historia, comunidad, membresÃ­as y pagos. Busca por tema o pregÃºntale directamente a Realito.
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por tema: pastes, membresÃ­a, mapa, leyendasâ€¦"
              className="w-full rounded-xl border border-border bg-muted/40 py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>

          {/* Category chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key ?? "all"}
                onClick={() => setActiveCat(c.key)}
                className={`rounded-full px-3.5 py-1.5 font-body text-xs tracking-wide transition-all ${
                  activeCat === c.key ? "bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/35" : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {totalResults === 0 ? (
            <div className="glass-surface-strong p-8 text-center">
              <p className="mb-4 text-sm text-muted-foreground">No encontramos artÃ­culos para â€œ{query}â€.</p>
              <button onClick={askRealito} className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/20">
                <MessageCircle className="h-4 w-4" /> PregÃºntale a Realito AI
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((g, gi) => (
                <motion.div key={g.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.05 }}>
                  <h2 className="mb-3 font-body text-xs uppercase tracking-[0.24em] text-cyan-100/60">{g.group}</h2>
                  <div className="space-y-3">
                    {g.items.map((it) => (
                      <FaqItem key={it.q} q={it.q} a={it.a} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Realito CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 glass-surface-strong flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="font-body text-base text-white/95">Â¿No encuentras tu respuesta?</h3>
              <p className="text-sm text-muted-foreground">Realito AI conoce el catÃ¡logo, rutas y la historia del pueblo.</p>
            </div>
            <button onClick={askRealito} className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/20">
              <MessageCircle className="h-4 w-4" /> Hablar con Realito
            </button>
          </motion.div>
        </div>
      </section>
    </RDMLayout>
  );
}
