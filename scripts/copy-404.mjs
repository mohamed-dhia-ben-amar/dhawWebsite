// Copies the prerendered English 404 page to the site root as 404.html, which Vercel (and
// scripts/serve-dist.mjs) serve for any unknown URL. Run after `ng build`.
import { copyFileSync, readFileSync } from 'node:fs';

const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const root = new URL(`../${vercel.outputDirectory}/`, import.meta.url);

copyFileSync(new URL('en/404/index.html', root), new URL('404.html', root));
console.log(`Copied en/404/index.html to ${vercel.outputDirectory}/404.html`);
