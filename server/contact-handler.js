'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createContactHandler = createContactHandler;
const zod_1 = require('zod');
const contact_js_1 = require('../src/shared/contact.js');
const rate_limit_js_1 = require('./rate-limit.js');
const send_email_js_1 = require('./send-email.js');
const MAX_BODY_BYTES = 16 * 1024;
const FIELDS = ['name', 'email', 'message'];
const schema = zod_1.z.object({
  name: zod_1.z
    .string()
    .trim()
    .min(contact_js_1.CONTACT_LIMITS.name.min)
    .max(contact_js_1.CONTACT_LIMITS.name.max),
  email: zod_1.z.string().trim().max(254).regex(contact_js_1.EMAIL_PATTERN),
  message: zod_1.z
    .string()
    .trim()
    .min(contact_js_1.CONTACT_LIMITS.message.min)
    .max(contact_js_1.CONTACT_LIMITS.message.max),
});
/**
 * POST /api/contact (brief §7): validates with Zod, drops honeypot hits silently, rate limits per
 * IP and emails the message as plain text. Every response is JSON with an error code; submitted
 * values are never echoed back.
 */
function createContactHandler(options) {
  const {
    env,
    rateLimiter = (0, rate_limit_js_1.createRateLimiter)({ limit: 5, windowMs: 10 * 60_000 }),
    sender = (apiKey) => (0, send_email_js_1.resendSender)(apiKey),
    log = (message) => console.error(message),
  } = options;
  return async function handle(request) {
    if (request.method !== 'POST') {
      return json(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' });
    }
    if (!isSameOrigin(request)) {
      return json(403, { ok: false, error: 'forbidden' });
    }
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return json(415, { ok: false, error: 'unsupported_media_type' });
    }
    if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
      return json(413, { ok: false, error: 'payload_too_large' });
    }
    const retryAfterMs = rateLimiter.hit(clientIp(request));
    if (retryAfterMs > 0) {
      return json(
        429,
        { ok: false, error: 'rate_limited' },
        { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
      );
    }
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
      return json(413, { ok: false, error: 'payload_too_large' });
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(400, { ok: false, error: 'invalid_json' });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json(400, { ok: false, error: 'invalid_json' });
    }
    // Bots fill in the hidden field: answer as if it worked and send nothing.
    const honeypot = body[contact_js_1.HONEYPOT_FIELD];
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      return json(200, { ok: true });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return json(400, { ok: false, error: 'validation', fields: fieldErrors(body, parsed.error) });
    }
    const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = env();
    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
      log('contact: RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set');
      return json(500, { ok: false, error: 'not_configured' });
    }
    const { name, email, message } = parsed.data;
    try {
      const sent = await sender(RESEND_API_KEY)({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        subject: `Portfolio contact from ${singleLine(name)}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
      });
      if (!sent) throw new Error('provider rejected the message');
    } catch (error) {
      log(`contact: sending failed (${error instanceof Error ? error.message : 'unknown error'})`);
      return json(502, { ok: false, error: 'send_failed' });
    }
    return json(200, { ok: true });
  };
}
function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}
/** Rejects cross-site posts: when the browser sends an Origin, it must be this site. */
function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    return new URL(origin).host === (host ?? new URL(request.url).host);
  } catch {
    return false;
  }
}
function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}
function singleLine(value) {
  return value.replace(/[\r\n]+/g, ' ').slice(0, 100);
}
/** Maps Zod issues to one code per field; never includes the submitted values. */
function fieldErrors(body, error) {
  const values = body;
  const result = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (!FIELDS.includes(field) || result[field]) continue;
    const value = values[field];
    if (typeof value !== 'string' || value.trim() === '') result[field] = 'required';
    else if (issue.code === 'too_small') result[field] = 'too_short';
    else if (issue.code === 'too_big') result[field] = 'too_long';
    else result[field] = 'invalid';
  }
  return result;
}
