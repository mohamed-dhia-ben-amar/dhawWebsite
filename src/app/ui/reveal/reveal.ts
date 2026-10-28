import {
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Fades and slides an element up the first time it scrolls into view. Elements already visible
 * when the page loads are never hidden (no flash, no effect on LCP), nothing happens without
 * IntersectionObserver or under prefers-reduced-motion, and only opacity/transform change, so it
 * causes no layout shift. `appReveal="2"` staggers by 2 × 80 ms. Styles: src/styles/_motion.scss.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal]': 'pending()',
    '[class.reveal--in]': 'shown()',
    '[style.--reveal-delay]': 'delay()',
  },
})
export class Reveal {
  /** Stagger step (0, 1, 2…); empty for none. */
  readonly appReveal = input<number | string>('');

  protected readonly pending = signal(false);
  protected readonly shown = signal(false);
  protected readonly delay = computed(() => `${(Number(this.appReveal()) || 0) * 80}ms`);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const view = element.ownerDocument.defaultView;
      if (!view || typeof IntersectionObserver === 'undefined') return;
      if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < view.innerHeight && rect.bottom > 0) return;

      this.pending.set(true);
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.shown.set(true);
          observer.disconnect();
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
