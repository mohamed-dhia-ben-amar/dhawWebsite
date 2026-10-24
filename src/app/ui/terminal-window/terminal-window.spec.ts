import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TerminalWindow } from './terminal-window';

@Component({
  imports: [TerminalWindow],
  template: `<app-terminal-window title="mohamed@tunis — zsh" [label]="label" [variant]="variant">
    <p class="projected">whoami</p>
  </app-terminal-window>`,
})
class Host {
  label: string | undefined = 'Terminal summary';
  variant: 'terminal' | 'contact' = 'terminal';
}

describe('TerminalWindow', () => {
  function render(changes: Partial<Host> = {}) {
    const fixture = TestBed.createComponent(Host);
    Object.assign(fixture.componentInstance, changes);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the title and projected body', () => {
    const el = render();
    expect(el.querySelector('.terminal__title')?.textContent).toBe('mohamed@tunis — zsh');
    expect(el.querySelector('.terminal__body .projected')?.textContent).toBe('whoami');
  });

  it('renders three decorative dots hidden from assistive technology', () => {
    const dots = render().querySelectorAll('.terminal__dot');
    expect(dots).toHaveLength(3);
    dots.forEach((dot) => expect(dot.getAttribute('aria-hidden')).toBe('true'));
  });

  it('is a labelled group only when a label is given', () => {
    const labelled = render().querySelector('.terminal');
    expect(labelled?.getAttribute('role')).toBe('group');
    expect(labelled?.getAttribute('aria-label')).toBe('Terminal summary');

    const plain = render({ label: undefined }).querySelector('.terminal');
    expect(plain?.hasAttribute('role')).toBe(false);
    expect(plain?.hasAttribute('aria-label')).toBe(false);
  });

  it('applies the contact variant class to the host', () => {
    const host = render({ variant: 'contact' }).querySelector('app-terminal-window');
    expect(host?.classList).toContain('terminal--contact');
  });
});
