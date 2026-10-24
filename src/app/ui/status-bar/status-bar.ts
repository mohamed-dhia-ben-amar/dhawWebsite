import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Editor-style status bar in the accent color, used as the site footer. */
@Component({
  selector: 'app-status-bar',
  template: `<div class="status container">
    <span>{{ start() }}</span>
    <span>{{ end() }}</span>
  </div>`,
  styleUrl: './status-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBar {
  readonly start = input.required<string>();
  readonly end = input.required<string>();
}
