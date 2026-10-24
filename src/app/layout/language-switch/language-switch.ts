import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { LanguageOption, Locale } from '../../../content/types';

/**
 * EN/FR links to the same page in each locale, with `aria-current` on the active one.
 */
@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.html',
  styleUrl: './language-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitch {
  readonly options = input.required<readonly LanguageOption[]>();
  readonly current = input.required<Locale>();
  /** Accessible name of the list, e.g. "Language". */
  readonly label = input.required<string>();
  /** Path of the current page without the locale prefix, e.g. `/work/nova`. */
  readonly path = input('/');

  protected readonly links = computed(() =>
    this.options().map((option) => ({
      ...option,
      href: `/${option.locale}${this.path().startsWith('/') ? '' : '/'}${this.path()}`,
      active: option.locale === this.current(),
    })),
  );
}
