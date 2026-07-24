---
name: Nested button HTML error pattern
description: React hydration error when buttons contain buttons; fix with div+role=button.
---

## Rule
HTML does not allow `<button>` elements to contain other `<button>` elements. React renders them but the browser rejects the nesting, causing a hydration error.

**Symptom:** `In HTML, <button> cannot be a descendant of <button>` in browser console.

**Fix pattern:** Convert the outer `<button>` to:
```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handler}
  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(); } }}
  className="... cursor-pointer"
>
  {/* inner buttons are fine here */}
</div>
```

**Why:** Occurred in `TrackRow` (Musica.tsx) — the row was a `<button>` but contained inner play/expand `<button>` elements. The `role=button` div approach preserves keyboard accessibility while fixing the HTML validity error.
