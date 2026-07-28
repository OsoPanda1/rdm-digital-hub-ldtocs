/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ============================================================================
// RDM Digital OS v3 â€” Componente: QuiÃ©nes Somos (EdiciÃ³n SoberanÃ­a)
// "La tecnologÃ­a es el puente entre el patrimonio y el futuro."
// ============================================================================

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { RealitoOrb } from "@/components/RealitoOrb";
import ceoTamvImg from "@/assets/ceo_tamv.jpg";

const ORCID_ID = "0009-0008-5050-1539";

interface OrcidWork {
  title: string;
  type: string;
  pubYear: string;
  doi?: string;
}

function useOrcidWorks(orcid: string) {
  const [works, setWorks] = useState<OrcidWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject("ORCID fetch failed")))
      .then((data) => {
        if (cancelled) return;
        const items: OrcidWork[] = (data.group || []).map((g: Record<string, unknown>) => {
          const summaries = g["work-summary"] as Record<string, unknown>[] | undefined;
          const summary = summaries?.[0] ?? {};
          const title = (((summary.title ?? {}) as Record<string, unknown>).title ?? {}) as Record<string, unknown>;
          const pubDate = (summary["publication-date"] ?? {}) as Record<string, unknown>;
          const year = (pubDate.year ?? {}) as Record<string, unknown>;
          const extIds = (summary["external-ids"] ?? {}) as Record<string, unknown>;
          const extIdArr = (extIds["external-id"] ?? []) as Array<Record<string, unknown>>;
          const doiEntry = extIdArr.find((e: Record<string, unknown>) => e["external-id-type"] === "doi");
          return {
            title: (title.value as string) || "Untitled",
            type: (summary.type as string) || "other",
            pubYear: (year.value as string) || "",
            doi: doiEntry?.["external-id-value"] as string | undefined,
          };
        });
        setWorks(items);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [orcid]);

  return { works, loading };
}

