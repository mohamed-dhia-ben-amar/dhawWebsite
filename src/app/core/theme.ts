import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type ThemeName = 'dark' | 'light';

/** localStorage key; also read by the inline script in index.html before first paint. */
export const THEME_STORAGE_KEY = 'theme';

/** Browser chrome color per theme (the `--bg` token), for `<meta name="theme-color">`. */
export const THEME_COLORS: Readonly<Record<ThemeName, string>> = {
  dark: '#0e1a2b',
  light: '#f4f6f9',
};

/** Where the wave starts, in viewport pixels. */
export interface WaveOrigin {
  readonly x: number;
  readonly y: number;
}

const WAVE_MS = 700;

/**
 * Light and dark theme. The system setting applies until the visitor picks a theme with the
 * header toggle; the choice is stored and applied as `data-theme` on <html> by index.html's inline
 * script, so a reload never flashes the other theme. Prerendered pages are dark until the browser
 * runs `init()`. Switching reveals the new theme as a circle growing from the toggle (View
 * Transitions); without them, or with reduced motion, it switches at once.
 */
@Injectable({ providedIn: 'root' })
export class Theme {
  /** The theme on screen. */
  readonly current = signal<ThemeName>('dark');

  private readonly document = inject(DOCUMENT);
  private started = false;

  /** Reads the theme on screen and follows system changes until the visitor picks one. */
  init(): void {
    const view = this.document.defaultView;
    if (this.started || !view) return;
    this.started = true;
    const query = view.matchMedia?.('(prefers-color-scheme: light)');
    const resolve = () => this.current.set(this.stored() ?? (query?.matches ? 'light' : 'dark'));
    resolve();
    query?.addEventListener('change', () => {
      if (!this.stored()) resolve();
    });
  }

  /** Switches to the other theme, with the wave from `origin` when motion is allowed. */
  toggle(origin?: WaveOrigin): void {
    const next: ThemeName = this.current() === 'dark' ? 'light' : 'dark';
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    const apply = () => {
      root.dataset['theme'] = next;
      this.current.set(next);
      this.store(next);
      for (const meta of this.document.querySelectorAll('meta[name="theme-color"]')) {
        meta.setAttribute('content', THEME_COLORS[next]);
      }
    };

    const reduced = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!view || !origin || reduced || typeof this.document.startViewTransition !== 'function') {
      apply();
      return;
    }

    const radius = Math.hypot(
      Math.max(origin.x, view.innerWidth - origin.x),
      Math.max(origin.y, view.innerHeight - origin.y),
    );
    root.classList.add('theme-wave');
    const transition = this.document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          {
            clipPath: [
              `circle(0px at ${origin.x}px ${origin.y}px)`,
              `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
            ],
          },
          {
            duration: WAVE_MS,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      )
      .catch(() => undefined);
    transition.finished.finally(() => root.classList.remove('theme-wave')).catch(() => undefined);
  }

  private stored(): ThemeName | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  private store(theme: ThemeName): void {
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  }
}
