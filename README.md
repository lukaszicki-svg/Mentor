# workspace-app

A Next.js 16 (App Router) + React 19 + TypeScript application, set up for
AI-assisted, Specification-Driven Development (SDD).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- ESLint (`eslint-config-next`) + **Prettier**
- **Vitest** + React Testing Library for unit tests
- **Playwright** for E2E tests (smoke-test scaffold)
- GitHub Actions CI on every pull request

See [`AGENTS.md`](./AGENTS.md) for the full set of engineering conventions,
directory structure, and the agent workflow this repository follows.
`CLAUDE.md` simply imports `AGENTS.md` so any AI coding agent reads the same
instructions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app auto-reloads as
you edit files under `src/app`.

## Project structure

```
.ai/                      Specs, run logs, and lessons for AI coding agents
.github/workflows/        CI pipeline (lint, typecheck, build, tests)
e2e/                       Playwright E2E specs
public/                    Static assets
src/app/                   Next.js App Router: pages, layouts, API routes
  api/health/route.ts      Example API route (GET /api/health)
  page.tsx, layout.tsx     Root route
```

New features should be grouped by **domain** (e.g. a route group per
business concept), with domain-local helpers colocated in private `_lib` /
`_components` folders rather than split across generic `components/`,
`services/`, `utils/` buckets. See `AGENTS.md` → "Directory structure" for
the full rationale and an example.

## Available scripts

| Script                  | Purpose                                       |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Start the dev server                          |
| `npm run build`         | Production build                              |
| `npm start`             | Run the production build                      |
| `npm run lint`          | ESLint                                        |
| `npm run format`        | Format the codebase with Prettier             |
| `npm run format:check`  | Check formatting without writing (used in CI) |
| `npm run typecheck`     | TypeScript, no emit                           |
| `npm test`              | Unit tests (Vitest)                           |
| `npm run test:watch`    | Unit tests in watch mode                      |
| `npm run test:coverage` | Unit tests with a coverage report             |
| `npm run test:e2e`      | Playwright E2E tests (builds + boots the app) |

## Working with AI coding agents

This repository is set up for agent-assisted, Specification-Driven
Development:

- **`AGENTS.md`** — stack, conventions, and the required agent workflow
  (read before coding, spec before building, verify after building).
- **`.ai/specs/`** — technical specs (`YYYY-MM-DD-slug.md`), moved to
  `.ai/specs/implemented/` once shipped or `.ai/specs/archive/` if dropped.
- **`.ai/runs/`** — logs of agent sessions: decisions, progress, handoff.
- **`.ai/lessons.md`** / **`.ai/lessons/`** — durable lessons learned, so
  the same mistake isn't repeated across sessions.

GitHub is the source of truth for the SDLC: Issues for requirements, Pull
Requests for implementation and review, `.ai/specs/` for technical specs,
and GitHub Actions as the automated quality gate before merge.

## CI

Every pull request to `main` runs (`.github/workflows/ci.yml`):

1. Install dependencies (`npm ci`)
2. Lint (`eslint`) and format check (`prettier --check`)
3. Typecheck (`tsc --noEmit`)
4. Production build
5. Unit tests with a coverage report (uploaded as a build artifact)
6. A Playwright E2E smoke test

Postgres/Testcontainers-based integration tests are documented as a
convention in `AGENTS.md` but not implemented yet, since the project does
not use a database. Add them following that convention once one is
introduced.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- This project's Next.js version is new enough that training data for AI
  tools may be stale — see the note at the top of `AGENTS.md` and read
  `node_modules/next/dist/docs/` before relying on memorized APIs.
