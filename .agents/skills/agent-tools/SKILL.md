---
name: agent-tools
description: "Enterprise-grade AI application runtime for inference.sh. Execute serverless AI applications—including LLMs, image generation, video synthesis, speech, search, automation, 3D generation, and social integrations—through a unified CLI without managing GPUs or infrastructure. Supports FLUX, Veo, Gemini, Claude, Grok, OpenRouter, Tavily, Exa, OmniHuman, Seedance, Rodin 3D, Twitter/X automation, and hundreds of additional applications published in the inference.sh ecosystem."
allowed-tools: Bash(belt *)
---

# inference.sh Agent Runtime
## Cloud AI App Execution via Belt CLI

`agent-tools` provides a unified interface for running AI applications in the cloud through the `belt` CLI. It is designed for image generation, video generation, LLM inference, web search, media utilities, and social automation workflows without requiring local GPU infrastructure.

---

## 1. Purpose

Use this skill when you need to:

- Run hosted AI apps from the command line.
- Generate images, videos, 3D assets, or audio.
- Call LLMs through cloud apps.
- Run search and extraction workflows.
- Automate publishing or social actions.
- Inspect app schemas, sample inputs, and task outputs.
- Integrate AI workflows into scripts, CI/CD, or agent runtimes.

### Design intent

This skill is not just a command wrapper. It is an execution layer for cloud-hosted AI capabilities, where the important variables are:

- App identity.
- Input schema.
- Version pinning.
- Task lifecycle.
- Artifact handling.
- Reproducibility.

That means the workflow should be treated as **schema-first**, **task-driven**, and **output-aware**, rather than as a simple shell shortcut.

---

## 2. Runtime Model

Inference.sh exposes AI capabilities as standardized applications that run remotely. The CLI submits structured inputs to those applications, receives task IDs when needed, and returns artifacts or URLs as outputs.

```text
User
  ↓
Belt CLI
  ↓
Auth layer
  ↓
Inference.sh runtime
  ↓
App execution
  ↓
Task orchestration
  ↓
Cloud artifacts
```

### What this buys you

- No local GPU management.
- No per-provider SDK sprawl.
- One execution style across many model families.
- Consistent task tracking.
- Portable automation across environments.

### Analytical framing

The runtime removes infrastructure complexity from the agent loop. In practice, that means the agent can focus on:
- selecting the right app,
- validating schema,
- constructing inputs,
- monitoring completion,
- and handling outputs.

This is especially valuable when workflows combine multiple modalities, such as image generation followed by captioning, or search followed by LLM synthesis.

---

## 3. Install and Authenticate

Install the CLI:

```bash
curl -fsSL https://cli.inference.sh | sh
belt login
```

### What the installer does

The installer:

- Detects your operating system and architecture.
- Downloads the appropriate binary.
- Verifies integrity.
- Places the executable in your `PATH`.

The result is a local CLI with no GPU requirement and no daemon process.

### Recommended post-install checks

```bash
belt version
belt me
```

Use these commands to confirm the CLI is installed correctly and that authentication is active.

### Authentication modes

- Interactive: `belt login`.
- Automation: `export INFSH_API_KEY=YOUR_API_KEY`.

For scripts, CI/CD, or headless execution, environment-based authentication is the preferred pattern because it is easier to rotate, audit, and inject securely.

---

## 4. Discovery Workflow

Before running an app, discover what is available and inspect the app details.

```bash
belt app store
belt app store search "flux"
belt app store --category image
belt app get google/veo-3-1-fast
belt app sample google/veo-3-1-fast --save input.json
belt app run google/veo-3-1-fast --input input.json
```

### Recommended sequence

1. Search the store.
2. Inspect the app.
3. Generate a sample input.
4. Edit only the fields you need.
5. Run the app.
6. Retrieve task results if the job is asynchronous.

### Why this matters

This sequence reduces three common failure modes:

- Wrong app selection.
- Schema mismatch.
- Overly complex input construction.

A strong operational pattern is to treat the sample payload as the authoritative contract for the app until the schema is well understood.

---

## 5. Quick Start Patterns

### Image generation

```bash
belt app run falai/flux-dev-lora --input '{"prompt": "a cat astronaut"}'
```

### Video generation

```bash
belt app run google/veo-3-1-fast --input '{"prompt": "drone over mountains"}'
```

### LLM inference

```bash
belt app run openrouter/claude-sonnet-45 --input '{"prompt": "Explain quantum computing"}'
```

### Web search

```bash
belt app run tavily/search-assistant --input '{"query": "latest AI news"}'
```

### Twitter/X automation

```bash
belt app run x/post-tweet --input '{"text": "Hello from AI!"}'
```

### 3D generation

```bash
belt app run infsh/rodin-3d-generator --input '{"prompt": "a wooden chair"}'
```

### Analysis note

These examples show the core value proposition: the same command shape works across very different capability classes. The app name determines the backend behavior; the input JSON determines the task semantics.

