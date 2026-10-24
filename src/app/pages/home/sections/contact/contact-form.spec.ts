import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { ContactApi, type ContactResult } from '../../../../core/contact-api';
import { ContactForm, contactFieldValidator } from './contact-form';

describe('contactFieldValidator', () => {
  const check = (field: 'name' | 'email' | 'message', value: string) =>
    contactFieldValidator(field)({ value } as never);

  it('uses the limits from the brief on trimmed values', () => {
    expect(check('name', '   ')).toEqual({ required: true });
    expect(check('name', ' A ')).toEqual({ too_short: true });
    expect(check('name', 'Ada')).toBeNull();
    expect(check('name', 'x'.repeat(101))).toEqual({ too_long: true });
    expect(check('message', 'too short')).toEqual({ too_short: true });
    expect(check('message', 'x'.repeat(5001))).toEqual({ too_long: true });
  });

  it('checks the email format', () => {
    expect(check('email', 'nope')).toEqual({ invalid: true });
    expect(check('email', 'a b@c.de')).toEqual({ invalid: true });
    expect(check('email', ' ada@example.com ')).toBeNull();
  });
});

describe('ContactForm', () => {
  let send: ReturnType<typeof vi.fn<(r: unknown) => Promise<ContactResult>>>;

  async function render() {
    send = vi.fn<(r: unknown) => Promise<ContactResult>>();
    TestBed.configureTestingModule({ providers: [{ provide: ContactApi, useValue: { send } }] });
    const fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('content', home.contact.form);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const field = (id: string) => el.querySelector<HTMLInputElement>(`#contact-${id}`)!;
    const type = (id: string, value: string) => {
      field(id).value = value;
      field(id).dispatchEvent(new Event('input'));
    };
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const fillValid = () => {
      type('name', '  Ada Lovelace ');
      type('email', 'ada@example.com');
      type('message', 'Hello, I would like to talk about a role.');
    };
    return { fixture, el, field, type, submit, fillValid };
  }

  afterEach(() => document.body.querySelectorAll('app-contact-form').forEach((n) => n.remove()));

  it('labels every field and marks them required', async () => {
    const { el, field } = await render();
    for (const id of ['name', 'email', 'message']) {
      expect(el.querySelector(`label[for="contact-${id}"]`)).not.toBeNull();
      expect(field(id).getAttribute('aria-required')).toBe('true');
    }
    expect(field('email').type).toBe('email');
    expect(field('message').tagName).toBe('TEXTAREA');
    expect(el.querySelector('form')?.getAttribute('aria-label')).toBe('Contact form');
  });

  it('hides the honeypot from people and assistive technology', async () => {
    const { el, field } = await render();
    expect(el.querySelector('.cf__trap')?.getAttribute('aria-hidden')).toBe('true');
    expect(field('website').getAttribute('tabindex')).toBe('-1');
    expect(field('website').getAttribute('autocomplete')).toBe('off');
  });

  it('shows no errors before the first attempt', async () => {
    const { el } = await render();
    expect(el.querySelector('.cf__summary')).toBeNull();
    expect(el.querySelector('.cf__error')).toBeNull();
  });

  it('on an invalid submit, shows inline errors and a focused summary, and sends nothing', async () => {
    const { el, field, type, submit } = await render();
    type('email', 'nope');
    await submit();

    expect(send).not.toHaveBeenCalled();
    const summary = el.querySelector<HTMLElement>('.cf__summary')!;
    expect(document.activeElement).toBe(summary);
    expect([...summary.querySelectorAll('a')].map((a) => a.textContent?.trim())).toEqual([
      'Enter your name.',
      'Enter a valid email address, like name@example.com.',
      'Enter a message.',
    ]);
    expect(field('email').getAttribute('aria-invalid')).toBe('true');
    expect(field('email').getAttribute('aria-describedby')).toBe('contact-email-error');
    expect(el.querySelector('#contact-email-error')?.textContent).toContain('Enter a valid email');
  });

  it('summary links move focus to their field', async () => {
    const { el, field, submit } = await render();
    await submit();
    el.querySelectorAll<HTMLAnchorElement>('.cf__summary a')[1].click();
    expect(document.activeElement).toBe(field('email'));
  });

  it('the summary updates as fields are fixed', async () => {
    const { el, fixture, type, submit } = await render();
    await submit();
    type('name', 'Ada');
    fixture.detectChanges();
    expect(el.querySelectorAll('.cf__summary li')).toHaveLength(2);
  });

  it('sends trimmed values with the empty honeypot, then shows the focused success state', async () => {
    const { el, fixture, submit, fillValid } = await render();
    let resolve!: (r: ContactResult) => void;
    send.mockReturnValue(new Promise((r) => (resolve = r)));
    fillValid();
    await submit();

    expect(send).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello, I would like to talk about a role.',
      website: '',
    });
    const button = el.querySelector('button[type="submit"]')!;
    expect(button.textContent?.trim()).toBe('Sending…');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(el.querySelector('[aria-live="polite"]')?.textContent).toBe('Sending…');

    // A second submit while sending is ignored.
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    expect(send).toHaveBeenCalledTimes(1);

    resolve({ ok: true });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(el.querySelector('form')).toBeNull();
    const title = el.querySelector<HTMLElement>('.cf__success-title')!;
    expect(title.textContent).toBe('Message sent.');
    expect(document.activeElement).toBe(title);
  });

  it('"Send another message" brings back an empty form', async () => {
    const { el, fixture, field, submit, fillValid } = await render();
    send.mockResolvedValue({ ok: true });
    fillValid();
    await submit();
    el.querySelector<HTMLButtonElement>('.cf__success button')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(field('name').value).toBe('');
    expect(document.activeElement).toBe(field('name'));
    expect(el.querySelector('.cf__summary')).toBeNull();
  });

  it('shows the rate-limit message and keeps the form', async () => {
    const { el, field, submit, fillValid } = await render();
    send.mockResolvedValue({ ok: false, error: 'rate_limited' });
    fillValid();
    await submit();
    const alert = el.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Too many messages');
    expect(field('name').value).toBe('  Ada Lovelace ');
  });

  it('shows a generic failure with the email fallback for other errors', async () => {
    const { el, submit, fillValid } = await render();
    send.mockResolvedValue({ ok: false, error: 'network' });
    fillValid();
    await submit();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain(
      'email me at contact@mohameddhia.dev',
    );
  });

  it('maps field errors from the server onto the fields', async () => {
    const { el, field, submit, fillValid } = await render();
    send.mockResolvedValue({ ok: false, error: 'validation', fields: { email: 'invalid' } });
    fillValid();
    await submit();
    expect(field('email').getAttribute('aria-invalid')).toBe('true');
    expect(el.querySelectorAll('.cf__summary li')).toHaveLength(1);
    expect(document.activeElement).toBe(el.querySelector('.cf__summary'));
  });
});
