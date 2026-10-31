import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HeroAccent, HeroAlign, HeroFocus, HomeContent } from '../../../../../content/types';
import { TechTags } from '../../../../ui/tech-tags/tech-tags';
import { TerminalWindow } from '../../../../ui/terminal-window/terminal-window';
import { HeroConfig } from './hero-config';

/** How long the preview settles after a config change (the hero-settle animation, plus margin). */
const CHANGE_MS = 260;

/**
 * Hero: the text on the left is a live preview of the `hero.widget.json` config on the right.
 * The prerendered page shows the defaults (amber, start, the "widgets" headline, the full stack),
 * so it reads the same without JavaScript. The headline slides in on load (transform only, so it
 * does not delay the largest paint) and the config types itself in after it (HeroConfig).
 */
@Component({
  selector: 'app-hero-section',
  imports: [HeroConfig, RouterLink, TechTags, TerminalWindow],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  readonly content = input.required<HomeContent['hero']>();

  protected readonly accent = signal<HeroAccent>('amber');
  protected readonly align = signal<HeroAlign>('start');
  protected readonly focus = signal<HeroFocus>('widgets');
  protected readonly hidden = signal<readonly string[]>([]);

  protected readonly headline = computed(() => {
    const hero = this.content();
    const focus = this.focus();
    return focus === 'widgets' ? hero.headline : hero.config.headlines[focus];
  });
  protected readonly stack = computed(() =>
    this.content().stack.items.filter((item) => !this.hidden().includes(item)),
  );
  /** True for a moment after a change: the preview dims and settles (no motion if reduced). */
  protected readonly changing = signal(false);

  constructor() {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let first = true;
    effect(() => {
      this.accent();
      this.align();
      this.focus();
      this.hidden();
      if (first) {
        first = false;
        return;
      }
      untracked(() => this.changing.set(true));
      clearTimeout(timer);
      timer = setTimeout(() => this.changing.set(false), CHANGE_MS);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(timer));
  }
}
