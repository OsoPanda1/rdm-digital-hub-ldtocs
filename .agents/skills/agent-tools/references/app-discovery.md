# Belt Apps Discovery & Marketplace
## Professional Skill Specification (SKILL.md)

This skill describes how an AI agent should **discover, explore, filter, compare, and export apps** using the `belt` CLI against the Inference Grid marketplace. It is designed for agents, admins, and DevOps teams managing large catalogs of AI applications. [web:127][web:128][web:136]

---

## 1. Purpose and Scope

**Goal.**  
Give the AI a structured way to:

- List and search installed apps.
- Browse the public marketplace.
- Filter by categories and keywords.
- Inspect detailed schemas (inputs/outputs).
- Export catalogs to JSON.
- Use metadata for auditing, automation, and tool selection.

**Scope.**

- CLI interface: `belt` commands.
- Resource: Inference Grid app store (public + installed grid). [web:126][web:124]
- Output: Human-readable tables + JSON suitable for programmatic use.

---

## 2. Core Commands Overview

The AI must use this canonical set of commands:

- `belt app list` — discover installed/local apps.
- `belt app search` — search within installed apps.
- `belt app store` — browse public marketplace.
- `belt app store search` — search apps in marketplace.
- `belt app store --category …` — filter by category.
- `belt app store --featured` — show curated apps.
- `belt app store --new` — show newest apps.
- `belt app store --save file.json` — export marketplace snapshot.
- `belt app get APP_ID` — get app details.
- `belt app get APP_ID --json` — get app details as JSON.

The AI should **never guess app IDs**; it must always search first and then use the exact ID from results. [web:134][web:135]

---

## 3. Discovering Installed Apps

### 3.1 Basic listing

```bash
belt app list
```

**Expected fields:**

- `id` — unique app ID.
- `name` — human‑friendly name.
- `category` — image / video / audio / text / other.
- `version` — current version.
- `status` — installed, active, disabled.
- `author` — provider or owner.
- `source` — local / grid / private.
- `installed_at` — installation date/time.

### 3.2 Detailed view

```bash
belt app list -l
```

**Extended fields (when available):**

- `description` — full description.
- `permissions` — required scopes.
- `models` — underlying model(s).
- `endpoint` — internal route being called.
- `metadata` — arbitrary extra info.
- `runtime` — python / node / container type.
- `tags` — capability tags (e.g. `flux`, `sdxl`, `tts`).
- `dependencies` — libs or services required.

### 3.3 Searching installed apps

```bash
belt app list --search "flux"
belt app search "flux"
belt app search "video"
belt app search "tts"
belt app search "sdxl"
belt app search "gemini"
```

**Search targets:**

- Name.
- Description.
- Category.
- Tags.
- Provider.
- Metadata.

**AI method:**  

1. Use `belt app list --search KEYWORD` for rough discovery.  
2. If needed, repeat with different keywords (`flux`, `sdxl`, `whisper`, `tts`).  
3. For critical selection, switch to `belt app get APP_ID` for schema‑level inspection.

---

## 4. Browsing the Public Marketplace

### 4.1 Basic marketplace view

```bash
belt app store
```

Shows a table of available apps on the Grid. [web:128][web:126]

### 4.2 Detailed marketplace view

```bash
belt app store -l
```

**Typical fields:**

- `name` — app name.
- `id` — unique identifier.
- `provider` — author or organization.
- `category` — image / video / audio / text / other.
- `description` — summary of capabilities.
- `version` — app version.
- `featured` — boolean flag for curated apps.
- `updated` — last update timestamp.

**AI method:**  

- Use this view when the user asks for a **quick catalog** or overview of available apps in a domain.

---

## 5. Pagination and large catalogs

```bash
belt app store --page 1
belt app store --page 2
belt app store --page 3
```

**AI rules:**

- When results are large or truncated, iterate through pages sequentially until enough candidates are found.
- For each page, the AI can optionally export results (see Section 9).

---

## 6. Category Filtering

### 6.1 Standard categories

