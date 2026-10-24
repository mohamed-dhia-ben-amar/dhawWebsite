import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** `$ command` line shown above a section title. The `$` is decorative. */
@Component({
  selector: 'app-prompt-label',
  template: `<p class="prompt">
    <span class="prompt__sign" aria-hidden="true">$</span> {{ command() }}
  </p>`,
  styleUrl: './prompt-label.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptLabel {
  readonly command = input.required<string>();
}
