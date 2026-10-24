import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

// Vercel compiles api/*.ts to ES modules and runs them with plain Node, which (unlike Vitest)
// needs explicit file extensions on relative imports. This compiles the function the same way
// and loads it in a separate Node process, so a module-resolution mistake fails here, not in
// production with FUNCTION_INVOCATION_FAILED.
const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fileURLToPath(new URL('../.tmp/function-smoke/', import.meta.url));
const entry = `${outDir}api/contact.js`;

function runNode(code: string): string {
  return execFileSync(process.execPath, ['--no-warnings', '--input-type=module', '-e', code], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
}

describe('compiled /api/contact function', () => {
  beforeAll(() => {
    rmSync(outDir, { recursive: true, force: true });
    execFileSync(
      process.execPath,
      [
        `${root}node_modules/typescript/bin/tsc`,
        '-p',
        'tsconfig.server.json',
        '--noEmit',
        'false',
        '--outDir',
        outDir,
      ],
      { cwd: root, stdio: 'pipe' },
    );
  }, 60_000);

  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it('loads with import() and answers GET with 405', () => {
    const status = runNode(`
      const m = await import(${JSON.stringify(pathToFileURL(entry).href)});
      const res = await m.GET(new Request('https://example.test/api/contact'));
      console.log(res.status, (await res.json()).error);
    `);
    expect(status).toBe('405 method_not_allowed');
  });

  it('loads with require() too', () => {
    const exports = runNode(`
      import { createRequire } from 'node:module';
      const m = createRequire(import.meta.url)(${JSON.stringify(entry)});
      console.log(['POST', 'GET'].map((k) => typeof m[k]).join(','));
    `);
    expect(exports).toBe('function,function');
  });
});
