import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { home } from '../../../../../content/en/home';
import { ProjectsSection } from './projects-section';

describe('ProjectsSection', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ProjectsSection);
    fixture.componentRef.setInput('content', home.work);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #work section with a prompt and title', () => {
    const section = render().querySelector('section');
    expect(section?.id).toBe('work');
    expect(section?.querySelector('app-prompt-label')?.textContent).toContain('ls ~/featured-work');
    expect(section?.querySelector('h2')?.textContent).toBe('Selected projects');
  });

  it('renders the three project cards, each linking to its case study', () => {
    const el = render();
    expect([...el.querySelectorAll('h3')].map((h) => h.textContent)).toEqual([
      'Configurable widget library for a CMS page builder',
      'NOVA: AI-assisted development workflow',
      'Converty Shop merchant app',
    ]);
    expect([...el.querySelectorAll('.card__link')].map((a) => a.getAttribute('href'))).toEqual([
      '/work/widget-library',
      '/work/nova',
      '/work/converty-shop',
    ]);
  });
});
