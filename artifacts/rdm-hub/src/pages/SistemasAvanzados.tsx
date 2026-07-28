/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hexagon, Cpu, Atom, Activity, Filter, Layers, Zap, Shield, Database, GitBranch, Users, Heart, Vote, Star } from "lucide-react";

const SistemasAvanzados = () => (
  <WikiPage
    title="Sistemas Avanzados"
    subtitle="Pipelines hexagonales, EOCT, quantum, monitoreo, filtraciÃ³n y Social Core"
  >
    <Tabs defaultValue="hexagonal" className="w-full">
      <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/30 p-1">
        <TabsTrigger value="hexagonal" className="text-xs">Pipelines Hexagonales</TabsTrigger>
        <TabsTrigger value="eoct" className="text-xs">EOCT</TabsTrigger>
        <TabsTrigger value="quantum" className="text-xs">Quantum</TabsTrigger>
        <TabsTrigger value="monitoreo" className="text-xs">Monitoreo</TabsTrigger>
        <TabsTrigger value="filtracion" className="text-xs">FiltraciÃ³n</TabsTrigger>
        <TabsTrigger value="socialcore" className="text-xs">Social Core</TabsTrigger>
      </TabsList>

      {/* HEXAGONAL PIPELINES */}
      <TabsContent value="hexagonal" className="space-y-6 mt-6">
        <Section title="Arquitectura Hexagonal con Doble Pipeline">
          <p className="text-muted-foreground leading-relaxed">
            El sistema computacional hexagonal de TAMV implementa una arquitectura de puertos y adaptadores
            con <strong className="text-primary">doble pipeline en caliente</strong> (procesamiento en tiempo real) y{" "}
            <strong className="text-secondary">doble pipeline en frÃ­o</strong> (procesamiento batch y archivo).
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Zap} title="Pipeline Caliente A" description="Stream de eventos en tiempo real: ingestiÃ³n, validaciÃ³n, enriquecimiento y routing a nodos activos con latencia < 50ms." variant="gold" />
          <InfoCard icon={Zap} title="Pipeline Caliente B" description="Redundancia hot-standby: replica paralela del pipeline A con failover automÃ¡tico y balanceo inteligente de carga." variant="gold" />
          <InfoCard icon={Database} title="Pipeline FrÃ­o A" description="Procesamiento batch nocturno: agregaciÃ³n, compactaciÃ³n, indexaciÃ³n y archivado en almacenamiento inmutable." variant="cyan" />
          <InfoCard icon={Database} title="Pipeline FrÃ­o B" description="AnÃ¡lisis retrospectivo: data warehouse para BI, machine learning y auditorÃ­a forense con ventanas temporales." variant="cyan" />
        </div>

        <Section title="FiltraciÃ³n inteligente entre pipelines">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Filter className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Clasificador de flujo</h4>
                <p className="text-xs text-muted-foreground">Algoritmo de priorizaciÃ³n basado en urgencia, tipo de dato, SLA del dominio y carga actual. Decide routing caliente vs frÃ­o en {"<5ms"}.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GitBranch className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">Crossover inteligente</h4>
                <p className="text-xs text-muted-foreground">Los datos pueden migrar entre pipelines segÃºn cambios de prioridad. Eventos frÃ­os que se vuelven urgentes se promueven automÃ¡ticamente.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Especificaciones tÃ©cnicas">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Throughput caliente", value: "50K evt/s" },
              { label: "Latencia P99", value: "< 50ms" },
              { label: "Batch window", value: "6h" },
              { label: "RetenciÃ³n frÃ­a", value: "7 aÃ±os" },
              { label: "Failover time", value: "< 200ms" },
              { label: "CompresiÃ³n", value: "Zstd L3" },
              { label: "Formato", value: "Apache Parquet" },
              { label: "Esquema", value: "Avro + Protobuf" },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-border/50 bg-card/50 p-3 text-center">
                <div className="text-sm font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>
      </TabsContent>

      {/* EOCT */}
      <TabsContent value="eoct" className="space-y-6 mt-6">
        <Section title="Evolutionary Organizational Cybernetic Technology">
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-primary">EOCT</strong> es el framework de gobernanza computacional de TAMV.
            Combina teorÃ­a cibernÃ©tica organizacional (Stafford Beer VSM) con blockchain inmutable para crear
            un sistema que evoluciona, aprende y se auto-regula manteniendo coherencia civilizatoria.
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Layers} title="Capa 1: OperaciÃ³n" description="GestiÃ³n autÃ³noma de nodos individuales. Cada nodo ejecuta sus funciones de dominio con autonomÃ­a local." variant="gold" />
          <InfoCard icon={Activity} title="Capa 2: CoordinaciÃ³n" description="SincronizaciÃ³n horizontal entre nodos del mismo dominio. Protocolos de consenso y resoluciÃ³n de conflictos." variant="cyan" />
          <InfoCard icon={Shield} title="Capa 3: Control" description="SupervisiÃ³n de dominios completos. Monitoreo de SLAs, auditorÃ­a de recursos y enforcement de polÃ­ticas." variant="gold" />
          <InfoCard icon={Cpu} title="Capa 4: Inteligencia" description="AnÃ¡lisis predictivo inter-dominio. Isabella AI opera aquÃ­, detectando patrones y proponiendo adaptaciones." variant="cyan" />
        </div>

        <Section title="Ledger de confianza">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada decisiÃ³n organizacional se registra en un ledger inmutable gestionado vÃ­a <strong className="text-primary">MSR API</strong> (Measure-Signal-Response).
              Esto permite auditorÃ­a completa, trazabilidad de decisiones y anÃ¡lisis post-mortem de incidentes.
              El ledger soporta <strong className="text-primary">Zero-Knowledge Proofs</strong> para verificar compliance sin exponer datos sensibles.
            </p>
          </div>
        </Section>

        <Section title="Ciclo evolutivo">
          <div className="space-y-2">
            {["Sensado: recolecciÃ³n de mÃ©tricas y seÃ±ales del ecosistema",
              "Modelado: construcciÃ³n de modelos predictivos con ML federado",
              "DecisiÃ³n: selecciÃ³n de acciones Ã³ptimas via consenso distribuido",
              "EjecuciÃ³n: implementaciÃ³n gradual con rollback automÃ¡tico",
              "EvaluaciÃ³n: mediciÃ³n de impacto y retroalimentaciÃ³n al modelo",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </Section>
      </TabsContent>

      {/* QUANTUM */}
      <TabsContent value="quantum" className="space-y-6 mt-6">
        <Section title="Sistema Quantum Resiliente">
          <p className="text-muted-foreground leading-relaxed">
            La capa quantum de TAMV no es computaciÃ³n cuÃ¡ntica per se, sino una arquitectura{" "}
            <strong className="text-primary">quantum-resilient</strong> diseÃ±ada para resistir amenazas de
            computaciÃ³n cuÃ¡ntica futura mientras aprovecha principios cuÃ¡nticos en su diseÃ±o de seguridad y consenso.
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Atom} title="CriptografÃ­a post-cuÃ¡ntica" description="Algoritmos CRYSTALS-Kyber (KEM) y CRYSTALS-Dilithium (firmas) aprobados por NIST para resistir ataques cuÃ¡nticos." variant="gold" />
          <InfoCard icon={Shield} title="QKD-inspired key exchange" description="Protocolo de intercambio de claves inspirado en distribuciÃ³n cuÃ¡ntica, con detecciÃ³n de interceptaciÃ³n activa." variant="cyan" />
          <InfoCard icon={Cpu} title="Consenso quantum-safe" description="Protocolo de consenso que mantiene seguridad BFT incluso ante adversarios con capacidad cuÃ¡ntica limitada." variant="gold" />
          <InfoCard icon={Layers} title="Entrelazamiento lÃ³gico" description="Modelo de datos donde la modificaciÃ³n de un nodo propaga verificaciones criptogrÃ¡ficas a nodos entrelazados." variant="cyan" />
        </div>

        <Section title="Roadmap de migraciÃ³n">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
            {[
              { phase: "Fase 1 (Actual)", desc: "IdentificaciÃ³n y catÃ¡logo de primitivas criptogrÃ¡ficas vulnerables en el ecosistema." },
              { phase: "Fase 2 (2025)", desc: "ImplementaciÃ³n de algoritmos hÃ­bridos (clÃ¡sico + post-cuÃ¡ntico) en mÃ³dulos crÃ­ticos." },
              { phase: "Fase 3 (2026)", desc: "MigraciÃ³n completa a stack post-cuÃ¡ntico con pruebas de penetraciÃ³n especializadas." },
              { phase: "Fase 4 (2027+)", desc: "ExploraciÃ³n de QaaS (Quantum as a Service) para optimizaciÃ³n y simulaciÃ³n." },
            ].map((p) => (
              <div key={p.phase} className="flex items-start gap-3">
                <span className="text-xs font-bold text-primary whitespace-nowrap mt-0.5">{p.phase}</span>
                <span className="text-xs text-muted-foreground">{p.desc}</span>
              </div>
            ))}
          </div>
        </Section>
      </TabsContent>

      {/* MONITOREO */}
      <TabsContent value="monitoreo" className="space-y-6 mt-6">
        <Section title="Stack de monitoreo en tiempo real">
          <p className="text-muted-foreground leading-relaxed">
            Observabilidad completa del ecosistema TAMV mediante un stack integrado de herramientas
            open-source y propietarias que cubren mÃ©tricas, logs, traces y alertas.
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Activity} title="Grafana" description="Dashboards interactivos con alertas configurables. VisualizaciÃ³n de mÃ©tricas de nodos, dominios y servicios con refresh de 5s." variant="gold" />
          <InfoCard icon={Layers} title="Terraform" description="Infrastructure as Code para provisioning reproducible. GestiÃ³n de estado, planificaciÃ³n y aplicaciÃ³n de cambios con aprobaciÃ³n." variant="cyan" />
          <InfoCard icon={Database} title="Prometheus + Loki" description="Prometheus para mÃ©tricas time-series, Loki para agregaciÃ³n de logs. Ambos con retenciÃ³n configurable y alerting." variant="gold" />
          <InfoCard icon={Hexagon} title="Jaeger / OpenTelemetry" description="Distributed tracing para seguimiento de requests a travÃ©s de dominios federados. DetecciÃ³n de cuellos de botella." variant="cyan" />
        </div>

        <Section title="SLAs por dominio">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/30">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Dominio</th>
                <th className="text-center px-4 py-2 text-muted-foreground font-medium">Uptime</th>
                <th className="text-center px-4 py-2 text-muted-foreground font-medium">Latencia max</th>
                <th className="text-center px-4 py-2 text-muted-foreground font-medium">RTO</th>
              </tr></thead>
              <tbody>
                {[
                  { dom: "Seguridad", up: "99.99%", lat: "10ms", rto: "30s" },
                  { dom: "ID-NVIDA", up: "99.95%", lat: "50ms", rto: "2min" },
                  { dom: "EconomÃ­a", up: "99.95%", lat: "100ms", rto: "5min" },
                  { dom: "UTAMV", up: "99.9%", lat: "200ms", rto: "10min" },
                  { dom: "Metaverso", up: "99.5%", lat: "500ms", rto: "15min" },
                ].map((r) => (
                  <tr key={r.dom} className="border-t border-border/30">
                    <td className="px-4 py-2 font-medium text-foreground">{r.dom}</td>
                    <td className="px-4 py-2 text-center text-primary">{r.up}</td>
                    <td className="px-4 py-2 text-center text-muted-foreground">{r.lat}</td>
                    <td className="px-4 py-2 text-center text-muted-foreground">{r.rto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </TabsContent>

      {/* FILTRACIÃ“N */}
      <TabsContent value="filtracion" className="space-y-6 mt-6">
        <Section title="FiltraciÃ³n inteligente con doble pipeline">
          <p className="text-muted-foreground leading-relaxed">
            Sistema de clasificaciÃ³n, depuraciÃ³n y recomendaciÃ³n de informaciÃ³n que opera transversalmente
            en todos los dominios TAMV, filtrando ruido, detectando anomalÃ­as y priorizando contenido relevante.
          </p>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Filter} title="Clasificador multinivel" description="Tres etapas: pre-filtro (reglas), ML (clasificaciÃ³n) y post-filtro (validaciÃ³n semÃ¡ntica). PrecisiÃ³n >96%." variant="gold" />
          <InfoCard icon={Cpu} title="Motor de recomendaciÃ³n" description="Sistema hybrid CF+CBF con embeddings contextuales de TAMV. PersonalizaciÃ³n por rol, dominio y preferencias." variant="cyan" />
          <InfoCard icon={Shield} title="DepuraciÃ³n de datos" description="DetecciÃ³n de duplicados, correcciÃ³n de inconsistencias, normalizaciÃ³n de formatos y eliminaciÃ³n de PII no autorizado." variant="gold" />
          <InfoCard icon={Activity} title="Scoring de confiabilidad" description="Cada dato recibe un trust-score basado en origen, antigÃ¼edad, validaciÃ³n cruzada y consenso de nodos." variant="cyan" />
        </div>

        <Section title="Flujo de filtraciÃ³n">
          <div className="space-y-2">
            {[
              "IngestiÃ³n: datos entran por APIs, webhooks o scraping supervisado",
              "Pre-filtro: reglas estÃ¡ticas eliminan spam, bots y contenido irrelevante",
              "ClasificaciÃ³n ML: modelo de NLP categoriza por dominio, urgencia y tipo",
              "Enriquecimiento: crossref con grafos de conocimiento TAMV",
              "Scoring: asignaciÃ³n de trust-score y prioridad",
              "Routing: distribuciÃ³n a pipelines caliente/frÃ­o segÃºn score",
              "AuditorÃ­a: registro inmutable de decisiones de filtrado",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </Section>
      </TabsContent>

      {/* SOCIAL CORE */}
      <TabsContent value="socialcore" className="space-y-6 mt-6">
        <Section title="MÃ³dulo Social Core">
          <p className="text-muted-foreground leading-relaxed">
            El <strong className="text-primary">Social Core</strong> es la capa que modela las relaciones entre
            identidades, comunidades y nodos dentro del ecosistema TAMV. Es donde se aplica reputaciÃ³n,
            participaciÃ³n, penalizaciones y reconocimiento como mecanismos de gobernanza social.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-3">
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary">Acceso por membresÃ­a:</strong> Devs, Advance y Enterprise tienen acceso
              a Social Core. Los usuarios Free y Premium tienen voz (sin voto) en foros pÃºblicos.
            </p>
          </div>
        </Section>

        <Section title="Entidades conceptuales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={Users} title="Persona" description="Identidad verificada vÃ­a ID-NVIDA con perfil social, historial de participaciÃ³n, reputaciÃ³n acumulada y badges." variant="gold" />
            <InfoCard icon={Heart} title="Comunidad" description="Grupo de personas con intereses compartidos. Puede ser temÃ¡tica (dominio), geogrÃ¡fica (nodo) o funcional (proyecto)." variant="cyan" />
            <InfoCard icon={Hexagon} title="Nodo" description="Instancia federada del ecosistema TAMV. El nodo es tambiÃ©n una entidad social con reputaciÃ³n y gobernanza propia." variant="gold" />
            <InfoCard icon={Shield} title="Rol" description="FunciÃ³n que una persona ejerce dentro de una comunidad o nodo: guardiÃ¡n, moderador, contribuidor, observador." variant="cyan" />
          </div>
        </Section>

        <Section title="Relaciones y dinÃ¡micas">
          <div className="space-y-3">
            {[
              { icon: Star, title: "ReputaciÃ³n", desc: "Sistema de trust-score basado en contribuciones, votos recibidos, tiempo activo y cumplimiento de compromisos. La reputaciÃ³n es portable entre comunidades y nodos." },
              { icon: Vote, title: "ParticipaciÃ³n en gobernanza", desc: "Votaciones, propuestas y encuestas. Cada nivel de membresÃ­a tiene diferente peso de voto. Las decisiones se registran en el ledger EOCT." },
              { icon: Heart, title: "Reconocimiento", desc: "Badges, certificaciones y tÃ­tulos otorgados por contribuciones significativas. Los reconocimientos son verificables en blockchain." },
              { icon: Shield, title: "Penalizaciones", desc: "Sistema de sanciones graduales por violaciÃ³n del CÃ³dice Maestro: advertencia â†’ restricciÃ³n temporal â†’ suspensiÃ³n â†’ expulsiÃ³n. Apelable ante el consejo de guardianes." },
            ].map((r) => (
              <div key={r.title} className="rounded-lg border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <r.icon className="h-4 w-4 text-primary shrink-0" />
                  <h4 className="font-semibold text-foreground text-sm">{r.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{r.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Casos de uso del Social Core">
          <div className="space-y-2">
            {[
              "Votaciones comunitarias: decidir prioridades de desarrollo de un dominio",
              "Propuestas de mejora: cualquier miembro Devs+ puede proponer cambios formales",
              "ReputaciÃ³n por contribuciÃ³n: desarrolladores acumulan trust-score con PRs aprobados",
              "Gobernanza de nodo: los miembros Enterprise eligen representantes para el consejo federado",
              "ModeraciÃ³n distribuida: la comunidad reporta y los guardianes resuelven conflictos",
              "Reconocimiento pÃºblico: badges por hitos como 'Primera contribuciÃ³n', 'GuardiÃ¡n de dominio', '1000 commits'",
            ].map((useCase, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm text-muted-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Estado del mÃ³dulo">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/5">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm text-yellow-500 font-medium">En progreso â€” DiseÃ±o conceptual completado, implementaciÃ³n pendiente</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            La implementaciÃ³n completa del Social Core incluirÃ¡: tabla de comunidades con RLS por membresÃ­a,
            sincronizaciÃ³n en tiempo real de actividad social, y sistema de reputaciÃ³n con scoring on-chain.
          </p>
        </Section>
      </TabsContent>
    </Tabs>
  </WikiPage>
);

export default SistemasAvanzados;
