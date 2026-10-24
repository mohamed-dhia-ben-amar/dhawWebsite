# CLAUDE.md

Personal portfolio for Mohamed Dhia Ben Amar (Full-Stack Software Engineer). Angular 22, fully
prerendered (SSG) with `@angular/ssr`, deployed on Vercel. Bilingual EN/FR later (milestone 4).

**Source of truth:** [`docs/PORTFOLIO_BRIEF.md`](docs/PORTFOLIO_BRIEF.md). The approved homepage
design is [`docs/design-reference.html`](docs/design-reference.html). Read both before starting a
milestone. If the brief is ambiguous or conflicts with how Angular works, ask instead of guessing.

## Commands

| Task        | Command                                        |
| ----------- | ---------------------------------------------- |
| Dev server  | `pnpm start` (http://localhost:4200)           |
| Build (SSG) | `pnpm build` → `dist/dhaw-portfolio/browser`   |
| Unit tests  | `pnpm test` (Vitest, once) · `pnpm test:watch` |
| E2E         | `pnpm build && pnpm e2e` (Playwright + axe)    |
| Lint        | `pnpm lint`                                    |
| Format      | `pnpm format` · `pnpm format:check`            |

E2E serves the built output in `dist/` as static files, so always build first.

### Local machine quirks (macOS 12)

- Angular's default `sass-embedded` needs macOS 14+ and hangs the build. Export
  `NG_BUILD_SASS_EMBEDDED=0` (pure-JS Sass) before `pnpm start`, `build` or `test`.
- Playwright has no browsers for macOS 12. Run e2e in the official image instead:
  `docker run --rm --ipc=host -v "$PWD":/work -w /work -e CI=1 mcr.microsoft.com/playwright:v<version>-noble bash -c "corepack enable pnpm && pnpm e2e"`
  (match `<version>` to the installed `@playwright/test`).

## Conventions

- Standalone components only (no NgModules). Zoneless change detection.
- State in **signals**; `ChangeDetectionStrategy.OnPush` on every component (lint-enforced).
- **No hard-coded colors** in components: use the CSS custom properties from the tokens file.
- New components need unit tests (Vitest, `*.spec.ts` next to the file). New routes need an
  e2e test with an axe scan.
- Copy lives in typed content files (`src/content/{en,fr}/…`), not inline in templates.
- File names follow the Angular 2025 style guide (`home.ts`, not `home.component.ts`).
- Conventional commits, small and focused. **One milestone per PR**, on a `feat/mN-…` branch.
- Never commit secrets. Secrets live only in Vercel environment variables.
