import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HomeContent } from '../../../../../content/types';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';
import { Reveal } from '../../../../ui/reveal/reveal';
import { ExperienceTabs } from './experience-tabs';

export { experienceJson } from './experience-tabs';

@Component({
  selector: 'app-experience-section',
  imports: [ExperienceTabs, PromptLabel, Reveal],
  template: `@let c = content();
    <section id="experience" class="section" aria-labelledby="experience-title">
      <app-prompt-label [command]="c.prompt" />
      <h2 id="experience-title" class="section__title">{{ c.title }}</h2>
      <app-experience-tabs
        appReveal
        [items]="c.items"
        [explorerLabel]="c.explorerLabel"
        [explorerHeading]="c.explorerHeading"
      />
    </section>`,
  styleUrl: '../section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  readonly content = input.required<HomeContent['experience']>();
}
