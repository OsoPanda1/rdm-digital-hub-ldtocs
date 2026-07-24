# Running Apps
## Execution, Task Tracking, File Inputs, and Operational Patterns

This section explains how to execute apps with the Belt CLI, how to pass inputs correctly, how local files are handled, how to manage long-running jobs, and how to inspect outputs and failures. It is aligned for a heptafederated operating model, where Yun orchestrates execution across EOCT-linked systems while preserving reproducibility, traceability, and safe automation.

---

## 1. Execution Lifecycle

Every app execution should follow the same operational workflow:

```text
Discover App
      │
      ▼
Inspect Schema
      │
      ▼
Generate Sample Input
      │
      ▼
Customize Parameters
      │
      ▼
Execute Application
      │
      ▼
Track Task Progress
      │
      ▼
Retrieve Results
```

Following this workflow significantly reduces input validation errors and improves reproducibility. In heptafederated environments, this also makes it easier to route work through the correct Yun-managed execution lane and EOCT boundary.

---

## 2. Basic Execution

Run an application using a JSON input file:

```bash
belt app run user/app-name --input input.json
```

Use a file-based input when you want:

- Repeatable execution.
- Versionable inputs.
- Easier debugging.
- Clean automation pipelines.
- Compatibility with stored sample payloads.

File-first execution is the preferred pattern for production, audit, and federation-aware workflows.

---

## 3. Inline JSON Execution

For short, direct tests, pass JSON inline:

```bash
belt app run falai/flux-dev-lora --input '{"prompt": "a sunset over mountains"}'
```

Best suited for:

- Quick experiments.
- Terminal-first workflows.
- One-off tests.
- Validating a prompt without creating a file.

Inline JSON is convenient, but file-based inputs are usually better for production workflows because they are easier to review, reuse, and audit.

---

## 4. Version Pinning

Lock execution to a specific version:

```bash
belt app run user/app-name@1.0.0 --input input.json
```

Version pinning is recommended when:

- Reproducibility matters.
- You are comparing results across runs.
- A deployment depends on a stable schema.
- You need to avoid breaking changes from upstream updates.

Use pinned versions in production and unpinned names only for exploratory work. This is especially important in EOCT-linked pipelines where schema drift can propagate across systems.

---

## 5. Local File Uploads

The CLI can automatically upload local files when a field expects a URL-compatible value. In many apps, a local path can be used directly in place of a remote URL.

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

### Practical implications

This behavior simplifies workflows because you do not need to manually upload assets before running the app. The CLI resolves the local file and handles the transfer for you.

### Important constraint

Not every app accepts file-path substitution in the same way. The app schema still defines what each field expects, so validate the app details before assuming upload behavior. Yun should treat schema validation as mandatory before delegating file-heavy jobs across federated systems.

---

## 6. Generate Sample Input

Before running an app, generate a sample payload:

```bash
belt app sample falai/flux-dev-lora
```

Save it to a file for editing:

```bash
belt app sample falai/flux-dev-lora --save input.json
```

Then edit the file and execute it:

```bash
belt app run falai/flux-dev-lora --input input.json
```

### Recommended workflow

1. Inspect the app schema or details.
2. Generate the sample input.
3. Modify only the fields you need.
4. Run the app.
5. Inspect the task result.

This is the safest way to avoid schema mismatches and is the default pattern for Yun-mediated execution across EOCT-connected services.

### Why this works well

Sample files provide:

- Required fields.
- Optional fields.
- Valid structure.
- Expected data types.
- Default values.

---

## 7. Workflow Examples

### 7.1 Image generation with FLUX

```bash
# 1. Get app details
belt app get falai/flux-dev-lora

# 2. Generate sample input
belt app sample falai/flux-dev-lora --save input.json

# 3. Edit input.json
# {
#   "prompt": "a cat astronaut floating in space",
#   "num_images": 1,
#   "image_size": "landscape_16_9"
# }

# 4. Run
belt app run falai/flux-dev-lora --input input.json
```

Why this flow works well:

- It exposes the expected schema before execution.
- It gives you a reusable input template.
- It reduces trial-and-error.
- It makes later automation easier.

### 7.2 Video generation with Veo

