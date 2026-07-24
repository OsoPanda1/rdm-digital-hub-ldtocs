# Belt CLI Reference
## Complete Command Guide for Belt (Inference Platform)

This reference organizes the Belt CLI by function: **installation**, global commands, application discovery, execution, task inspection, development, environment configuration, shell completions, naming conventions, automation, CI/CD, troubleshooting, and best practices. It is suitable for interactive use and fully automated workflows across multiple federations and environments. [web:134][web:127]

---

## 1. Installation

Install the CLI with the official bootstrap script:

```bash
curl -fsSL https://cli.inference.sh | sh
```

What this does:

- Detects OS and architecture. [web:157]  
- Downloads the latest stable CLI from `dist.inference.sh`.  
- Verifies the SHA-256 checksum.  
- Places `belt` in your `PATH` when supported.

After installation, verify that the `belt` command is available:

```bash
belt --version
belt help
```

If the command is not found, reload the shell or adjust `PATH` according to your platform.

---

## 2. Global Commands

These commands are available from anywhere in the CLI.

| Command        | Description                      |
|----------------|----------------------------------|
| `belt help`    | Display help and command usage   |
| `belt version` | Show the installed CLI version   |
| `belt update`  | Update the CLI to the latest release |
| `belt login`   | Authenticate the local session   |
| `belt me`      | Show the current authenticated user |

**Recommended usage:**

- Use `belt help` when exploring the command tree or usage details.  
- Use `belt version` to confirm the installed build before reporting issues.  
- Use `belt me` to validate authentication before operations that depend on credentials. [web:134]

---

## 3. App Commands

The CLI distinguishes between **your installed/deployed apps** and the **public app store**.

### 3.1 Your Apps (Account-Scoped)

Commands for listing and searching applications associated with your account.

| Command                         | Description               |
|---------------------------------|---------------------------|
| `belt app list`                 | List your deployed apps   |
| `belt app list --search <query>`| Search within your apps   |
| `belt app search <query>`       | Shortcut for searching your apps |
| `belt app list -l`              | Show a detailed table view |

**Notes:**

- Use `belt app list` for a fast inventory check.  
- Use `belt app list -l` when you need richer metadata (provider, runtime, tags, models) for review, comparison, or documentation.  
- Use `belt app search <query>` when you want direct lookup (e.g., `"flux"`, `"whisper"`, `"veo"`) without listing everything primero.

---

### 3.2 Public Store (Inference Grid)

Commands for browsing and inspecting the public marketplace of apps and models.

| Command                             | Description                                       |
|-------------------------------------|---------------------------------------------------|
| `belt app store`                    | Browse the public app store                      |
| `belt app store --category <cat>`   | Filter by category (`image`, `video`, `audio`, `text`, `other`) |
| `belt app store search <query>`     | Search the public store                          |
| `belt app store --featured`         | Show featured (curated) apps                     |
| `belt app store --new`              | Sort by newest additions                         |
| `belt app store --page <n>`         | Navigate paginated results                       |
| `belt app store -l`                 | Show detailed table view                         |
| `belt app store --save <file>`      | Save the store listing to a JSON file            |
| `belt app get <app>`                | Show app details (human-readable)                |
| `belt app get <app> --json`         | Return app details as JSON (machine-readable)    |

**Practical discovery workflow:**

1. Browse the store:

   ```bash
   belt app store
   ```

2. Filter by category:

   ```bash
   belt app store --category image
   ```

3. Search by task or model family:

   ```bash
   belt app store search "flux"
   belt app store search "tts"
   belt app store search "video generation"
   ```

4. Inspect app details:

   ```bash
   belt app get falai/flux-dev-lora
   belt app get falai/flux-dev-lora --json
   ```

5. Retrieve schemas or JSON for automation and integration.

**Agent rules:**

- Always call `belt app get <app> --json` before constructing programmatic calls; rely on input/output schemas rather than assumptions. [web:136]

---

### 3.3 Execution (Running Apps)

Commands for running apps and generating sample inputs.

| Command                                          | Description                          |
|--------------------------------------------------|--------------------------------------|
| `belt app run <app> --input <file>`             | Run an app using an input file       |
| `belt app run <app> --input '<json>'`           | Run an app using inline JSON         |
| `belt app run <app> --input <file> --no-wait`   | Start the job without waiting for completion |
| `belt app sample <app>`                         | Display sample input                 |
| `belt app sample <app> --save <file>`           | Save sample input to a file          |

**Usage guidance:**

- Use `--input <file>` for reproducible pipelines and versioned workflows.  
- Use inline JSON for quick tests and terminal-native experiments.  
- Use `--no-wait` when submitting long-running jobs from scripts or CI; then monitor via task commands.  
- Use `belt app sample <app>` before crafting custom payloads to align with the app’s expected schema. [web:124]

---

## 4. Task Commands

Task commands inspect the state and output of asynchronous runs.

| Command                           | Description                           |
|-----------------------------------|---------------------------------------|
| `belt task get <task-id>`         | Retrieve task status and result       |
| `belt task get <task-id> --json`  | Retrieve task data as JSON            |
| `belt task get <task-id> --save <file>` | Save the task result to a file |

