import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
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
});
