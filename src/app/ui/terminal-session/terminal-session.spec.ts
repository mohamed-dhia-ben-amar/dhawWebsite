import { TestBed } from '@angular/core/testing';
import { TerminalSession } from './terminal-session';

describe('TerminalSession', () => {
  const entries = [
    { command: 'whoami', output: 'Mohamed Dhia Ben Amar' },
    { command: 'status', output: 'available for new roles', status: true },
  ];

  function render(animate = false) {
    const fixture = TestBed.createComponent(TerminalSession);
    fixture.componentRef.setInput('entries', entries);
    fixture.componentRef.setInput('animate', animate);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every command and output as text', () => {
    const el = render();
    expect([...el.querySelectorAll('.session__typed')].map((c) => c.textContent)).toEqual([
      'whoami',
      'status',
    ]);
    expect([...el.querySelectorAll('.session__out')].map((o) => o.textContent?.trim())).toEqual([
      'Mohamed Dhia Ben Amar',
      'available for new roles',
    ]);
  });

  it('hides decorative signs, status dot and the cursor line from assistive technology', () => {
    const el = render();
    el.querySelectorAll('.session__out .session__sign, .session__status').forEach((n) =>
      expect(n.getAttribute('aria-hidden')).toBe('true'),
    );
    expect(el.querySelector('.session__prompt')?.getAttribute('aria-hidden')).toBe('true');
    expect(el.querySelector('.session__cursor')).not.toBeNull();
  });

  it('only animates when asked to', () => {
    const fixture = TestBed.createComponent(TerminalSession);
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList).not.toContain('session--animate');

    fixture.componentRef.setInput('animate', true);
    fixture.detectChanges();
    expect(host.classList).toContain('session--animate');
  });

  it('sequences the typing: each line starts after the previous output', () => {
    const el = render(true);
    const ms = (node: Element | null, prop: string) =>
      parseFloat((node as HTMLElement).style.getPropertyValue(prop));
    const [first, second] = el.querySelectorAll('.session__typed');
    const [firstOut] = el.querySelectorAll('.session__out');

    expect((first as HTMLElement).style.getPropertyValue('--chars')).toBe('6');
    expect(ms(firstOut, '--delay')).toBeGreaterThan(ms(first, '--delay') + ms(first, '--duration'));
    expect(ms(second, '--delay')).toBeGreaterThan(ms(firstOut, '--delay'));
    expect(ms(el.querySelector('.session__prompt'), '--delay')).toBeGreaterThan(
      ms(second, '--delay'),
    );
  });
});
