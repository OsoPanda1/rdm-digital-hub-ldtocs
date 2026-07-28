/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { Brain, Shield, Eye, Heart, Cpu } from "lucide-react";

const IsabellaAI = () => (
  <WikiPage
    title="Isabella VillaseÃ±or AI"
    subtitle="LibrerÃ­a Universal de IA Ã‰tica â€” Explicable, Supervisada, Continua"
  >
    <InfoBox type="success" title="IA al Servicio de la Dignidad">
      Isabella es el sistema de IA Ã©tica de TAMV con explicabilidad total (XAI), supervisiÃ³n humana 
      obligatoria y aprendizaje continuo basado en feedback Ã©tico. Nunca actÃºa sin oversight humano.
    </InfoBox>

    <Section title="Arquitectura Isabella" icon={Brain}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Brain, title: "Motor Ã‰tico", desc: "EthicalReasoningEngine â€” anÃ¡lisis Ã©tico del contexto antes de cualquier acciÃ³n" },
          { icon: Eye, title: "XAI Explicable", desc: "Explicaciones en 3 niveles: usuario, auditor, regulador" },
          { icon: Shield, title: "SupervisiÃ³n Humana", desc: "HumanSupervisionLayer â€” nunca actÃºa sin aprobaciÃ³n en decisiones crÃ­ticas" },
          { icon: Cpu, title: "Aprendizaje Continuo", desc: "ContinuousLearningSystem â€” mejora basada en feedback Ã©tico verificado" },
        ].map((comp) => (
          <div key={comp.title} className="rounded-lg border border-border/50 bg-card/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <comp.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{comp.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{comp.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Pipeline de DecisiÃ³n Ã‰tica" icon={Heart}>
      <div className="rounded-lg border border-border/50 bg-card/30 p-4 font-mono text-xs space-y-2">
        <div className="text-muted-foreground"># Isabella Decision Pipeline</div>
        <div>1. <span className="text-primary">ethical_core</span>.analyze(context)</div>
        <div className="pl-4">â†’ EvaluaciÃ³n Ã©tica del contexto</div>
        <div>2. <span className="text-primary">generate_recommendation</span>(ethical_assessment)</div>
        <div>3. <span className="text-primary">xai_explainer</span>.explain(recommendation)</div>
        <div className="pl-4">â†’ ExplicaciÃ³n en 3 niveles (usuario, auditor, regulador)</div>
        <div>4. <span className="text-yellow-500">if</span> requires_human_review:</div>
        <div className="pl-4"><span className="text-primary">human_oversight</span>.request_review()</div>
        <div>5. <span className="text-primary">return</span> {"{"} recommendation, explanation, confidence, ethical_score {"}"}</div>
      </div>
    </Section>

    <Section title="Capacidades Principales">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          "AnÃ¡lisis Ã©tico contextual",
          "Recomendaciones con puntuaciÃ³n Ã©tica",
          "Explicaciones transparentes XAI",
          "TutorÃ­a educativa adaptativa (UTAMV)",
          "ModeraciÃ³n de contenido Ã©tica",
          "RecomendaciÃ³n de regalos CGIFTS",
          "DetecciÃ³n de fraude econÃ³mico",
          "Asistencia en gobernanza participativa",
          "AnÃ¡lisis de tendencias de noticias",
        ].map((cap) => (
          <div key={cap} className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            <span className="text-sm text-muted-foreground">{cap}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="MÃ©tricas Isabella">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Solicitudes/dÃ­a", value: "10M" },
          { label: "Modo Ã‰tico", value: "Strict" },
          { label: "Niveles XAI", value: "3" },
          { label: "Oversight Humano", value: "100%" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border/50 bg-card/30 p-4 text-center">
            <div className="text-xl font-bold text-primary">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default IsabellaAI;
