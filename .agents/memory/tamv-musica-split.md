---
name: TAMV Radio / Musica split
description: ArchivoSonoro owns TAMV live radio; Musica owns local music archive. Keep them separate.
---

## Rule
After the pull on 2026-07-24, the codebase split radio and music into two distinct pages:
- `/archivo-sonoro` → `pages/ArchivoSonoro.tsx` — TAMV 92.5 Radio Digital (Caster FM stream, weekly schedule, program catalog, episodes, donations)
- `/musica` → `pages/Musica.tsx` — Local music archive (Ecos Música, PLAYLIST, SpatialPlayer, XP system)

## Cross-promotion
`Musica.tsx` has a compact "En Vivo Ahora" strip at the top (dark bg, pulsing red dot) linking to `/archivo-sonoro`. This is intentional UX — keep it.

**Why:** Before the split, Musica.tsx tried to own both the local playlist and the TAMV radio player, causing the page to be bloated and the radio section to have nested-button HTML errors.

**How to apply:** Never merge TAMV radio back into Musica.tsx. If a new audio feature lands, check which page it belongs to first. The stream URL comes from `VITE_TAMV_STREAM_URL` env var (fallback: `https://tamv925.caster.fm/stream`).
