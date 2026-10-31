# Portfolio website — build brief

Personal portfolio for **Mohamed Dhia Ben Amar**, Full-Stack Software Engineer (Tunis, open to EU remote/hybrid).
This file is the source of truth for Claude Code. `design-reference.html` (same folder) is the approved homepage design: match it closely.

## 1. Goals

- Get recruiters and hiring managers (Tunisia + EU) to the proof fast: strongest numbers in the first screen, case studies one click away.
- Be proof in itself: the public repo should show clean Angular architecture, tests, CI and accessibility.
- Bilingual: English and French, both fully indexable by search engines.

## 2. Stack and hosting

- **Framework:** latest stable Angular, standalone components, Signals, `OnPush` everywhere, zoneless change detection if stable in this version. Strict TypeScript.
- **Rendering:** `@angular/ssr` with **prerendering (SSG)** of every route. No server needed for pages.
- **i18n:** Angular built-in i18n (`@angular/localize`), compile-time, one prerendered build per locale under `/en/` and `/fr/`. Root `/` redirects to `/en/`. Add `hreflang` alternates on every page.
- **Hosting:** Vercel, connected to the GitHub repo. Every push to `main` deploys; every PR gets a preview URL.
- **Contact form backend:** a Vercel serverless function at `/api/contact` (Node.js, TypeScript). See section 7.
- **Fonts:** self-host Space Grotesk, Inter and JetBrains Mono (e.g. via `@fontsource`, woff2 subsets, `font-display: swap`). Do **not** load Google Fonts at runtime (GDPR concern for EU visitors).
- **Package manager:** pnpm.

## 3. Routes

| Route (per locale) | Content |
|---|---|
| `/en/`, `/fr/` | Homepage (sections in section 5) |
| `/en/work/widget-library` | Case study: shared widget library |
| `/en/work/nova` | Case study: NOVA AI dev workflow |
| `/en/work/converty-shop` | Case study: Converty Shop app |
| `/en/404` | Not found page, terminal-styled (`command not found`) |
| later: `/en/notes`, `/en/notes/:slug` | Blog, Markdown-based. **Not in v1**, but keep the content layer ready for it |

CV downloads served as static files:
`/cv/Mohamed_Dhia_Ben_Amar_CV_2026_EN.pdf` and `/cv/Mohamed_Dhia_Ben_Amar_CV_2026_FR.pdf`.

## 4. Design system

Layout and components come from `design-reference.html`. The palette and type were redesigned in October 2026 (owner-approved): midnight ink and phosphor amber instead of near-black and lime, Martian Mono and Instrument Sans instead of three families. Define everything as CSS custom properties in one tokens file; components never hard-code colors.

**Themes:** dark (default, also in the prerendered HTML) and light. The visitor's system setting picks one; a header toggle overrides it, is remembered, and is applied before first paint. Switching spreads the new theme from the toggle as a wave (instant with reduced motion).

**Colors** (dark / light). Every text color reaches 4.5:1 on every surface in both themes.
- Surfaces: `--bg` `#0E1A2B` / `#F4F6F9` · `--surface` `#14233A` / `#FFFFFF` · `--surface-2` `#172840` / `#F9FAFC` (window/title bars) · `--surface-sunken` `#0B1624` / `#EDF1F6` (tab bars, explorer) · `--surface-raised` `#1B2D47` / `#E3E9F1`
- Borders: `--border` `#22354F` / `#D5DDE7` · `--border-strong` `#2C4260` / `#C3CFDD`
- Text: `--text` `#D9E1EC` / `#1B2A3F` · `--text-strong` `#F1F5FA` / `#0E1A2B` · `--text-muted` `#A3B2C6` / `#3E4F67` · `--text-faint` `#8696AD` / `#56677F` · `--line-number` `#4E6380` / `#8A98AB` (decorative, `aria-hidden`)
- `--accent` `#F2B640` / `#8F5B00` (phosphor amber: actions, prompts, focus) · `--on-accent` `#0E1A2B` / `#FFFFFF`
- `--accent-2` `#86C8E8` / `#1D5F8A` (sky: code strings, journey dates, file icons)
- Keep the rule: accent and accent-2 are the only two hues; everything else is neutral.

