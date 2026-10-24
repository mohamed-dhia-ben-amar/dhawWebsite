import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SITE_CONTENT } from '../../core/site-content';
import { StatusBar } from '../../ui/status-bar/status-bar';

@Component({
  selector: 'app-site-footer',
  imports: [StatusBar],
  template: `<footer>
    <app-status-bar [start]="content.footer.status" [end]="content.footer.copyright" />
  </footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly content = inject(SITE_CONTENT);
}
