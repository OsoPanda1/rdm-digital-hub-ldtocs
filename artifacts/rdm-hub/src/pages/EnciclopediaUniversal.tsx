/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { BookOpen, Search, Brain, Globe } from "lucide-react";

const fuentes = [
  { name: "GitHub", desc: "100M+ repositorios de cÃ³digo abierto", icon: "ðŸ™" },
  { name: "Sourcegraph", desc: "BÃºsqueda semÃ¡ntica de cÃ³digo universal", icon: "ðŸ”" },
  { name: "Wikipedia", desc: "Conocimiento enciclopÃ©dico verificado", icon: "ðŸ“š" },
  { name: "NeoWiki", desc: "Wiki descentralizada y soberana", icon: "ðŸŒ" },
  { name: "Kiro", desc: "Asistente de desarrollo con IA", icon: "ðŸ¤–" },
  { name: "Kilo", desc: "Editor de texto minimalista integrado", icon: "ðŸ“" },
];

const EnciclopediaUniversal = () => (
  <WikiPage
    title="Enciclopedia Universal"
    subtitle="Base de Conocimiento Integrada â€” 6 Fuentes, Grafo CuÃ¡ntico, SÃ­ntesis IA"
  >
    <InfoBox type="info" title="Conocimiento Unificado">
      La Enciclopedia Universal integra mÃºltiples fuentes de conocimiento en un grafo cuÃ¡ntico que 
      permite bÃºsquedas semÃ¡nticas, sÃ­ntesis inteligente y rutas de aprendizaje personalizadas.
    </InfoBox>

    <Section title="Fuentes de Conocimiento" icon={BookOpen}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fuentes.map((f) => (
          <div key={f.name} className="rounded-lg border border-border/50 bg-card/30 p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{f.icon}</span>
              <span className="font-semibold text-foreground">{f.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Motor de SÃ­ntesis" icon={Brain}>
      <div className="rounded-lg border border-border/50 bg-card/30 p-4 font-mono text-xs space-y-2">
        <div className="text-muted-foreground"># UniversalEncyclopedia Pipeline</div>
        <div>1. <span className="text-primary">search_universal</span>(query)</div>
        <div className="pl-4">â†’ BÃºsqueda paralela en 6 fuentes</div>
        <div>2. <span className="text-primary">knowledge_graph</span>.synthesize(results)</div>
        <div className="pl-4">â†’ Grafo cuÃ¡ntico de relaciones semÃ¡nticas</div>
        <div>3. <span className="text-primary">rank_and_explain</span>(synthesized)</div>
        <div className="pl-4">â†’ Resultados rankeados con explicaciones XAI</div>
      </div>
    </Section>

    <Section title="Puentes de Conocimiento" icon={Globe}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "IA conectora de conceptos interdisciplinarios",
          "VisualizaciÃ³n relacional con mapas de conocimiento",
          "Rutas personalizadas de aprendizaje adaptativo",
          "ColaboraciÃ³n global con expertos conectados",
          "InnovaciÃ³n emergente por conexiones inesperadas",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
            <span className="text-primary">â—†</span>
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default EnciclopediaUniversal;
