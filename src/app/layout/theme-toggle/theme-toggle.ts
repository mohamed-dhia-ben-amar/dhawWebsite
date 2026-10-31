import { ChangeDetectionStrategy, Component, afterNextRender, inject, input } from '@angular/core';
import { Theme } from '../../core/theme';

/**
 * Header button that switches between the light and dark theme; the new theme spreads from it as
 * a wave (see Theme). Its name says what pressing it does. Both icons are rendered and CSS shows
 * the one matching the theme on screen, so the prerendered button is right before hydration.
 */
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  readonly toLight = input.required<string>();
  readonly toDark = input.required<string>();

  protected readonly theme = inject(Theme);

  constructor() {
    afterNextRender(() => this.theme.init());
  }

  protected toggle(event: MouseEvent): void {
    const button = event.currentTarget as HTMLElement;
    const box = button.getBoundingClientRect();
    this.theme.toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
  }
}
