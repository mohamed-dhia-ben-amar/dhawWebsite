import { TestBed } from '@angular/core/testing';
import { FileExplorer } from './file-explorer';

describe('FileExplorer', () => {
  function render() {
    const fixture = TestBed.createComponent(FileExplorer);
    fixture.componentRef.setInput('files', ['minotore.json', 'converty.json']);
    fixture.componentRef.setInput('active', 'minotore.json');
    fixture.componentRef.setInput('label', 'Experience files');
    fixture.componentRef.setInput('heading', 'Explorer');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a labelled navigation with one item per file', () => {
    const el = render();
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Experience files');
    expect([...el.querySelectorAll('li')].map((li) => li.textContent?.replace(/\s+/g, ''))).toEqual(
      ['{}minotore.json', '{}converty.json'],
    );
  });

  it('marks only the active file', () => {
    const [active, other] = render().querySelectorAll('li');
    expect(active.classList).toContain('explorer__file--active');
    expect(active.getAttribute('aria-current')).toBe('true');
    expect(other.hasAttribute('aria-current')).toBe(false);
  });

  it('hides the decorative heading and icons from assistive technology', () => {
    const el = render();
    expect(el.querySelector('.explorer__heading')?.getAttribute('aria-hidden')).toBe('true');
    el.querySelectorAll('.explorer__icon').forEach((icon) =>
      expect(icon.getAttribute('aria-hidden')).toBe('true'),
    );
  });
});
