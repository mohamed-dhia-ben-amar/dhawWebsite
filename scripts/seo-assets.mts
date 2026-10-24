// Post-build SEO assets (brief §8), run by `pnpm build` after `ng build`:
// - share images (1200×630 PNG) for the homepage and every case study, per locale, rendered from
//   the content files with the site's own fonts: /{locale}/og/{name}.png
// - sitemap.xml with hreflang alternates, listing only prerendered pages that are indexable
//   (read from each page's robots meta tag and canonical link)
// - robots.txt pointing to the sitemap
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { SITE_ORIGIN } from '../src/app/core/site-config';
import { home as enHome } from '../src/content/en/home';
import { site as enSite } from '../src/content/en/site';
import { work as enWork } from '../src/content/en/work';
import { home as frHome } from '../src/content/fr/home';
import { work as frWork } from '../src/content/fr/work';
import type { Locale } from '../src/content/types';

const root = fileURLToPath(new URL('..', import.meta.url));
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const outDir = join(root, vercel.outputDirectory);
const require = createRequire(import.meta.url);

// Values of the design tokens (src/styles/_tokens.scss); images cannot read CSS variables.
const C = {
  bg: '#0A0A0B',
  surface: '#111113',
  border: '#27272A',
  text: '#F4F4F5',
  muted: '#A1A1AA',
  accent: '#C6F432',
  onAccent: '#0A0A0B',
};

const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));
const fonts = [
  {
    name: 'Space Grotesk',
    data: font('@fontsource/space-grotesk', 'space-grotesk-latin-700-normal.woff'),
    weight: 700 as const,
    style: 'normal' as const,
  },
  {
    name: 'Inter',
    data: font('@fontsource/inter', 'inter-latin-400-normal.woff'),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'JetBrains Mono',
    data: font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
    weight: 500 as const,
    style: 'normal' as const,
  },
];

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (style: Record<string, unknown>, children?: unknown): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

/** Title as wrapped words so part of it can be highlighted (satori lays out with flexbox). */
function title(parts: { text: string; accent?: boolean }[], size: number): Node {
  const words = parts.flatMap((part) =>
    part.text
      .split(' ')
      .filter(Boolean)
      .map((word) => h({ marginRight: size * 0.26, color: part.accent ? C.accent : C.text }, word)),
  );
  return h(
    {
      flexWrap: 'wrap',
      fontFamily: 'Space Grotesk',
      fontSize: size,
      lineHeight: 1.08,
      letterSpacing: -size * 0.03,
    },
    words,
  );
}

function card(kicker: string, heading: Node, subtitle: string): Node {
  const host = new URL(SITE_ORIGIN).host;
  return h(
    { width: '100%', height: '100%', flexDirection: 'column', background: C.bg, color: C.text },
    [
      h(
        { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px' },
        [
          h({ justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 28 }, [
            h({}, [h({ color: C.text }, 'mdba'), h({ color: C.accent }, ':~$')]),
            h({ color: C.muted, fontSize: 24 }, kicker),
          ]),
          h({ flexDirection: 'column', gap: 28 }, [
            heading,
            h({ fontFamily: 'Inter', fontSize: 30, color: C.muted }, subtitle),
          ]),
        ],
      ),
      h(
        {
          justifyContent: 'space-between',
          padding: '18px 72px',
          background: C.accent,
          color: C.onAccent,
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
        },
        [h({}, enSite.seo.siteName), h({}, host)],
      ),
    ],
  );
}

async function renderPng(node: Node): Promise<Buffer> {
  const svg = await satori(node as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

async function writeImages(locale: Locale, home: typeof enHome, work: typeof enWork) {
  const dir = join(outDir, locale, 'og');
  mkdirSync(dir, { recursive: true });
  const { before, accent, after } = home.hero.headline;
  const images: [string, Node][] = [
    [
      'home',
      card(
        '$ whoami',
        title([{ text: before }, { text: accent, accent: true }, { text: after }], 64),
        home.hero.availability,
      ),
    ],
    ...work.caseStudies.map((study): [string, Node] => [
      study.slug,
      card(
        `$ cat ~/work/${study.file}`,
        title([{ text: study.title }], 68),
        study.stack.join(' · '),
      ),
    ]),
  ];
  for (const [name, node] of images) {
    writeFileSync(join(dir, `${name}.png`), await renderPng(node));
  }
  return images.map(([name]) => `${locale}/og/${name}.png`);
}

function pageFile(route: string): string {
  return join(outDir, route.replace(/^\//, ''), 'index.html');
}

const attr = (html: string, pattern: RegExp) => html.match(pattern)?.[1];

function sitemap(): { xml: string; urls: string[] } {
  const routes = Object.keys(
    JSON.parse(readFileSync(join(root, 'dist/dhaw-portfolio/prerendered-routes.json'), 'utf8'))
      .routes,
  ).sort();
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries: string[] = [];
  const urls: string[] = [];
  for (const route of routes) {
    const html = readFileSync(pageFile(route), 'utf8');
    const robots = attr(html, /<meta name="robots" content="([^"]*)"/) ?? '';
    const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
    if (robots.includes('noindex') || !canonical) continue;
    const alternates = [
      ...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g),
    ]
      .map(
        ([, lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}"/>`,
      )
      .join('\n');
    urls.push(canonical);
    entries.push(
      `  <url>\n    <loc>${canonical}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`,
    );
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return { xml, urls };
}

const images = [
  ...(await writeImages('en', enHome, enWork)),
  ...(await writeImages('fr', frHome, frWork)),
];
const { xml, urls } = sitemap();
writeFileSync(join(outDir, 'sitemap.xml'), xml);
writeFileSync(
  join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
);

console.log(
  `SEO assets: ${images.length} share images, sitemap with ${urls.length} URLs, robots.txt`,
);
for (const url of urls) console.log(`  ${url}`);
