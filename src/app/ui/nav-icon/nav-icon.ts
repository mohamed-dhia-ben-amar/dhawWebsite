import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { NavIcon as NavIconName } from '../../../content/types';

/**
 * Decorative 24×24 line icons for the navigation (paths from Lucide, ISC licence).
 * Always aria-hidden: the link text carries the meaning.
 */
@Component({
  selector: 'app-nav-icon',
  template: `<svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    @switch (name()) {
      @case ('home') {
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path
          d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        />
      }
      @case ('work') {
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      }
      @case ('experience') {
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <rect width="20" height="14" x="2" y="6" rx="2" />
      }
      @case ('journey') {
        <circle cx="6" cy="19" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
        <circle cx="18" cy="5" r="3" />
      }
      @case ('contact') {
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      }
    }
  </svg>`,
  styles: ':host { display: inline-grid; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavIcon {
  readonly name = input.required<NavIconName>();
}
