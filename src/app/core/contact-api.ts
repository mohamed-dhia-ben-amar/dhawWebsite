import { Injectable } from '@angular/core';
import {
  CONTACT_ENDPOINT,
  type ContactField,
  type ContactFieldError,
  type ContactRequest,
  type ContactResponse,
} from '../../shared/contact';

export type ContactResult =
  | { readonly ok: true }
  | {
      readonly ok: false;
      /** `network` when the request never got a JSON answer. */
      readonly error: Extract<ContactResponse, { ok: false }>['error'] | 'network';
      readonly fields?: Partial<Record<ContactField, ContactFieldError>>;
    };

/**
 * Posts the contact form to /api/contact and turns every outcome into a typed result. Uses
 * `fetch` directly: the form is the only HTTP call on the site, so Angular's HttpClient would
 * add weight to every page's main bundle for one request.
 */
@Injectable({ providedIn: 'root' })
export class ContactApi {
  async send(request: ContactRequest): Promise<ContactResult> {
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(request),
      });
      const body: unknown = await response.json();
      if (isContactResponse(body)) return body;
    } catch {
      // Network failure or a non-JSON answer: handled below.
    }
    return { ok: false, error: 'network' };
  }
}

function isContactResponse(body: unknown): body is ContactResult {
  if (!body || typeof body !== 'object') return false;
  const value = body as { ok?: unknown; error?: unknown };
  return value.ok === true || (value.ok === false && typeof value.error === 'string');
}
