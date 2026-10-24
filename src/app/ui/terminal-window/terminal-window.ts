import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TerminalWindowVariant = 'terminal' | 'contact';

/**
 * Window frame with a title bar (three neutral dots and a title) and a projected body.
 * `terminal` has a mono body (hero); `contact` is the larger, roomier frame around the contact block.
 */
@Component({
  selector: 'app-terminal-window',
  templateUrl: './terminal-window.html',
  styleUrl: './terminal-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.terminal--contact]': 'variant() === "contact"',
  },
})
export class TerminalWindow {
  readonly title = input.required<string>();
  readonly variant = input<TerminalWindowVariant>('terminal');
  /** When set, the window is exposed as a labelled group. */
  readonly label = input<string>();
}
