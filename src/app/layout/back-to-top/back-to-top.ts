import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Floating "back to top" button. Shown once the page has scrolled more than a screen, it lifts
 * itself above the footer, scrolls to the top (smoothly unless reduced motion is preferred) and
 * moves focus to `focusTarget` so keyboard users continue from the top of the page. The explicit
 * scroll behavior also cancels any scroll animation still running (e.g. from the End key).
 */
@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.html',
  styleUrl: './back-to-top.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTop {
  readonly label = input.required<string>();
  /** Id of the element that receives focus at the top, e.g. the logo link. */
  readonly focusTarget = input('site-logo');

  protected readonly visible = signal(false);
  /** How far the footer reaches into the viewport, so the button can sit above it. */
  protected readonly footerOverlap = signal(0);

  private readonly document = inject(DOCUMENT);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view) return;
      let frame = 0;
      const update = () => {
        frame = 0;
        this.visible.set(view.scrollY > view.innerHeight);
        const footer = this.document.querySelector('app-site-footer');
        const top = footer?.getBoundingClientRect().top ?? view.innerHeight;
        this.footerOverlap.set(Math.max(0, Math.round(view.innerHeight - top)));
      };
      const schedule = () => {
        if (!frame) frame = view.requestAnimationFrame(update);
      };
      view.addEventListener('scroll', schedule, { passive: true });
      view.addEventListener('resize', schedule, { passive: true });
      update();
      destroyRef.onDestroy(() => {
        view.removeEventListener('scroll', schedule);
        view.removeEventListener('resize', schedule);
        if (frame) view.cancelAnimationFrame(frame);
      });
    });
  }

  protected scrollToTop(): void {
    const view = this.document.defaultView;
    const reduce = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    view?.scrollTo({ top: 0, behavior: reduce ? 'instant' : 'smooth' });
    this.document.getElementById(this.focusTarget())?.focus({ preventScroll: true });
  }
}
