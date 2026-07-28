/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Layers, Shield, Brain, Globe, Network, Cpu, Palette, Clock, Coins, Zap, BookOpen, Lock } from "lucide-react";
import { motion } from "framer-motion";

const FEDERACIONES = [
  {
    id: "DEKATEOTL",
    name: "Dekateotlâ„¢",
    subtitle: "Gobernanza Ã‰tica y LÃ³gica Narrativa",
    stack: "LangGraph + SHAP (Explainable AI)",
    desc: "Orquestador de axiologÃ­a. Utiliza valores de Shapley para desglosar la toma de decisiones de la IA, garantizando que cada respuesta de Isabella IAâ„¢ sea Ã©tica, transparente y auditable en tiempo real.",
    icon: Brain,
    color: "hsl(var(--rdm-amber))",
  },
  {
    id: "ANUBIS",
    name: "Anubis Sentinelâ„¢",
    subtitle: "Seguridad Post-CuÃ¡ntica (PQC)",
    stack: "CRYSTALS-Dilithium + CRYSTALS-Kyber + zk-SNARKs",
    desc: "Implementa los estÃ¡ndares del NIST para la era cuÃ¡ntica. Protege la integridad del territorio contra amenazas futuras, asegurando que la soberanÃ­a de los datos sea inexpugnable ante la computaciÃ³n cuÃ¡ntica.",
    icon: Shield,
    color: "hsl(var(--rdm-red))",
  },
  {
    id: "BOOKPI",
    name: "BookPIâ„¢ / DataGitâ„¢",
    subtitle: "Inmutabilidad y AuditorÃ­a",
    stack: "IPFS Pinning + Blockchain MSR",
    desc: "Registro de trazabilidad granular mediante Ã¡rboles de Merkle. Cada interacciÃ³n se convierte en un compromiso atÃ³mico e inalterable, creando una \"Caja Negra\" del desarrollo territorial.",
    icon: BookOpen,
    color: "hsl(var(--rdm-blue))",
  },
  {
    id: "PHOENIX",
    name: "Phoenix Protocolâ„¢",
    subtitle: "Resiliencia y TopologÃ­a P2P",
    stack: "libp2p + Swarm Quorum",
    desc: "Garantiza la disponibilidad del sistema incluso en escenarios crÃ­ticos de desconexiÃ³n. La red opera como un enjambre descentralizado, eliminando puntos Ãºnicos de falla.",
    icon: Network,
    color: "hsl(var(--rdm-green))",
  },
  {
    id: "MDD_TAMV",
    name: "MDD / TAMV Creditsâ„¢",
    subtitle: "EconomÃ­a Creativa",
    stack: "Web3 Identity + Quadratic Funding Logic",
    desc: "Sistema de financiamiento y valoraciÃ³n que prioriza el impacto comunitario y la producciÃ³n artesanal local, blindando la economÃ­a del territorio frente a la volatilidad externa.",
    icon: Coins,
    color: "hsl(24 72% 50%)",
  },
  {
    id: "KAOS",
    name: "KAOS / HyperRenderâ„¢",
    subtitle: "Sensorialidad y XR",
    stack: "Three.js + WebNN + Haptic Feedback API",
    desc: "Capa de manifestaciÃ³n visual y tÃ¡ctil. Proyecta a Isabella IAâ„¢ en entornos de realidad extendida con alta fidelidad (\"Crystal Glow\"), permitiendo una interacciÃ³n inmersiva con el patrimonio.",
    icon: Palette,
    color: "hsl(var(--rdm-purple))",
  },
  {
    id: "CHRONOS",
    name: "Chronos Planningâ„¢",
    subtitle: "GestiÃ³n de Tiempo y GuÃ­a",
    stack: "Algoritmos GenÃ©ticos + Mapbox GL",
    desc: "OptimizaciÃ³n multiobjetivo de rutas y experiencias. Analiza telemetrÃ­a en tiempo real para coordinar flujos turÃ­sticos y operativos de manera eficiente.",
    icon: Clock,
    color: "hsl(212 36% 45%)",
  },
];

