import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import type { HeroAccent, HeroAlign, HeroFocus, HomeContent } from '../../../../../content/types';

export const HERO_ACCENTS: readonly HeroAccent[] = ['amber', 'sky'];
export const HERO_ALIGNS: readonly HeroAlign[] = ['start', 'center'];
export const HERO_FOCUSES: readonly HeroFocus[] = ['widgets', 'ai', 'fullstack'];

/** The value after `current` in `values`, wrapping around. */
export function nextValue<T>(values: readonly T[], current: T): T {
  return values[(values.indexOf(current) + 1) % values.length];
}

type Key = 'accent' | 'align' | 'focus';

/** Fills `{key}` and `{value}` in a content template. */
export function fill(template: string, key: string, value: string): string {
  return template.replace('{key}', key).replace('{value}', value);
}

/**
 * The hero's live config, shown as `hero.widget.json`: the visitor's widgets at work (a JSON
 * config driving what the widget shows). Every value is a real button: the scalar values cycle,
 * the stack items are toggle buttons. Changes are announced politely. The file types itself in on
 * load (CSS only; everything is visible at once with reduced motion or before styles apply).
 */
@Component({
  selector: 'app-hero-config',
  templateUrl: './hero-config.html',
  styleUrl: './hero-config.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroConfig {
  readonly content = input.required<HomeContent['hero']['config']>();
  readonly stack = input.required<readonly string[]>();

  readonly accent = model<HeroAccent>('amber');
  readonly align = model<HeroAlign>('start');
  readonly focus = model<HeroFocus>('widgets');
  /** Stack items switched off. */
  readonly hidden = model<readonly string[]>([]);

  protected readonly announcement = signal('');
  protected readonly changed = computed(
    () =>
      this.accent() !== 'amber' ||
      this.align() !== 'start' ||
      this.focus() !== 'widgets' ||
      this.hidden().length > 0,
  );

  protected valueLabel(key: Key, value: string): string {
    const c = this.content();
    return fill(c.valueLabel, c.keys[key], value);
  }

  protected cycle(key: Key): void {
    let value: string;
    if (key === 'accent') this.accent.set((value = nextValue(HERO_ACCENTS, this.accent())));
    else if (key === 'align') this.align.set((value = nextValue(HERO_ALIGNS, this.align())));
    else this.focus.set((value = nextValue(HERO_FOCUSES, this.focus())));
    const c = this.content();
    this.announcement.set(fill(c.announce, c.keys[key], value));
  }

  protected isShown(item: string): boolean {
    return !this.hidden().includes(item);
  }

  protected toggleItem(item: string): void {
    const shown = this.isShown(item);
    this.hidden.update((list) => (shown ? [...list, item] : list.filter((i) => i !== item)));
    const c = this.content();
    this.announcement.set(`${item} ${shown ? c.hidden : c.shown}`);
  }

  protected reset(): void {
    if (!this.changed()) return;
    this.accent.set('amber');
    this.align.set('start');
    this.focus.set('widgets');
    this.hidden.set([]);
    this.announcement.set(this.content().reset);
  }
}
