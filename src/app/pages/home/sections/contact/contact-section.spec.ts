import { TestBed } from '@angular/core/testing';
import { ContactApi } from '../../../../core/contact-api';
import { home } from '../../../../../content/en/home';
import { ContactSection } from './contact-section';

describe('ContactSection', () => {
  function render() {
    TestBed.configureTestingModule({
      providers: [{ provide: ContactApi, useValue: { send: vi.fn() } }],
    });
    const fixture = TestBed.createComponent(ContactSection);
    fixture.componentRef.setInput('content', home.contact);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #contact section inside a contact window', () => {
    const el = render();
    expect(el.querySelector('section')?.id).toBe('contact');
    expect(el.querySelector('app-terminal-window')?.classList).toContain('terminal--contact');
    expect(el.querySelector('.terminal__title')?.textContent).toBe('~/contact.sh');
    expect(el.querySelector('h2')?.textContent).toBe("Let's build something.");
  });

  it('links the email address with mailto', () => {
    const email = render().querySelector('.contact__email');
    expect(email?.getAttribute('href')).toBe('mailto:contact@mohameddhia.dev');
    expect(email?.textContent).toBe('contact@mohameddhia.dev');
  });

  it('includes the contact form', () => {
    expect(render().querySelector('app-contact-form form')).not.toBeNull();
  });
});
