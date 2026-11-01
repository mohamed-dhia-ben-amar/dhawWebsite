import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  ALL_DOCUMENTS,
  DOCUMENTS,
  DOCUMENT_GROUPS,
  isDocumentSlug,
} from '../../../../../content/documents';
import type { DocumentSlug, HomeContent } from '../../../../../content/types';
import { PdfViewer, type ViewerDocument } from '../../../../ui/pdf-viewer/pdf-viewer';
import { PromptLabel } from '../../../../ui/prompt-label/prompt-label';
import { Reveal } from '../../../../ui/reveal/reveal';

/** Query parameter that names the open document, so a link can open it. */
export const DOC_PARAM = 'doc';

/**
 * Certificates: one card per scanned document, grouped by kind, each opening the PDF viewer.
 * The open document is kept in the URL (`?doc=tcf-french-c1`) with `history.replaceState`, like
 * the experience tabs (a router navigation would scroll the page back to the top); prerendered
 * pages open it after hydration. Closing the viewer returns focus to the card.
 */
@Component({
  selector: 'app-documents-section',
  imports: [PdfViewer, PromptLabel, Reveal],
  templateUrl: './documents-section.html',
  styleUrls: ['../section.scss', './documents-section.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsSection {
  readonly content = input.required<HomeContent['documents']>();

  protected readonly all = ALL_DOCUMENTS;
  protected readonly open = signal<DocumentSlug | null>(null);

  protected readonly groups = computed(() => {
    const c = this.content();
    return DOCUMENT_GROUPS.map((group) => ({
      group,
      label: c.groups[group],
      docs: DOCUMENTS.filter((doc) => doc.group === group).map((doc) => ({
        ...doc,
        text: c.items[doc.slug],
        pagesLabel:
          doc.pages === 1 ? c.pages.one : c.pages.other.replace('{pages}', String(doc.pages)),
      })),
    }));
  });

  protected readonly viewerDoc = computed<ViewerDocument | null>(() => {
    const slug = this.open();
    const doc = DOCUMENTS.find((d) => d.slug === slug);
    if (!doc) return null;
    const { title, summary } = this.content().items[doc.slug];
    return { href: doc.href, title, summary, pages: doc.pages };
  });

  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      const wanted = new URLSearchParams(this.document.location.search).get(DOC_PARAM);
      if (isDocumentSlug(wanted)) this.open.set(wanted);
    });
  }

  protected cardId(slug: DocumentSlug): string {
    return `doc-${slug}`;
  }

  protected show(slug: DocumentSlug): void {
    this.open.set(slug);
    this.setParam(slug);
  }

  protected hide(): void {
    const slug = this.open();
    this.open.set(null);
    this.setParam(null);
    if (slug) this.document.getElementById(this.cardId(slug))?.focus();
  }

  private setParam(slug: DocumentSlug | null): void {
    const view = this.document.defaultView;
    if (!view) return;
    const url = new URL(view.location.href);
    if (slug) url.searchParams.set(DOC_PARAM, slug);
    else url.searchParams.delete(DOC_PARAM);
    view.history.replaceState(view.history.state, '', url);
  }
}
