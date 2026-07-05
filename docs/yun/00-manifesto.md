# YUN Constitution: The 8 Immutable Principles

> "These principles are not aspirational guidelines—they are enforced constraints. Any system, service, or contribution that violates these principles must be remediated before reaching production."

---

## Principle 1: Truth as Service

**Summary:** Every data mutation must be traceable to a verifiable source; every claim must be attributable to evidence.

### Implementation Guidance

- All database writes must include `created_by`, `source_system`, and `correlation_id` metadata fields. No silent writes.
- Every external API call must log request/response payloads (redacted for PII) with structured logging via `console.log(JSON.stringify({ level, message, ... }))`.
- Supabase Row Level Security (RLS) policies must enforce that users can only read data they own or that is explicitly marked `public`. No implicit data access.

---

## Principle 2: No Orphans

**Summary:** Every entity must have a parent, a purpose, and a lifecycle owner. No dangling references, no forgotten services, no unmaintained tables.

### Implementation Guidance

- Foreign keys are mandatory on all relationship columns (`business_id`, `event_id`, `user_id`). Cascade rules must be explicit: `ON DELETE RESTRICT` by default, `ON DELETE CASCADE` only with documented justification.
- Every database table must have an entry in the Data Catalog (`docs/yun/09-data-catalog.md`) before migration. Tables without catalog entries are rejected in code review.
- Every API endpoint must have at least one owner federation listed in the route metadata. Orphaned endpoints are flagged in the weekly governance scan.

---

## Principle 3: Federate Don't Subjugate

**Summary:** No federation may override, bypass, or deprioritize another. Collaboration is structural, not optional.

### Implementation Guidance

- Cross-federation data requests must go through the Gateway Layer (`04-gateway.md`), never direct database access. This enforces audit trails and rate limiting.
- Federation-specific business logic must live in federation-scoped modules under `src/federations/{name}/`. Shared logic goes in `src/lib/`. Never embed federation-specific code in shared modules.
- Feature flags that affect multiple federations must be approved by at least two federation owners before activation. Unilateral flags are blocked by CI checks.

---

## Principle 4: Reversible by Default

**Summary:** Every state change must be undoable. If you can't roll it back, it doesn't ship.

### Implementation Guidance

- Database migrations must include both `up` and `down` scripts. Migrations without rollback paths are rejected in PR review.
- Soft deletes (`deleted_at` timestamp) are preferred over hard deletes for all user-facing data. Hard deletes require a 72-hour grace period enforced by a scheduled job.
- Feature deployments must support instant rollback via Vercel's deployment aliases. New features should be behind feature flags that can be toggled without redeployment.

---

## Principle 5: Edge-First with Cloud Fallback

**Summary:** Process data at the edge when possible; only centralize when latency, consistency, or security demand it.

### Implementation Guidance

- User-facing reads (profiles, businesses, events) must be served from Edge Functions or static generation where data freshness permits. Stale-while-revalidate caching with max 60s TTL.
- Writes and mutations go through the Express middleware layer which handles validation, authorization, and event emission before persisting to Supabase.
- If an Edge Function cannot complete a request (timeout, missing dependency), it must gracefully fall back to the cloud function with explicit logging: `console.warn('edge_fallback', { reason, path })`.

---

## Principle 6: Observable by Default

**Summary:** If you can't measure it, you can't improve it. If you can't see it, you can't debug it.

### Implementation Guidance

- Every API endpoint must emit structured logs with `requestId`, `userId`, `federation`, `latencyMs`, and `statusCode`. No endpoint may operate in silence.
- Distributed traces (OpenTelemetry) must propagate across Edge → Gateway → Database boundaries. Trace context (`traceparent` header) must be forwarded on all internal calls.
- Every dashboard must include at least one SLO (Service Level Objective) indicator. Dashboards without actionable signals are pruned quarterly.

---

## Principle 7: Human-in-the-Loop

**Summary:** Automation accelerates; humans decide. No irreversible action executes without a human approval gate.

### Implementation Guidance

- Financial transactions (orders, payments, refunds) must include a confirmation step in the UI and a server-side verification before execution. Auto-processing is prohibited for amounts above the configured threshold.
- Admin actions (user bans, data exports, federation role changes) require multi-factor confirmation. The system must present a summary of the action before execution.
- Automated content moderation (spam detection, toxicity filtering) must flag, not delete. Human review is required before content removal.

---

## Principle 8: Progressive Autonomy

**Summary:** Start with guardrails. Earn autonomy through demonstrated reliability. Systems mature from supervised to autonomous.

### Implementation Guidance

- New automated processes (cron jobs, webhooks, scheduled tasks) start in `dry_run` mode for their first 30 days. They log what they *would* do but do not execute.
- Federation health scores determine autonomy level. Federations below the SLO threshold have their auto-scaling, auto-publishing, and auto-promotion features temporarily disabled.
- Admin permissions follow a tiered model: `viewer` → `editor` → `operator` → `admin`. Each tier upgrade requires documented usage of the previous tier for at least 14 days with zero policy violations.

---

## Enforcement

These principles are enforced through:

1. **Code Review** - PR templates include a "Constitution Compliance" checklist.
2. **CI Checks** - Automated scanners verify catalog entries, migration rollback paths, and logging requirements.
3. **Governance Scans** - Weekly automated reports flag orphaned resources, missing observations, and policy violations.
4. **Federation Audits** - Quarterly reviews by the Governance Layer assess adherence across all federations.

> Violations are logged as architectural debt in ADR tracking. Debt must be resolved within the sprint it is identified, or escalated to the Governance Layer with a remediation plan.
