/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Shield, Users, FileCheck, RefreshCw, BookOpen, Scale, Eye, GitBranch, Globe, Crown, Code, Building, Landmark } from "lucide-react";

const Gobernanza = () => (
  <WikiPage
    title="Gobernanza y PolÃ­ticas"
      subtitle="Reglas de contribuciÃ³n, roles y principios del ecosistema TAMV"
    >
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/streets-colonial.jpg" alt="Calles coloniales de Real del Monte" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <Section title="Principios de gobernanza">
      <p className="text-muted-foreground leading-relaxed">
        TAMV opera bajo un modelo de gobernanza abierta progresiva, donde la transparencia, el respeto
        y el enfoque civilizatorio son pilares fundamentales. El{" "}
        <strong className="text-primary">CÃ³dice Maestro</strong> establece los lineamientos Ã©ticos y
        tÃ©cnicos que rigen toda contribuciÃ³n al ecosistema.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <InfoCard icon={Scale} title="Claridad y respeto" description="Toda comunicaciÃ³n y contribuciÃ³n debe ser clara, respetuosa y con enfoque civilizatorio." variant="gold" />
        <InfoCard icon={Eye} title="Transparencia" description="Decisiones documentadas pÃºblicamente. No duplicar contenido: enlazar antes de copiar." variant="cyan" />
        <InfoCard icon={BookOpen} title="Coherencia terminolÃ³gica" description="Usar siempre los nombres oficiales de mÃ³dulos, guardianÃ­as y protocolos." variant="gold" />
        <InfoCard icon={GitBranch} title="No duplicar" description="Antes de crear contenido nuevo, verificar si ya existe algo similar y enlazarlo." variant="cyan" />
      </div>
    </Section>

    <Section title="Roles del ecosistema">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Shield} title="Fundador / GuardiÃ¡n Supremo" description="Anubis VillaseÃ±or (Edwin Oswaldo Castillo Trejo). VisiÃ³n, arquitectura y decisiones finales del ecosistema." variant="gold" />
        <InfoCard icon={Users} title="Colaboradores de Alta Confianza" description="Fase inicial: solo el fundador y colaboradores directos validan y editan contenido crÃ­tico." variant="cyan" />
        <InfoCard icon={FileCheck} title="Contribuidores Moderados" description="Fase posterior: contribuciones abiertas moderadas mediante pull requests y sugerencias revisadas." variant="gold" />
        <InfoCard icon={Eye} title="DueÃ±os de SecciÃ³n" description="Cada pÃ¡gina o secciÃ³n tiene un responsable que garantiza la precisiÃ³n y vigencia del contenido." variant="cyan" />
      </div>
    </Section>

    <Section title="MembresÃ­as y roles de participaciÃ³n">
      <p className="text-muted-foreground leading-relaxed mb-4">
        Cada nivel de membresÃ­a del ecosistema TAMV se asocia a un rol de participaciÃ³n en la gobernanza,
        definiendo el alcance de las decisiones que cada miembro puede influir.
      </p>
      <div className="space-y-3">
        {[
          { icon: Users, level: "Free", role: "Observador civilizatorio", permissions: "Acceso de lectura a la wiki y Social Core. Voz en foros pÃºblicos, sin voto en gobernanza." },
          { icon: BookOpen, level: "Premium", role: "Usuario avanzado", permissions: "Acceso a dashboards y contenidos ampliados. Voz en Social Core con participaciÃ³n limitada en encuestas." },
          { icon: Code, level: "Devs", role: "Desarrollador TAMV", permissions: "Puede proponer cambios tÃ©cnicos (PR/MR) en dominios asignados. Participa en revisiones de cÃ³digo y Social Core." },
          { icon: Building, level: "Advance", role: "Operador / Aliado institucional", permissions: "Participa en decisiones de despliegue federado. Puede configurar nodos y proponer polÃ­ticas de dominio." },
          { icon: Crown, level: "Enterprise", role: "Nodo federado / Entidad civilizatoria asociada", permissions: "Gobernanza compartida con el ecosistema. Voto en decisiones crÃ­ticas, designaciÃ³n de guardianes de nodo." },
        ].map((m) => (
          <div key={m.level} className="rounded-lg border border-border/50 bg-card/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className="h-4 w-4 text-primary shrink-0" />
              <h4 className="font-semibold text-foreground text-sm">{m.level} â€” {m.role}</h4>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{m.permissions}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Mapa de decisiones por nivel">
      <div className="rounded-lg border border-border/50 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="text-left px-3 py-2.5 text-foreground font-medium text-xs">Tipo de decisiÃ³n</th>
              <th className="text-center px-2 py-2.5 text-foreground font-medium text-xs">Free</th>
              <th className="text-center px-2 py-2.5 text-foreground font-medium text-xs">Premium</th>
              <th className="text-center px-2 py-2.5 text-foreground font-medium text-xs">Devs</th>
              <th className="text-center px-2 py-2.5 text-foreground font-medium text-xs">Advance</th>
              <th className="text-center px-2 py-2.5 text-foreground font-medium text-xs">Enterprise</th>
            </tr>
          </thead>
          <tbody className="text-xs text-muted-foreground">
            {[
              { decision: "Voz en Social Core", levels: ["âœ”ï¸", "âœ”ï¸", "âœ”ï¸", "âœ”ï¸", "âœ”ï¸"] },
              { decision: "Proponer contenido wiki", levels: ["âŒ", "âœ”ï¸", "âœ”ï¸", "âœ”ï¸", "âœ”ï¸"] },
              { decision: "PRs tÃ©cnicos en dominios", levels: ["âŒ", "âŒ", "âœ”ï¸", "âœ”ï¸", "âœ”ï¸"] },
              { decision: "Configurar nodos propios", levels: ["âŒ", "âŒ", "âŒ", "âœ”ï¸", "âœ”ï¸"] },
              { decision: "Decisiones de despliegue federado", levels: ["âŒ", "âŒ", "âŒ", "âœ”ï¸", "âœ”ï¸"] },
              { decision: "Voto en gobernanza crÃ­tica", levels: ["âŒ", "âŒ", "âŒ", "âŒ", "âœ”ï¸"] },
              { decision: "Designar guardianes de nodo", levels: ["âŒ", "âŒ", "âŒ", "âŒ", "âœ”ï¸"] },
            ].map((row) => (
              <tr key={row.decision} className="border-b border-border/30">
                <td className="px-3 py-2 text-foreground">{row.decision}</td>
                {row.levels.map((v, i) => (
                  <td key={i} className="px-2 py-2 text-center">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    <Section title="Sistema de CertificaciÃ³n Federada TAMV">
      <p className="text-muted-foreground leading-relaxed mb-4">
        Cada rÃ©plica del ecosistema TAMV puede alcanzar un nivel de certificaciÃ³n federada que
        valida su cumplimiento tÃ©cnico, Ã©tico y operativo dentro de la red.
      </p>
      <div className="space-y-3">
        {[
          { level: "Nodo Observador", criteria: "Registro bÃ¡sico, cumplimiento mÃ­nimo de estÃ¡ndares. Acceso de lectura a la federaciÃ³n. Asociado a niveles Free/Premium.", color: "text-muted-foreground" },
          { level: "Nodo Colaborador", criteria: "Cumplimiento tÃ©cnico parcial (seguridad base, APIs estÃ¡ndar). Puede aportar datos y propuestas. Asociado a nivel Devs.", color: "text-secondary" },
          { level: "Nodo Operador", criteria: "Cumplimiento tÃ©cnico completo, uptime > 99.5%, auditorÃ­a aprobada. Opera servicios activos. Asociado a nivel Advance.", color: "text-primary" },
          { level: "Nodo GuardiÃ¡n", criteria: "MÃ¡ximo nivel. Cumplimiento Ã©tico y contractual total, guardiÃ¡n de nodo designado, participaciÃ³n activa en gobernanza. Solo Enterprise.", color: "text-primary" },
        ].map((n) => (
          <div key={n.level} className="rounded-lg border border-border/50 bg-card/50 p-4">
            <h4 className={`font-semibold text-sm ${n.color}`}>{n.level}</h4>
            <p className="text-xs text-muted-foreground mt-1">{n.criteria}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-primary">Proceso de certificaciÃ³n:</strong> Solicitud â†’ AuditorÃ­a tÃ©cnica (seguridad, uptime, APIs)
          â†’ AuditorÃ­a de gobernanza (Ã©tica, documentaciÃ³n, comunidad) â†’ EmisiÃ³n de certificado con firma criptogrÃ¡fica
          â†’ RevisiÃ³n periÃ³dica cada 12 meses.
        </p>
      </div>
    </Section>

    <Section title="Proceso de contribuciÃ³n">
      <div className="space-y-3">
        {[
          { step: "1", text: "Buscar si ya existe contenido similar antes de crear una pÃ¡gina nueva." },
          { step: "2", text: "Usar siempre las plantillas definidas: ArtÃ­culo General, MÃ³dulo, EspecificaciÃ³n TÃ©cnica o GuÃ­a/Tutorial." },
          { step: "3", text: "Proponer cambios grandes mediante issue/ticket con discusiÃ³n previa." },
          { step: "4", text: "Seguir el estilo de escritura: voz clara, en presente, sin marketing. 1 frase de resumen antes del detalle." },
          { step: "5", text: "Secciones con tÃ­tulos descriptivos, listas para pasos o elementos, citar fuentes internas." },
          { step: "6", text: "RevisiÃ³n por el dueÃ±o de secciÃ³n antes de publicar cambios." },
        ].map((s) => (
          <div key={s.step} className="flex gap-3 items-start p-3 rounded-lg bg-muted/30 border border-border/50">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold shrink-0">
              {s.step}
            </span>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Plantillas de ediciÃ³n">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border/50 bg-card/60">
          <h4 className="font-semibold text-foreground mb-2">ðŸ“„ ArtÃ­culo General</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>â€¢ Resumen (1â€“3 lÃ­neas)</li>
            <li>â€¢ DefiniciÃ³n y contexto en TAMV</li>
            <li>â€¢ Componentes clave</li>
            <li>â€¢ Casos de uso y riesgos</li>
            <li>â€¢ RelaciÃ³n con otros mÃ³dulos</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/60">
          <h4 className="font-semibold text-foreground mb-2">ðŸ§© MÃ³dulo del Ecosistema</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>â€¢ Tipo: Dominio / GuardianÃ­a / Servicio</li>
            <li>â€¢ PropÃ³sito y funciones clave</li>
            <li>â€¢ Entradas, salidas e integraciones</li>
            <li>â€¢ Estado actual del mÃ³dulo</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/60">
          <h4 className="font-semibold text-foreground mb-2">âš™ï¸ EspecificaciÃ³n TÃ©cnica</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>â€¢ Arquitectura y modelos de datos</li>
            <li>â€¢ Flujos principales y APIs</li>
            <li>â€¢ Seguridad y cumplimiento</li>
            <li>â€¢ Testing y mÃ©tricas</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border border-border/50 bg-card/60">
          <h4 className="font-semibold text-foreground mb-2">ðŸ“˜ GuÃ­a / Tutorial</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>â€¢ Objetivo y requisitos previos</li>
            <li>â€¢ Pasos detallados numerados</li>
            <li>â€¢ Ejemplos de uso</li>
            <li>â€¢ Errores comunes y soluciones</li>
          </ul>
        </div>
      </div>
    </Section>

    <Section title="RevisiÃ³n y mantenimiento">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={RefreshCw} title="Revisiones periÃ³dicas" description="Cada 3â€“6 meses se revisan las secciones crÃ­ticas: Arquitectura, Seguridad y APIs." variant="gold" />
        <InfoCard icon={FileCheck} title="Contenido archivado" description="El contenido obsoleto se marca como 'Archivado' o 'HistÃ³rico', nunca se borra si tiene valor documental." variant="cyan" />
      </div>
    </Section>

    <Section title="Compliance y estÃ¡ndares">
      <p className="text-muted-foreground leading-relaxed">
        Toda contribuciÃ³n al ecosistema TAMV debe alinearse con los estÃ¡ndares internacionales y nacionales
        adoptados por el proyecto:
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {["AI Act (EU)", "GDPR", "ISO 27001", "ISO 42001", "NOMâ€‘151", "Zeroâ€‘Trust", "OWASP Top 10"].map((std) => (
          <span key={std} className="px-3 py-1.5 rounded-md border border-border/50 bg-muted/30 text-sm text-foreground">
            {std}
          </span>
        ))}
      </div>
    </Section>

    <Section title="Enlaces oficiales">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="https://github.com/OsoPanda1" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/60 hover:border-primary/50 transition-colors">
          <GitBranch className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">GitHub â€” OsoPanda1</span>
        </a>
        <a href="https://tamvonline-oficial.odoo.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/60 hover:border-primary/50 transition-colors">
          <Globe className="h-4 w-4 text-secondary" />
          <span className="text-sm text-foreground">Sitio Oficial â€” Odoo</span>
        </a>
        <a href="https://tamvonlinenetwork.blogspot.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/60 hover:border-primary/50 transition-colors">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">Blog Oficial â€” Blogspot</span>
        </a>
      </div>
    </Section>
  </WikiPage>
);

export default Gobernanza;
