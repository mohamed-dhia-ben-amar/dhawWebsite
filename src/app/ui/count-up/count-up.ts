import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

/** A stat value split around its number: `~9,000` → `~`, 9000, `` (grouped with `,`). */
export interface CountParts {
  readonly prefix: string;
  readonly target: number;
  readonly suffix: string;
  /** Thousands separator used in the original (`,`, a no-break space…), or '' for none. */
  readonly group: string;
}

/** Splits a display value around its first number, or returns null when it has none. */
export function parseCount(value: string): CountParts | null {
  const match = /^(\D*?)(\d{1,3}(?:([,\u00a0\u202f ])\d{3})+|\d+)(.*)$/u.exec(value);
  if (!match) return null;
  const [, prefix, digits, group = '', suffix] = match;
  return { prefix, target: Number(digits.replace(/\D/g, '')), suffix, group };
}

/** Formats `n` the way the original value was written. */
export function formatCount(n: number, parts: CountParts): string {
  const digits = String(Math.round(n));
  const grouped = parts.group ? digits.replace(/\B(?=(\d{3})+$)/g, parts.group) : digits;
  return `${parts.prefix}${grouped}${parts.suffix}`;
}

const DURATION_MS = 1200;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts a stat's number up from zero the first time it is in view (`21`, `~9,000`, `4 days`,
 * `10k+`): straight away if it is on screen when the page loads (on most desktops the stats sit
 * just under the hero), otherwise once it scrolls into view. The prerendered text is the final
 * value, and nothing changes under reduced motion or without IntersectionObserver. The host
 * should be aria-hidden next to a visually hidden copy of the value, so screen readers never hear
 * the intermediate numbers.
 */
@Directive({
  selector: '[appCountUp]',
  host: { '[textContent]': 'display()' },
})
export class CountUp {
  readonly appCountUp = input.required<string>();

  protected readonly display = linkedSignal(() => this.appCountUp());

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const view = element.ownerDocument.defaultView;
      const parts = parseCount(this.appCountUp());
      if (!view || !parts || typeof IntersectionObserver === 'undefined') return;
      if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

      // Already on screen: the observer reports it at once and the count starts right away.
      this.display.set(formatCount(0, parts));
      let frame = 0;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          const start = view.performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            this.display.set(
              t < 1 ? formatCount(parts.target * easeOut(t), parts) : this.appCountUp(),
            );
            if (t < 1) frame = view.requestAnimationFrame(step);
          };
          frame = view.requestAnimationFrame(step);
        },
        // Any visible pixel starts it: on a 900px-tall laptop the stats only peek in at load.
        { threshold: 0 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        view.cancelAnimationFrame(frame);
      });
    });
  }
}
