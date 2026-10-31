import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { home } from '../../../../../content/en/home';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(HeroSection);
    fixture.componentRef.setInput('content', home.hero);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const value = (name: RegExp) =>
      [...el.querySelectorAll<HTMLButtonElement>('.cfg__value')].find((b) =>
        name.test(b.getAttribute('aria-label') ?? ''),
      )!;
    const press = (button: HTMLElement) => {
      button.click();
      fixture.detectChanges();
    };
    return { fixture, el, value, press };
  }
  const render = () => setup().el;

  it('renders the headline with the accented phrase', () => {
    const h1 = render().querySelector('h1');
    expect(h1?.textContent?.trim()).toBe(
      'Full-stack engineer building configurable widget libraries and AI-assisted workflows.',
    );
    expect(h1?.querySelector('.hero__accent')?.textContent).toBe('configurable widget libraries');
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

  it('shows its live config next to it, in a labelled editor window', () => {
    const el = render();
    const editor = el.querySelector('[role="group"]');
    expect(editor?.getAttribute('aria-label')).toBe('Hero settings');
    expect(el.querySelector('.terminal__title')?.textContent).toBe('hero.widget.json');
  });

  it('"focus" swaps the headline between the three statements', () => {
    const { el, value, press } = setup();
    const h1 = () => el.querySelector('h1')?.textContent?.trim();
    press(value(/^Headline/));
    expect(h1()).toBe(
      'Full-stack engineer leading AI-assisted development with Claude Code agents.',
    );
    press(value(/^Headline/));
    expect(h1()).toBe('Full-stack engineer shipping with Angular, React, Node.js and Golang.');
    press(value(/^Headline/));
    expect(h1()).toContain('configurable widget libraries');
  });

  it('"accent" and "align" restyle the hero', () => {
    const { el, value, press } = setup();
    const hero = el.querySelector('.hero')!;
    press(value(/^Accent colour/));
    expect(hero.classList).toContain('hero--sky');
    press(value(/^Alignment/));
    expect(hero.classList).toContain('hero--center');
  });

  it('stack items hide and show their tag', () => {
    const { el, press } = setup();
    const tags = () =>
      [...el.querySelectorAll('.hero__stack .tag')].map((t) => t.textContent?.trim());
    const golang = el.querySelector<HTMLButtonElement>('.cfg__item[aria-label="Golang"]')!;
    press(golang);
    expect(tags()).not.toContain('Golang');
    expect(golang.getAttribute('aria-pressed')).toBe('false');
    press(golang);
    expect(tags()).toContain('Golang');
  });
});
