// Contact form rules shared by the Angular form and the /api/contact function (brief §7), so the
// client and the server can never disagree on what is valid.

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  message: { min: 10, max: 5000 },
} as const;

/** Deliberately simple: something@something.tld, no spaces. Same check on both sides. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Hidden field that people never fill in; bots that do are dropped silently. */
export const HONEYPOT_FIELD = 'website';

export const CONTACT_ENDPOINT = '/api/contact';

export type ContactField = 'name' | 'email' | 'message';

/** Per-field error codes the API returns. Never contains the submitted values. */
export type ContactFieldError = 'required' | 'too_short' | 'too_long' | 'invalid';

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly [HONEYPOT_FIELD]?: string;
}

export type ContactResponse =
  | { readonly ok: true }
  | {
      readonly ok: false;
      readonly error:
        | 'method_not_allowed'
        | 'forbidden'
        | 'unsupported_media_type'
        | 'payload_too_large'
        | 'invalid_json'
        | 'validation'
        | 'rate_limited'
        | 'not_configured'
        | 'send_failed';
      readonly fields?: Partial<Record<ContactField, ContactFieldError>>;
    };