---

## 6. Input Strategy

Belt supports both file-based inputs and inline JSON.

### File-based input

```bash
belt app run user/app-name --input input.json
```

Use this when you want:

- Repeatable execution.
- Versionable inputs.
- Easier debugging.
- Clean automation pipelines.
- Compatibility with stored sample payloads.

### Inline JSON

```bash
belt app run falai/flux-dev-lora --input '{"prompt":"a sunset over mountains"}'
```

Best suited for:

- Quick experiments.
- Terminal-first workflows.
- One-off tests.
- Validating a prompt without creating a file.

### Version pinning

```bash
belt app run user/app-name@1.0.0 --input input.json
```

Version pinning is recommended when:

- Reproducibility matters.
- You are comparing results across runs.
- A deployment depends on a stable schema.
- You need to avoid breaking changes from upstream updates.

### Heuristic

Use pinned versions in production and unpinned names only for exploratory work.

---

## 7. Schema-First Development

The safest operational model is:

```text
Inspect app
→ generate sample
→ modify minimally
→ run
→ validate outputs
```

### Why sample-driven workflows are superior

Sample files provide:

- Required fields.
- Optional fields.
- Valid structure.
- Expected data types.
- Default values.

This is more reliable than constructing payloads from memory, especially for multimodal apps where field names and input types can vary significantly.

### Practical rule

If you are unsure about an app’s input shape, do not guess. Inspect the app and start from a sample payload.

---

## 8. Local File Uploads

The CLI supports local file paths in many fields that normally accept URLs. When a local path is provided, the CLI uploads the asset automatically.

### Examples

```bash
# Upscale a local image
belt app run falai/topaz-image-upscaler --input '{"image": "/path/to/photo.jpg", "upscale_factor": 2}'

# Image-to-video from local file
belt app run falai/wan-2-5-i2v --input '{"image": "./my-image.png", "prompt": "make it move"}'

# Avatar with local audio and image
belt app run bytedance/omnihuman-1-5 --input '{"audio": "/path/to/speech.mp3", "image": "/path/to/face.jpg"}'

# Post tweet with local media
belt app run x/post-create --input '{"text": "Check this out!", "media": "./screenshot.png"}'
```

### Supported path formats

- Absolute paths: `/home/user/images/photo.jpg`
- Relative paths: `./image.png`, `../data/video.mp4`
- Home directory paths: `~/Pictures/photo.jpg`

### Operational implications

This behavior is especially useful for asset-heavy workflows because the local filesystem can act as the staging area until execution time. That keeps scripts cleaner and reduces manual upload steps.

### Important constraint

Not every app accepts file-path substitution in the same way. The app schema still defines what each field expects, so validate the app details before assuming upload behavior.

---

## 9. Task Lifecycle

Most apps produce a task ID when execution begins.

```text
Running falai/flux-dev-lora
Task ID: abc123def456
```

### Task operations

```bash
belt task get abc123def456
belt task get abc123def456 --json
belt task get abc123def456 --save result.json
```

### Background execution

```bash
belt app run google/veo-3 --input input.json --no-wait
belt task get <task-id>
```

### When to use `--no-wait`

Use it for:

- Video generation.
- Multi-step workflows.
- High-latency model calls.
- Batch jobs.
- Automation pipelines.
- Agent workflows that continue later.

### Analytical note

Task IDs are the boundary between submission and retrieval. In longer workflows, the task ID becomes the durable reference for polling, archiving, retries, and audit logging.

---

## 10. Output Handling

The CLI returns app outputs directly. File-based outputs commonly arrive as URLs or downloadable artifacts.

### Example

```json
{
  "images": [
    {
      "url": "https://cloud.inference.sh/...",
      "content_type": "image/png"
    }
  ]
}
```

### Common output types

- Images.
- Video files.
- Audio files.
- Structured JSON.
- Metadata such as task ID, runtime, seed, or model information.

### Recommended practice

Save outputs when you need:

- Auditability.
- Reproducibility.
- Downstream processing.
- Human review.
- Artifact archival.
- Comparison across runs.

### Practical interpretation

Outputs are not just end products; they are handoff artifacts. In a pipeline, they can feed into later apps, reporting systems, or external storage layers.

---

## 11. Command Map

| Task | Command |
|---|---|
| Browse the app store | `belt app store` |
| Search apps | `belt app store search "flux"` |
| Filter by category | `belt app store --category image` |
| Get app details | `belt app get google/veo-3-1-fast` |
| Generate sample input | `belt app sample google/veo-3-1-fast --save input.json` |
| Run app | `belt app run google/veo-3-1-fast --input input.json` |
| Run without waiting | `belt app run <app> --input input.json --no-wait` |
| Check task status | `belt task get <task-id>` |

This map should be thought of as the minimal operational surface of the runtime.

---

## 12. Capability Matrix

