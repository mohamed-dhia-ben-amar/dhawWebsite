import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HomeContent } from '../../../../../content/types';
import { ProjectCard } from '../../../../ui/project-card/project-card';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';
import { Reveal } from '../../../../ui/reveal/reveal';

@Component({
  selector: 'app-projects-section',
  imports: [ProjectCard, PromptLabel, Reveal],
  template: `@let c = content();
    <section id="work" class="section" aria-labelledby="work-title">
      <app-prompt-label [command]="c.prompt" />
      <h2 id="work-title" class="section__title">{{ c.title }}</h2>
      @for (project of c.projects; track project.slug; let i = $index) {
        <app-project-card
          [appReveal]="i"
          [title]="project.title"
          [summary]="project.summary"
          [file]="project.file"
          [stack]="project.stack"
          [stats]="project.stats"
          [href]="'/work/' + project.slug"
          [linkLabel]="c.caseStudyLabel"
        />
      }
    </section>`,
  styleUrl: '../section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsSection {
  readonly content = input.required<HomeContent['work']>();
}
