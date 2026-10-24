import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HOME_CONTENT } from '../../core/home-content';
import { SITE_CONTENT } from '../../core/site-content';
import { ExperienceTabs } from '../home/sections/experience/experience-tabs';
import { LanguageSwitch } from '../../layout/language-switch/language-switch';
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
    ExperienceTabs,
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

  constructor() {
    const meta = inject(Meta);
    meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));
  }
}
