import { TestBed } from '@angular/core/testing';
import { StatusBar } from './status-bar';

describe('StatusBar', () => {
  it('renders the start and end text', () => {
    const fixture = TestBed.createComponent(StatusBar);
    fixture.componentRef.setInput('start', 'main ✓ · Angular SSR · Vercel');
    fixture.componentRef.setInput('end', '© 2026 Mohamed Dhia Ben Amar');
    fixture.detectChanges();
    const spans = (fixture.nativeElement as HTMLElement).querySelectorAll('.status span');
    expect([...spans].map((s) => s.textContent)).toEqual([
      'main ✓ · Angular SSR · Vercel',
      '© 2026 Mohamed Dhia Ben Amar',
    ]);
  });
});
