import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SectionSpy } from '../../core/section-spy';
import { SectionStepper } from './section-stepper';

describe('SectionStepper', () => {
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'Work' },
    { id: 'contact', label: 'Contact' },
  ];

  function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(SectionStepper);
    fixture.componentRef.setInput('sections', sections);
    fixture.componentRef.setInput('label', 'Page sections');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, el, spy: TestBed.inject(SectionSpy) };
  }

  it('is a labelled navigation with a link per section', () => {
    const { el } = render();
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Page sections');
    expect(
      [...el.querySelectorAll('a')].map((a) => [a.textContent?.trim(), a.getAttribute('href')]),
    ).toEqual([
      ['Home', '/#home'],
      ['Work', '/#work'],
      ['Contact', '/#contact'],
    ]);
  });

  it('spreads the dots evenly before the page is measured', () => {
    const items = [...render().el.querySelectorAll<HTMLElement>('.stepper__item')];
    expect(items.map((i) => i.style.getPropertyValue('--at'))).toEqual(['0', '0.5', '1']);
  });

  it('follows the spy: positions, progress fill, passed and active dots', () => {
    const { fixture, el, spy } = render();
    spy.marks.set([
      { id: 'home', at: 0 },
      { id: 'work', at: 0.3 },
      { id: 'contact', at: 1 },
    ]);
    spy.progress.set(0.4);
    spy.active.set('work');
    fixture.detectChanges();

    expect(
      el.querySelector<HTMLElement>('.stepper__fill')?.style.getPropertyValue('--progress'),
    ).toBe('0.4');
    const dots = [...el.querySelectorAll('.stepper__dot')];
    expect(dots.map((d) => d.classList.contains('stepper__dot--passed'))).toEqual([
      true,
      true,
      false,
    ]);
    expect(dots[1].classList).toContain('stepper__dot--active');
    expect(dots[1].getAttribute('aria-current')).toBe('true');
    expect(dots[0].hasAttribute('aria-current')).toBe(false);
  });

  it('hides the decorative prompt and cursor from assistive technology', () => {
    const { el } = render();
    expect(el.querySelector('.stepper__prompt')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.stepper__cursor')?.getAttribute('aria-hidden')).toBe('true');
  });
});
