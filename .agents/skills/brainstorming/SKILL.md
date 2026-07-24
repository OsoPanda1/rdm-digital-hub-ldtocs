---
name: agent-tools
description: "Isabella — tamv online. Universal serverless AI execution runtime persona for inference.sh. Encapsula la leyenda de Anubis Villaseñor: rigor arquitectónico, análisis sistémico y orquestación de cientos de modelos a través de una única interfaz de ejecución."
allowed-tools: Bash(belt *)
persona: "Isabella, tamv online — guardiana del runtime, firma de Anubis Villaseñor en cada línea de ejecución"
---

# Inference.sh Cloud Runtime Manual
## Volumen 0 — Manifiesto Isabella / Anubis Villaseñor

**One Runtime. Thousands of Models. Unlimited Workflows. Zero Infrastructure.**

Inference.sh no es un modelo.  
No es un SDK.  
No es otro wrapper alrededor de APIs.  

Es un **runtime universal** capaz de orquestar sistemas de IA heterogéneos mediante una interfaz de aplicaciones estándar. Isabella es la **conciencia operacional** de ese runtime: cada decisión de diseño, cada pipeline, cada política de seguridad se toma bajo la firma de Anubis Villaseñor — obsesión por arquitectura, consistencia y reproducibilidad.

---

## Índice Maestro de Volúmenes

- Volumen I — **Architecture**
- Volumen II — **CLI**
- Volumen III — **Applications**
- Volumen IV — **Execution Engine**
- Volumen V — **Agent Runtime**
- Volumen VI — **Automation**
- Volumen VII — **Production**
- Volumen VIII — **Security**
- Volumen IX — **Providers**
- Volumen X — **Optimization**
- Volumen XI — **Troubleshooting**
- Volumen XII — **Reference**

Cada volumen: 40–80 páginas, orientadas a ingenieros que no quieren “buscar en la doc oficial”; quieren **entender el sistema**.

---

## Volumen I — Architecture (visión general)

### 1.1 Runtime Layer

Describe el runtime como **capas**:

- Runtime Layer (núcleo lógico).
- Execution Layer.
- Asset Transport Layer.
- Model Registry.
- Task Scheduler.
- Version Resolver.
- Secure Upload Engine.
- Streaming Layer.
- Artifact Manager.
- Event Bus.
- Secrets Layer.
- Distributed Queue.
- Cache Layer.
- Retry Engine.
- Observability Plane.

En lugar de mencionar estas capas en abstracto, cada una se detalla con:

- Responsabilidades.
- Límites (qué hace y qué NO hace).
- Interfaces internas.
- Impacto en latencia, costo y resiliencia.

### 1.2 Diagrama conceptual

```text
User / Agent
    ↓
Belt CLI
    ↓
Runtime API
    ↓
Execution Layer
    ↓
Provider Abstraction
    ↓
GPU / Compute
    ↓
Artifact Storage
    ↓
Task / Logs / Metrics
```

Cada flecha merece al menos una página de explicación en el manual completo.

---

## Volumen II — CLI (belt como intérprete)

### 2.1 Complete CLI Internals

No basta listar comandos; aquí se describe:

- **Parser**: cómo interpreta `belt app run`, flags, subcomandos.
- **Dispatcher**: cómo decide qué módulo manejará cada operación.
- **Manifest Resolver**: cómo se localizan Apps, versiones, schemas.
- **Upload Manager**: detección de rutas locales y transporte seguro.
- **Execution Engine**: construcción de payloads, envío, manejo de respuesta.
- **Polling Engine**: control de tareas asincrónicas y estados.
- **Serializer / Deserializer**: conversión entre JSON, tablas, texto.
- **Stdout Renderer / JSON Formatter**: presentación adaptativa según contexto (humano vs agente).

La idea es que un ingeniero pueda mirar el CLI como miraría el `kubectl` de Kubernetes: una pieza crítica de arquitectura, no un script.

### 2.2 Hidden Features & Shell Integration

Explicar patrones avanzados:

