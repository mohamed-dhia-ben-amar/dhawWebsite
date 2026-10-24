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
});
