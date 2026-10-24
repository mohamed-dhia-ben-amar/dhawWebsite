import { TestBed } from '@angular/core/testing';
import { jsonToCodeLines } from './code-line';
import { CodeView } from './code-view';

describe('CodeView', () => {
  function render() {
    const fixture = TestBed.createComponent(CodeView);
    fixture.componentRef.setInput(
      'lines',
      jsonToCodeLines(
        { company: 'Minotore', period: 'Dec 2024 – present' },
        { dateKeys: ['period'] },
      ),
    );
    fixture.componentRef.setInput('label', 'minotore.json');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders one line per code line, without line numbers in the text', () => {
    const lines = [...render().querySelectorAll('.code__line')].map((l) => l.textContent);
    expect(lines).toEqual([
      '{',
      '  "company": "Minotore",',
      '  "period": "Dec 2024 – present"',
      '}',
    ]);
  });

  it('keeps the code text intact for copy and screen readers', () => {
    const code = [...render().querySelectorAll('.code__line')].map((l) => l.textContent);
    expect(code).toEqual([
      '{',
      '  "company": "Minotore",',
      '  "period": "Dec 2024 – present"',
      '}',
    ]);
  });

  it('applies token classes', () => {
    const el = render();
    expect(el.querySelector('.tok--key')?.textContent).toBe('"company"');
    expect(el.querySelector('.tok--string')?.textContent).toBe('"Minotore"');
    expect(el.querySelector('.tok--date')?.textContent).toBe('"Dec 2024 – present"');
  });

  it('is a focusable, labelled scroll region', () => {
    const region = render().querySelector('.code');
    expect(region?.getAttribute('role')).toBe('region');
    expect(region?.getAttribute('tabindex')).toBe('0');
    expect(region?.getAttribute('aria-label')).toBe('minotore.json');
  });
});
