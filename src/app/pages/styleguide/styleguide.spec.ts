import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Styleguide } from './styleguide';

describe('Styleguide', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('renders one h1 and a section per component', () => {
    const fixture = TestBed.createComponent(Styleguide);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect([...el.querySelectorAll('h2')].map((h) => h.textContent)).toContain('ProjectCard');
  });

  it('is noindex while shown, and drops the tag when left', () => {
    const meta = TestBed.inject(Meta);
    const fixture = TestBed.createComponent(Styleguide);
    expect(meta.getTag('name="robots"')?.content).toBe('noindex, nofollow');
    fixture.destroy();
    expect(meta.getTag('name="robots"')).toBeNull();
  });
});
