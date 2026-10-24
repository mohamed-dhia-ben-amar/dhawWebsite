import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Vercel compiles api/*.ts with the nearest tsconfig (api/tsconfig.json) and its launcher loads
// the result as CommonJS. This compiles with that tsconfig and loads the output in a separate
// Node process with ES-module syntax detection turned off (which is what hid two production
// FUNCTION_INVOCATION_FAILED bugs locally), so module-format mistakes fail here instead.
const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fileURLToPath(new URL('../.tmp/function-smoke/', import.meta.url));
const entry = `${outDir}api/contact.js`;

function runNode(code: string): string {
  return execFileSync(
    process.execPath,
    ['--no-warnings', '--no-experimental-detect-module', '-e', code],
    {
      cwd: root,
      encoding: 'utf8',
    },
  ).trim();
}

describe('compiled /api/contact function', () => {
  beforeAll(() => {
    rmSync(outDir, { recursive: true, force: true });
    execFileSync(
      process.execPath,
      [`${root}node_modules/typescript/bin/tsc`, '-p', 'api/tsconfig.json', '--outDir', outDir],
      { cwd: root, stdio: 'pipe' },
    );
  }, 60_000);

  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it('is emitted as CommonJS', () => {
    expect(readFileSync(entry, 'utf8')).toMatch(/require\("\.\.\/server\/contact-handler\.js"\)/);
  });

  it('loads with require() as CommonJS and answers GET with 405', () => {
    const status = runNode(`
      const m = require(${JSON.stringify(entry)});
      m.GET(new Request('https://example.test/api/contact'))
        .then(async (res) => console.log(res.status, (await res.json()).error));
    `);
    expect(status).toBe('405 method_not_allowed');
  });

  it('loads with import() too', () => {
    const exports = runNode(`
      import(${JSON.stringify(pathToFileURL(entry).href)})
        .then((m) => console.log(['POST', 'GET'].map((k) => typeof m[k]).join(',')));
    `);
    expect(exports).toBe('function,function');
  });
});
