import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactApi } from './contact-api';

describe('ContactApi', () => {
  const request = { name: 'Ada', email: 'ada@example.com', message: 'Hello there!', website: '' };

  function setup() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    return { api: TestBed.inject(ContactApi), http: TestBed.inject(HttpTestingController) };
  }

  it('posts JSON to /api/contact', async () => {
    const { api, http } = setup();
    const result = api.send(request);
    const req = http.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ ok: true });
    expect(await result).toEqual({ ok: true });
  });

  it('returns the API error body for 4xx and 5xx answers', async () => {
    const { api, http } = setup();
    const result = api.send(request);
    http
      .expectOne('/api/contact')
      .flush(
        { ok: false, error: 'validation', fields: { email: 'invalid' } },
        { status: 400, statusText: 'Bad Request' },
      );
    expect(await result).toEqual({ ok: false, error: 'validation', fields: { email: 'invalid' } });
  });

  it('reports a network error when there is no JSON answer', async () => {
    const { api, http } = setup();
    const result = api.send(request);
    http.expectOne('/api/contact').error(new ProgressEvent('error'));
    expect(await result).toEqual({ ok: false, error: 'network' });
  });
});
