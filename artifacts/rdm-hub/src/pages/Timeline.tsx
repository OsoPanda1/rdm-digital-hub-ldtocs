/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";

const Timeline = () => {
  const events = [
    { year: "2019â€“2020", title: "ConceptualizaciÃ³n", desc: "Primeras ideas y autoestudio intensivo. Nace la visiÃ³n de un ecosistema digital soberano." },
    { year: "2021", title: "DiseÃ±o arquitectÃ³nico", desc: "Se define la estructura modular de dominios y guardianÃ­as. Se crea el CÃ³dice Maestro v0.1." },
    { year: "2022", title: "Primeros prototipos", desc: "ImplementaciÃ³n de demos funcionales: UTAMV, interfaces XR iniciales y mÃ³dulos de identidad." },
    { year: "2023", title: "Isabella AI & Seguridad", desc: "IntegraciÃ³n de la IA contextual Isabella y los mÃ³dulos de seguridad ANUBIS y HORUS." },
    { year: "2024", title: "MDâ€‘X4 & FederaciÃ³n", desc: "Lanzamiento del framework MDâ€‘X4. ConsolidaciÃ³n de 177 repositorios en el Digital Nexus." },
    { year: "2025", title: "ExpansiÃ³n CITEMESH", desc: "Apertura de nodos federados, economÃ­a TAMV y guardianÃ­a TENOCHTITLAN." },
    { year: "2026+", title: "SoberanÃ­a plena", desc: "Infraestructura pÃºblica, gobernanza ciudadana y escalamiento latinoamericano." },
  ];

  return (
    <WikiPage title="LÃ­nea de Tiempo" subtitle="La evoluciÃ³n del ecosistema TAMV desde su origen">
      <Section title="Hitos principales">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-primary/20" />
          <div className="space-y-6">
            {events.map((e, i) => (
              <div key={e.year} className="flex gap-5 items-start">
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${
                    i % 2 === 0 ? "border-primary/50 bg-primary/10 text-primary" : "border-secondary/50 bg-secondary/10 text-secondary"
                  }`}>
                    {e.year.slice(0, 4)}
                  </div>
                </div>
                <div className="pt-1.5">
                  <div className="text-xs text-muted-foreground mb-0.5">{e.year}</div>
                  <h3 className="font-semibold text-foreground">{e.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </WikiPage>
  );
};

export default Timeline;
