<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project overview

A Next.js 16 (App Router) + React 19 + TypeScript application, bootstrapped
from `create-next-app` and running inside an Open Mercato sandbox
(`openmercato.toml` controls the preview command; it is cockpit
configuration, not application code). The codebase is intentionally minimal
today — these docs describe the conventions all _new_ code must follow as
real features are added, not a retrofit of the existing starter page.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, React 19.
- **Styling:** CSS Modules + global CSS (`src/app/globals.css`). No CSS
  framework is installed; don't add one without a reason.
- **Lint/format:** ESLint (`eslint-config-next`) + Prettier
  (`eslint-config-prettier` disables stylistic rules that conflict with it).
- **Unit testing:** Vitest + React Testing Library + jsdom.
- **E2E testing:** Playwright (scaffold only — see "Testing" below).
- **Package manager:** npm (`package-lock.json` is committed; use `npm ci`
  in automation, `npm install` locally).

## Directory structure

```
.ai/                      Persistent agent context (see "Agent context" below)
.github/workflows/        CI (GitHub Actions)
e2e/                       Playwright specs
public/                    Static assets
src/app/                   Next.js App Router routes
  api/<resource>/route.ts  Route Handlers (API endpoints)
  <route>/page.tsx         Pages
  <route>/layout.tsx       Shared layout for a route subtree
  <route>/_components/     Private, non-routable UI colocated with a route
  <route>/_lib/            Private, non-routable helpers colocated with a route
```

As the app grows past a single concept, group routes by **domain**, not by
technical layer: prefer `src/app/(billing)/invoices/...` and
`src/app/(billing)/invoices/_lib/...` over a top-level `components/`,
`services/`, `utils/` split that mixes unrelated domains together. Keep
cross-domain, truly shared code (design-system primitives, generic fetch
wrappers) in a top-level `src/lib/` or `src/components/` — if in doubt,
colocate first and only promote to shared code once a second domain needs it.

Route groups `(group)` organize without affecting the URL; private folders
`_folder` hold code that must not become a route. Do not create a `route.ts`
and `page.tsx` in the same segment (Next.js forbids it).

## Conventions

- **Naming:** `camelCase` for variables/functions, `PascalCase` for
  components and types, `kebab-case` for route segments and non-component
  file names.
- **Components:** function components, no default-exported anonymous
  functions outside `page.tsx` / `layout.tsx` / `route.ts` (which Next.js
  requires to be the default export).
- **API routes:** one `route.ts` per resource under `src/app/api/`, using
  the Web `Request`/`Response` APIs (or `NextRequest`/`NextResponse` when you
  need the extra helpers). Return typed JSON via `Response.json(...)`.
  Validate all external input at the boundary (request body/query/params) —
  don't assume callers are well-behaved.
- **Data access:** no ORM/DB is set up yet. When one is introduced, put data
  access behind a small repository/service module per domain
  (`_lib/<domain>Repository.ts`) rather than querying directly from route
  handlers or components — this is what makes the Testcontainers convention
  below possible.
- **Dependency injection:** prefer plain functions taking their
  dependencies as parameters (or a small factory) over singletons/classes
  with hidden global state. This keeps unit tests trivial — pass a fake,
  don't mock a module.
- **Simplicity:** don't introduce a pattern (DI container, generic
  repository abstraction, event bus, etc.) before a second, real use case
  needs it. Three similar lines beat a premature abstraction.

# Agent context (`.ai/`)

This repository uses a persistent, file-based context structure for AI
coding agents. Every agent session must read and write to it — it is the
project's memory across sessions, not optional scaffolding.

- **`.ai/specs/YYYY-MM-DD-slug.md`** — a specification for a non-trivial
  piece of work, written _before_ implementation starts. Include: context,
  goals, non-goals, plan, verification steps. Move it to
  `.ai/specs/implemented/` once the work has shipped and been verified, or
  to `.ai/specs/archive/` if it was abandoned/superseded.
- **`.ai/runs/YYYY-MM-DD-slug.md`** — a running log of an autonomous or
  semi-autonomous agent session: decisions made, what was tried, what
  failed, and a handoff note for whoever (human or agent) picks it up next.
- **`.ai/lessons.md`** — a short, curated index of durable lessons learned
  (one or two lines each, newest relevant first), linking into
  `.ai/lessons/` for detail. Append to this after fixing any non-obvious
  bug or discovering a non-obvious constraint. Do not log routine, expected
  behavior — only what would otherwise be re-discovered the hard way.

