import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { isOwnerPlaceholder } from '../../../content/types';
import { HOME_CONTENT } from '../../core/home-content';
import { Seo } from '../../core/seo';
import { SITE_CONTENT } from '../../core/site-content';
import { WORK_CONTENT } from '../../core/work-content';
import { ExperienceTabs } from '../home/sections/experience/experience-tabs';
import { LanguageSwitch } from '../../layout/language-switch/language-switch';
import { SoundToggle } from '../../layout/sound-toggle/sound-toggle';
import { ThemeToggle } from '../../layout/theme-toggle/theme-toggle';
import { FlowDiagram } from '../../ui/flow-diagram/flow-diagram';
import { NavIcon } from '../../ui/nav-icon/nav-icon';
import { OwnerNote } from '../../ui/owner-note/owner-note';
import { ProjectCard } from '../../ui/project-card/project-card';
import { PromptLabel } from '../../ui/prompt-label/prompt-label';
import { StatStrip } from '../../ui/stat-strip/stat-strip';
import { TerminalSession } from '../../ui/terminal-session/terminal-session';
import { TechTags } from '../../ui/tech-tags/tech-tags';
import { TerminalWindow } from '../../ui/terminal-window/terminal-window';
import * as data from './styleguide.data';

/** Internal showcase of tokens and signature components. Not indexed, not linked. */
@Component({
  selector: 'app-styleguide',
  imports: [
    ExperienceTabs,
    FlowDiagram,
    LanguageSwitch,
    NavIcon,
    OwnerNote,
    ProjectCard,
    PromptLabel,
    SoundToggle,
    StatStrip,
    TechTags,
    TerminalSession,
    TerminalWindow,
    ThemeToggle,
  ],
  templateUrl: './styleguide.html',
  styleUrl: './styleguide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Styleguide {
  protected readonly data = data;
  protected readonly site = inject(SITE_CONTENT);
  protected readonly home = inject(HOME_CONTENT);
  /** Main stack plus one tech without a logo, to show the fallback mark. */
  protected readonly techDemo = [...inject(HOME_CONTENT).hero.stack.items, 'Zustand'];
  protected readonly icons = ['home', 'work', 'experience', 'journey', 'contact'] as const;
  /** The NOVA diagram, as a real example. */
  protected readonly flowDemo = (() => {
    const diagram = inject(WORK_CONTENT).caseStudies[1].diagram;
    return isOwnerPlaceholder(diagram) ? null : diagram;
  })();

  constructor() {
    inject(Seo).setPage({
      title: 'Styleguide · mdba',
      description: 'Internal showcase of the design tokens and components.',
      path: '/styleguide',
      robots: 'noindex, nofollow',
    });
  }
}
