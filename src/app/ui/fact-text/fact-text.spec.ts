import { TestBed } from '@angular/core/testing';
import { FactText } from './fact-text';

describe('FactText', () => {
  function render(fact: string | { owner: string }) {
    const fixture = TestBed.createComponent(FactText);
    fixture.componentRef.setInput('fact', fact);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders plain text facts as text', () => {
    const el = render('Cut widget size by 30–50%.');
    expect(el.textContent?.trim()).toBe('Cut widget size by 30–50%.');
    expect(el.querySelector('app-owner-note')).toBeNull();
  });

  it('renders missing facts as an owner note', () => {
    const el = render({ owner: 'add the period' });
    expect(el.querySelector('app-owner-note')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      '[OWNER: add the period]',
    );
  });
});
