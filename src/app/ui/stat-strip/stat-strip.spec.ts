import { TestBed } from '@angular/core/testing';
import { StatStrip } from './stat-strip';

describe('StatStrip', () => {
  it('renders each stat as a list item with value then caption', () => {
    const fixture = TestBed.createComponent(StatStrip);
    fixture.componentRef.setInput('stats', [
      { value: '76', caption: 'reusable widgets across 8 projects' },
      { value: '~9,000', caption: 'unit tests, 80–96% coverage' },
    ]);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('ul')?.getAttribute('role')).toBe('list');
    const items = [...el.querySelectorAll('li')].map((li) => [
      li.querySelector('.stats__value')?.textContent,
      li.querySelector('.stats__caption')?.textContent,
    ]);
    expect(items).toEqual([
      ['76', 'reusable widgets across 8 projects'],
      ['~9,000', 'unit tests, 80–96% coverage'],
    ]);
  });
});
