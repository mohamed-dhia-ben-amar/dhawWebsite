import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CountUp } from '../count-up/count-up';
import { Reveal } from '../reveal/reveal';

export interface Stat {
  readonly value: string;
  readonly caption: string;
}

/**
 * Row of big numbers with captions (four on the homepage). Wraps to fewer columns when narrow.
 * The numbers count up when they first scroll into view (CountUp); screen readers get the value.
 */
@Component({
  selector: 'app-stat-strip',
  imports: [CountUp, Reveal],
  templateUrl: './stat-strip.html',
  styleUrl: './stat-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatStrip {
  readonly stats = input.required<readonly Stat[]>();
}
