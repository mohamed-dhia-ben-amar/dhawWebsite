import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { CaseStudy } from './case-study';

describe('CaseStudy', () => {
  function render(slug: string, localeId = 'en-US') {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: localeId }],
    });
    const fixture = TestBed.createComponent(CaseStudy);
    fixture.componentRef.setInput('slug', slug);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the title and the sections in the order of the brief', () => {
    const { el } = render('nova');
    expect(el.querySelector('h1')?.textContent).toBe('NOVA: AI-assisted development workflow');
    expect(
      [...el.querySelectorAll('h2')].map((h) => h.textContent?.replace('##', '').trim()),
    ).toEqual(['Context', 'Problem', 'What I did', 'Stack', 'Results']);
  });

  it('hides sections that have no facts', () => {
    const headings = [...render('converty-shop').el.querySelectorAll('h2')].map((h) =>
      h.textContent?.replace('##', '').trim(),
    );
    expect(headings).toEqual(['Context', 'What I did', 'Stack', 'Results']);
  });

  it('shows the facts card, skipping facts that are not known', () => {
    const { el } = render('nova');
    const facts = [...el.querySelectorAll('.study__fact')].map((f) => [
      f.querySelector('dt')?.textContent,
      f.querySelector('dd')?.textContent?.replace(/\s+/g, ' ').trim(),
    ]);
    expect(facts).toEqual([
      ['role', 'Technical Lead'],
      ['company', 'Minotore'],
      ['location', 'Tunis (hybrid)'],
    ]);
    expect(el.querySelector('app-owner-note')).toBeNull();
  });

  it('renders the diagram as a captioned list of steps', () => {
    const { el } = render('converty-shop');
    expect(el.querySelector('figcaption')?.textContent).toBe(
      'Converty Shop, from the app to the orders',
    );
    expect(el.querySelectorAll('.flow__step')).toHaveLength(3);
  });

  it('links Converty Shop to both app stores', () => {
    const links = [...render('converty-shop').el.querySelectorAll('.study__links a')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      'https://apps.apple.com/dz/app/converty-shop/id6466304252',
      'https://play.google.com/store/apps/details?id=com.converty.app',
    ]);
  });

  it('links back to the projects and on to the next case study, wrapping around', () => {
    const { el } = render('converty-shop');
    const [back, next] = el.querySelectorAll('.study__nav a');
    expect(back.getAttribute('href')).toBe('/#work');
    expect(next.getAttribute('href')).toBe('/work/widget-library');
  });

  it('sets title and description, and is indexable', () => {
    render('widget-library');
    expect(TestBed.inject(Title).getTitle()).toBe(
      'Shared widget library for market finance · Mohamed Dhia Ben Amar',
    );
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('name="description"')?.content).toContain('76 accessible Angular widgets');
    expect(meta.getTag('name="robots"')).toBeNull();
  });

  it('uses its own share image and a canonical URL', () => {
    render('nova');
    const meta = TestBed.inject(Meta);
    expect(meta.getTag('property="og:type"')?.content).toBe('article');
    expect(meta.getTag('property="og:image"')?.content).toBe(
      'https://mohameddhia.dev/en/og/nova.png',
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://mohameddhia.dev/en/work/nova',
    );
  });

  it('uses the French copy in the fr build', () => {
    const { el } = render('nova', 'fr');
    expect(el.querySelector('h1')?.textContent).toBe(
      'NOVA : workflow de développement assisté par l’IA',
    );
    expect(el.querySelector('h2')?.textContent?.replace('##', '').trim()).toBe('Contexte');
  });
});
