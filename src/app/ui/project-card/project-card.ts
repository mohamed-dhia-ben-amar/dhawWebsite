import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EditorPane, EditorTab } from '../editor-pane/editor-pane';

export interface ProjectStat {
  /** Code-style label, e.g. `team_widgets`. */
  readonly label: string;
  readonly value: string;
}

/** Project teaser in an editor pane: title, summary, case-study link and two code-style stats. */
@Component({
  selector: 'app-project-card',
  imports: [EditorPane, RouterLink],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly title = input.required<string>();
  readonly summary = input.required<string>();
  /** Router path of the case study. No link is rendered without it. */
  readonly href = input<string>();
  readonly linkLabel = input<string>('');
  /** Active tab, e.g. `widget-library/README.md`. */
  readonly file = input.required<string>();
  /** Secondary tab with the stack, e.g. `Angular · Nx · Vitest`. */
  readonly stack = input.required<string>();
  readonly stats = input.required<readonly ProjectStat[]>();

  protected readonly tabs = computed<EditorTab[]>(() => [
    { label: this.file(), active: true },
    { label: this.stack() },
  ]);
}