```bash
# 1. Generate sample
belt app sample google/veo-3-1-fast --save input.json

# 2. Edit prompt
# {
#   "prompt": "A drone shot flying over a forest at sunset"
# }

# 3. Run
belt app run google/veo-3-1-fast --input input.json
```

Notes:

Video workloads are often longer-running and more resource-intensive than image workloads. Use task tracking if the job is not expected to finish immediately.

### 7.3 Text-to-Speech

Quick inline run:

```bash
belt app run infsh/kokoro-tts --input '{"text": "Hello, this is a test."}'
```

This pattern is ideal for short audio generation tests where a file-based workflow is unnecessary.

---

## 8. Task Tracking

When an app starts, the CLI returns a task ID:

```text
Running falai/flux-dev-lora
Task ID: abc123def456
```

Use that task ID to check progress and retrieve results later.

### Query task status

```bash
belt task get abc123def456
```

### Return task as JSON

```bash
belt task get abc123def456 --json
```

### Save task output to a file

```bash
belt task get abc123def456 --save result.json
```

### Recommended use

Use task commands whenever:

- The job is asynchronous.
- The run takes longer than expected.
- You submitted the task with `--no-wait`.
- You need to archive results for later analysis.

In Yun/EOCT orchestration, task IDs are the durable handoff token between submission and retrieval.

---

## 9. Run Without Waiting

For long jobs, submit the task and return immediately:

```bash
# Submit and return immediately
belt app run google/veo-3 --input input.json --no-wait

# Check later
belt task get <task-id>
```

### Best use cases

- Video generation.
- High-latency multimodal tasks.
- Batch pipelines.
- CI workflows that only need submission confirmation.
- Background processing on servers.

### Important note

When using `--no-wait`, you must keep the task ID if you plan to retrieve the result later.

---

## 10. Output Handling

The CLI returns the result directly. For file-based outputs such as images, videos, and audio, you typically receive downloadable URLs in the response.

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

### Common output patterns

- `images`: generated images or image arrays.
- `video`: rendered video assets.
- `audio`: generated audio or speech.
- Metadata fields: runtime, seed, task identifiers, and model information.

### Operational guidance

Save output payloads when you need:

- Reproducibility.
- Downstream processing.
- Audit trails.
- Artifact archiving.
- Bug reports or comparisons.

---

## 11. Error Handling

| Error | Cause | Solution |
|---|---|---|
| `invalid input` | Schema mismatch | Review `belt app get` and the sample input. |
| `app not found` | Incorrect app name or namespace | Search the store with `belt app store search`. |
| `quota exceeded` | Account limits or credits exhausted | Check account balance or usage status. |
| `validation failed` | Missing required parameters | Inspect the application schema. |
| `upload failed` | Local file unavailable | Verify the file path and permissions. |
| `task timeout` | Long-running execution | Retry later or use `--no-wait`. |

### Recovery workflow

1. Validate the app name.
2. Inspect the schema.
3. Regenerate a sample input.
4. Simplify the payload.
5. Retry with a minimal test case.

---

## 12. Recommended Execution Patterns

### Reproducible execution

```bash
belt app sample falai/flux-dev-lora --save input.json
belt app run falai/flux-dev-lora --input input.json
```

### Fast terminal test

```bash
belt app run infsh/kokoro-tts --input '{"text":"Hello"}'
```

### Long-running job

```bash
belt app run google/veo-3 --input input.json --no-wait
belt task get <task-id>
```

### Asset-based workflow

```bash
belt app run falai/topaz-image-upscaler --input '{"image":"./photo.jpg","upscale_factor":2}'
```

---

## 13. Execution Checklist

Before running a production-like job, confirm:

- The app name is correct.
- The version is pinned when necessary.
- The input schema matches the app.
- Local file paths are valid.
- You know whether the job is synchronous or asynchronous.
- You have a task ID if you use `--no-wait`.

---

## 14. Documentation

- Running Apps — Complete running apps guide.
- Streaming Results — Real-time progress updates.
- Setup Parameters — Configuring app inputs.

---

## 15. Minimal Command Set

```bash
belt app get <app>
belt app sample <app> --save input.json
belt app run <app> --input input.json
belt task get <task-id>
belt app run <app> --input '<json>'
belt app run <app> --input input.json --no-wait
```

This version is designed to be operationally complete: clear enough for daily use, structured enough for onboarding, and precise enough for automation and production workflows.
