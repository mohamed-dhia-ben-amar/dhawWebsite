import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeContent } from '../../../../../content/types';
import { TechTags } from '../../../../ui/tech-tags/tech-tags';
import { TerminalSession } from '../../../../ui/terminal-session/terminal-session';
import { TerminalWindow } from '../../../../ui/terminal-window/terminal-window';

@Component({
  selector: 'app-hero-section',
  imports: [RouterLink, TechTags, TerminalSession, TerminalWindow],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  readonly content = input.required<HomeContent['hero']>();
}
