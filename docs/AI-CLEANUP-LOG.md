# AI Cleanup Log — Real del Monte Digital Hub

One line per deletion or major refactor: `date | path | action | reason | impact`.

2026-07-03 | src/quantum/pqc.ts | refactor | Fixed broken classical fallback (KEM round-trip + sign/verify key derivation) | Fallback crypto now functions correctly; no API changes, no deletions
2026-07-03 | src/security/sanitize.ts | rewrite | Replaced weak sanitizer with hardened iterative allowlist-based implementation | Passes security regression tests; public function signatures preserved, all call sites compatible
2026-07-03 | src/hooks/useIsabellaVoice.ts | refactor | Queue now retains the in-flight clip until playback ends | Truthful `queue` state and correct cancel/local behavior; return shape unchanged
2026-07-03 | src/test/useAuth.test.ts | test-fix | Made Supabase `onAuthStateChange` mock a `vi.fn()` | Test can stub implementation; no app impact
2026-07-03 | tests/integration/skills.int.test.ts | test-fix | Corrected assertions to real skill contract (`summary`, `riskProfile`) | Tests match actual outputs; no app impact
2026-07-03 | tests/useIsabellaVoice.test.ts | test-fix | Stub only needed globals instead of replacing `window`; richer Audio/Speech mocks | jsdom/React no longer broken by test; no app impact

No files were deleted in this pass. No duplicated/obsolete/dead files were
identified with confidence via the toolchain; recommend a dedicated cleanup
session (per the second, cleanup-focused prompt) before any removals.
