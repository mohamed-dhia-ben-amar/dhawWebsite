# Mohamed Dhia Ben Amar — Portfolio

Personal portfolio site. Work in progress.

## Stack

Angular 22 (standalone, signals, zoneless) · `@angular/ssr` prerendering · SCSS · Vitest ·
Playwright + axe · ESLint + Prettier · GitHub Actions · Vercel · pnpm

## Run locally

Requires Node 24+ and pnpm (`corepack enable pnpm`).

```sh
pnpm install
pnpm start          # dev server on http://localhost:4200
pnpm build          # prerendered output in dist/dhaw-portfolio/browser
pnpm test           # unit tests
pnpm e2e            # e2e against the build (run pnpm build first)
pnpm lint
pnpm format
```