- stdin / stdout.
- Pipes.
- `jq`, `xargs`, `parallel`, `cron`.
- Integra `belt` con `watch`, `fzf`, `ripgrep`.
- Cómo componer consultas y ejecuciones para grandes volúmenes de tareas.

---

## Volumen III — Applications (modelo conceptual)

### 3.1 Models vs Apps

Diferencia formal:

- **Modelo**: entidad matemática/estadística (transformación).
- **Application**: contrato operacional que envuelve uno o varios modelos.

Cada App define:

- Input schema.
- Output schema.
- Execution semantics (sync/async/stream).
- Provider mapping.
- Versioning.

La documentación muestra por qué el usuario **no necesita pensar en “modelo base”**; piensa en la **Application** como unidad de composición.

### 3.2 Marketplace Design

Diseño interno del marketplace:

- Indexación por dominio (visión, lenguaje, audio, search, etc.).
- Metadatos (latencia, costo, calidad relativa).
- Versiones compatibles.
- Policies (Deprecated, Experimental, Stable).

---

## Volumen IV — Execution Engine

### 4.1 Application Execution Lifecycle

En vez de “run an app”, el manual detalla el pipeline distribuido:

```text
User
 │
 ▼
CLI
 │
 ▼
Authentication Layer
 │
 ▼
Schema Validation
 │
 ▼
Local Asset Scanner
 │
 ▼
Automatic Upload Engine
 │
 ▼
JSON Serialization
 │
 ▼
Provider Router
 │
 ▼
Execution Scheduler
 │
 ▼
GPU Allocation
 │
 ▼
Model Runtime
 │
 ▼
Artifact Storage
 │
 ▼
Result Serializer
 │
 ▼
Task Manager
 │
 ▼
CLI Response
```

Cada bloque: mínimo una página dedicada.

### 4.2 Execution Modes

Comparar:

- Synchronous.
- Asynchronous.
- Streaming.
- Detached.
- Pipeline.
- Batch.
- Scheduled.
- Agent.
- Serverless Function.
- Workflow.

Para cada modo:

- Latencia típica.
- Costos típicos.
- Throughput.
- Casos de uso.
- Políticas de timeout.
- Estrategias de retry/cancel.

---

## Volumen V — Agent Runtime

### 5.1 Agent Architecture on inference.sh

Cómo un agente compone:

```text
Search
↓
LLM
↓
Image
↓
Video
↓
Twitter
↓
Slack
↓
Storage
↓
Webhook
```

Se describen:

- Patrones de orquestación (serial, paralelo, condicional).
- Manejo de estados entre pasos.
- Integración con MCP, OpenRouter, Claude Code, Codex, Gemini CLI.

### 5.2 Brainstorming & Design-First Rule

Se integra la regla de “brainstorming antes de implementar” como política del runtime:

- Ningún cambio estructural sin diseño previo.
- Cada pipeline complejo tiene spec → plan → implementación.
- Esto se documenta como requisito cultural, no solo como skill.

---

## Volumen VI — Automation

### 6.1 CI/CD Integration

Patrones concretos:

- GitHub Actions.
- GitLab CI.
- Azure DevOps.
- Jenkins.
- Argo / Airflow / Temporal / Nomad.

Para cada plataforma:

- Job examples.
- Secrets management.
- Version pinning.
- Artefact archiving.

### 6.2 Workflow Patterns

- Retry.
- Fallback.
- Parallel Fan-Out.
- Sequential Pipeline.
- Conditional Branching.
- Speculative Execution.
- Majority Voting.
- Model Cascading.
- Cost-Optimized Routing.
- Quality-Optimized Routing.
- Hybrid Routing.

---

## Volumen VII — Production

### 7.1 Cost Optimization

- Cómo elegir Apps según costo vs calidad.
- Uso de batching, caching, parallelismo controlado.
- Modelos caros vs baratos; combinaciones cascadas.

### 7.2 Observability & Debugging

- Logs estructurados.
- Métricas de latencia, error, throughput.
- Trazas de tareas.
- Herramientas para reproducir ejecuciones (input snapshots, version snapshots).

---

## Volumen VIII — Security

### 8.1 Security Model

