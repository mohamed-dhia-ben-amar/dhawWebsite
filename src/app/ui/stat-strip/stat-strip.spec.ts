import { TestBed } from '@angular/core/testing';
import { StatStrip } from './stat-strip';

describe('StatStrip', () => {
  it('renders each stat as a list item with value then caption', () => {
    const fixture = TestBed.createComponent(StatStrip);
    fixture.componentRef.setInput('stats', [
      { value: '21', caption: 'widgets I authored, of 81 in our team library' },
      { value: '~9,000', caption: 'unit tests, 80–96% coverage' },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('ul')?.getAttribute('role')).toBe('list');
    const items = [...el.querySelectorAll('li')].map((li) => [
      li.querySelector('.stats__value .visually-hidden')?.textContent,
      li.querySelector('.stats__caption')?.textContent,
    ]);
    expect(items).toEqual([
      ['21', 'widgets I authored, of 81 in our team library'],
      ['~9,000', 'unit tests, 80–96% coverage'],
    ]);
  });

  it('shows the counting number to sight only; screen readers get the value', () => {
    const fixture = TestBed.createComponent(StatStrip);
    fixture.componentRef.setInput('stats', [{ value: '4 days', caption: 'delivery' }]);
    fixture.detectChanges();
    const shown = (fixture.nativeElement as HTMLElement).querySelector('[aria-hidden="true"]');
    expect(shown?.textContent).toBe('4 days');
  });
});
