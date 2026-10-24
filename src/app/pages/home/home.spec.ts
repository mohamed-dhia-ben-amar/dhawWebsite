import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { home } from '../../../content/en/home';
import { Home } from './home';

describe('Home', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the sections in the order of the brief', () => {
    const el = render();
    const order = [...el.querySelectorAll('section')].map(
      (s) => s.id || s.getAttribute('aria-label') || s.getAttribute('aria-labelledby'),
    );
    expect(order).toEqual(['hero-title', 'Highlights', 'work', 'experience', 'contact']);
  });

  it('has exactly one h1 and an h2 per titled section', () => {
    const el = render();
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect([...el.querySelectorAll('h2')].map((h) => h.textContent)).toEqual([
      'Selected projects',
      "Where I've worked",
      "Let's build something.",
    ]);
  });

  it('sets the page title and description from the content', () => {
    render();
    expect(TestBed.inject(Title).getTitle()).toBe(home.meta.title);
    expect(TestBed.inject(Meta).getTag('name="description"')?.content).toBe(home.meta.description);
  });

  it('adds the Person structured data and removes it when left', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    const script = document.getElementById('person-jsonld');
    expect(JSON.parse(script?.textContent ?? '{}')['@type']).toBe('Person');
    fixture.destroy();
    expect(document.getElementById('person-jsonld')).toBeNull();
  });

  it('sets a canonical URL and the homepage share image', () => {
    render();
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://dhaw-website.vercel.app/en/',
    );
    expect(TestBed.inject(Meta).getTag('property="og:image"')?.content).toBe(
      'https://dhaw-website.vercel.app/en/og/home.png',
    );
  });
});
