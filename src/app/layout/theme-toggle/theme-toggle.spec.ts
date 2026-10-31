import { TestBed } from '@angular/core/testing';
import { Theme } from '../../core/theme';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  // Test files can share storage and <html>: start and end without a picked theme.
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  function render() {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.componentRef.setInput('toLight', 'Switch to light theme');
    fixture.componentRef.setInput('toDark', 'Switch to dark theme');
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
    return { fixture, button };
  }

  it('is a button named after what it does, with decorative icons', () => {
    const { button } = render();
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
    const icons = button.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    icons.forEach((svg) => expect(svg.getAttribute('aria-hidden')).toBe('true'));
  });

  it('switches the theme and renames itself', () => {
    const { fixture, button } = render();
    button.click();
    fixture.detectChanges();
    expect(TestBed.inject(Theme).current()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
  });
});
