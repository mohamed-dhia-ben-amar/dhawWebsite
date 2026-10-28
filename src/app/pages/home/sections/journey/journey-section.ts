import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HomeContent } from '../../../../../content/types';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';
import { Reveal } from '../../../../ui/reveal/reveal';

/** "My journey so far": a vertical timeline of work, education and community steps, newest first. */
@Component({
  selector: 'app-journey-section',
  imports: [PromptLabel, Reveal],
  templateUrl: './journey-section.html',
  styleUrls: ['../section.scss', './journey-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneySection {
  readonly content = input.required<HomeContent['journey']>();
}