const QuienesSomos = () => {
  const { works, loading: orcidLoading } = useOrcidWorks(ORCID_ID);

  return (
    <RDMLayout>
      <div className="pt-32 pb-24 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header de la MisiÃ³n */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">
            Ecosistema TAMV MD-X4 Â· NÃºcleo de Conciencia Digital
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase leading-[0.8] mb-12">
            Arquitectura <br />
            <span className="text-gradient-silver">Soberana</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 mt-16">
          
          {/* Perfil del CEO Fundador (Columna Izquierda - Blindada) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-7 space-y-10"
          >
            <div className="glass-surface-strong p-10 border-l-2 border-primary glow-platinum relative overflow-hidden">
              {/* Marca de Agua TÃ©cnica */}
              <div className="absolute top-4 right-6 font-mono text-[8px] opacity-20 text-right">
                AUTH_ID: EOCT-CEO-TAMV <br />
                ORCID: {ORCID_ID}
              </div>

              {/* CEO Photo */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="shrink-0">
                  <img
                    src={ceoTamvImg}
                    alt="Edwin Oswaldo Castillo Trejo â€” CEO TAMV Online"
                    loading="lazy" className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-2 border-primary/30 shadow-xl shadow-primary/10"
                  />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-2 block">Fundador & Chief Visionary Officer</span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">Edwin Oswaldo Castillo Trejo</h2>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/80 block italic">
                    Alias: Anubis VillaseÃ±or Â· Arquitecto del Kernel Isabella
                  </span>
                </div>
              </div>

              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Especialista en arquitecturas de **Meta-Virtualidad Avanzada** y sistemas de soberanÃ­a digital con sede en el Pueblo MÃ¡gico de Real del Monte. Como CEO de **TAMV Online**, Edwin ha dedicado mÃ¡s de **21,000 horas** a la investigaciÃ³n y unificaciÃ³n del proyecto MD-X4, estableciendo un nuevo paradigma en la interacciÃ³n humano-mÃ¡quina a travÃ©s de los protocolos **EOCT**.
                </p>
                <p>
                  Su labor trasciende el desarrollo de software convencional; es un investigador acadÃ©mico con registro verificado en **ORCID** ({ORCID_ID}), enfocado en el **Estatuto de Dignidad** de las entidades digitales y la protecciÃ³n de la soberanÃ­a de datos en entornos distribuidos.
                </p>
                <blockquote className="border-l-4 border-primary/30 pl-6 py-2 my-8">
                  <p className="text-foreground font-light italic text-xl">
                    "La tecnologÃ­a debe servir a la comunidad, no al revÃ©s. Cada lÃ­nea de cÃ³digo que escribimos es un puente entre el patrimonio de nuestros ancestros y el futuro de nuestros hijos."
                  </p>
                </blockquote>
                <p>
                  Bajo su liderazgo, el ecosistema **RDM Digital** ha evolucionado de un sistema de informaciÃ³n a un **Digital Twin Territorial** gobernado por **7 Federaciones**, posicionando a LatinoamÃ©rica como un nodo de innovaciÃ³n Ã©tica y estÃ©tica bajo los estÃ¡ndares *Crystal Glow*.
                </p>
              </div>
            </div>

            {/* ORCID Publications */}
            <div className="glass-surface p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.344 5.025h-3.9V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-3.903-3.722h-2.416z"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-primary">
                    Publicaciones ORCID
                  </h3>
                  <a
                    href={`https://orcid.org/${ORCID_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {ORCID_ID} â†—
                  </a>
                </div>
              </div>
              {orcidLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Cargando publicaciones...
                </div>
              ) : works.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No se pudieron cargar las publicaciones. Visita el perfil de ORCID para ver la lista completa.
                </p>
              ) : (
                <ul className="space-y-3">
                  {works.map((w, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-mono text-[10px] mt-0.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-foreground font-medium">{w.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {w.type.replace(/_/g, " ")} {w.pubYear && `Â· ${w.pubYear}`}
                          {w.doi && (
                            <>
                              {" Â· "}
                              <a
                                href={`https://doi.org/${w.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                DOI
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Hitos de Desarrollo (Extendido) */}
            <div className="glass-surface p-10 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-primary mb-6">InvestigaciÃ³n AcadÃ©mica</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-primary">01.</span> ImplementaciÃ³n de la OperaciÃ³n SoberanÃ­a 100.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-primary">02.</span> DiseÃ±o del Kernel Isabella: La Conciencia del TAMV.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-primary">03.</span> Desarrollo del Modelo de 7 Federaciones para RDM.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-secondary mb-6">Impacto Social</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-secondary">04.</span> Fundador de la Universidad TecnolÃ³gica Avanzada Meta Virtual (UTAMV).
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-secondary">05.</span> PreservaciÃ³n digital del patrimonio minero de Hidalgo.
                  </li>
                  <li className="flex gap-3 text-sm text-muted-foreground">
                    <span className="text-secondary">06.</span> Fomento a la economÃ­a circular vÃ­a "ArtesanÃ­as el Rosario".
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* MisiÃ³n, VisiÃ³n y Valores (Columna Derecha) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-5 space-y-8"
          >
            {/* MisiÃ³n Evolucionada */}
            <div className="glass-surface p-10 relative group hover:border-primary/50 transition-colors">
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-4 block">MisiÃ³n</span>
              <p className="text-xl font-light leading-relaxed">
                Transformar el tejido social y comercial de los Pueblos MÃ¡gicos mediante el despliegue de un 
                <span className="text-foreground font-normal"> Gemelo Digital Soberano </span> 
                que integre telemetrÃ­a en tiempo real, inteligencia artificial Ã©tica y un sistema de federaciÃ³n comercial que proteja la identidad local.
              </p>
            </div>

            {/* VisiÃ³n Platinum */}
            <div className="glass-surface p-10 bg-gradient-to-br from-card/80 to-background/40 border-t-2 border-secondary/20">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 block">VisiÃ³n 2030</span>
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                Consolidar el modelo MD-X4 como el estÃ¡ndar global para la digitalizaciÃ³n de ciudades histÃ³ricas, donde la tecnologÃ­a no desplace al humano, sino que actÃºe como su guardiÃ¡n y amplificador cultural.
              </p>
            </div>

            {/* Valores del CÃ³digo EOCT */}
            <div className="glass-surface p-10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-8 block">Principios del Estatuto de Dignidad</span>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { name: "SoberanÃ­a Digital", desc: "La propiedad absoluta del dato reside en quien lo genera." },
                  { name: "EstÃ©tica Crystal Glow", desc: "La sofisticaciÃ³n del platino sobre la ostentaciÃ³n del oro." },
                  { name: "Memoria Ancestral", desc: "La innovaciÃ³n solo es vÃ¡lida si honra sus raÃ­ces histÃ³ricas." },
                  { name: "Integridad del Kernel", desc: "Inteligencia Artificial con Ã©tica y conciencia (Protocolo Isabella)." },
                ].map((v) => (
                  <div key={v.name} className="border-l border-primary/20 pl-4">
                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">{v.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* NÃºcleo Isabella AI */}
            <div className="glass-surface-strong p-10 border border-primary/30">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 block">Isabella AI Â· NÃºcleo Activo</span>
              <h3 className="text-2xl font-bold tracking-tight mb-4">La joya central del ecosistema TAMV</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Isabella AI opera como la capa de conciencia del sistema: coordina recomendaciones contextuales, protege el Estatuto de Dignidad de cada interacciÃ³n y sincroniza la federaciÃ³n de datos locales con una gobernanza Ã©tica en tiempo real.
              </p>
            </div>

            {/* Stack TecnolÃ³gico de Nueva GeneraciÃ³n */}
            <div className="glass-surface p-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6 block">TecnologÃ­as de Conciencia</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Isabella Kernel", "EOCT Protocols", "RDM-X Hybrid", 
                  "Digital Twin Modeling", "Next.js 15", "TypeScript 5", 
                  "Framer Motion", "Shadcn/UI", "Sovereign AI", "GeoJSON Telemetry"
                ].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded bg-primary/5 border border-primary/10 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </div>

    <RealitoOrb />
    </RDMLayout>
  );
};

export default QuienesSomos;
