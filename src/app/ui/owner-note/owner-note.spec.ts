import { TestBed } from '@angular/core/testing';
import { OwnerNote } from './owner-note';

describe('OwnerNote', () => {
  it('renders a clearly marked [OWNER: …] placeholder', () => {
    const fixture = TestBed.createComponent(OwnerNote);
    fixture.componentRef.setInput('note', 'add architecture diagram');
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent?.replace(/\s+/g, ' ').trim();
    expect(text).toBe('[OWNER: add architecture diagram]');
  });
});