```bash
belt app store --category image
belt app store --category video
belt app store --category audio
belt app store --category text
belt app store --category other
```

**AI method:**

- If the user request is domain‑specific (“find TTS”, “video generator”), start with the appropriate category to reduce search space.
- Combine with search keywords (Section 7) for sharper results.

---

## 7. Advanced Search in Marketplace

### 7.1 Generic keyword search

```bash
belt app store search "flux"
belt app store search "lora"
belt app store search "video generation"
belt app store search "stable diffusion"
belt app store search "whisper"
belt app store search "tts"
belt app store search "music"
belt app store search "upscaler"
belt app store search "avatar"
belt app store search "gemini"
belt app store search "grok"
```

### 7.2 Search within a category

```bash
belt app store search "image" --category image
belt app store search "speech" --category audio
belt app store search "llm" --category text
```

### 7.3 Extended search view

```bash
belt app store search "flux" -l
```

In extended view, the AI may see:

- Full description.
- Provider.
- Endpoint.
- Examples.
- Models.
- Tags.

**AI method:**

1. Map user intent to keywords (e.g. “generate images” → `image`, `flux`, `sdxl`).  
2. Use `belt app store search KEYWORD` and refine with `--category`.  
3. When multiple candidates exist, inspect details with `belt app get APP_ID`.  
4. Prefer `-l` when the user wants reasoning or comparison between apps.

---

## 8. Featured and Newest Apps

### 8.1 Featured (curated) apps

```bash
belt app store --featured
```

### 8.2 Newest apps first

```bash
belt app store --new
```

**AI method:**

- Use `--featured` when the user wants **trusted / recommended** apps.
- Use `--new` when the user wants the **latest capabilities** or experimental features.

---

## 9. Exporting Marketplace Data

### 9.1 Export full store view

```bash
belt app store --save apps.json
```

### 9.2 Export filtered views

```bash
belt app store --category image --save images.json
belt app store search flux --save flux.json
```

### 9.3 Post‑processing with `jq`

```bash
jq .
jq '.apps'
jq '.apps[].name'
jq '.apps[].provider'
jq '.apps[] | {id, category, provider}' apps.json
jq -r '.apps[].category' apps.json | sort | uniq -c
jq -r '.apps[].provider' apps.json | sort -u
```

**AI method:**

- Use `--save` when the user requests **catalogs**, **audits**, or **automation**.
- Suggest `jq` filters for advanced analysis when working in terminal contexts.

---

## 10. App Details and Schemas

### 10.1 Human‑readable details

```bash
belt app get falai/flux-dev-lora
```

### 10.2 JSON details

```bash
belt app get falai/flux-dev-lora --json
```

**Expected content:**

- `metadata` — general info.
- `provider` — owner.
- `inputs` — input schema.
- `outputs` — output schema.
- `schemas` — full validation structure.
- `examples` — sample calls.
- `pricing` — if available. [web:134]
- `versions` — version history.
- `documentation` — links or embedded docs.
- `models` — underlying models.

**AI rule:**  

- Always use `--json` when the output will be consumed programmatically or by other tools.
- Use the schema to construct **safe, explicit tool calls**.

---

## 11. Input / Output Schema Semantics

Based on the app concept and docs: [web:136]

### 11.1 Typical image input fields

- `prompt` (string, required) — description of the desired image.
- `negative_prompt` (string, optional) — things to avoid.
- `steps` (integer, optional) — number of inference steps.
- `cfg` (float, optional) — guidance scale.
- `seed` (integer, optional) — reproducibility.
- `width` (integer, optional) — image width.
- `height` (integer, optional) — image height.

### 11.2 Typical image output fields

- `image` — file or URL.
- `metadata` — generation metadata.
- `seed` — final seed used.
- `runtime` — execution time.

**AI method:**

- Read input schema before constructing requests.
- Respect required vs optional fields.
- Prefer default values when not specified by user.
- Use output schema to parse results and present them clearly.

---

## 12. Popular Applications (Reference)

### 12.1 Image generation

