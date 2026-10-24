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
  type AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidationErrors,
} from '@angular/forms';
import type { ContactFormContent } from '../../../../../content/types';
import {
  CONTACT_LIMITS,
  type ContactField,
  type ContactFieldError,
  EMAIL_PATTERN,
} from '../../../../../shared/contact';
import { ContactApi } from '../../../../core/contact-api';

const FIELDS: readonly ContactField[] = ['name', 'email', 'message'];
const ERROR_ORDER: readonly ContactFieldError[] = ['required', 'too_short', 'too_long', 'invalid'];

/** Same rules as the API (src/shared/contact.ts), on trimmed values; error keys = API codes. */
export function contactFieldValidator(field: ContactField) {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = (control.value ?? '').trim();
    if (!value) return { required: true };
    if (field === 'email') {
      return value.length > 254 || !EMAIL_PATTERN.test(value) ? { invalid: true } : null;
    }
    const { min, max } = CONTACT_LIMITS[field];
    if (value.length < min) return { too_short: true };
    if (value.length > max) return { too_long: true };
    return null;
  };
}

type Status = 'idle' | 'submitting' | 'success';

/**
 * Contact form (brief §7): typed reactive form, inline messages, an error summary that takes
 * focus, loading and success states, and a honeypot. Posts to /api/contact through ContactApi.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  readonly content = input.required<ContactFormContent>();

  private readonly api = inject(ContactApi);
  private readonly injector = inject(Injector);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private readonly successTitle = viewChild<ElementRef<HTMLElement>>('successTitle');

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: contactFieldValidator('name') }),
    email: new FormControl('', { nonNullable: true, validators: contactFieldValidator('email') }),
    message: new FormControl('', {
      nonNullable: true,
      validators: contactFieldValidator('message'),
    }),
    website: new FormControl('', { nonNullable: true }),
  });

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
    const errors = this.form.controls[field].errors;
    return errors ? (ERROR_ORDER.find((code) => errors[code]) ?? 'invalid') : null;
  }

  protected showError(field: ContactField): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.attempted());
  }

  protected errorMessage(field: ContactField): string {
    return this.content().errors[field][this.errorCode(field) ?? 'invalid'];
  }

  protected invalidFields(): ContactField[] {
    return this.attempted() ? FIELDS.filter((field) => this.form.controls[field].invalid) : [];
  }

  protected focusField(event: Event, field: ContactField): void {
    event.preventDefault();
    document.getElementById(this.fieldId(field))?.focus();
  }

  protected async submit(): Promise<void> {
    if (this.submitting()) return;
    this.failure.set(null);
    this.attempted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.focusAfterRender(() => this.summary());
      return;
    }

    this.status.set('submitting');
    const { name, email, message, website } = this.form.getRawValue();
    const result = await this.api.send({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      website,
    });

    if (result.ok) {
      this.status.set('success');
      this.form.reset();
      this.attempted.set(false);
      this.focusAfterRender(() => this.successTitle());
      return;
    }

    this.status.set('idle');
    if (result.error === 'validation' && result.fields) {
      for (const [field, code] of Object.entries(result.fields)) {
        this.form.controls[field as ContactField].setErrors({ [code]: true });
      }
      this.focusAfterRender(() => this.summary());
    } else {
      const { failure } = this.content();
      this.failure.set(result.error === 'rate_limited' ? failure.rateLimited : failure.generic);
    }
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
