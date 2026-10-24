import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { type Fact, isOwnerPlaceholder } from '../../../content/types';
import { OwnerNote } from '../owner-note/owner-note';

/** Renders a content fact: its text, or an owner placeholder when the fact is still missing. */
@Component({
  selector: 'app-fact-text',
  imports: [OwnerNote],
  template: `@let placeholder = owner();
    @if (placeholder !== null) {
      <app-owner-note [note]="placeholder" [label]="ownerLabel()" />
    } @else {
      {{ fact() }}
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactText {
  readonly fact = input.required<Fact>();
  readonly ownerLabel = input('OWNER');

  protected readonly owner = computed(() => {
    const fact = this.fact();
    return isOwnerPlaceholder(fact) ? fact.owner : null;
  });
}
