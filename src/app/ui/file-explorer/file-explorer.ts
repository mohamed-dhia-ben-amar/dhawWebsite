import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Editor explorer sidebar listing files, with the open one highlighted. Static for now; it
 * becomes the keyboard-accessible tab list of the experience section in milestone 5.
 */
@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.html',
  styleUrl: './file-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExplorer {
  readonly files = input.required<readonly string[]>();
  readonly active = input.required<string>();
  /** Accessible name of the navigation, e.g. "Experience files". */
  readonly label = input.required<string>();
  /** Visible heading, e.g. "Explorer" (shown uppercase). */
  readonly heading = input.required<string>();
}
