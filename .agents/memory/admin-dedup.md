---
name: Admin route deduplication
description: /admin-panel is retired; redirects to /admin. AdminPanel lazy import removed.
---

## Rule
The project had two overlapping admin routes:
- `/admin` → `pages/admin/Dashboard.tsx` (AdminDashboard) — the canonical admin panel
- `/admin-panel` → `pages/Admin.tsx` (AdminPanel) — legacy, duplicated functionality

As of 2026-07-24, `/admin-panel` was converted to `<Navigate to="/admin" replace />` and the `AdminPanel` lazy import was removed from `App.tsx`.

**Why:** Having two admin routes confused navigaton and split admin functionality. The `pages/Admin.tsx` file still exists on disk (contains MusicAdminPanel component used internally), but it is no longer directly routed.

**How to apply:** Do not re-add a `/admin-panel` route. If admin sub-features are needed, add them as subroutes under `/admin/*` (e.g., `/admin/marketing` already exists).
