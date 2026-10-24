import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  viewChildren,
} from '@angular/core';

export type ExplorerOrientation = 'vertical' | 'horizontal';

/** Id of the tab for `file`, so panels can reference it with aria-labelledby. */
export function explorerTabId(idPrefix: string, file: string): string {
  return `${idPrefix}-tab-${slug(file)}`;
}

/** Id of the panel `file` controls; the host renders an element with this id and role="tabpanel". */
export function explorerPanelId(idPrefix: string, file: string): string {
  return `${idPrefix}-panel-${slug(file)}`;
}

function slug(file: string): string {
  return file
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

/**
 * Editor explorer listing files as an accessible tab list (WAI-ARIA tabs pattern): one tab stop
 * (roving tabindex), arrow keys / Home / End move focus and select (automatic activation), and the
 * selected file is a two-way `active` model. The host renders the matching tab panels.
 */
@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.html',
  styleUrl: './file-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExplorer {
  readonly files = input.required<readonly string[]>();
  readonly active = model.required<string>();
  /** Accessible name of the tab list, e.g. "Experience files". */
  readonly label = input.required<string>();
  /** Visible heading, e.g. "Explorer" (shown uppercase, decorative). */
  readonly heading = input.required<string>();
  /** Prefix for tab and panel ids; must be unique on the page. */
  readonly idPrefix = input.required<string>();
  /** Matches the layout: a vertical sidebar when wide, a horizontal strip when narrow. */
  readonly orientation = input<ExplorerOrientation>('vertical');

  private readonly tabs = viewChildren<ElementRef<HTMLButtonElement>>('tab');

  protected readonly tabId = explorerTabId;
  protected readonly panelId = explorerPanelId;

  protected select(file: string): void {
    this.active.set(file);
    this.reveal(this.files().indexOf(file));
  }

  protected onKeydown(event: KeyboardEvent): void {
    const files = this.files();
    const current = files.indexOf(this.active());
    const last = files.length - 1;
    const next: Record<string, number> = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;

    event.preventDefault();
    this.active.set(files[target]);
    this.tabs()[target]?.nativeElement.focus({ preventScroll: true });
    this.reveal(target);
  }

  /** Scrolls the tab fully into view inside the strip (narrow layout) without moving the page. */
  private reveal(index: number): void {
    this.tabs()[index]?.nativeElement.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }
}
