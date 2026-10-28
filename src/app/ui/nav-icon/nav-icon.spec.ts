import { TestBed } from '@angular/core/testing';
import { NavIcon } from './nav-icon';

describe('NavIcon', () => {
  for (const name of ['home', 'work', 'experience', 'journey', 'contact'] as const) {
    it(`renders a decorative ${name} icon`, () => {
      const fixture = TestBed.createComponent(NavIcon);
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();
      const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(svg?.children.length).toBeGreaterThan(0);
    });
  }
});
