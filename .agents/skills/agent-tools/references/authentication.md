# belt-cli — Authentication, Environment & Apps Discovery
## Agent Skill Specification for inference.sh CLI

Use this skill when the agent needs to **run AI apps, discover tools, or manage the Inference Grid** via the `belt` CLI: image generation, video creation, LLMs, TTS/ASR, and more. The skill defines how to install Belt, authenticate, use API keys, and browse apps safely. [web:134][web:150]

---

## 1. Scope and Capabilities

This skill gives the agent:

- **Authentication & environment setup** for `belt`.
- **Discovery of installed apps** via `belt app list` / `belt app search`.
- **Browsing the public Grid** with `belt app store`.
- **Filtering and searching apps** by category and keyword.
- **Inspecting app schemas** (inputs/outputs) via `belt app get`.
- **Exporting catalogs to JSON** for audits and automation.

The agent should use this skill whenever it needs **procedural knowledge** about:

- How to ensure `belt` is installed and authenticated.
- How to select the right app (e.g., FLUX vs SDXL vs Gemini vs Grok).
- How to configure CI/CD and environment variables securely.

---

## 2. Authentication & Environment Setup

### 2.1 Install the CLI

Command:

```bash
curl -fsSL https://cli.inference.sh | sh
```

Behavior:

- Downloads the latest stable `belt` CLI. [web:143]
- Installs the `belt` executable.
- Adds it to `PATH` when supported.
- Prepares the environment for authenticated usage.

Agent rules:

- **Do not** attempt manual binary downloads; always use the official script.
- After install, run:

  ```bash
  belt --help
  belt --version
  ```

  to confirm that Belt is available.

### 2.2 Interactive login

Command:

```bash
belt login
```

Flow:

- Opens a browser window.
- User completes device authorization. [web:139]
- CLI receives a session token or API key.
- Credentials are stored locally.

Agent rules:

- In interactive environments (developer workstation, laptop), suggest `belt login` when the user is not authenticated.
- The agent **cannot** directly complete the browser flow; it must instruct the human to do it.

### 2.3 Verify authentication

Command:

```bash
belt me
```

Expected result:

- Account identity.
- Profile metadata.
- Org/workspace context (if applicable).
- Authentication state.

Agent rules:

- Always run `belt me` before using apps or store commands.
- If `belt me` fails with `not authenticated`, instruct the user to run `belt login` or set `INFSH_API_KEY`.

### 2.4 API keys for automation

Primary environment variable:

```bash
export INFSH_API_KEY=your-api-key
```

Behavior:

- Overrides local configuration. [web:139][web:141]
- Suitable for CI/CD and headless environments.
- Can be injected from secret stores.

Agent rules:

- Never hardcode API keys in scripts or responses.
- Refer to them generically (e.g., “your API key”).
- Recommend using secret managers (GitHub Secrets, GitLab Variables, Vault, etc.). [web:140]

Example:

```bash
INFSH_API_KEY="$INFSH_API_KEY" belt me
```

### 2.5 Updating the CLI

Commands:

```bash
belt update
# fallback
curl -fsSL https://cli.inference.sh | sh
```

Agent rules:

- Suggest `belt update` when commands behave unexpectedly or features documented online are missing locally. [web:125]
- Suggest reinstall with the bootstrap script if the CLI is corrupted or `belt` is not found.

### 2.6 Troubleshooting rules

Common issues:

- `not authenticated` → Run `belt login` or set `INFSH_API_KEY`.  
- `belt: command not found` → Reinstall CLI and fix `PATH`.  
- `API key invalid` → Verify `INFSH_API_KEY` and regenerate the key if needed.  
- Browser not opening → Use API key instead of interactive login.  
- CI fails but local works → Ensure CI injects `INFSH_API_KEY`.

Agent behavior:

- Map CLI errors to concrete remediation steps.
- Avoid guessing OS-level fixes; focus on commands and environment variables.

---

## 3. Discovering Installed Apps