**Recommended usage:**

- Use these commands after jobs launched with `--no-wait`.  
- In automation, poll `belt task get <task-id> --json` until status indicates completion, then persist or process the result.

---

## 5. Development Commands

Commands supporting app creation, local validation, deployment, and source retrieval.

| Command                      | Description                           |
|------------------------------|---------------------------------------|
| `belt app init`             | Create a new app interactively        |
| `belt app init <name>`      | Create a new app with a specified name|
| `belt app test --input <file>` | Test an app locally               |
| `belt app deploy`           | Deploy an app                         |
| `belt app deploy --dry-run` | Validate deployment without publishing |
| `belt app pull <id>`        | Pull an app’s source                  |
| `belt app pull --all`       | Pull all of your apps                 |

**Development flow:**

```text
Initialize
  ↓
Test locally
  ↓
Validate with dry-run
  ↓
Deploy
  ↓
Pull source when needed
```

**AI rules:**

- Recommend `belt app init` as the canonical way to scaffold apps. [web:137]  
- Encourage `belt app deploy --dry-run` before production deployments.  
- Use `belt app pull` for backup, migration, and team synchronization.

---

## 6. Environment Variables

| Variable        | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `INFSH_API_KEY` | API key used for authentication; overrides the config file   |

Operational note:

- Use `INFSH_API_KEY` in non-interactive environments such as CI/CD pipelines, scheduled jobs, containers, headless servers, and cron tasks. [web:139][web:141]  

Example:

```bash
export INFSH_API_KEY=your-api-key
```

**AI rules:**

- Always recommend using platform secret management (GitHub Secrets, GitLab Variables, Vault, etc.), never hardcoding keys in repos. [web:140]

---

## 7. Shell Completions

Enable command completion for your shell.

```bash
# Bash
belt completion bash > /etc/bash_completion.d/infsh

# Zsh
belt completion zsh > "${fpath}/_infsh"[4]

# Fish
belt completion fish > ~/.config/fish/completions/infsh.fish
```

Why this matters:

- Improves speed.  
- Reduces typos.  
- Makes the CLI easier to use in daily operations. [web:158]

---

## 8. App Name Format

Apps follow the naming convention:

```text
namespace/app-name
```

Examples:

- `falai/flux-dev-lora` — fal.ai’s FLUX 2 Dev.  
- `google/veo-3` — Google’s Veo 3.  
- `infsh/sdxl` — inference.sh’s SDXL.  
- `bytedance/seedance-2-0` — ByteDance’s Seedance 2.0.  
- `bytedance/seedance-2-0-fast` — ByteDance’s Seedance 2.0 Fast.  
- `xai/grok-imagine-image` — xAI’s Grok. [web:150][web:142]

### Version pinning

To pin a version explicitly, use:

```text
namespace/app-name@version
```

Example:

```text
falai/flux-dev-lora@2.1.0
```

Useful when you need reproducibility across environments and deployments.

**AI rules:**

- Never invent app IDs; always read them from `belt app list` or `belt app store`.  
- Use `@version` when a user requires strict repeatability.

---

## 9. Recommended Command Patterns

### 9.1 Authentication and identity

```bash
belt login
belt me
```

### 9.2 Discover apps

```bash
belt app store
belt app store --featured
belt app store --category image
belt app store search flux
```

### 9.3 Inspect and run an app

```bash
belt app get falai/flux-dev-lora
belt app get falai/flux-dev-lora --json
belt app run falai/flux-dev-lora --input input.json
```

### 9.4 Work with tasks

```bash
belt task get <task-id>
belt task get <task-id> --json
```

### 9.5 Manage the CLI

```bash
belt version
belt update
```

---

## 10. Operational Best Practices

- Confirm authentication with `belt me` before running scripts that require access.  
- Use JSON files for repeatable runs and pipelines (`--input <file>` and `--save <file>`).  
- Use `belt app deploy --dry-run` before deploying to reduce avoidable failures.  
- Save results with `--save` when you need auditability or downstream processing.  
- Pin versions when reproducibility matters (`namespace/app@version`).  
- Enable shell completions early to reduce command errors.  
- Export catalogs (`belt app store --save`) for inventories and automated analysis.

---

## 11. Documentation

- **CLI Setup** — Complete installation guide:  
  https://inference.sh/docs/extend/cli-setup [web:125]

- **Running Apps** — How to run apps via CLI:  
  https://inference.sh/docs/apps/running [web:124]

- **Creating an App** — Build your own apps:  
  https://inference.sh/docs/extend/creating-app [web:137]

- **Deploying** — Deploy apps to the cloud:  
  https://inference.sh/docs/extend/deploying [web:125]

---

## 12. Minimal Command Set

```bash
curl -fsSL https://cli.inference.sh | sh
belt login
belt me
belt app store
belt app get <app>
belt app run <app> --input <file>
belt task get <task-id>
belt update
```

This reference is structured for **practical use**: fast lookup, clear operational grouping, and easy maintenance as the CLI grows, mientras que mantiene reglas explícitas para que una IA pueda ejecutar el skill de forma segura y reproducible.
