import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlternateLinks } from './core/alternate-links';
import { startAnalytics } from './core/analytics';
import { SITE_CONTENT } from './core/site-content';
import { BackToTop } from './layout/back-to-top/back-to-top';
import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';
import { SkipLink } from './layout/skip-link/skip-link';

@Component({
  selector: 'app-root',
  imports: [BackToTop, RouterOutlet, SiteFooter, SiteHeader, SkipLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly content = inject(SITE_CONTENT);

  constructor() {
    inject(AlternateLinks).start();
    startAnalytics();
  }
}
