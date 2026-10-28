import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import type { ExperienceContent } from '../../../../../content/types';
import { EDITOR_WIDE_QUERY } from '../../../../core/breakpoints';
import { jsonToCodeLines } from '../../../../ui/code-view/code-line';
import { CodeView } from '../../../../ui/code-view/code-view';
import { EditorPane } from '../../../../ui/editor-pane/editor-pane';
import {
  ExplorerOrientation,
  FileExplorer,
  explorerPanelId,
  explorerTabId,
} from '../../../../ui/file-explorer/file-explorer';

/** The JSON shown in the editor for one experience entry. */
export function experienceJson(item: ExperienceContent) {
  return {
    role: item.role,
    company: item.company,
    industry: item.industry,
    period: item.period,
    highlights: item.highlights,
  };
}

/**
 * Editor pane where each experience file is a tab. All panels are prerendered (every job is in
 * the HTML); only the open one is shown. The open file is a signal.
 */
@Component({
  selector: 'app-experience-tabs',
  imports: [CodeView, EditorPane, FileExplorer],
  templateUrl: './experience-tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceTabs {
  readonly items = input.required<readonly ExperienceContent[]>();
  readonly explorerLabel = input.required<string>();
  readonly explorerHeading = input.required<string>();
  readonly idPrefix = input('experience');

  /** Open file; resets to the first one if the items change. */
  readonly active = linkedSignal(() => this.items()[0].file);

  /** Sidebar (vertical) when wide, strip (horizontal) when narrow. Vertical when prerendered. */
  protected readonly orientation = signal<ExplorerOrientation>('vertical');

  protected readonly files = computed(() => this.items().map((item) => item.file));
  protected readonly panels = computed(() =>
    this.items().map((item) => ({
      file: item.file,
      lines: jsonToCodeLines(experienceJson(item), { dateKeys: ['period'] }),
    })),
  );

  protected readonly tabId = explorerTabId;
  protected readonly panelId = explorerPanelId;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (typeof window.matchMedia !== 'function') return;
      const query = window.matchMedia(EDITOR_WIDE_QUERY);
      const update = () => this.orientation.set(query.matches ? 'vertical' : 'horizontal');
      update();
      query.addEventListener('change', update);
      destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });
  }
}
