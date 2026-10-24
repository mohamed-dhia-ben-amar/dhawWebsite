import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectCard } from './project-card';

describe('ProjectCard', () => {
  function render(withLink = true) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectCard);
    const ref = fixture.componentRef;
    ref.setInput('title', 'Configurable widget library for a CMS page builder');
    ref.setInput('summary', 'I built 21 of the 81 widgets in our team library.');
    if (withLink) {
      ref.setInput('href', '/work/widget-library');
      ref.setInput('linkLabel', 'Read case study');
    }
    ref.setInput('file', 'widget-library/README.md');
    ref.setInput('stack', 'Angular · Nx · Vitest');
    ref.setInput('stats', [
      { label: 'my_widgets', value: '21' },
      { label: 'team_widgets', value: '81' },
    ]);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders an article with an h3 title and summary', () => {
    const el = render();
    expect(el.querySelector('article h3')?.textContent).toBe(
      'Configurable widget library for a CMS page builder',
    );
    expect(el.querySelector('.card__summary')?.textContent).toContain('21 of the 81 widgets');
  });

  it('shows the file as the active tab and the stack as a secondary tab', () => {
    const tabs = render().querySelectorAll('.pane__tab');
    expect(tabs[0].textContent).toBe('widget-library/README.md');
    expect(tabs[0].classList).toContain('pane__tab--active');
    expect(tabs[1].textContent).toBe('Angular · Nx · Vitest');
  });

  it('links to the case study with a unique accessible name', () => {
    const link = render().querySelector<HTMLAnchorElement>('.card__link');
    expect(link?.getAttribute('href')).toBe('/work/widget-library');
    const accessibleText = [...(link?.childNodes ?? [])]
      .filter((node) => !(node instanceof Element && node.getAttribute('aria-hidden') === 'true'))
      .map((node) => node.textContent)
      .join('')
      .trim();
    expect(accessibleText).toBe(
      'Read case study — Configurable widget library for a CMS page builder',
    );
    expect(link?.querySelector('[aria-hidden="true"]')?.textContent).toBe('→');
  });

  it('renders no link without an href', () => {
    expect(render(false).querySelector('a')).toBeNull();
  });

  it('renders stats as a description list', () => {
    const el = render();
    expect([...el.querySelectorAll('dt')].map((d) => d.textContent)).toEqual([
      'my_widgets',
      'team_widgets',
    ]);
    expect([...el.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['21', '81']);
  });
});
