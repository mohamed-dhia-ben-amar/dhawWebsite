import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { CodeLine } from './code-line';

/**
 * Line-numbered code block. Line numbers are decorative CSS counters, not text.
 * The block scrolls horizontally inside its own box, so it is a focusable, labelled region.
 */
@Component({
  selector: 'app-code-view',
  templateUrl: './code-view.html',
  styleUrl: './code-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeView {
  readonly lines = input.required<readonly CodeLine[]>();
  /** Accessible name of the scrollable region, e.g. the file name. */
  readonly label = input.required<string>();
}
