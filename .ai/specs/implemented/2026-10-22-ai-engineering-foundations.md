# AI Engineering Foundations Setup

- **Status:** Implemented
- **Date:** 2026-10-22
- **Author:** Claude (AI Coding Agent)

## Context

The repository is a freshly bootstrapped Next.js 16 / React 19 / TypeScript
App Router project (`create-next-app` output, plus an Open Mercato sandbox
preview placeholder page). It has no tests, no CI, no domain modules yet, and
no persistent structure for working with AI coding agents. This spec defines
the baseline tooling and conventions needed before real feature work starts,
following Specification-Driven Development (SDD) and the AI Tech Leaders
lesson 02 checklist.

## Goals

1. Document the existing stack and the conventions new code must follow
   (`AGENTS.md`, `README.md`).
2. Add a persistent context structure for AI agents: `.ai/specs`,
   `.ai/specs/implemented`, `.ai/specs/archive`, `.ai/runs`, `.ai/lessons.md`,
   `.ai/lessons/`.
3. Add a minimal, real (non-decorative) example of the domain/API convention:
   a `/api/health` route handler, to anchor the documented pattern and give
   the test setup something genuine to exercise.
4. Introduce a unit testing stack (Vitest + Testing Library) with one smoke
   test for the existing home page and one for the health route.
5. Introduce a Playwright scaffold for future E2E tests, with a single smoke
   spec (home page loads) — no business scenarios yet.
6. Add Prettier (+ eslint-config-prettier) so "lint and formatting" are both
   enforceable in CI.
7. Add a GitHub Actions workflow that runs on every PR: install, lint,
   format check, typecheck, build, unit tests with coverage.
8. Document (but do not implement) the Postgres + Testcontainers integration
   test setup, since the project does not use a database yet — implementing
   it now would be speculative infrastructure for a dependency that doesn't
   exist.

## Non-goals

- Restructuring the existing sandbox placeholder page/backdrop animation —
  it belongs to the Open Mercato preview scaffold, not application code, and
  there is no second domain yet to justify a module layout.
- Installing Open Mercato skills (explicitly deferred to the next lesson).
- Implementing Testcontainers/Postgres integration tests before any code
  uses a database — would be speculative scaffolding.
- Implementing real E2E business scenarios beyond a single smoke test.
- Configuring GitHub branch protection rules (requires repo admin API access
  outside this agent's scope; documented as a follow-up instead).

## Plan

1. Write this spec.
2. Create `.ai/` structure (`specs`, `specs/implemented`, `specs/archive`,
   `runs`, `lessons.md`, `lessons/`).
3. Add `src/app/api/health/route.ts` (GET health check) as the first real
   domain-oriented example.
4. Add Vitest config + `__tests__` unit tests (home page, health route).
5. Add Playwright config + one E2E smoke spec.
6. Add Prettier config + ignore file, wire `format`/`format:check` scripts.
7. Extend `AGENTS.md` with standards, conventions, workflow rules, and the
   `.ai/` usage contract.
8. Rewrite `README.md` with architecture, structure, and setup docs.
9. Add `.github/workflows/ci.yml`.
10. Run lint, typecheck, unit tests, and build; fix anything broken.
11. Write the run log in `.ai/runs/`.
12. Record one lesson in `.ai/lessons.md` / `.ai/lessons/`.

## Verification

- `npm run lint` — passes.
- `npm run format:check` — passes.
- `npm run typecheck` — passes.
- `npm test` — unit tests pass.
- `npm run build` — production build succeeds.
- E2E spec is present but not required to run outside CI's dedicated job
  (needs browser binaries).

## Follow-ups (next lessons)

- Install Open Mercato skills.
- When a database is introduced, add Testcontainers-based integration tests
  per the convention documented in `AGENTS.md`.
- Configure GitHub branch protection to require the CI workflow before
  merge (repo admin action, not file-based).
- Expand Playwright coverage once real user flows exist.
