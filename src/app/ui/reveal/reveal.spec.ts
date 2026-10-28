import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Reveal } from './reveal';

@Component({
  imports: [Reveal],
  template: `<div id="target" appReveal="2">content</div>`,
})
class Host {}

describe('Reveal', () => {
  let callback: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();

  beforeEach(() => {
    callback = undefined;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb;
        }
        observe = vi.fn();
        disconnect = disconnect;
      },
    );
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  });

  afterEach(() => vi.unstubAllGlobals());

  async function render(top: number) {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return { top, bottom: top + 100 } as DOMRect;
    };
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    HTMLElement.prototype.getBoundingClientRect = original;
    return { fixture, el: (fixture.nativeElement as HTMLElement).querySelector('#target')! };
  }

  it('leaves elements that are visible on load untouched', async () => {
    const { el } = await render(100);
    expect(el.classList).not.toContain('reveal');
    expect(callback).toBeUndefined();
  });

  it('hides below-the-fold elements until they scroll into view, with a stagger delay', async () => {
    const { fixture, el } = await render(2000);
    expect(el.classList).toContain('reveal');
    expect((el as HTMLElement).style.getPropertyValue('--reveal-delay')).toBe('160ms');

    callback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(el.classList).toContain('reveal--in');
    expect(disconnect).toHaveBeenCalled();
  });
});
