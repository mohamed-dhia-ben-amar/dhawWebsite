import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { JourneySection } from './journey-section';

describe('JourneySection', () => {
  function render() {
    const fixture = TestBed.createComponent(JourneySection);
    fixture.componentRef.setInput('content', home.journey);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('is the #journey section with a prompt and a title', () => {
    const section = render().querySelector('section');
    expect(section?.id).toBe('journey');
    expect(section?.querySelector('h2')?.textContent).toBe('My journey so far');
  });

  it('lists every step newest first as an ordered list of h3 entries', () => {
    const el = render();
    expect(el.querySelector('ol')?.getAttribute('role')).toBe('list');
    expect([...el.querySelectorAll('h3')].map((h) => h.textContent)).toEqual([
      'Frontend Developer',
      'Full-Stack Engineer Intern',
      'Software Engineer Intern',
      'Department Lead, then Mentor',
      'Front-End Mobile Developer Intern',
      'Engineering Degree in Full-Stack Software Engineering',
    ]);
  });

  it('shows period, kind, organisation and note for each step', () => {
    const last = [...render().querySelectorAll('li')].at(-1)!;
    expect(last.querySelector('.journey__period')?.textContent).toBe('2019 – 2024');
    expect(last.querySelector('.journey__kind')?.textContent).toBe('type: education');
    expect(last.querySelector('.journey__org')?.textContent).toBe('ESPRIT');
    expect(last.querySelector('.journey__note')?.textContent).toBe(
      'Mobile development specialization.',
    );
  });

  it('keeps the timeline nodes decorative', () => {
    render()
      .querySelectorAll('.journey__node')
      .forEach((node) => expect(node.getAttribute('aria-hidden')).toBe('true'));
  });
});
