import { ChangeDetectionStrategy, Component, afterNextRender, inject, input } from '@angular/core';
import { Sound } from '../../core/sound';

/**
 * Header button that turns the sound effects on and off (off by default). A toggle button: its
 * name stays the same and `aria-pressed` tells whether sound is on. Turning sound on plays a
 * click, so the visitor hears what they enabled.
 */
@Component({
  selector: 'app-sound-toggle',
  templateUrl: './sound-toggle.html',
  styleUrl: './sound-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundToggle {
  readonly label = input.required<string>();

  protected readonly sound = inject(Sound);

  constructor() {
    afterNextRender(() => this.sound.init());
  }

  protected toggle(): void {
    const on = !this.sound.enabled();
    this.sound.setEnabled(on);
    if (on) this.sound.play('click');
  }
}
