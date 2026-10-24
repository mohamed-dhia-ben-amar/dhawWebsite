import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type ContactEnv, createContactHandler } from './contact-handler';
import { createRateLimiter } from './rate-limit';
import type { OutgoingEmail } from './send-email';
import { resendSender } from './send-email';

const ENV: ContactEnv = {
  RESEND_API_KEY: 're_test',
  CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'Portfolio <onboarding@resend.dev>',
};

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello, I would like to talk about a role.',
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://dhaw-website.vercel.app/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Host: 'dhaw-website.vercel.app',
      'X-Forwarded-For': '203.0.113.7',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  let sent: OutgoingEmail[];
  let send: ReturnType<typeof vi.fn<(email: OutgoingEmail) => Promise<boolean>>>;
  let log: ReturnType<typeof vi.fn<(message: string) => void>>;
  let env: ContactEnv;

  function handler(limit = 100) {
    return createContactHandler({
      env: () => env,
      rateLimiter: createRateLimiter({ limit, windowMs: 60_000 }),
      sender: () => send,
      log,
    });
  }

  beforeEach(() => {
    sent = [];
    env = ENV;
    send = vi.fn(async (email: OutgoingEmail) => {
      sent.push(email);
      return true;
    });
    log = vi.fn();
  });

  it('sends a valid message as plain text and answers ok', async () => {
    const response = await handler()(post({ ...VALID, name: '  Ada Lovelace  ' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(sent).toEqual([
      {
        from: ENV.CONTACT_FROM_EMAIL,
        to: ENV.CONTACT_TO_EMAIL,
        replyTo: 'ada@example.com',
        subject: 'Portfolio contact from Ada Lovelace',
        text: `Name: Ada Lovelace\nEmail: ada@example.com\n\n${VALID.message}\n`,
      },
    ]);
  });

  it('rejects other methods with 405', async () => {
    const response = await handler()(new Request('https://x.test/api/contact', { method: 'GET' }));
    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('POST');
    expect(await response.json()).toEqual({ ok: false, error: 'method_not_allowed' });
  });

  it('rejects cross-site posts', async () => {
    const response = await handler()(post(VALID, { Origin: 'https://evil.example' }));
    expect(response.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it('accepts same-origin posts', async () => {
    const response = await handler()(post(VALID, { Origin: 'https://dhaw-website.vercel.app' }));
    expect(response.status).toBe(200);
  });

  it('requires JSON', async () => {
    const response = await handler()(post('name=x', { 'Content-Type': 'text/plain' }));
    expect(response.status).toBe(415);
  });

  it('rejects malformed JSON and non-object bodies', async () => {
    expect((await handler()(post('{nope'))).status).toBe(400);
    const array = await handler()(post([1, 2]));
    expect(await array.json()).toEqual({ ok: false, error: 'invalid_json' });
  });

  it('rejects oversized bodies', async () => {
    const response = await handler()(post({ ...VALID, message: 'x'.repeat(20_000) }));
    expect(response.status).toBe(413);
  });

  it('returns one error code per invalid field, without echoing the input', async () => {
    const response = await handler()(post({ name: 'A', email: '<script>@nope', message: '   ' }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      ok: false,
      error: 'validation',
      fields: { name: 'too_short', email: 'invalid', message: 'required' },
    });
    expect(JSON.stringify(body)).not.toContain('script');
    expect(send).not.toHaveBeenCalled();
  });

  it('enforces the length limits from the brief', async () => {
    const response = await handler()(
      post({ name: 'x'.repeat(101), email: 'a@b.co', message: 'y'.repeat(5001) }),
    );
    expect((await response.json()).fields).toEqual({ name: 'too_long', message: 'too_long' });
  });

  it('flags missing fields as required', async () => {
    const response = await handler()(post({}));
    expect((await response.json()).fields).toEqual({
      name: 'required',
      email: 'required',
      message: 'required',
    });
  });

  it('drops honeypot hits silently', async () => {
    const response = await handler()(post({ ...VALID, website: 'https://spam.example' }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it('rate limits per IP', async () => {
    const handle = handler(2);
    expect((await handle(post(VALID))).status).toBe(200);
    expect((await handle(post(VALID))).status).toBe(200);
    const limited = await handle(post(VALID));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('retry-after'))).toBeGreaterThan(0);
    expect((await handle(post(VALID, { 'X-Forwarded-For': '198.51.100.1' }))).status).toBe(200);
    expect(sent).toHaveLength(3);
  });

  it('keeps line breaks out of the subject', async () => {
    await handler()(post({ ...VALID, name: 'Ada\r\nBcc: x@y.z' }));
    expect(sent[0].subject).toBe('Portfolio contact from Ada Bcc: x@y.z');
  });

  it('answers 500 and logs when not configured', async () => {
    env = { ...ENV, RESEND_API_KEY: undefined };
    const response = await handler()(post(VALID));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, error: 'not_configured' });
    expect(log).toHaveBeenCalledOnce();
  });

  it('answers 502 when the provider fails or throws', async () => {
    send.mockResolvedValueOnce(false);
    expect((await handler()(post(VALID))).status).toBe(502);
    send.mockRejectedValueOnce(new Error('network down'));
    const response = await handler()(post(VALID));
    expect(await response.json()).toEqual({ ok: false, error: 'send_failed' });
    expect(log).toHaveBeenLastCalledWith('contact: sending failed (network down)');
  });
});

describe('resendSender', () => {
  it('posts the email to the Resend API', async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 200 }));
    const ok = await resendSender(
      're_key',
      fetchFn as unknown as typeof fetch,
    )({
      from: 'a@x.dev',
      to: 'b@x.dev',
      replyTo: 'c@x.dev',
      subject: 'Hi',
      text: 'Body',
    });
    expect(ok).toBe(true);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers).toEqual({
      Authorization: 'Bearer re_key',
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(init.body as string)).toEqual({
      from: 'a@x.dev',
      to: ['b@x.dev'],
      reply_to: 'c@x.dev',
      subject: 'Hi',
      text: 'Body',
    });
  });

  it('reports a rejected request', async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 422 }));
    expect(
      await resendSender(
        'k',
        fetchFn as unknown as typeof fetch,
      )({
        from: 'a',
        to: 'b',
        replyTo: 'c',
        subject: 's',
        text: 't',
      }),
    ).toBe(false);
  });
});