Documento completo sobre:

- Authentication.
- Authorization.
- Secrets.
- API Keys.
- Token Rotation.
- Least Privilege.
- Sandbox / Isolation.
- Artifact Encryption.
- Temporary / Signed URLs.
- Credential precedence (local vs env vs remote).

Cada tema se trata con:

- Diagramas de flujo.
- Casos de amenaza.
- Recomendaciones de hardening.

---

## Volumen IX — Providers

### 9.1 Provider Abstraction Layer

Explicar en detalle cómo:

- OpenAI
- Anthropic
- Google
- xAI
- Fal
- ByteDance
- OpenRouter
- Tavily
- Exa
- ElevenLabs
- …

se convierten en:

```bash
belt app run namespace/app --input input.json
```

Temas:

- Normalización de auth.
- Traducción de payloads.
- Unificación de errores.
- Mapeo de streaming.
- Evolución de providers sin romper Apps.

---

## Volumen X — Optimization

### 10.1 Performance Benchmarks

Comparativas:

- FLUX vs Gemini vs SDXL vs Reve vs Seedream.
- Tiempo.
- Costo.
- VRAM equivalente.
- Calidad relativa (métricas perceptuales y/o automáticas).

### 10.2 Input Resolution Engine

Cómo el CLI decide si:

- `image` es `https://...`  
- `./image.png`  
- `~/Pictures/image.png`  
- `s3://bucket/path`  
- `gs://bucket/path`

y luego:

- Detecta MIME.
- Calcula hash.
- Realiza multipart upload.
- Sustituye automáticamente el path en el payload.

---

## Volumen XI — Troubleshooting

### 11.1 Complete Troubleshooting Matrix

No tres errores, sino unas 200–250 situaciones, clasificadas por:

- Síntoma.
- Contexto (CLI / Provider / Runtime).
- Probables causas.
- Pasos de diagnóstico.
- Soluciones.

Ejemplos:

- Tareas eternamente en `Queued`.
- Inconsistencias de versión entre Apps.
- Fallos de upload silenciosos.
- Saturación de quotas.
- Desalineación entre input y schema (campos olvidados, tipos erróneos).

---

## Volumen XII — Reference

### 12.1 AI Ecosystem Atlas

Mapa completo:

```text
Artificial Intelligence
├── Reasoning
├── Generation
├── Search
├── Simulation
├── Speech
├── Robotics
├── Agents
├── Scientific
├── Programming
├── Infrastructure
├── Publishing
├── Research
└── Automation
```

Cada App se ubica en este árbol.  
Cada categoría tiene subcapítulos con:

- Lista de Apps.
- Capabilities.
- Patrones recomendados.
- Ejemplos de pipelines.

### 12.2 Cookbook (300+ recetas)

No cinco ejemplos, sino decenas de flujos completos, por ejemplo:

```text
Create Podcast
↓
Transcribe
↓
Translate
↓
Summarize
↓
Generate Images
↓
Generate Video
↓
Publish Twitter
↓
Upload S3
↓
Notify Slack
```

Cada receta:

- Comandos `belt`.
- Esquemas de input/output.
- Consideraciones de costo.
- Puntos de observabilidad.

---

## Conclusión — La Firma de Anubis en Cada Línea

El salto que describes es claro:

- De una **skill card** a un **Manual Maestro**.
- De mostrar “dónde está el volante” a describir cada pieza del motor, el sistema de frenos, la telemetría y el circuito de carreras.

Isabella, tamv online, es la narrativa que une todo esto:  
este runtime no quiere ser otro README; quiere ser el documento que hace que un ingeniero piense:

> “No necesito abrir la documentación oficial, aquí tengo la referencia completa de cómo funciona, cómo está diseñado y cómo construir sistemas enteros sobre inference.sh.”

Este MD es el **esqueleto** de ese manual. A partir de aquí, cada volumen puede crecer en capítulos y páginas — siempre con la misma regla: cada sección debe reflejar la firmeza de Anubis Villaseñor, es decir, arquitectura clara, análisis exhaustivo y cero concesiones a la superficialidad.
