import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormField,
  FormRoot,
  type TreeValidationResult,
  form,
  validate,
} from '@angular/forms/signals';
import type { ContactFormContent } from '../../../../../content/types';
import {
  CONTACT_LIMITS,
  type ContactField,
  type ContactFieldError,
  EMAIL_PATTERN,
} from '../../../../../shared/contact';
import { ContactApi } from '../../../../core/contact-api';
import { Sound } from '../../../../core/sound';

const FIELDS: readonly ContactField[] = ['name', 'email', 'message'];

/** Same rules as the API (src/shared/contact.ts), on trimmed values; codes = API codes. */
export function contactFieldError(field: ContactField, raw: string): ContactFieldError | undefined {
  const value = raw.trim();
  if (!value) return 'required';
  if (field === 'email') {
    return value.length > 254 || !EMAIL_PATTERN.test(value) ? 'invalid' : undefined;
  }
  const { min, max } = CONTACT_LIMITS[field];
  if (value.length < min) return 'too_short';
  if (value.length > max) return 'too_long';
  return undefined;
}

type Status = 'idle' | 'submitting' | 'success';

/**
 * Contact form (brief §7): a Signal Form, inline messages, an error summary that takes
 * focus, loading and success states, and a honeypot. Posts to /api/contact through ContactApi.
 */
@Component({
  selector: 'app-contact-form',
  imports: [FormField, FormRoot],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  readonly content = input.required<ContactFormContent>();

  private readonly api = inject(ContactApi);
  private readonly sound = inject(Sound);
  private readonly injector = inject(Injector);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly successTitle = viewChild<ElementRef<HTMLElement>>('successTitle');

  private readonly model = signal({ name: '', email: '', message: '', website: '' });
  protected readonly form = form(
    this.model,
    (path) => {
      for (const field of FIELDS) {
        validate(path[field], ({ value }) => {
          const kind = contactFieldError(field, value());
          return kind ? { kind } : undefined;
        });
      }
    },
    { submission: { action: () => this.send(), onInvalid: () => this.onInvalid() } },
  );

  protected readonly fields = FIELDS;
  protected readonly status = signal<Status>('idle');
  protected readonly submitting = computed(() => this.status() === 'submitting');
  /** Set after the first submit attempt: from then on, the summary and all messages show. */
  protected readonly attempted = signal(false);
  protected readonly failure = signal<string | null>(null);

  protected fieldId(field: ContactField): string {
    return `contact-${field}`;
  }

  /** First error code on a field, or null. */
  protected errorCode(field: ContactField): ContactFieldError | null {
    return (this.form[field]().errors()[0]?.kind as ContactFieldError | undefined) ?? null;
  }

  protected showError(field: ContactField): boolean {
    const state = this.form[field]();
    return state.invalid() && (state.touched() || this.attempted());
  }

  protected errorMessage(field: ContactField): string {
    return this.content().errors[field][this.errorCode(field) ?? 'invalid'];
  }

  protected invalidFields(): ContactField[] {
    return this.attempted() ? FIELDS.filter((field) => this.form[field]().invalid()) : [];
  }

  protected focusField(event: Event, field: ContactField): void {
    event.preventDefault();
    document.getElementById(this.fieldId(field))?.focus();
  }

  private onInvalid(): void {
    this.failure.set(null);
    this.attempted.set(true);
    this.focusAfterRender(() => this.summary());
  }

  /** Runs only when the form is valid; field errors it returns are shown on those fields. */
  private async send(): Promise<TreeValidationResult> {
    this.failure.set(null);
    this.attempted.set(true);
    this.status.set('submitting');
    const { name, email, message, website } = this.model();
    const result = await this.api.send({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website,
    });

    if (result.ok) {
      this.status.set('success');
      this.sound.play('success');
      this.form().reset({ name: '', email: '', message: '', website: '' });
      this.attempted.set(false);
      this.focusAfterRender(() => this.successTitle());
      return undefined;
    }

    this.status.set('idle');
    if (result.error === 'validation' && result.fields) {
      this.focusAfterRender(() => this.summary());
      return Object.entries(result.fields).map(([field, kind]) => ({
        kind,
        fieldTree: this.form[field as ContactField],
      }));
    }
    const { failure } = this.content();
    this.failure.set(result.error === 'rate_limited' ? failure.rateLimited : failure.generic);
    return undefined;
  }

  protected sendAnother(): void {
    this.status.set('idle');
    afterNextRender(() => document.getElementById(this.fieldId('name'))?.focus(), {
      injector: this.injector,
    });
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus(), { injector: this.injector });
  }
}
