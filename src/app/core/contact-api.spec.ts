import { TestBed } from '@angular/core/testing';
import { ContactApi } from './contact-api';

describe('ContactApi', () => {
  const request = { name: 'Ada', email: 'ada@example.com', message: 'Hello there!', website: '' };
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  afterEach(() => vi.unstubAllGlobals());

  it('posts JSON to /api/contact', async () => {
    const fetchMock = vi.fn(async () => json(200, { ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await TestBed.inject(ContactApi).send(request)).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body as string)).toEqual(request);
  });

  it('returns the API error body for 4xx and 5xx answers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        json(400, { ok: false, error: 'validation', fields: { email: 'invalid' } }),
      ),
    );
    expect(await TestBed.inject(ContactApi).send(request)).toEqual({
      ok: false,
      error: 'validation',
      fields: { email: 'invalid' },
    });
  });

  it('reports a network error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))),
    );
    expect(await TestBed.inject(ContactApi).send(request)).toEqual({ ok: false, error: 'network' });
  });

  it('reports a network error when the answer is not the API JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html>502</html>', { status: 502 })),
    );
    expect(await TestBed.inject(ContactApi).send(request)).toEqual({ ok: false, error: 'network' });
  });
});
