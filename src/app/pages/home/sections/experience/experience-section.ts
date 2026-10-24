import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ExperienceContent, HomeContent } from '../../../../../content/types';
import { jsonToCodeLines } from '../../../../ui/code-view/code-line';
import { CodeView } from '../../../../ui/code-view/code-view';
import { EditorPane } from '../../../../ui/editor-pane/editor-pane';
import { FileExplorer } from '../../../../ui/file-explorer/file-explorer';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';

/** The JSON shown in the editor for one experience entry. */
export function experienceJson(item: ExperienceContent) {
  return {
    role: item.role,
    company: item.company,
    industry: item.industry,
    period: item.period,
    highlights: item.highlights,
  };
}

/**
 * Editor pane with the experience files. Shows the first file for now; switching files
 * (accessible tabs, state in a signal) lands in milestone 5.
 */
@Component({
  selector: 'app-experience-section',
  imports: [CodeView, EditorPane, FileExplorer, PromptLabel],
  template: `@let c = content();
    <section id="experience" class="section" aria-labelledby="experience-title">
      <app-prompt-label [command]="c.prompt" />
      <h2 id="experience-title" class="section__title">{{ c.title }}</h2>
      <app-editor-pane [tabs]="[{ label: active().file, active: true }]">
        <app-file-explorer
          paneExplorer
          [files]="files()"
          [active]="active().file"
          [label]="c.explorerLabel"
          [heading]="c.explorerHeading"
        />
        <app-code-view [lines]="lines()" [label]="active().file" />
      </app-editor-pane>
    </section>`,
  styleUrl: '../section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  readonly content = input.required<HomeContent['experience']>();

  protected readonly files = computed(() => this.content().items.map((item) => item.file));
  protected readonly active = computed(() => this.content().items[0]);
  protected readonly lines = computed(() =>
    jsonToCodeLines(experienceJson(this.active()), { dateKeys: ['period'] }),
  );
}
