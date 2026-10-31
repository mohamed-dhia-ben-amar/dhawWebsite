import { TestBed } from '@angular/core/testing';
import { THEME_COLORS, THEME_STORAGE_KEY, Theme } from './theme';

describe('Theme', () => {
  let systemLight = false;
  let reduced = false;
  let systemListener: (() => void) | undefined;

  beforeEach(() => {
    systemLight = false;
    reduced = false;
    systemListener = undefined;
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
    document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = THEME_COLORS.dark;
    document.head.append(meta);
    vi.stubGlobal(
      'matchMedia',
      (query: string) =>
        ({
          get matches() {
            return query.includes('color-scheme') ? systemLight : reduced;
          },
          addEventListener: (_: string, fn: () => void) => (systemListener = fn),
          removeEventListener: () => undefined,
        }) as unknown as MediaQueryList,
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset['theme'];
  });

  const create = () => TestBed.inject(Theme);

  it('starts dark, as prerendered', () => {
    expect(create().current()).toBe('dark');
  });

  it('follows the system setting until the visitor picks a theme', () => {
    systemLight = true;
    const theme = create();
    theme.init();
    expect(theme.current()).toBe('light');

    systemLight = false;
    systemListener?.();
    expect(theme.current()).toBe('dark');
  });

  it('a stored choice wins over the system setting', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const theme = create();
    theme.init();
    expect(theme.current()).toBe('light');
    systemListener?.();
    expect(theme.current()).toBe('light');
  });

  it('toggle switches, sets data-theme, stores the choice and updates theme-color', () => {
    const theme = create();
    theme.init();
    theme.toggle();
    expect(theme.current()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      THEME_COLORS.light,
    );
    theme.toggle();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('plays the wave through a view transition when one is available', () => {
    const ready = Promise.resolve();
    const finished = Promise.resolve();
    const start = vi.fn((update: () => void) => {
      update();
      return { ready, finished } as unknown as ViewTransition;
    });
    Object.assign(document, { startViewTransition: start });
    try {
      const theme = create();
      theme.toggle({ x: 10, y: 10 });
      expect(start).toHaveBeenCalledTimes(1);
      expect(theme.current()).toBe('light');
      expect(document.documentElement.classList.contains('theme-wave')).toBe(true);
    } finally {
      delete (document as { startViewTransition?: unknown }).startViewTransition;
    }
  });

  it('switches at once with reduced motion', () => {
    reduced = true;
    const start = vi.fn();
    Object.assign(document, { startViewTransition: start });
    try {
      const theme = create();
      theme.toggle({ x: 10, y: 10 });
      expect(start).not.toHaveBeenCalled();
      expect(theme.current()).toBe('light');
    } finally {
      delete (document as { startViewTransition?: unknown }).startViewTransition;
    }
  });
});
