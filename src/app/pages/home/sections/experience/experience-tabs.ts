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

/** `minotore.json` → `minotore`: the value kept in the URL for that file. */
export function experienceSlug(file: string): string {
  return file.replace(/\.json$/, '');
}

/**
 * Editor pane where each experience file is a tab. All panels are prerendered (every job is in
 * the HTML); only the open one is shown. The open file is a signal. With `urlParam`, the open
 * file is kept in the query string (`?experience=converty`) so it can be linked to; prerendered
 * pages open the first file and pick up the query after hydration.
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
  readonly urlParam = input<string>();

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

  protected open(file: string): void {
    this.active.set(file);
    const param = this.urlParam();
    if (!param) return;
    // Plain history update: a router navigation would scroll the page back to the top.
    const url = new URL(location.href);
    url.searchParams.set(param, experienceSlug(file));
    history.replaceState(history.state, '', url);
  }

  protected readonly tabId = explorerTabId;
  protected readonly panelId = explorerPanelId;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const param = this.urlParam();
      const wanted = param && new URLSearchParams(location.search).get(param);
      const file = wanted && this.files().find((f) => experienceSlug(f) === wanted);
      if (file) this.active.set(file);

      if (typeof window.matchMedia !== 'function') return;
      const query = window.matchMedia(EDITOR_WIDE_QUERY);
      const update = () => this.orientation.set(query.matches ? 'vertical' : 'horizontal');
      update();
      query.addEventListener('change', update);
      destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });
  }
}
