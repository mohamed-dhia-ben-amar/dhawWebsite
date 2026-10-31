import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountUp, formatCount, parseCount } from './count-up';

describe('parseCount / formatCount', () => {
  it('splits a value around its number and keeps the separator style', () => {
    expect(parseCount('21')).toEqual({ prefix: '', target: 21, suffix: '', group: '' });
    expect(parseCount('~9,000')).toEqual({ prefix: '~', target: 9000, suffix: '', group: ',' });
    expect(parseCount('~9 000')).toMatchObject({ target: 9000, group: ' ' });
    expect(parseCount('4 days')).toEqual({ prefix: '', target: 4, suffix: ' days', group: '' });
    expect(parseCount('10k+')).toEqual({ prefix: '', target: 10, suffix: 'k+', group: '' });
    expect(parseCount('n/a')).toBeNull();
  });

  it('formats intermediate numbers like the original', () => {
    const parts = parseCount('~9,000')!;
    expect(formatCount(0, parts)).toBe('~0');
    expect(formatCount(1234.4, parts)).toBe('~1,234');
    expect(formatCount(9000, parts)).toBe('~9,000');
    expect(formatCount(2.6, parseCount('4 jours')!)).toBe('3 jours');
  });
});

@Component({
  imports: [CountUp],
  template: `<span id="target" [appCountUp]="value"></span>`,
})
class Host {
  value = '~9,000';
}

describe('CountUp', () => {
  let callback: IntersectionObserverCallback | undefined;
  let frame: FrameRequestCallback | undefined;
  let reduced = false;

  beforeEach(() => {
    callback = undefined;
    frame = undefined;
    reduced = false;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe = vi.fn();
        disconnect = vi.fn();
      },
    );
    vi.stubGlobal('matchMedia', () => ({ matches: reduced }) as MediaQueryList);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frame = cb;
      return 1;
    });
    vi.spyOn(performance, 'now').mockReturnValue(0);
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  async function render(top: number) {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return { top, bottom: top + 40 } as DOMRect;
    };
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    HTMLElement.prototype.getBoundingClientRect = original;
    const el = (fixture.nativeElement as HTMLElement).querySelector('#target')!;
    return { fixture, el };
  }

  it('also counts values that are on screen at load (stats just under the hero)', async () => {
    const { fixture, el } = await render(100);
    expect(el.textContent).toBe('~0');
    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    frame?.(1200);
    fixture.detectChanges();
    expect(el.textContent).toBe('~9,000');
  });

  it('does nothing with reduced motion', async () => {
    reduced = true;
    const { el } = await render(2000);
    expect(el.textContent).toBe('~9,000');
  });

  it('counts up from zero once the value scrolls into view, ending on the exact text', async () => {
    const { fixture, el } = await render(2000);
    expect(el.textContent).toBe('~0');

    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    frame?.(600);
    fixture.detectChanges();
    const middle = Number(el.textContent?.replace(/\D/g, ''));
    expect(middle).toBeGreaterThan(0);
    expect(middle).toBeLessThan(9000);

    frame?.(1200);
    fixture.detectChanges();
    expect(el.textContent).toBe('~9,000');
  });
});