### 3.1 List installed apps

Command:

```bash
belt app list
```

Typical fields:

- `id`
- `name`
- `category`
- `version`
- `status`
- `author`
- `source`
- `installed_at`

### 3.2 Detailed list

Command:

```bash
belt app list -l
```

Additional details (when available):

- `description`
- `permissions`
- `models`
- `endpoint`
- `metadata`
- `runtime`
- `tags`
- `dependencies`

Agent rules:

- Use `belt app list -l` when the user wants detailed information about local apps.
- Use plain `belt app list` for quick overviews.

### 3.3 Search installed apps

Commands:

```bash
belt app list --search "flux"
belt app search "flux"
belt app search "video"
belt app search "tts"
belt app search "sdxl"
belt app search "gemini"
```

Search targets:

- Name.
- Description.
- Category.
- Tags.
- Provider.
- Metadata.

Agent behavior:

- Map user intent (“image generation”, “TTS”, “transcription”) to appropriate keywords.
- Prefer `belt app search KEYWORD` to narrow local results quickly.
- Then call `belt app get APP_ID` for deeper inspection.

---

## 4. Browsing the Public Marketplace (Grid)

### 4.1 Basic store view

Command:

```bash
belt app store
```

Shows public apps on the Grid. [web:128][web:126]

### 4.2 Detailed store view

Command:

```bash
belt app store -l
```

Typical fields:

- `name`
- `id`
- `provider`
- `category`
- `description`
- `version`
- `featured`
- `updated`

Agent rules:

- Use `-l` when the agent needs enough detail to compare apps or explain tradeoffs.

### 4.3 Pagination

Commands:

```bash
belt app store --page 1
belt app store --page 2
belt app store --page 3
```

Agent behavior:

- If results are large, traverse pages sequentially until enough candidates are found.
- Do not assume page 1 is exhaustive.

### 4.4 Category filters

Commands:

```bash
belt app store --category image
belt app store --category video
belt app store --category audio
belt app store --category text
belt app store --category other
```

Agent rules:

- Use category filters to reduce noise.
- Example mapping:
  - “image generation” → `--category image`
  - “video generation” → `--category video`
  - “TTS / speech” → `--category audio`
  - “LLM / text tasks” → `--category text`

---

## 5. Advanced Store Search

### 5.1 Generic keyword search

Examples:

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

### 5.2 Search within a category

Examples:

```bash
belt app store search "image" --category image
belt app store search "speech" --category audio
belt app store search "llm" --category text
```

### 5.3 Extended search view

Command:

```bash
belt app store search "flux" -l
```

May include:

- Full description.
- Provider.
- Endpoint.
- Examples.
- Models.
- Tags.

Agent behavior:

1. Translate user requests to capabilities (e.g., “upscale images” → `upscaler` in image category).  
2. Use `belt app store search KEYWORD` plus `--category` when appropriate.  
3. Use extended view (`-l`) before recommending a specific app.  
4. Always inspect with `belt app get` before constructing automated calls.

---

## 6. Featured, Newest, and Popular Apps

### 6.1 Featured apps

Command:

```bash
belt app store --featured
```

Use for:

- Curated, high-trust apps.

### 6.2 Newest apps

Command:

```bash
belt app store --new
```

Use for:

- Recently published capabilities.
- Experimental features.

### 6.3 Popular reference apps

Image generation:

- `falai/flux-dev-lora` — FLUX Dev (max quality).
- `falai/flux-2-klein-lora` — FLUX Klein (fast).
- `infsh/sdxl` — SDXL.
- `google/gemini-3-pro-image-preview`.
- `xai/grok-imagine-image`.

Video:

- `google/veo-3`.
- `google/veo-3-1-fast`.
- `bytedance/seedance-2-0`.
- `bytedance/seedance-2-fast`.
- `infsh/ltx-video-2`.
- `bytedance/omnihuman-1-5`.

Audio:

