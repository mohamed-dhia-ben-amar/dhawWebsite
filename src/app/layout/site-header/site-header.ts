import { DOCUMENT, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectCurrentPath } from '../../core/current-path';
import { APP_LOCALE } from '../../core/locale';
import { SITE_CONTENT } from '../../core/site-content';
import { LanguageSwitch } from '../language-switch/language-switch';

/** Gap kept between the sticky header and an anchor target scrolled into view. */
const ANCHOR_GAP = 16;

/**
 * Sticky site header. It publishes its live height as `--header-height` (used for
 * `scroll-padding-top`, so focus and native anchor jumps stay clear of it) and offsets the
 * router's anchor scrolling by the same amount, since that ignores CSS scroll padding.
 */
@Component({
  selector: 'app-site-header',
  imports: [LanguageSwitch, RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly content = inject(SITE_CONTENT);
  protected readonly locale = inject(APP_LOCALE);
  /** Current page, so the language switch links to the same page in the other locale. */
  protected readonly path = injectCurrentPath();

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const root = inject(DOCUMENT).documentElement;
    const scroller = inject(ViewportScroller);
    const destroyRef = inject(DestroyRef);

    scroller.setOffset(() => [0, host.getBoundingClientRect().height + ANCHOR_GAP]);

    afterNextRender(() => {
      const publish = () =>
        root.style.setProperty(
          '--header-height',
          `${Math.round(host.getBoundingClientRect().height)}px`,
        );
      publish();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(publish);
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