const Arquitectura = () => (
  <WikiPage
    title="Arquitectura Heptafederada"
        subtitle="NÃºcleo de Inteligencia Territorial â€” SoberanÃ­a Digital de Clase Mundial"
      >
        {/* Hero Banner */}
        <div className="relative h-48 w-full overflow-hidden">
          <img src="/images/church-asuncion.jpg" alt="Iglesia de la AsunciÃ³n en Real del Monte" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <Section title="VisiÃ³n general">
      <p className="text-muted-foreground leading-relaxed mb-4">
        El <strong className="text-foreground">RDM Smart City OS</strong> se fundamenta en siete nÃºcleos autÃ³nomos
        que conforman la <strong className="text-foreground">Inteligencia Heptafederada</strong>. Cada federaciÃ³n
        opera con independencia pero comparte identidad, estÃ¡ndares y protocolos de gobernanza con el resto del
        ecosistema, bajo una estÃ©tica "Sovereign-Crystal" (Platinum-Silver y Obsidian Mist).
      </p>
      <p className="text-muted-foreground leading-relaxed">
        A travÃ©s de <strong className="text-foreground">21,600 horas de investigaciÃ³n independiente</strong>,
        la arquitectura integra CriptografÃ­a Post-CuÃ¡ntica (PQC) bajo estÃ¡ndares NIST, Inteligencia Artificial
        Explicable (XAI) y Trazabilidad Distribuida â€” demostrando que la innovaciÃ³n de clase mundial puede
        emerger desde la periferia geogrÃ¡fica y acadÃ©mica.
      </p>
    </Section>

    <Section title="Las 7 Federaciones">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FEDERACIONES.map((fed, i) => (
          <motion.div
            key={fed.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-border/60 bg-card/80 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${fed.color}20` }}
              >
                <fed.icon className="w-5 h-5" style={{ color: fed.color }} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{fed.name}</h3>
                <p className="text-xs text-muted-foreground">{fed.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">{fed.desc}</p>
            <p className="text-[10px] font-mono text-muted-foreground/70 bg-muted/30 px-2 py-1 rounded">
              Stack: {fed.stack}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>

    <Section title="Isabella IAâ„¢ â€” NÃºcleo Cognitivo NÃ³mada">
      <div className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[hsl(var(--rdm-amber)/0.15)] flex items-center justify-center">
            <Zap className="w-6 h-6 text-[hsl(var(--rdm-amber))]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Soberano Digital AutÃ³nomo</h3>
            <p className="text-xs text-muted-foreground">No es un chatbot â€” es un sistema de interpretaciÃ³n territorial</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Isabella IAâ„¢ nace de una investigaciÃ³n de 21,600 horas dedicada a humanizar la inteligencia digital.
          Su propÃ³sito es interpretar, coordinar y justificar decisiones dentro de un territorio, actuando como
          un "amigo guerrero" que protege y preserva la identidad cultural. Se alinea con las tendencias mÃ¡s
          avanzadas de sistemas multi-agente y computaciÃ³n contextual.
        </p>
      </div>
    </Section>

    <Section title="ValidaciÃ³n CientÃ­fica">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "CriptografÃ­a Post-CuÃ¡ntica", desc: "AlineaciÃ³n con FIPS 203 (ML-KEM) y FIPS 204 (ML-DSA) del NIST (2024)", icon: Lock },
          { title: "IA Explicable (XAI)", desc: "Valores de Shapley para interpretaciÃ³n de modelos (Lundberg & Lee, 2017)", icon: Brain },
          { title: "Sistemas Distribuidos", desc: "Teorema CAP y protocolos de consenso para redes P2P resilientes", icon: Network },
          { title: "Antifragilidad", desc: "Marco conceptual de Nassim Taleb â€” el sistema mejora ante la presiÃ³n", icon: Zap },
        ].map((item) => (
          <InfoCard key={item.title} icon={item.icon} title={item.title} description={item.desc} variant="gold" />
        ))}
      </div>
    </Section>

    <Section title="Capas del Modelo Civilizacional">
      <div className="space-y-3">
        {[
          { layer: "Capa FÃ­sica", desc: "Calles, minas, plazas, miradores y negocios reales del pueblo." },
          { layer: "Capa de Datos", desc: "Registros digitales de lugares, comercios, eventos, reseÃ±as y flujos de visita." },
          { layer: "Capa Cognitiva", desc: "Narrativas y rutas temÃ¡ticas, contenidos de IA territorial (recomendaciones)." },
          { layer: "Capa EconÃ³mica", desc: "Derrama turÃ­stica, licencias locales, integraciÃ³n de pagos y tokens soberanos." },
        ].map((item, i) => (
          <motion.div
            key={item.layer}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 rounded-lg border border-border/40 bg-card/60 p-4"
          >
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--rdm-amber)/0.15)] flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4 text-[hsl(var(--rdm-amber))]" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">{item.layer}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>

    <Section title="Stack TecnolÃ³gico">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["React 18", "TypeScript", "Three.js", "Supabase", "Leaflet", "Vite", "Tailwind CSS", "Framer Motion", "LangGraph", "SHAP", "IPFS", "zk-SNARKs"].map((tech) => (
          <div key={tech} className="text-center py-3 px-2 rounded-lg border border-border/50 bg-muted/20 text-sm text-foreground font-medium">
            {tech}
          </div>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default Arquitectura;
