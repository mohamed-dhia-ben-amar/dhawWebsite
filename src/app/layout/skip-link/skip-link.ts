import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

/**
 * "Skip to content" link, visible on focus. It moves focus to the target itself, because a bare
 * `#main` href resolves against `<base href="/">` and would navigate to the homepage.
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

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  protected readonly href = computed(() => `${this.router.url.split('#')[0]}#${this.target()}`);

  protected skip(event: Event): void {
    const target = this.document.getElementById(this.target());
    if (!target) return;
    event.preventDefault();
    target.focus();
    target.scrollIntoView();
  }
}
