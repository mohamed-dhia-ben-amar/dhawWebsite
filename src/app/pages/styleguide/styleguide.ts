import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DOCUMENTS } from '../../../content/documents';
import { isOwnerPlaceholder } from '../../../content/types';
import { HOME_CONTENT } from '../../core/home-content';
import { Seo } from '../../core/seo';
import { SITE_CONTENT } from '../../core/site-content';
import { WORK_CONTENT } from '../../core/work-content';
import { ExperienceTabs } from '../home/sections/experience/experience-tabs';
import { HeroConfig } from '../home/sections/hero/hero-config';
import { LanguageSwitch } from '../../layout/language-switch/language-switch';
import { SoundToggle } from '../../layout/sound-toggle/sound-toggle';
import { ThemeToggle } from '../../layout/theme-toggle/theme-toggle';
import { FlowDiagram } from '../../ui/flow-diagram/flow-diagram';
import { NavIcon } from '../../ui/nav-icon/nav-icon';
import { OwnerNote } from '../../ui/owner-note/owner-note';
import { PdfViewer, type ViewerDocument } from '../../ui/pdf-viewer/pdf-viewer';
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
    HeroConfig,
    LanguageSwitch,
    NavIcon,
    OwnerNote,
    PdfViewer,
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
  /** The two-page Japanese certificate, to show page navigation. */
  protected readonly pdfSample: ViewerDocument = (() => {
    const doc = DOCUMENTS.find((d) => d.slug === 'japanese-levels-1-2')!;
    const { title, summary } = this.home.documents.items[doc.slug];
    return { href: doc.href, title, summary, pages: doc.pages };
  })();
  protected readonly pdfDemo = signal<ViewerDocument | null>(null);
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
