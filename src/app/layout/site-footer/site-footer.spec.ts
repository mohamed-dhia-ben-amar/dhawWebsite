import { TestBed } from '@angular/core/testing';
import { SiteFooter } from './site-footer';

describe('SiteFooter', () => {
  it('renders a footer landmark with the status bar copy', () => {
    const fixture = TestBed.createComponent(SiteFooter);
    fixture.detectChanges();
    const footer = (fixture.nativeElement as HTMLElement).querySelector('footer');
    expect(footer?.textContent).toContain('main ✓ · Angular SSR · Vercel');
    expect(footer?.textContent).toContain('© 2026 Mohamed Dhia Ben Amar');
  });
});
