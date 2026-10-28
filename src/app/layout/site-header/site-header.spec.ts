import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SectionSpy } from '../../core/section-spy';
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
      a.textContent?.trim(),
      a.getAttribute('href'),
    ]);
    expect(links).toEqual([
      ['Home', '/#home'],
      ['Work', '/#work'],
      ['Experience', '/#experience'],
      ['Journey', '/#journey'],
      ['Contact', '/#contact'],
    ]);
  });

  it('gives every link a decorative icon and marks Home active on the homepage', () => {
    const el = render();
    const links = [...el.querySelectorAll<HTMLAnchorElement>('.nav__link')];
    links.forEach((a) => expect(a.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true'));
    expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([
      'true',
      null,
      null,
      null,
      null,
    ]);
    expect(links[0].classList).toContain('nav__link--active');
  });

  it('follows the section being read', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
    TestBed.inject(SectionSpy).active.set('experience');
    fixture.detectChanges();
    const active = (fixture.nativeElement as HTMLElement).querySelector(
      '[aria-current="true"].nav__link',
    );
    expect(active?.textContent?.trim()).toBe('Experience');
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
    expect([...el.querySelectorAll('.nav__label')].map((a) => a.textContent)).toEqual([
      'Accueil',
      'Projets',
      'Expérience',
      'Parcours',
      'Contact',
    ]);
    expect(el.querySelector('.langs__link[aria-current="true"]')?.getAttribute('href')).toBe(
      '/fr/',
    );
  });
});
