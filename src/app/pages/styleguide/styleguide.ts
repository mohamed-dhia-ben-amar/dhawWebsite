import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { SITE_CONTENT } from '../../core/site-content';
import { LanguageSwitch } from '../../layout/language-switch/language-switch';
import { CodeView } from '../../ui/code-view/code-view';
import { EditorPane } from '../../ui/editor-pane/editor-pane';
import { ProjectCard } from '../../ui/project-card/project-card';
import { PromptLabel } from '../../ui/prompt-label/prompt-label';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { TerminalWindow } from '../../ui/terminal-window/terminal-window';
import * as data from './styleguide.data';

/** Internal showcase of tokens and signature components. Not indexed, not linked. */
@Component({
  selector: 'app-styleguide',
  imports: [
    CodeView,
    EditorPane,
    LanguageSwitch,
    ProjectCard,
    PromptLabel,
    StatStrip,
    TerminalWindow,
  ],
  templateUrl: './styleguide.html',
  styleUrl: './styleguide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Styleguide {
  protected readonly data = data;
  protected readonly site = inject(SITE_CONTENT);

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
  }
}
