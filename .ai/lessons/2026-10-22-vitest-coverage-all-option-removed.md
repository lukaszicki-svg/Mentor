---
name: vitest-coverage-all-option-removed
description: coverage.all is not a valid CoverageOptions key in vitest 5 / @vitest/coverage-v8 5 — causes a typecheck failure during next build
---

## What happened

`vitest.config.mts` had `coverage: { all: true, ... }` (following older
Vitest docs/examples). `next build` runs its own TypeScript check over the
whole project (including `*.mts` config files per `tsconfig.json`'s
`include`), which failed with:

```
error TS2769: No overload matches this call.
  Object literal may only specify known properties, and 'all' does not
  exist in type 'CoverageOptions'.
```

## How to apply

In Vitest 5 / `@vitest/coverage-v8` 5, every file matched by
`coverage.include` is already reported (including files with zero
coverage) without needing `all: true` — just omit the option. Verified by
removing it and re-running `vitest run --coverage`: the report was
unchanged. If a future Vitest major re-adds or renames this option, check
`node_modules/vitest/dist/node.d.ts`'s `CoverageOptions` type rather than
trusting cached docs/examples, since `next build`'s typecheck will catch
the mismatch anyway.
