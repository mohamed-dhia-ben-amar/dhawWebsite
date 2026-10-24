import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NOT_FOUND_CONTENT } from '../../core/work-content';
import { PromptLabel } from '../../ui/prompt-label/prompt-label';
import { TerminalWindow } from '../../ui/terminal-window/terminal-window';

/**
 * Terminal-styled 404 (brief: "command not found"). Prerendered at /404 per locale and copied to
 * the site root as 404.html, which the host serves for unknown URLs. The requested path is shown
 * once the page runs in the browser.
 */
@Component({
  selector: 'app-not-found',
  imports: [PromptLabel, RouterLink, TerminalWindow],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  protected readonly content = inject(NOT_FOUND_CONTENT);
  /** Path that was not found; generic until the browser knows the real one. */
  protected readonly path = signal('404');

  constructor() {
    const meta = inject(Meta);
    inject(Title).setTitle(this.content.meta.title);
    meta.updateTag({ name: 'description', content: this.content.meta.description });
    meta.updateTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => meta.removeTag('name="robots"'));

    afterNextRender(() => {
      const requested = window.location.pathname.replace(/^\/(en|fr)\//, '/');
      if (requested !== '/404' && requested !== '/404/') this.path.set(requested);
    });
  }
}
