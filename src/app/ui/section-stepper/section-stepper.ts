import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionSpy } from '../../core/section-spy';

export interface StepperSection {
  readonly id: string;
  readonly label: string;
}

/**
 * Vertical progress rail on the right edge (wide screens only): a `$` prompt at the top, a
 * blinking cursor at the bottom, one dot per section placed where that section starts, and a fill
 * that follows the scroll. Dots are links to their section, labelled on hover and focus.
 * Reads SectionSpy, which the page starts.
 */
@Component({
  selector: 'app-section-stepper',
  imports: [RouterLink],
  templateUrl: './section-stepper.html',
  styleUrl: './section-stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionStepper {
  readonly sections = input.required<readonly StepperSection[]>();
  /** Accessible name of the navigation, e.g. "Page sections". */
  readonly label = input.required<string>();

  protected readonly spy = inject(SectionSpy);

  protected readonly steps = computed(() => {
    const marks = new Map(this.spy.marks().map((mark) => [mark.id, mark.at]));
    const count = this.sections().length;
    const progress = this.spy.progress();
    return this.sections().map((section, index) => {
      // Before the first measurement (prerender), spread the dots evenly.
      const at = marks.get(section.id) ?? (count > 1 ? index / (count - 1) : 0);
      return {
        ...section,
        at,
        active: this.spy.active() === section.id,
        passed: progress >= at - 0.001,
      };
    });
  });
}
