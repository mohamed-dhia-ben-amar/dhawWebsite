import { TestBed } from '@angular/core/testing';
import { home } from '../../../../../content/en/home';
import { HERO_FOCUSES, HeroConfig, nextValue } from './hero-config';

describe('nextValue', () => {
  it('cycles through the values and wraps around', () => {
    expect(nextValue(HERO_FOCUSES, 'widgets')).toBe('ai');
    expect(nextValue(HERO_FOCUSES, 'fullstack')).toBe('widgets');
  });
});

describe('HeroConfig', () => {
  function render() {
    const fixture = TestBed.createComponent(HeroConfig);
    fixture.componentRef.setInput('content', home.hero.config);
    fixture.componentRef.setInput('stack', ['Angular', 'Golang']);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const click = (selector: string) => {
      el.querySelector<HTMLButtonElement>(selector)!.click();
      fixture.detectChanges();
    };
    const live = () => el.querySelector('[aria-live="polite"]')?.textContent?.trim();
    return { fixture, el, click, live };
  }

  it('names every value after its key and what pressing does', () => {
    const { el } = render();
    const names = [...el.querySelectorAll('.cfg__value')].map((b) => b.getAttribute('aria-label'));
    expect(names).toEqual([
      'Accent colour: amber. Change',
      'Alignment: start. Change',
      'Headline: widgets. Change',
      'Angular',
      'Golang',
    ]);
    el.querySelectorAll('.cfg__item').forEach((b) =>
      expect(b.getAttribute('aria-pressed')).toBe('true'),
    );
  });

  it('cycles a value, renames the button and announces the change', () => {
    const { fixture, el, click, live } = render();
    click('.cfg__value');
    expect(fixture.componentInstance.accent()).toBe('sky');
    expect(el.querySelector('.cfg__value')?.textContent?.trim()).toBe('"sky"');
    expect(el.querySelector('.cfg__value')?.getAttribute('aria-label')).toBe(
      'Accent colour: sky. Change',
    );
    expect(live()).toBe('Accent colour: sky');
  });

  it('toggles a stack item and announces it', () => {
    const { fixture, click, live } = render();
    click('.cfg__item[aria-label="Golang"]');
    expect(fixture.componentInstance.hidden()).toEqual(['Golang']);
    expect(live()).toBe('Golang hidden');
    click('.cfg__item[aria-label="Golang"]');
    expect(fixture.componentInstance.hidden()).toEqual([]);
    expect(live()).toBe('Golang shown');
  });

  it('reset is inert until something changed, then restores the defaults', () => {
    const { fixture, el, click } = render();
    const reset = () => el.querySelector('.cfg__reset')!;
    expect(reset().getAttribute('aria-disabled')).toBe('true');
    click('.cfg__value');
    click('.cfg__item[aria-label="Angular"]');
    expect(reset().getAttribute('aria-disabled')).toBe('false');
    click('.cfg__reset');
    const c = fixture.componentInstance;
    expect([c.accent(), c.align(), c.focus(), c.hidden()]).toEqual([
      'amber',
      'start',
      'widgets',
      [],
    ]);
    expect(reset().getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps code identifiers out of automatic translation', () => {
    expect(render().el.querySelector('.cfg')?.getAttribute('translate')).toBe('no');
  });
});
