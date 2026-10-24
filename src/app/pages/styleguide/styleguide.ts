import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../core/home-content';
import { SITE_CONTENT } from '../../core/site-content';
import { experienceJson } from '../home/sections/experience/experience-section';
import { LanguageSwitch } from '../../layout/language-switch/language-switch';
import { jsonToCodeLines } from '../../ui/code-view/code-line';
import { CodeView } from '../../ui/code-view/code-view';
import { EditorPane } from '../../ui/editor-pane/editor-pane';
import { FileExplorer } from '../../ui/file-explorer/file-explorer';
import { ProjectCard } from '../../ui/project-card/project-card';
import { PromptLabel } from '../../ui/prompt-label/prompt-label';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { TerminalSession } from '../../ui/terminal-session/terminal-session';
import { TerminalWindow } from '../../ui/terminal-window/terminal-window';
import * as data from './styleguide.data';

/** Internal showcase of tokens and signature components. Not indexed, not linked. */
@Component({
  selector: 'app-styleguide',
  imports: [
    CodeView,
    EditorPane,
    FileExplorer,
    LanguageSwitch,
    ProjectCard,
    PromptLabel,
    StatStrip,
    TerminalSession,
    TerminalWindow,
  ],
  templateUrl: './styleguide.html',
  styleUrl: './styleguide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Styleguide {
  protected readonly data = data;
  protected readonly site = inject(SITE_CONTENT);
  protected readonly home = inject(HOME_CONTENT);
  protected readonly experience = this.home.experience.items[0];
  protected readonly experienceFiles = this.home.experience.items.map((item) => item.file);
  protected readonly experienceLines = jsonToCodeLines(experienceJson(this.experience), {
    dateKeys: ['period'],
  });

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
  }
}