## Agent workflow

1. **Before changing code:** read the relevant code, docs, and existing
   conventions in this file and in `.ai/`. For anything Next.js-specific,
   check `node_modules/next/dist/docs/` first — see the generated block
   above, training data is not reliable for this framework version.
2. **For complex/non-trivial tasks:** write a spec and plan in
   `.ai/specs/` before writing code. "Complex" means: touches more than one
   domain, changes a public contract (API shape, DB schema), or has more
   than one reasonable implementation approach worth deciding between up
   front. A one-line bug fix doesn't need a spec.
3. **Implement in stages**, verifying each stage (lint/typecheck/tests)
   before moving to the next, rather than writing everything then debugging
   at the end.
4. **New business logic requires unit tests.** Target 100% unit test
   coverage of new business logic (see "Testing" below) — but never add a
   test solely to inflate a coverage number; a test must assert real
   behavior.
5. **After implementation**, run: lint, typecheck, unit tests, build (and
   integration/E2E tests where applicable). Do not mark a task done if a
   required check fails.
6. **After fixing a bug**, record the non-obvious part of the fix (root
   cause, why it was missed) in `.ai/lessons.md`.
7. **Autonomous or multi-step runs** get a log in `.ai/runs/`.
8. **Plan before you type, verify after you type.** Prefer a short written
   plan for anything non-trivial, re-read the actual diff before calling a
   task done, and treat a passing build as the minimum bar, not proof the
   feature works — exercise it (tests, or the running app) before reporting
   success.

# Testing

- **Unit tests** (Vitest + Testing Library): colocate `*.test.ts(x)` next to
  the code they test (e.g. `src/app/api/health/route.test.ts`). Run with
  `npm test` (CI mode) or `npm run test:watch` locally. Coverage:
  `npm run test:coverage`.
  - Goal: **100% unit test coverage of new business logic.** Decorative /
    non-logic code (e.g. the starter page's background animation in
    `src/app/backdrop.tsx`, the root layout) is excluded from the coverage
    target in `vitest.config.mts` — don't chase coverage on code with no
    branches to test.
- **Integration tests (Postgres via Testcontainers):** not set up yet,
  because the project does not use a database. When one is introduced:
  - Add `testcontainers` + `@testcontainers/postgresql` as dev
    dependencies.
  - Spin up an isolated Postgres container per test run (not per test) in a
    global Vitest setup file, run migrations against it, and point the
    repository/service layer at it via an injected connection — this is
    exactly why data access must go through a repository module (see
    "Conventions" above) rather than ad-hoc queries in route handlers.
  - Add an `integration-tests` job to `.github/workflows/ci.yml` (separate
    from the fast unit-test job, since container startup is slow) and a
    `test:integration` script.
- **E2E tests** (Playwright): scaffolded in `e2e/` with a single smoke spec
  (`e2e/home.spec.ts`, home page loads) — intentionally not a full business
  scenario suite yet. Run locally with `npm run build && npm run test:e2e`
  (the Playwright config boots the production server itself). Add real
  user-flow specs here as features ship; don't let this become a dumping
  ground for what should be unit tests.

# Verification commands

| Command                 | What it does                                 |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Start the dev server (Turbopack)             |
| `npm run lint`          | ESLint                                       |
| `npm run format:check`  | Prettier check (use `npm run format` to fix) |
| `npm run typecheck`     | `tsc --noEmit`                               |
| `npm test`              | Unit tests (Vitest, single run)              |
| `npm run test:coverage` | Unit tests with coverage report              |
| `npm run test:e2e`      | Playwright E2E (needs `npm run build` first) |
| `npm run build`         | Production build                             |

All of these (except E2E, which needs a dedicated job) run in CI on every
pull request — see `.github/workflows/ci.yml`. A PR should not be merged
with a red check.

# SDLC / source of truth

- **GitHub Issues** — requirements and tasks.
- **Pull Requests** — implementation and code review; link the Issue and,
  for non-trivial work, the `.ai/specs/` file it implements.
- **`.ai/specs/`** — technical specifications (SDD).
- **GitHub Actions** — automated verification gate before merge.

Open Mercato skills are intentionally **not** installed yet — that is
planned for a later lesson. Do not add them preemptively.
