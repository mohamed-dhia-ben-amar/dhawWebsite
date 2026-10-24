import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { ExperienceSection, experienceJson } from './experience-section';

describe('ExperienceSection', () => {
  function render() {
    const fixture = TestBed.createComponent(ExperienceSection);
    fixture.componentRef.setInput('content', home.experience);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lists the four experience files with the first one open', () => {
    const el = render();
    expect(
      [...el.querySelectorAll('.explorer__file')].map((f) => f.textContent?.replace(/\s+/g, '')),
    ).toEqual(['{}minotore.json', '{}converty.json', '{}ibspace.json', '{}inoteqia.json']);
    expect(el.querySelector('.explorer__file--active')?.textContent).toContain('minotore.json');
    expect(el.querySelector('.pane__tab--active')?.textContent).toBe('minotore.json');
  });

  it('shows the open file as JSON with the period highlighted as a date', () => {
    const el = render();
    expect(el.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('minotore.json');
    expect(el.querySelector('.tok--date')?.textContent).toBe('"Dec 2024 – present"');
    expect(el.querySelector('.code')?.textContent).toContain('"Frontend Developer"');
  });

  it('builds the editor JSON from the content fields', () => {
    expect(Object.keys(experienceJson(home.experience.items[0]))).toEqual([
      'role',
      'company',
      'industry',
      'period',
      'highlights',
    ]);
  });
});
