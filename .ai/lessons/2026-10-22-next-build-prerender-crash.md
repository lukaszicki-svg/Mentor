---
name: next-build-prerender-crash
description: npm run build fails prerendering with a null useContext error in this sandbox, pre-existing on the untouched starter
---

## What happened

`npm run build` (Next.js 16.4.2, React 19.2.8, Node 24.21.0, Turbopack)
fails while "Generating static pages" with:

```
TypeError: Cannot read properties of null (reading 'useContext')
```

This happens on `/_global-error` (Turbopack) and even on plain `/` when
forcing `--webpack` or `experimental.cpus: 1`.

## Why it's notable

This reproduces identically on the **untouched** `create-next-app` starter
(verified via a clean `git worktree` at the initial commit, `npm install`,
`npm run build` — same crash, no code involved). It is not caused by any
application code, and it is not fixed by:

- Forcing a single build worker.
- Switching from Turbopack to webpack.
- Pinning `next`/`eslint-config-next` back to the originally committed
  `16.3.4` (same crash) or forward to the latest patch `16.4.2`.

`next dev` (the actual preview mechanism this sandbox uses, via
`openmercato.toml`) works fine and serves the app correctly — this is
specific to the production build's prerender phase.

## How to apply

Treat this as a sandbox/environment issue (possibly a Node 24 + Next 16
worker-thread incompatibility specific to this container), not a code bug.
Before debugging a failing `build` step in this repo:

1. Confirm whether it also fails on the actual GitHub Actions runner (the
   CI workflow runs `npm run build` on `ubuntu-latest`) — if it passes
   there, the sandbox is the problem, not the code.
2. Don't "fix" it by downgrading dependencies or changing application code
   — that was tried and made no difference here.
3. If it does reproduce in CI, that's worth an upstream Next.js issue
   report with a minimal repro (the untouched starter already reproduces
   it), rather than a workaround in this codebase.