**Type**
- Headings: Martian Mono 700 at its widest setting, tight letter-spacing (`-0.03em` to `-0.04em`). Hero: `clamp(30px, …, 44px)`.
- Body: Instrument Sans 400–700, 16px, line-height 1.6.
- Anything "machine" (nav, prompts, labels, code, terminal, status bar): Martian Mono at a narrower width.

**Shape and spacing**
- Radius: cards 14px, contact block 20px, inputs 10px, primary buttons pill (999px).
- Section rhythm: 96px between sections on desktop, scale down on mobile. Container max-width 1160px, 24px side padding.
- Touch targets at least 44px (buttons 48px).

**Signature components**
- `TerminalWindow`: title bar with three neutral dots and a title, mono body. Used in hero and contact.
- `PromptLabel`: `$ command` line above each section title (accent `$`).
- `EditorPane`: tab bar with the active tab's top border in accent, optional explorer sidebar, optional line-numbered code view.
- `StatusBar` footer in accent color.
- `StatStrip`: 4 big numbers with captions.
- `ProjectCard`: an `EditorPane` with title, summary, case-study link and 2 code-style stats (`size_cut`, `features_per_sprint`).

**Motion**
- Terminal cursor blink and a subtle typing effect on the hero terminal, scroll reveal, the theme wave. Disable all motion under `prefers-reduced-motion`.

## 5. Homepage sections (in order)

1. **Header:** `mdba:~$` logo, nav `./work`, `./experience`, `./contact`, EN/FR switch (links to the same page in the other locale, `aria-current` on the active one).
2. **Hero:** availability badge, headline, intro paragraph, CTAs (Get in touch, Download CV EN/FR, GitHub, LinkedIn); terminal window on the right (stacks below on mobile).
3. **Stat strip:** 21 widgets authored (of 81 in the team library) / ~9,000 tests / 4 days / 10k+ downloads.
4. **Selected projects:** 3 project cards linking to case studies.
5. **Experience:** editor pane with an explorer of 4 files (`minotore.json`, `converty.json`, `ibspace.json`, `inoteqia.json`). Clicking a file opens it in the pane. Implement as an accessible **tabs** pattern (roving tabindex, arrow keys, `role="tablist"`/`tab`/`tabpanel`), state in a signal. On mobile the explorer becomes a horizontal scrollable list above the pane.
6. **Contact:** terminal-framed block with copy, email link and form.
7. **Footer status bar:** `main ✓ · Angular SSR · Vercel` and copyright.

## 6. Content (all real; do not invent)

Store all copy in typed content files (`src/content/{en,fr}/…ts`) or Angular i18n messages, not inline in templates. The French copy must be written as French, not machine-translated word for word; the owner will review it.

**Hero (EN):** "Full-stack engineer building configurable widget libraries and AI-assisted workflows." / "I'm Mohamed Dhia Ben Amar. I build configurable Angular widgets that power a CMS page builder, lead AI-assisted development with Claude Code agents, and ship with React, Node.js and Golang."

**Experience data**
- **Minotore** — Frontend Developer, market finance, Tunis (hybrid), Dec 2024 – present. The frontend team builds standard, configurable Angular widgets for the company's CMS (product, content, document, search and others): webmasters insert them into pages through the CMS page editor, and each widget ships a JSON configuration file, coded alongside its logic, from which the CMS generates its settings form. In the CMS, each client sets up a workspace and creates as many projects as they want, each an independent website. The team library has 81 accessible widgets used across 8 projects; I am the original author of 21 of them (never imply I built all of them). The configuration contract moved from XML to JSON during my time: defined by the backend, frontend and studio tech leads, and I took part in the migration. Widget size cut 30–50%; supervised migration of 68 widgets and 8 libraries from Angular 18 to Angular 21 / Nx 22 in one 3-week sprint leading 3 developers; contributed to Angular 22 / Nx 23 migration; introduced Vitest (~9,000 tests, 80–96% coverage); Technical Lead on NOVA (see case study); Storybook skeleton library and Keycloak auth screens; mentored 2 new team members and 1 intern.
- **Converty** — Full-Stack Engineer Intern, e-commerce, Tunis (hybrid), Feb – Aug 2024. Co-developed the Converty Shop merchant app (React Native, Expo, Redux, Zustand) with one other developer, with a designer and PM; built its statistics and profile screens; upsell/cross-sell automation on web and mobile (+15% average order value); dashboard load time −30%; REST APIs in Node.js/Express and a Golang order-processing microservice.
- **IBSpace** — Software Engineer Intern, e-solutions, Tunis (hybrid), Jul – Sep 2023. Firestore schemas for 10,000+ concurrent users; real-time Angular admin/analytics dashboards saving ~6 hours/week of manual reporting.
- **Inoteqia** — Front-End Mobile Developer Intern, deeptech, Tunis (hybrid), Aug – Sep 2022. Flutter front end of a vehicle-trading DApp (Solidity, ERC-20, MetaMask), deployed to testnet.

