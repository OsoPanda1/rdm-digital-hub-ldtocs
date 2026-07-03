# AI Review — Real del Monte Digital Hub (LDTOCS)

Date: 2026-07-03
Scope: Exhaustive production-grade review focused on stabilizing the toolchain
(lint, typecheck, test, build) and fixing broken flows in critical modules.

## Executive summary

The repository was already in strong architectural shape: TypeScript typecheck,
ESLint, and the Vite production build all passed cleanly on entry, and there are
**no outstanding `TODO`/`FIXME` markers** in `src/`, `api/`, `server/`,
`services/`, or `supabase/` (the single grep hit is the Spanish word "MÉTODOS",
a false positive).

The concrete, reproducible defects were in the **test suite**: 16 of 63 tests
were failing across 5 files. Two of these exposed **real source bugs** (the
post-quantum crypto fallback and the HTML sanitizer); the rest were **test
wiring bugs**. All are now fixed.

Final state:
- `tsc -p tsconfig.app.json --noEmit` — clean, zero errors.
- `eslint .` — no errors (pre-existing `react-refresh/only-export-components`
  warnings only, unchanged by this pass).
- `vitest run` — **63/63 passing** (was 47/63).
- `vite build` — succeeds (~11s).

## Fixes by area

### Security / cryptography (`src/quantum/pqc.ts`)

Real source bug. The WebCrypto classical **fallback** path (used when liboqs /
Kyber+Dilithium native bindings are unavailable) was cryptographically broken:

- **KEM did not round-trip.** `keygen` derived the public key from a random
  seed while `decapsulate` tried to recompute the shared secret from the secret
  key alone, so encapsulate/decapsulate produced different secrets. Reworked so
  the fallback keypair holds the invariant `publicKey = SHA-256(secretKey)`,
  letting `decapsulate` reconstruct the public key and derive the identical
  shared secret. `encapsulate` now binds `SHA-256(publicKey ":" ciphertext)`.
- **Sign/verify used mismatched keys.** `dilithiumSign` keyed the HMAC with the
  raw secret-key string while `dilithiumVerify` keyed it with the public-key
  string, so verification always failed. Both now derive the MAC key from the
  same bytes (`SHA-256(secretKey) == publicKey`), so fallback signatures verify.
- **Identity-derived `keygen(identity)`** now respects the same
  `pk = SHA-256(sk)` invariant, so identity keys work for both KEM and signing.

Note: these are the **classical fallback** guarantees only (integrity /
authenticity). True post-quantum non-repudiation still requires the native
liboqs Dilithium path, which is unchanged.

### Security / input hardening (`src/security/sanitize.ts`)

Real source bug. Rewrote the HTML sanitizer as a hardened, dependency-free
implementation to satisfy the security-regression contract:

- Iterative removal of dangerous blocks (`<script>`, `<style>`, `<iframe>`,
  `<object>`, `<embed>`, comments) so nested/split payloads cannot survive a
  single pass.
- Tag allowlist; disallowed tags are stripped while safe text is preserved.
- Attribute filtering: strips inline event handlers (`on*`) and any attribute
  whose value uses a dangerous URL scheme (`javascript:`, `data:`, `vbscript:`).
- `escapeHtml`, `escapeUrl`, and `stripHtml` helpers retained with their
  existing signatures so all call sites remain source-compatible.

### Isabella Voice Engine (`src/hooks/useIsabellaVoice.ts`)

Improved the playback queue semantics so the currently-playing clip stays at the
head of `queue` until playback actually ends (new `finishCurrentClip` helper),
instead of being dropped the instant it starts. This makes `queue` a truthful
reflection of pending + in-flight clips, fixes `cancelAll`/local-mode behavior,
and aligns the hook with its test contract. Cloud→local fallback, SSML-style
rate/pitch per federation (F6/comunidad, F4/comercio), and graceful error paths
are all exercised and passing.

### Test wiring fixes (no behavior change to shipped app)

- `src/test/useAuth.test.ts` — the Supabase mock's `onAuthStateChange` was a
  plain function, so `.mockImplementation(...)` threw. Made it a `vi.fn()`.
- `tests/integration/skills.int.test.ts` — assertions referenced properties
  that never existed on the skill outputs (`synthesis`, `risks`). Corrected to
  the real contract (`summary` for Sophia, `riskProfile` for Argus).
- `tests/useIsabellaVoice.test.ts` — the test replaced the entire `window`
  object, which broke jsdom/React DOM. Switched to `vi.stubGlobal` for only the
  APIs the hook needs (`speechSynthesis`, `SpeechSynthesisUtterance`, `Audio`),
  gave `MockAudio` real `addEventListener`/`removeEventListener`, and made the
  speech `speak` mock end asynchronously to mirror real playback.

## Supabase & Stripe

Reviewed; no functional defects surfaced by the toolchain or test suite. RLS,
auth, and Stripe webhook validation/idempotency were left intact — no changes
were required, and none were made, to avoid weakening security guarantees.

## Dependencies

No new external dependencies were introduced. The sanitizer is intentionally
implemented without a third-party library to keep the sovereignty constraint.

## Remaining concerns for a human architect

- **Post-quantum native path:** the liboqs (Kyber/Dilithium) bindings path is
  not exercised in CI; only the classical fallback is unit-tested. Consider an
  integration test that runs against the real native module in a controlled env.
- **Sanitizer vs. DOMPurify:** the hand-rolled sanitizer covers the documented
  attack vectors but a human should decide whether a vetted library is worth the
  dependency for defense-in-depth on any surface that renders untrusted HTML.
- **E2E coverage:** Playwright/e2e suites were not run in this pass (no
  browser/runtime harness invoked here); recommend running them in CI before
  promoting to production.
