# ────────────────────────────────────────────────────────────────
# YUN Policy (Rego) — ADR-YUN-0001 Executable Implementation
# This file is the "active constitution" — YUN never decides
# anything important without consulting this policy.
# ────────────────────────────────────────────────────────────────

package yun

default allow = false
default deny = false

# ── CP-001: Soberanía del Dato ─────────────────────────────────
# Una sola verdad coherente por dominio.

allow {
  input.action == "yun.data.read"
  input.resource.domain == "territory"
  not data.yun.restrictions.deny_read[input.principal.id]
}

allow {
  input.action == "yun.data.write"
  input.resource.domain == "territory"
  input.principal.verified == true
  input.context.licenses[_] == "TAMV-PRCL"
  not data.yun.restrictions.dpa_block[input.resource.event_type]
}

# ── CP-002: Desacoplamiento Reactivo ───────────────────────────
# Direct calls prohibited outside EMERGENCY mode.

deny_reason["CP-002_direct_call_not_allowed"] {
  input.action == "service.direct.call"
  input.context.mode != "EMERGENCY"
}

allow {
  input.action == "service.direct.call"
  input.context.mode == "EMERGENCY"
  input.principal.verified == true
}

# ── CP-003: Zero Trust — Seguridad Transparente ────────────────
# Unverified principals are always denied.

deny_reason["CP-003_unverified_principal"] {
  input.principal.verified == false
  input.action != "health.check"
}

allow {
  input.principal.verified == true
  input.action != "health.check"
}

# ── CP-004: Resiliencia Degradable ─────────────────────────────
# In EMERGENCY mode, only critical services survive.

allow {
  input.action == "yun.degradation.apply"
  input.context.mode == "EMERGENCY"
  input.resource.domain == "non_critical"
}

allow {
  input.action == "yun.identity.read"
  input.context.mode == "EMERGENCY"
  input.resource.domain == "identity"
}

allow {
  input.action == "yun.telemetry.read"
  input.context.mode == "EMERGENCY"
  input.resource.domain == "telemetry"
}

# ── CP-005: Gobernanza Documentada ─────────────────────────────
# Architecture changes require ADR.

deny_reason["CP-005_no_adr"] {
  input.action == "yun.architecture.change"
  not input.context.adr[_] == "ADR-YUN-0001"
}

# ── CP-006: Observabilidad Obligatoria ─────────────────────────
# All events must have traceId.

deny_reason["CP-006_no_trace"] {
  input.action == "yun.events.publish"
  input.context.traceId == null
}

allow {
  input.action == "yun.events.publish"
  input.context.traceId != null
  input.principal.verified == true
}

# ── CP-007: Gobernanza Federada ────────────────────────────────
# Soul modification requires FED-7.

deny_reason["CP-007_soul_requires_fed7"] {
  input.action == "yun.soul.modify"
  input.principal.federation != "FED-7"
}

# ── CP-008: Neutralidad Epistémica ─────────────────────────────
# Isabella cannot declare absolute truths.

deny_reason["CP-008_no_absolute_truths"] {
  input.action == "yun.narrative.declare"
  input.principal.type == "ai"
}

# ── TAMV + DPA Licensing ───────────────────────────────────────

allow {
  input.action == "yun.events.publish"
  input.resource.domain == "territory"
  input.context.licenses[_] == "TAMV-PRCL"
  not data.yun.restrictions.dpa_block[input.resource.event_type]
}

allow {
  input.action == "yun.knowledge.read"
  input.context.licenses[_] == "TAMV-EOL"
}

allow {
  input.action == "yun.narrative.generate"
  input.context.licenses[_] == "TAMV-KORIMA"
}

# ── Federation Event Routing ───────────────────────────────────

allow {
  input.action == "yun.events.route"
  input.principal.federation != null
  input.principal.verified == true
  input.context.traceId != null
}
