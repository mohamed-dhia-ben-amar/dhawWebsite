import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  function render(localeId = 'en-US') {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: localeId }],
    });
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the logo as a home link with a descriptive accessible name', () => {
    const logo = render().querySelector('.header__logo');
    expect(logo?.getAttribute('href')).toBe('/');
    expect(logo?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'mdba:~$ Mohamed Dhia Ben Amar, home',
    );
  });

  it('renders the main navigation with links to homepage sections', () => {
    const nav = render().querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Main');
    const links = [...(nav?.querySelectorAll('a') ?? [])].map((a) => [
      a.textContent,
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['./work', '/#work'],
      ['./experience', '/#experience'],
      ['./contact', '/#contact'],
    ]);
  });

  it('renders the language switch for the current page with English marked current', () => {
    const links = [...render().querySelectorAll('.langs__link')];
    expect(links.map((a) => [a.getAttribute('href'), a.getAttribute('aria-current')])).toEqual([
      ['/en/', 'true'],
      ['/fr/', null],
    ]);
  });

  it('uses the French copy and marks French current in the fr build', () => {
    const el = render('fr');
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Principale');
    expect([...el.querySelectorAll('.header__link')].map((a) => a.textContent)).toEqual([
      './projets',
      './parcours',
      './contact',
    ]);
    expect(el.querySelector('[aria-current="true"]')?.getAttribute('href')).toBe('/fr/');
  });
});
