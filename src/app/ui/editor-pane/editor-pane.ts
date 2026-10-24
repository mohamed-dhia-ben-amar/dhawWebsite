import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface EditorTab {
  readonly label: string;
  /** The active tab is highlighted with an accent top border. */
  readonly active?: boolean;
}

/**
 * Editor-style frame: a tab bar above a projected body, with an optional explorer sidebar
 * (project an element with the `paneExplorer` attribute). The tabs here are presentational;
 * the interactive tabs pattern for the experience section builds on top of this in milestone 5.
 */
@Component({
  selector: 'app-editor-pane',
  templateUrl: './editor-pane.html',
  styleUrl: './editor-pane.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPane {
  readonly tabs = input<readonly EditorTab[]>([]);
}
