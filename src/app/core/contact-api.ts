import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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

/** Posts the contact form to /api/contact and turns every outcome into a typed result. */
@Injectable({ providedIn: 'root' })
export class ContactApi {
  private readonly http = inject(HttpClient);

  async send(request: ContactRequest): Promise<ContactResult> {
    try {
      return await firstValueFrom(this.http.post<ContactResponse>(CONTACT_ENDPOINT, request));
    } catch (error) {
      const body = error instanceof HttpErrorResponse ? error.error : null;
      if (body && typeof body === 'object' && body.ok === false && typeof body.error === 'string') {
        return body as ContactResult;
      }
      return { ok: false, error: 'network' };
    }
  }
}
