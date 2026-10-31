import { DOCUMENT, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectCurrentPath } from '../../core/current-path';
import { APP_LOCALE } from '../../core/locale';
import { SectionSpy } from '../../core/section-spy';
import { SITE_CONTENT } from '../../core/site-content';
import { NavIcon } from '../../ui/nav-icon/nav-icon';
import { LanguageSwitch } from '../language-switch/language-switch';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

/** Gap kept between the sticky header and an anchor target scrolled into view. */
const ANCHOR_GAP = 16;

/**
 * Sticky site header with the icon nav: a pill in the header when wide, a bottom tab bar when
 * narrow. The active item follows the section being read on the homepage (SectionSpy), is Work on
 * case studies and Home in the prerendered homepage. The header publishes its live height as
 * `--header-height` (used for `scroll-padding-top`, so focus and native anchor jumps stay clear of
 * it) and offsets the router's anchor scrolling by the same amount, which ignores CSS padding.
 */
@Component({
  selector: 'app-site-header',
  imports: [LanguageSwitch, NavIcon, RouterLink, ThemeToggle],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly content = inject(SITE_CONTENT);
  protected readonly locale = inject(APP_LOCALE);
  /** Current page, so the language switch links to the same page in the other locale. */
  protected readonly path = injectCurrentPath();

  private readonly spy = inject(SectionSpy);

  /** Fragment of the nav item to highlight, or null. */
  protected readonly active = computed(() => {
    const path = this.path();
    if (path === '/' || path === '') return this.spy.active() ?? 'home';
    return path.startsWith('/work/') ? 'work' : null;
  });

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
