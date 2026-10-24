import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Visible `[OWNER: …]` marker for a fact the owner still has to supply (brief §6). Pages that
 * contain one are noindex until it is replaced.
 */
@Component({
  selector: 'app-owner-note',
  template: `<span class="owner"
    >[<span class="owner__label">{{ label() }}:</span> {{ note() }}]</span
  >`,
  styleUrl: './owner-note.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerNote {
  readonly note = input.required<string>();
  readonly label = input('OWNER');
}
