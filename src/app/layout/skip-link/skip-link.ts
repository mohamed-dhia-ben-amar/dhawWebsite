import { DOCUMENT, LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { injectCurrentPath } from '../../core/current-path';

/**
 * "Skip to content" link, visible on focus. It moves focus to the target itself, because a bare
 * `#main` href resolves against `<base href>` and would navigate to the locale's homepage.
 */
@Component({
  selector: 'app-skip-link',
  template: `<a class="skip-link" [href]="href()" (click)="skip($event)">{{ label() }}</a>`,
  styleUrl: './skip-link.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLink {
  readonly label = input.required<string>();
  /** Id of the element to skip to. */
  readonly target = input('main');

  private readonly document = inject(DOCUMENT);
  private readonly locationStrategy = inject(LocationStrategy);
  private readonly path = injectCurrentPath();

  /** Current page including the locale base href, e.g. `/fr/styleguide#main`. */
  protected readonly href = computed(
    () => `${this.locationStrategy.prepareExternalUrl(this.path())}#${this.target()}`,
  );

  protected skip(event: Event): void {
    const target = this.document.getElementById(this.target());
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView();
  }
}
