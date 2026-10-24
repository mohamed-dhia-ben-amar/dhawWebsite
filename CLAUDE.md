# CLAUDE.md

Personal portfolio for Mohamed Dhia Ben Amar (Full-Stack Software Engineer). Angular 22, fully
prerendered (SSG) with `@angular/ssr`, deployed on Vercel. Bilingual: one compile-time build per
locale (`@angular/localize`) under `/en/` and `/fr/`.

**Source of truth:** [`docs/PORTFOLIO_BRIEF.md`](docs/PORTFOLIO_BRIEF.md). The approved homepage
design is [`docs/design-reference.html`](docs/design-reference.html). Read both before starting a
milestone. If the brief is ambiguous or conflicts with how Angular works, ask instead of guessing.

## Commands

| Task        | Command                                              |
| ----------- | ---------------------------------------------------- |
| Dev server  | `pnpm start` (EN) · `pnpm start:fr` (FR), port 4200  |
| Build (SSG) | `pnpm build` → `dist/dhaw-portfolio/browser/{en,fr}` |
| Unit tests  | `pnpm test` (Vitest, once) · `pnpm test:watch`       |
| E2E         | `pnpm build && pnpm e2e` (Playwright + axe)          |
| Lint        | `pnpm lint`                                          |
| Format      | `pnpm format` · `pnpm format:check`                  |

E2E serves the built output in `dist/` with the redirects and rewrites from `vercel.json`
(`scripts/serve-dist.mjs`), so always build first.

### Local machine quirks (macOS 12)

- Angular's default `sass-embedded` needs macOS 14+ and hangs the build. Export
  `NG_BUILD_SASS_EMBEDDED=0` (pure-JS Sass) before `pnpm start`, `build` or `test`.
- Playwright has no browsers for macOS 12. Run e2e in the official image on a copy of the repo
  (never mount it writable: pnpm in the container would rewrite the host `node_modules`):

  ```sh
  docker run --rm --ipc=host -v "$PWD":/work:ro -e CI=1 mcr.microsoft.com/playwright:v<version>-noble \
    bash -c "mkdir /app && cd /work && tar --exclude=./node_modules --exclude=./.angular --exclude=./.git -cf - . | tar -xf - -C /app && cd /app && corepack enable pnpm && pnpm install --frozen-lockfile && pnpm e2e"
  ```

  Match `<version>` to the installed `@playwright/test`, and run `pnpm build` on the host first.

## Project structure

- `src/styles/`: `_tokens.scss` (every color, type, spacing and radius token), `_breakpoints.scss`
  (Sass breakpoints, mirrored in `src/app/core/breakpoints.ts`), `_fonts.scss`
  (self-hosted variable fonts and metric-matched fallbacks), `_base.scss` (reset, focus, `.container`,
  `.visually-hidden`, reduced motion).
- `src/content/`: typed copy per locale (`en/`, `fr/`): `site.ts` (shell) and
  `home.ts` (homepage), read through the `SITE_CONTENT` / `HOME_CONTENT` tokens in `src/app/core/`.
- `src/app/ui/`: signature components (TerminalWindow, TerminalSession, PromptLabel, EditorPane,
  FileExplorer, CodeView, StatStrip, ProjectCard, StatusBar).
- `src/app/layout/`: app shell (SkipLink, SiteHeader, SiteFooter, LanguageSwitch).
- `src/app/pages/`: routed pages. The homepage is composed of `pages/home/sections/*`, which take
  their content slice as an input. The experience section is `ExperienceTabs`: `FileExplorer` is a
  WAI-ARIA tab list (roving tabindex, arrows/Home/End, automatic activation) and every panel is
  prerendered, only the open one visible. `/styleguide` is an internal noindex showcase of the components;
  keep it out of the sitemap.

## i18n

- Each locale is a separate build with its own `<html lang>` and base href. The dev server builds
  one locale at a time (`development` = EN, `development-fr` = FR).
- Copy lives in `src/content/{en,fr}/`; `APP_LOCALE` (from `LOCALE_ID`) picks the right file.
  `src/content/content.spec.ts` fails if the two locales drift apart structurally. French copy is
  written as French (no-break spaces as `\u00a0` escapes) and reviewed by the owner.
- `src/locale/messages.fr.xlf` is empty on purpose (no `i18n` attributes in templates).
- `/` redirects to `/en/`; `/cv/*` and `/fonts/*` are rewritten to the `/en/` copies (`vercel.json`).
- Every page gets `hreflang` alternates (en, fr, x-default) from `AlternateLinks`, built on
  `SITE_ORIGIN` in `src/app/core/site-config.ts` (switch to the custom domain in milestone 9).

## Conventions

- Standalone components only (no NgModules). Zoneless change detection.
- State in **signals**; `ChangeDetectionStrategy.OnPush` on every component (lint-enforced).
- **No hard-coded colors** in components: use the custom properties in `src/styles/_tokens.scss`.
  Stylelint rejects hex, named and `rgb()`/`hsl()` colors under `src/app/`.
- Every text/background pair must reach 4.5:1. `--text-faint` is `#82828B`, not the brief's
  `#71717A` (which fails). Decorative line numbers are CSS counters, not text.
- New components get a demo on `/styleguide` and need unit tests (Vitest, `*.spec.ts` next to
  the file). New routes need an e2e test with an axe scan.
- Copy lives in typed content files (`src/content/{en,fr}/…`), not inline in templates.
- File names follow the Angular 2025 style guide (`home.ts`, not `home.component.ts`).
- Conventional commits, small and focused. **One milestone per PR**, on a `feat/mN-…` branch.
- Never commit secrets. Secrets live only in Vercel environment variables.
