# Lessons

Durable, non-obvious lessons learned while working on this project. Keep
entries short; link to `.ai/lessons/<slug>.md` for detail. Newest first.

- [2026-10-22 — `next build` fails to prerender in this sandbox](lessons/2026-10-22-next-build-prerender-crash.md) — pre-existing, environment-specific; reproduces on the untouched starter too. Verify on real CI before trusting the build gate.
- [2026-10-22 — Vitest v8 coverage no longer has an `all` option](lessons/2026-10-22-vitest-coverage-all-option-removed.md) — just omit it; matched files are already fully reported by default.
