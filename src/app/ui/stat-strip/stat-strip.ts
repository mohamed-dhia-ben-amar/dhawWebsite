import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Stat {
  readonly value: string;
  readonly caption: string;
}

/** Row of big numbers with captions (four on the homepage). Wraps to fewer columns when narrow. */
@Component({
  selector: 'app-stat-strip',
  templateUrl: './stat-strip.html',
  styleUrl: './stat-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatStrip {
  readonly stats = input.required<readonly Stat[]>();
}
