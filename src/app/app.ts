import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlternateLinks } from './core/alternate-links';
import { SITE_CONTENT } from './core/site-content';
import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';
import { SkipLink } from './layout/skip-link/skip-link';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooter, SiteHeader, SkipLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly content = inject(SITE_CONTENT);

  constructor() {
    inject(AlternateLinks).start();
  }
}
