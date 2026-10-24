import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HomeContent } from '../../../../../content/types';
import { ProjectCard } from '../../../../ui/project-card/project-card';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';

/** Case-study links are added when the case-study routes exist (milestone 6). */
@Component({
  selector: 'app-projects-section',
  imports: [ProjectCard, PromptLabel],
  template: `@let c = content();
    <section id="work" class="section" aria-labelledby="work-title">
      <app-prompt-label [command]="c.prompt" />
      <h2 id="work-title" class="section__title">{{ c.title }}</h2>
      @for (project of c.projects; track project.slug) {
        <app-project-card
          [title]="project.title"
          [summary]="project.summary"
          [file]="project.file"
          [stack]="project.stack"
          [stats]="project.stats"
        />
      }
    </section>`,
  styleUrl: '../section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  readonly content = input.required<HomeContent['work']>();
}
