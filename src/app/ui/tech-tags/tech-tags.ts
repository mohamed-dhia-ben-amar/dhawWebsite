import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TECH_ICONS } from './tech-icons';

/**
 * Pill tags for a stack, each with its logo (or a › mark when there is none). Logos are
 * decorative: the text is the name. With `animate`, the tags pop in one after another on load
 * (CSS only, none under reduced motion).
 */
@Component({
  selector: 'app-tech-tags',
  templateUrl: './tech-tags.html',
  styleUrl: './tech-tags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.tags--animate]': 'animate()' },
})
export class TechTags {
  readonly items = input.required<readonly string[]>();
  /** Accessible name of the list, e.g. "Main stack". */
  readonly label = input<string>();
  readonly animate = input(false);

  protected readonly tags = computed(() =>
    this.items().map((name) => ({ name, path: TECH_ICONS[name] ?? null })),
  );
}
