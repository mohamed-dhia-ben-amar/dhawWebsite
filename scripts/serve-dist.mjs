// Serves the prerendered build like Vercel does, using the redirects and rewrites from
// vercel.json, so e2e tests exercise the production routing. Usage: node scripts/serve-dist.mjs [port]
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import compression from 'compression';
import handler from 'serve-handler';

const port = Number(process.argv[2] ?? 4300);
const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

const config = {
  public: vercel.outputDirectory,
  directoryListing: false,
  rewrites: vercel.rewrites ?? [],
  redirects: (vercel.redirects ?? []).map(({ source, destination, permanent }) => ({
    source,
    destination,
    type: permanent ? 308 : 307,
  })),
};

// Compress text responses like Vercel's CDN, so local Lighthouse runs are comparable.
const compress = compression();

createServer((req, res) => compress(req, res, () => handler(req, res, config))).listen(port, () => {
  console.log(`Serving ${config.public} on http://localhost:${port}`);
});
