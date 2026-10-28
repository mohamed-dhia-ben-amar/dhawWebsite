import { TestBed } from '@angular/core/testing';
import { SectionSpy } from './section-spy';

describe('SectionSpy', () => {
  const sections: Record<string, number> = { home: 0, work: 900, contact: 2400 };
  let scrollY = 0;

  beforeEach(() => {
    scrollY = 0;
    document.body.innerHTML = Object.keys(sections)
      .map((id) => `<section id="${id}"></section>`)
      .join('');
    for (const [id, top] of Object.entries(sections)) {
      document.getElementById(id)!.getBoundingClientRect = () =>
        ({ top: top - scrollY }) as DOMRect;
    }
    Object.defineProperty(window, 'scrollY', { get: () => scrollY, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 3000,
      configurable: true,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  const scrollTo = async (y: number) => {
    scrollY = y;
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  };

  it('starts on the first section with zero progress', () => {
    const spy = TestBed.inject(SectionSpy);
    const stop = spy.track(['home', 'work', 'contact']);
    expect(spy.active()).toBe('home');
    expect(spy.progress()).toBe(0);
    stop();
  });

  it('activates a section once it passes the reading line and reports progress', async () => {
    const spy = TestBed.inject(SectionSpy);
    const stop = spy.track(['home', 'work', 'contact']);
    await scrollTo(700); // work top at 200 ≤ line (300)
    expect(spy.active()).toBe('work');
    expect(spy.progress()).toBeCloseTo(0.35);
    stop();
  });

  it('activates the last section at the bottom of the page', async () => {
    const spy = TestBed.inject(SectionSpy);
    const stop = spy.track(['home', 'work', 'contact']);
    await scrollTo(2000);
    expect(spy.active()).toBe('contact');
    expect(spy.progress()).toBe(1);
    stop();
  });

  it('exposes where each section starts on the progress scale', () => {
    const spy = TestBed.inject(SectionSpy);
    const stop = spy.track(['home', 'work', 'contact']);
    expect(spy.marks().map((m) => [m.id, Number(m.at.toFixed(2))])).toEqual([
      ['home', 0],
      ['work', 0.3],
      ['contact', 1],
    ]);
    stop();
  });

  it('resets when tracking stops', () => {
    const spy = TestBed.inject(SectionSpy);
    spy.track(['home', 'work'])();
    expect(spy.active()).toBeNull();
    expect(spy.marks()).toEqual([]);
  });
});
