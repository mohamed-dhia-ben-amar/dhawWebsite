import { TestBed } from '@angular/core/testing';
import { PromptLabel } from './prompt-label';

describe('PromptLabel', () => {
  function render(command: string): HTMLElement {
    const fixture = TestBed.createComponent(PromptLabel);
    fixture.componentRef.setInput('command', command);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the command after a $ sign', () => {
    const el = render('ls ~/featured-work');
    expect(el.textContent?.replace(/\s+/g, ' ').trim()).toBe('$ ls ~/featured-work');
  });

  it('hides the decorative $ from assistive technology', () => {
    const sign = render('whoami').querySelector('.prompt__sign');
    expect(sign?.getAttribute('aria-hidden')).toBe('true');
  });
});