- `falai/flux-dev-lora` — FLUX Dev (maximum quality).
- `falai/flux-2-klein-lora` — FLUX Klein (ultra fast).
- `infsh/sdxl` — Stable Diffusion XL (general use).
- `google/gemini-3-pro-image-preview` — Gemini image generation.
- `xai/grok-imagine-image` — Grok creative image generation.

### 12.2 Video generation

- `google/veo-3`.
- `google/veo-3-1-fast`.
- `bytedance/seedance-2-0`.
- `bytedance/seedance-2-fast`.
- `infsh/ltx-video-2`.
- `bytedance/omnihuman-1-5`.

### 12.3 Audio (TTS, ASR, music)

- `infsh/dia-tts` — conversational TTS.
- `infsh/kokoro-tts` — TTS.
- `infsh/fast-whisper-large-v3` — transcription.
- `infsh/diffrythm` — music generation.

**AI method:**

- When the user does not specify a particular provider, start from these apps and compare capabilities, pricing and schemas.

---

## 13. Typical Discovery Workflow (AI Procedure)

The AI should follow this decision flow:

1. **Marketplace overview**

   ```bash
   belt app store
   ```

2. **Filter by category** (image, video, audio, text):

   ```bash
   belt app store --category image
   ```

3. **Search by capability keyword**:

   ```bash
   belt app store search "flux" --category image
   ```

4. **Inspect candidate details**:

   ```bash
   belt app get falai/flux-dev-lora --json
   ```

5. **Compare alternatives** (e.g., FLUX vs SDXL vs Gemini vs Grok).

6. **Export catalog** (optional):

   ```bash
   belt app store search "flux" --save flux.json
   ```

7. **Integrate chosen apps** into versioned workflows or agents.

---

## 14. Power User Patterns

### 14.1 Find all FLUX models

```bash
belt app store search flux
```

### 14.2 Find all TTS apps

```bash
belt app store search tts
```

### 14.3 Find transcription apps

```bash
belt app store search whisper
```

### 14.4 Find experimental apps

```bash
belt app store search experimental
```

---

## 15. Best Practices for AI Agents

- **Always search first.** Never hard‑code or guess app IDs. [web:135]
- **Inspect schema before running.** Use `belt app get APP_ID --json`.
- **Compare models.** Do not select the first result; evaluate alternatives.
- **Export catalogs for auditability.** Use `--save` for reproducible selection.
- **Stay up to date.** Periodically run `belt app store --new` and `belt update`. [web:134]

---

## 16. Automation and CLI Pipelines

Example pipelines:

```bash
# Export full marketplace and filter image apps
belt app store --save apps.json && \
jq '.apps[] | select(.category=="image")' apps.json

# Count apps per category
jq -r '.apps[].category' apps.json | sort | uniq -c

# List unique providers
jq -r '.apps[].provider' apps.json | sort -u
```

The AI can propose or execute such pipelines when operating in a shell context to support audits and reports.

---

## 17. Ecosystem Categories

| Category | Use cases |
|---------|-----------|
| image   | generation, editing, upscaling, LoRA |
| video   | text‑to‑video, image‑to‑video, avatars |
| audio   | TTS, STT, music, separation |
| text    | LLMs, translation, summarization, classification |
| other   | utilities, automation, conversion, tools |

---

## 18. Recommended Strategy (for AI and humans)

1. Explore the marketplace (`belt app store`).
2. Filter by relevant category.
3. Search by task keywords.
4. Inspect detailed schemas.
5. Compare multiple apps.
6. Export catalogs for documentation and automation.
7. Integrate selected apps into reproducible, versioned flows.

---

## 19. Related Documentation

- Browsing the Grid: https://inference.sh/docs/apps/browsing-grid [web:124]
- Apps Overview: https://inference.sh/docs/apps/overview [web:136]
- Running Apps: https://inference.sh/docs/apps/running [web:134]
- Belt CLI Guide: https://inference.sh/blog/guides/belt-cli-guide [web:134]

---
