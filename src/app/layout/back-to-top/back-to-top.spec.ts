import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BackToTop } from './back-to-top';

@Component({
  imports: [BackToTop],
  template: `<a id="site-logo" href="/">logo</a> <app-back-to-top label="Back to top" />`,
})
class Host {}

describe('BackToTop', () => {
  const setScroll = (y: number) =>
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

  async function render() {
    setScroll(0);
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const scrollTo = async (y: number) => {
      setScroll(y);
      window.dispatchEvent(new Event('scroll'));
      await nextFrame();
      fixture.detectChanges();
    };
    return { fixture, el, scrollTo, button: () => el.querySelector<HTMLButtonElement>('.to-top') };
  }

  afterEach(() => {
    setScroll(0);
    document.body.querySelectorAll('app-back-to-top').forEach((n) => n.parentElement?.remove());
  });

  it('is hidden at the top of the page', async () => {
    const { button } = await render();
    expect(button()).toBeNull();
  });

  it('appears after scrolling past a screen and hides again at the top', async () => {
    const { button, scrollTo } = await render();
    await scrollTo(window.innerHeight + 10);
    expect(button()).not.toBeNull();
    await scrollTo(0);
    expect(button()).toBeNull();
  });

  it('is a labelled button with a decorative icon', async () => {
    const { button, scrollTo } = await render();
    await scrollTo(window.innerHeight * 2);
    expect(button()?.getAttribute('type')).toBe('button');
    expect(button()?.getAttribute('aria-label')).toBe('Back to top');
    expect(button()?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('scrolls to the top and moves focus to the logo', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const { el, button, scrollTo } = await render();
    await scrollTo(window.innerHeight * 2);
    button()?.click();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: expect.any(String) });
    expect(document.activeElement).toBe(el.querySelector('#site-logo'));
    scrollToSpy.mockRestore();
  });
});
