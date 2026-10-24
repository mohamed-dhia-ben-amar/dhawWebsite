import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { ExperienceSection } from './experience-section';

describe('ExperienceSection', () => {
  it('is the #experience section with a prompt, a title and the experience tabs', () => {
    const fixture = TestBed.createComponent(ExperienceSection);
    fixture.componentRef.setInput('content', home.experience);
    fixture.detectChanges();
    const section = (fixture.nativeElement as HTMLElement).querySelector('section');
    expect(section?.id).toBe('experience');
    expect(section?.querySelector('app-prompt-label')?.textContent).toContain(
      'code experience.json',
    );
    expect(section?.querySelector('h2')?.textContent).toBe("Where I've worked");
    expect(section?.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Experience files',
    );
  });
});
