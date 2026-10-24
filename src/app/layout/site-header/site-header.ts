import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectCurrentPath } from '../../core/current-path';
import { APP_LOCALE } from '../../core/locale';
import { SITE_CONTENT } from '../../core/site-content';
import { LanguageSwitch } from '../language-switch/language-switch';

@Component({
  selector: 'app-site-header',
  imports: [LanguageSwitch, RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly content = inject(SITE_CONTENT);
  protected readonly locale = inject(APP_LOCALE);
  /** Current page, so the language switch links to the same page in the other locale. */
  protected readonly path = injectCurrentPath();
}
