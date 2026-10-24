import { TestBed } from '@angular/core/testing';
import { site } from '../../../content/en/site';
import { LanguageSwitch } from './language-switch';

describe('LanguageSwitch', () => {
  function render(current: 'en' | 'fr', path?: string) {
    const fixture = TestBed.createComponent(LanguageSwitch);
    fixture.componentRef.setInput('options', site.languages.options);
    fixture.componentRef.setInput('current', current);
    fixture.componentRef.setInput('label', 'Language');
    if (path !== undefined) fixture.componentRef.setInput('path', path);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('links to the same page in every locale', () => {
    const hrefs = [...render('en', '/work/nova').querySelectorAll('a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual(['/en/work/nova', '/fr/work/nova']);
  });

  it('defaults to the locale root and tolerates paths without a leading slash', () => {
    expect(render('en').querySelector('a')?.getAttribute('href')).toBe('/en/');
    expect(render('en', 'work').querySelector('a')?.getAttribute('href')).toBe('/en/work');
  });

  it('marks only the current locale with aria-current', () => {
    const [en, fr] = render('fr').querySelectorAll('a');
    expect(en.hasAttribute('aria-current')).toBe(false);
    expect(fr.getAttribute('aria-current')).toBe('true');
  });

  it('labels each link with its language for screen readers', () => {
    const fr = render('en').querySelectorAll('a')[1];
    expect(fr.getAttribute('lang')).toBe('fr');
    expect(fr.getAttribute('hreflang')).toBe('fr');
    expect(fr.textContent?.replace(/\s+/g, ' ').trim()).toBe('FR Français');
  });
});
