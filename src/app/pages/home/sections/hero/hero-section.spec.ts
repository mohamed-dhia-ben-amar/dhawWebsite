import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { home } from '../../../../../content/en/home';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(HeroSection);
    fixture.componentRef.setInput('content', home.hero);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the headline with the accented phrase', () => {
    const h1 = render().querySelector('h1');
    expect(h1?.textContent?.trim()).toBe(
      'Full-stack engineer building design systems and AI-assisted workflows.',
    );
    expect(h1?.querySelector('.hero__accent')?.textContent).toBe('design systems');
  });

  it('links "Get in touch" to the contact section', () => {
    const cta = render().querySelector('.button--primary');
    expect(cta?.textContent).toBe('Get in touch');
    expect(cta?.getAttribute('href')).toBe('/#contact');
  });

  it('offers both CV PDFs as downloads with descriptive names', () => {
    const links = [...render().querySelectorAll<HTMLAnchorElement>('.hero__cv-link')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/cv/Mohamed_Dhia_Ben_Amar_CV_2026_EN.pdf',
      '/cv/Mohamed_Dhia_Ben_Amar_CV_2026_FR.pdf',
    ]);
    links.forEach((a) => expect(a.hasAttribute('download')).toBe(true));
    expect(links.map((a) => a.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Download CV in English, PDF: EN',
      'Download CV in French, PDF: FR',
    ]);
  });

  it('links to GitHub and LinkedIn with rel="me"', () => {
    const profiles = [...render().querySelectorAll('.button--quiet')];
    expect(profiles.map((a) => [a.getAttribute('href'), a.getAttribute('rel')])).toEqual([
      ['https://github.com/mohamed-dhia-ben-amar', 'me'],
      ['https://linkedin.com/in/mohameddhia-benamar', 'me'],
    ]);
  });

  it('shows the animated terminal summary', () => {
    const el = render();
    expect(el.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Terminal summary');
    expect(el.querySelector('app-terminal-session')?.classList).toContain('session--animate');
  });
});
