import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TerminalEntry } from '../../../content/types';

const CHAR_MS = 45;
const OUTPUT_PAUSE_MS = 250;
const NEXT_PAUSE_MS = 350;
const START_MS = 400;

/**
 * `$ command` / output lines with a blinking cursor. With `animate`, commands are typed out and
 * outputs revealed in sequence, in CSS only: the full text is always in the DOM (prerendered,
 * read in full by screen readers) and everything is static under `prefers-reduced-motion`.
 */
@Component({
  selector: 'app-terminal-session',
  templateUrl: './terminal-session.html',
  styleUrl: './terminal-session.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.session--animate]': 'animate()' },
})
export class TerminalSession {
  readonly entries = input.required<readonly TerminalEntry[]>();
  readonly animate = input(false);

  /** Per-entry timings (ms) for the typing animation. */
  protected readonly timeline = computed(() => {
    let t = START_MS;
    const lines = this.entries().map((entry) => {
      const chars = entry.command.length;
      const typed = { chars, delay: t, duration: chars * CHAR_MS };
      t += typed.duration + OUTPUT_PAUSE_MS;
      const outputDelay = t;
      t += NEXT_PAUSE_MS;
      return { entry, typed, outputDelay };
    });
    return { lines, end: t };
  });
}