| Category | Examples | Typical use cases |
|---|---|---|
| Image | FLUX, Gemini 3 Pro, Grok Imagine, Seedream 4.5, Reve, Topaz Upscaler | Concept art, marketing, illustration, restoration, upscaling |
| Video | Veo 3.1, Seedance 1.5, Wan 2.5, OmniHuman, Fabric, HunyuanVideo Foley | Cinematic generation, avatars, image-to-video, lipsync |
| LLMs | Claude Opus/Sonnet/Haiku, Gemini 3 Pro, Kimi K2, GLM-4, OpenRouter models | Coding, summarization, reasoning, translation, structured generation |
| Search | Tavily Search, Tavily Extract, Exa Search, Exa Answer, Exa Extract | Semantic search, extraction, research, citations |
| 3D | Rodin 3D Generator | Games, CAD concepts, XR, digital twins |
| Twitter/X | post-tweet, post-create, dm-send, user-follow, post-like, post-retweet | Publishing, engagement, account automation |
| Utilities | Media merger, caption videos, image stitching, audio extraction | Pipeline support, preprocessing, postprocessing |

### Structural insight

The capability matrix is best understood as a specialization map. Each category corresponds to a different operational profile: generation, transformation, reasoning, retrieval, or automation.

---

## 13. Local Development and Reuse

Use sample inputs and version pinning to keep workflows reproducible.

### Version pinning

```bash
belt app run user/app-name@1.0.0 --input input.json
```

Why pin versions:

- Stable schemas.
- Deterministic behavior.
- Repeatable automation.
- Safer production execution.
- Easier rollback.

### Sample-driven development

```bash
belt app get falai/flux-dev-lora
belt app sample falai/flux-dev-lora --save input.json
belt app run falai/flux-dev-lora --input input.json
```

This is the safest path when building reusable scripts or agent pipelines.

### Analytical note

Version pinning addresses temporal drift, while sample payloads address structural drift. Together they form the core reproducibility model.

---

## 14. Error Handling

| Error | Cause | Solution |
|---|---|---|
| `invalid input` | Schema mismatch | Check `belt app get` and the sample input. |
| `app not found` | Wrong namespace or app name | Use `belt app store search`. |
| `quota exceeded` | No remaining credits or usage limit reached | Check account balance or limits. |
| `task not completing` | Long-running job or transient issue | Use `belt task get` and retry if needed. |

### Recovery sequence

1. Verify the app name.
2. Inspect the schema.
3. Generate a sample input.
4. Reduce the payload to a minimal test.
5. Retry with a pinned version if the schema changed.

### Operational guidance

When failure is ambiguous, treat it as a schema or identity issue first, not as a runtime failure. That is usually the fastest way to isolate the problem.

---

## 15. Related Skills

```bash
# Image generation
npx skills add inference-sh/skills@ai-image-generation

# Video generation
npx skills add inference-sh/skills@ai-video-generation

# LLMs
npx skills add inference-sh/skills@llm-models

# Web search
npx skills add inference-sh/skills@web-search

# AI avatars and lipsync
npx skills add inference-sh/skills@ai-avatar-video

# Twitter/X automation
npx skills add inference-sh/skills@twitter-automation

# Model-specific
npx skills add inference-sh/skills@flux-image
npx skills add inference-sh/skills@google-veo

# Utilities
npx skills add inference-sh/skills@image-upscaling
npx skills add inference-sh/skills@background-removal
```

This modular approach keeps workflows focused while still allowing specialized capability bundles when needed.

---

## 16. Reference Files

- Authentication & Setup
- Discovering Apps
- Running Apps
- CLI Reference

These files should be treated as the canonical internal references for onboarding, troubleshooting, and advanced usage.

---

## 17. Documentation

- Agent Skills Overview — Open standard for AI capabilities.
- Getting Started — Platform introduction.
- What is inference.sh? — Product overview.
- Apps Overview — App ecosystem fundamentals.
- CLI Setup — Install and authenticate the CLI.
- Workflows vs Agents — Guidance on orchestration strategy.
- Why Agent Runtimes Matter — Runtime architecture rationale.

---

## 18. Recommended Operating Pattern

```text
Install CLI
→ Authenticate
→ Discover app
→ Inspect schema
→ Generate sample input
→ Run app
→ Track task
→ Save output
```

This sequence is the most robust default because it separates discovery, validation, execution, and retention into distinct steps.

---

## 19. Minimal Command Set

```bash
curl -fsSL https://cli.inference.sh | sh
belt login
belt me
belt app store
belt app get <app>
belt app sample <app> --save input.json
belt app run <app> --input input.json
belt task get <task-id>
belt app run <app> --input input.json --no-wait
```

---

## 20. Final Operating Principle

Treat Belt as a cloud execution runtime, not as a thin wrapper around APIs. Its real value is in standardizing heterogeneous AI capabilities into a repeatable operational model that supports agents, automation, and production-grade workflows with minimal infrastructure overhead.
