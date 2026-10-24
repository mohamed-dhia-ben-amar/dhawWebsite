import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { HomeContent } from '../../../../../content/types';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';
import { TerminalWindow } from '../../../../ui/terminal-window/terminal-window';
import { ContactForm } from './contact-form';

@Component({
  selector: 'app-contact-section',
  imports: [ContactForm, PromptLabel, TerminalWindow],
  templateUrl: './contact-section.html',
  styleUrls: ['../section.scss', './contact-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSection {
  readonly content = input.required<HomeContent['contact']>();
}