- `infsh/dia-tts`.
- `infsh/kokoro-tts`.
- `infsh/fast-whisper-large-v3`.
- `infsh/diffrythm`.

Agent rules:

- Use these as **starting points** when the user does not specify any provider.
- Still inspect schemas with `belt app get` before use.

---

## 7. Inspecting App Details and Schemas

### 7.1 Human-readable details

```bash
belt app get APP_ID
```

### 7.2 JSON details

```bash
belt app get APP_ID --json
```

Expected fields:

- `metadata`
- `provider`
- `inputs`
- `outputs`
- `schemas`
- `examples`
- `pricing` (if available)
- `versions`
- `documentation`
- `models`

Agent behavior:

- Use `--json` when building tools or automated calls.
- Parse `inputs` and `outputs` to know exactly which parameters to send and what to expect back.

### 7.3 Typical input/output semantics (image apps)

Inputs:

- `prompt` (string, required).
- `negative_prompt` (optional).
- `steps` (integer).
- `cfg` (float).
- `seed` (integer).
- `width` / `height` (integers).

Outputs:

- `image` (file/URL).
- `metadata`.
- `seed`.
- `runtime`.

Agent rules:

- Respect required vs optional fields in the schema.
- Use defaults when the user does not specify values.
- Present outputs clearly in responses (e.g., link or description of the generated asset).

---

## 8. Exporting Marketplace Data

### 8.1 Export full store view

```bash
belt app store --save apps.json
```

### 8.2 Export filtered catalogs

```bash
belt app store --category image --save images.json
belt app store search flux --save flux.json
```

Post-processing with `jq` (if available):

```bash
jq '.apps'
jq '.apps[].name'
jq '.apps[] | {id, category, provider}' apps.json
jq -r '.apps[].category' apps.json | sort | uniq -c
jq -r '.apps[].provider' apps.json | sort -u
```

Agent behavior:

- Use `--save` when the user needs **catalogs** or **audit reports**.
- Suggest `jq` filters when operating in a shell context and deeper analysis is required.

---

## 9. Ecosystem Categories and Mapping

Categories:

- `image` — generation, editing, upscaling, LoRA.
- `video` — text-to-video, image-to-video, avatars.
- `audio` — TTS, STT, music, separation.
- `text` — LLMs, translation, summarization, classification.
- `other` — utilities, automation, conversion, tools. [web:136]

Agent mapping:

- “Generate images” → `image` + models like FLUX, SDXL, Gemini, Grok.  
- “Create videos” → `video` + models like Veo, Seedance, LTX.  
- “Voice / transcription / music” → `audio` + Kokoro, Whisper, Diffrythm.  
- “LLM tasks” → `text` + LLM apps.

---

## 10. Recommended AI Procedure (Meta-Rules)

When the agent uses this skill:

1. **Check CLI availability**: if relevant, confirm `belt --version` (in terminal context).
2. **Check authentication**: run `belt me` and handle `not authenticated`.
3. **For interactive users**: recommend `belt login`.
4. **For CI/automation**: recommend setting `INFSH_API_KEY` via secrets.
5. **Discover apps**: use `belt app store` + filters + search.
6. **Inspect schemas**: use `belt app get APP_ID --json` before constructing calls.
7. **Compare candidates**: do not pick the first app; examine tradeoffs.
8. **Respect security**:
   - Never print actual API keys or secrets.
   - Never instruct storing keys in code or plain text files.
9. **Use exports for audits**: `belt app store --save …` + `jq` when needed.

---

## 11. References

- Belt CLI Guide: https://inference.sh/blog/guides/belt-cli-guide [web:134]
- Apps & Grid Overview: https://inference.sh/docs/concepts/apps [web:136]
- CLI Setup: https://inference.sh/docs/extend/cli-setup [web:125]
- API Authentication: https://inference.sh/docs/api/authentication [web:139][web:141]
- Secrets Overview: https://inference.sh/docs/secrets/overview [web:140]
- Agent Skills Overview: https://inference.sh/docs/skills/overview [web:146]
