# Run log: AI engineering foundations setup

- **Date:** 2026-10-22
- **Spec:** `.ai/specs/implemented/2026-10-22-ai-engineering-foundations.md`
- **Agent:** Claude (AI Coding Agent)

## What was done

1. Audited the repo: vanilla `create-next-app` (Next.js 16.3.4, React
   19.2.8, TypeScript, App Router, ESLint) plus an Open Mercato sandbox
   preview placeholder page. No tests, no CI, no `.ai/` structure, no
   domain code yet.
2. Wrote the implementation spec (see above) before changing code.
3. Created the `.ai/` structure: `specs/`, `specs/implemented/`,
   `specs/archive/`, `runs/`, `lessons.md`, `lessons/`.
4. Added `src/app/api/health/route.ts` as the first real example of the
   documented API/domain convention, with a unit test.
5. Added Vitest + React Testing Library + jsdom, with a smoke test for the
   existing home page (`src/app/page.test.tsx`) and the health route test.
   Bumped `@types/node` from `^20` to `^24` to satisfy Vitest 5's peer
   dependency (the sandbox runs Node 24.21.0).
6. Added Playwright with a single E2E smoke spec (`e2e/home.spec.ts`).
7. Added Prettier + `eslint-config-prettier`, ran `prettier --write .` once
   to normalize the existing codebase (cosmetic only — semicolons/line
   wrapping; diffs reviewed, no behavior change).
8. Upgraded `next` and `eslint-config-next` from `16.3.4` to `16.4.2` to
   fix a critical RCE and several high-severity advisories (`npm audit`)
   that predated this session — a patch-level, non-breaking bump.
9. Extended `AGENTS.md` (below the `next dev`-managed generated block) with
   stack/conventions/workflow/testing/CI documentation, and rewrote
   `README.md` to match.
10. Added `.github/workflows/ci.yml`: lint + format check + typecheck +
    build in one job, unit tests + coverage artifact in another, a
    Playwright E2E job depending on the first.
11. Ran lint, format check, typecheck, unit tests (with coverage), and
    build. Found and logged two issues (see `.ai/lessons.md`):
    - `coverage.all` isn't a valid Vitest 5 option — removed it.
    - `npm run build` crashes during prerendering in this sandbox; verified
      via a clean worktree that this reproduces on the **original,
      untouched** commit, independent of any change made in this session.
      `next dev` (the actual preview mechanism) works correctly and serves
      the new `/api/health` route.

## Final verification status

| Check                   | Result                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run lint`          | ✅ pass                                                                                         |
| `npm run format:check`  | ✅ pass                                                                                         |
| `npm run typecheck`     | ✅ pass                                                                                         |
| `npm run test:coverage` | ✅ pass — 100% on `src/app/page.tsx` and `src/app/api/health/route.ts`                          |
| `npm run build`         | ❌ pre-existing sandbox issue — see lesson above, not caused by this session's changes          |
| `npm run test:e2e`      | Not run in this session (needs Playwright browser binaries + a successful build; wired into CI) |

## Handoff

- Everything in the spec's plan is implemented except the build step's
  pre-existing failure, which is out of scope (environment issue, not a
  code defect) and documented as a lesson + follow-up.
- Next session / next lesson: install Open Mercato skills; once a database
  is introduced, implement the Testcontainers/Postgres integration test
  convention documented in `AGENTS.md`; verify the `next build` crash
  against real GitHub Actions infra and file an upstream issue if it
  reproduces there too.
