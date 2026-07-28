/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";
import { FileText, BookOpen, Layers, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
  { icon: FileText, title: "ArtÃ­culo general", desc: "DefiniciÃ³n, contexto, componentes, casos de uso y relaciÃ³n con otros mÃ³dulos." },
  { icon: Layers, title: "MÃ³dulo del ecosistema", desc: "Tipo, propÃ³sito, funciones clave, entradas/salidas, integraciones y estado actual." },
  { icon: ClipboardList, title: "EspecificaciÃ³n tÃ©cnica", desc: "Arquitectura, modelos de datos, flujos, APIs, seguridad y testing." },
  { icon: BookOpen, title: "GuÃ­a / Tutorial", desc: "Objetivo, requisitos, pasos detallados, ejemplos y errores comunes." },
];

const Documentacion = () => (
  <WikiPage
    title="DocumentaciÃ³n TÃ©cnica"
        subtitle="Plantillas, estructura y polÃ­ticas de la wiki TAMV"
      >
        {/* Hero Banner */}
        <div className="relative h-48 w-full overflow-hidden">
          <img src="/images/museo-mina.jpg" alt="Museo de la Mina de Real del Monte" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <Section title="Plantillas de ediciÃ³n">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div key={t.title} className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <t.icon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">{t.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Estructura de la wiki">
      <div className="rounded-lg border border-border/50 bg-muted/20 p-4 font-mono text-sm text-muted-foreground space-y-1">
        <div><span className="text-primary">00</span> IntroducciÃ³n</div>
        <div><span className="text-primary">01</span> FilosofÃ­a y CÃ³dice</div>
        <div><span className="text-primary">02</span> Arquitectura TAMV MDâ€‘X4</div>
        <div><span className="text-primary">03</span> Dominios</div>
        <div className="pl-6">03.01 Nexus Â· 03.02 UTAMV Â· 03.03 Metaverso Â· 03.04 EconomÃ­a Â· 03.05 Seguridad</div>
        <div><span className="text-primary">04</span> IA y Agentes</div>
        <div><span className="text-primary">05</span> DocumentaciÃ³n TÃ©cnica</div>
        <div><span className="text-primary">06</span> GuÃ­as de Uso</div>
        <div><span className="text-primary">07</span> Historia y LÃ­nea de Tiempo</div>
        <div><span className="text-primary">08</span> Gobernanza y PolÃ­ticas</div>
        <div><span className="text-primary">09</span> Changelog / Versiones</div>
      </div>
    </Section>

    <Section title="PolÃ­ticas de contribuciÃ³n">
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex gap-2"><span className="text-primary">â€¢</span> Claridad, respeto, enfoque civilizatorio.</li>
        <li className="flex gap-2"><span className="text-primary">â€¢</span> No duplicar contenido: enlazar antes de copiar.</li>
        <li className="flex gap-2"><span className="text-primary">â€¢</span> Usar siempre las plantillas definidas.</li>
        <li className="flex gap-2"><span className="text-primary">â€¢</span> Revisiones periÃ³dicas cada 3â€“6 meses.</li>
        <li className="flex gap-2"><span className="text-primary">â€¢</span> Marcar contenido obsoleto, no borrarlo.</li>
      </ul>
    </Section>
  </WikiPage>
);

export default Documentacion;