**Case studies** — structure each as: Context → Problem → What I did → Stack → Results → What I'd do next. Use only the facts above; leave clearly marked placeholders such as `[OWNER: add architecture diagram]` for anything missing. **Confidentiality:** no Minotore code, screenshots, client names or internal URLs; describe architecture and approach, use simple diagrams drawn for the site.
- Converty Shop: link to the App Store (`https://apps.apple.com/dz/app/converty-shop/id6466304252`) and Google Play (`https://play.google.com/store/apps/details?id=com.converty.app`). Phrase the 10k+ downloads / 4.4 rating as the app's current figures, not as results of the internship alone.

**Links:** GitHub `https://github.com/mohamed-dhia-ben-amar`, LinkedIn `https://linkedin.com/in/mohameddhia-benamar`, email `contact@mohameddhia.dev`.

## 7. Contact form

- Client: Angular reactive form, typed, inline validation messages, accessible error summary, loading and success states. Honeypot field. No third-party captcha in v1.
- Server `/api/contact`: validate with Zod (name 2–100 chars, valid email, message 10–5000 chars), reject honeypot hits silently, basic rate limit per IP, send the message by email through a transactional email provider (e.g. Resend). Secrets only in Vercel environment variables, never in the repo.
- Return clear JSON errors; never echo raw input back into HTML.

## 8. Quality bar (acceptance criteria)

- **Accessibility:** WCAG 2.2 AA. Every text/background pair at least 4.5:1. Real `<button>`/`<a>`/`<label>`, visible focus styles in accent, skip link, landmarks, correct heading order, `lang` per locale. Automated axe checks in Playwright on every route.
- **Performance:** Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO (mobile). No layout shift from fonts. Images as AVIF/WebP with width/height.
- **SEO:** unique title and description per page and locale, Open Graph and Twitter cards with a generated OG image, `sitemap.xml`, `robots.txt`, canonical URLs, `hreflang`, JSON-LD `Person` schema.
- **Responsive:** works from 320px to wide desktop; no horizontal page scroll (code panes scroll inside their own box).
- **Tests:** Vitest unit tests for components, the content layer and the contact handler; Playwright e2e for navigation, language switch, experience tabs (keyboard included), contact form (mock the API) and axe scans.
- **Tooling:** ESLint (angular-eslint), Prettier, strict TS, Husky + lint-staged. GitHub Actions on PRs: install, lint, unit tests, build, e2e. Vercel handles deploys.
- **Privacy:** no tracking cookies. Vercel Web Analytics (cookieless) is acceptable.
- **README:** what the project is, stack, architecture overview, how to run, test and deploy, and a screenshot. The repo is part of the portfolio, so keep it polished.

## 9. Suggested milestones

1. Scaffold: Angular + SSR/prerender, pnpm, lint/format, Vitest, Playwright, CI, Vercel project. Deploy a blank page.
2. Design tokens, fonts, base layout, header/footer, signature components.
3. Homepage in English, matching `design-reference.html`.
4. i18n setup and French homepage.
5. Experience tabs (interactive, accessible).
6. Case-study pages (with owner placeholders).
7. Contact form + `/api/contact`.
8. SEO, OG image, sitemap, analytics.
9. Audit pass: axe, Lighthouse, mobile check, README. Then connect the custom domain.

Work milestone by milestone, one PR each, and stop for review after milestones 3, 5 and 7.

## 10. Out of scope for v1

Notes/blog, light theme, CMS, Arabic locale, the separate NestJS + PostgreSQL backend project (planned as its own repo later).
