import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FlowStep } from '../../../content/types';

/**
 * Simple flow diagram drawn in HTML: an ordered list of steps joined by arrows, with a caption.
 * Horizontal when there is room, vertical on narrow screens. Fully readable as text.
 */
@Component({
  selector: 'app-flow-diagram',
  templateUrl: './flow-diagram.html',
  styleUrl: './flow-diagram.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDiagram {
  readonly caption = input.required<string>();
  readonly steps = input.required<readonly FlowStep[]>();
}
