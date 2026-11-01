import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import type { PdfViewerLabels } from '../../../content/types';
import { PDF_JS } from './pdf-js';

/** The document to show: its PDF and the text that stands in for the scanned pages. */
export interface ViewerDocument {
  readonly href: string;
  readonly title: string;
  readonly summary: string;
  readonly pages: number;
}

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 4;
const ZOOM_STEP = 1.25;
/** Horizontal travel that turns the page on touch screens (and less than this vertically). */
const SWIPE_PX = 60;

/** Fills `{page}` and `{total}` in a label. */
export function pageText(template: string, page: number, total: number): string {
  return template.replace('{page}', String(page)).replace('{total}', String(total));
}

/** Scale at which a page fits the stage entirely (zoom 1 = fit). */
export function fitScale(
  page: { width: number; height: number },
  stage: { width: number; height: number },
): number {
  return Math.min(stage.width / page.width, stage.height / page.height);
}

type Status = 'idle' | 'loading' | 'ready' | 'error';

/**
 * PDF viewer in the site's editor style: a modal dialog (focus kept inside, Esc closes) with the
 * file as a tab, page and zoom controls, download and close. Pages are drawn by pdf.js on a canvas
 * sharp at any pixel density; the canvas is an image named after the page, and the document's
 * summary describes it. Arrows turn pages, +/−/0 zoom, a swipe turns pages on touch screens.
 * pdf.js loads only when a document is first opened.
 */
@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewer {
  readonly labels = input.required<PdfViewerLabels>();
  /** Open while set. */
  readonly doc = input<ViewerDocument | null>(null);
  readonly closed = output<void>();

  protected readonly page = signal(1);
  protected readonly total = signal(1);
  protected readonly zoom = signal(ZOOM_MIN);
  protected readonly status = signal<Status>('idle');
  protected readonly stageSize = signal({ width: 0, height: 0 });

  protected readonly pageLabel = computed(() =>
    pageText(this.labels().page, this.page(), this.total()),
  );
  protected readonly pageAlt = computed(() =>
    pageText(this.labels().pageAlt, this.page(), this.total()),
  );
  protected readonly zoomMin = ZOOM_MIN;
  protected readonly zoomMax = ZOOM_MAX;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly loadPdfJs = inject(PDF_JS);
  private readonly document = inject(DOCUMENT);

  private pdf: PDFDocumentProxy | null = null;
  private loading: PDFDocumentLoadingTask | null = null;
  private renderTask: RenderTask | null = null;
  private swipeStart: { x: number; y: number } | null = null;

  constructor() {
    // Open and load when a document is set, close when it is cleared.
    effect(() => {
      const doc = this.doc();
      untracked(() => (doc ? this.open(doc) : this.shut()));
    });

    // Redraw whenever the page, the zoom or the space available changes.
    effect(() => {
      const ready = this.status() === 'ready';
      const page = this.page();
      const zoom = this.zoom();
      const stage = this.stageSize();
      if (ready && stage.width > 0) void this.render(page, zoom, stage);
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        this.stageSize.set({ width: Math.floor(width), height: Math.floor(height) });
      });
      observer.observe(this.stage().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
    destroyRef.onDestroy(() => this.unload());
  }

  protected previous(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected next(): void {
    this.page.update((page) => Math.min(this.total(), page + 1));
  }

  protected zoomIn(): void {
    this.zoom.update((zoom) => Math.min(ZOOM_MAX, zoom * ZOOM_STEP));
  }

  protected zoomOut(): void {
    this.zoom.update((zoom) => Math.max(ZOOM_MIN, zoom / ZOOM_STEP));
  }

  protected fit(): void {
    this.zoom.set(ZOOM_MIN);
  }

  protected close(): void {
    this.closed.emit();
  }

  /** Esc: let the parent clear the document, which closes the dialog. */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected onKey(event: KeyboardEvent): void {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => this.previous(),
      ArrowRight: () => this.next(),
      '+': () => this.zoomIn(),
      '=': () => this.zoomIn(),
      '-': () => this.zoomOut(),
      '0': () => this.fit(),
    };
    const action = actions[event.key];
    if (!action || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    action();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.swipeStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(event: PointerEvent): void {
    const start = this.swipeStart;
    this.swipeStart = null;
    if (!start || this.zoom() > ZOOM_MIN) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(event.clientY - start.y) > SWIPE_PX) return;
    if (dx < 0) this.next();
    else this.previous();
  }

  private open(doc: ViewerDocument): void {
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) dialog.showModal?.();
    this.document.documentElement.classList.add('viewer-open');
    this.page.set(1);
    this.zoom.set(ZOOM_MIN);
    this.total.set(doc.pages);
    void this.load(doc.href);
  }

  private shut(): void {
    this.unload();
    this.status.set('idle');
    this.document.documentElement.classList.remove('viewer-open');
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
  }

  private async load(href: string): Promise<void> {
    this.unload();
    this.status.set('loading');
    try {
      const pdfjs = await this.loadPdfJs();
      const task = pdfjs.getDocument({ url: href });
      this.loading = task;
      const pdf = await task.promise;
      if (this.loading !== task) return void task.destroy();
      this.pdf = pdf;
      this.total.set(pdf.numPages);
      this.status.set('ready');
    } catch {
      if (this.doc()) this.status.set('error');
    }
  }

  private async render(
    pageNumber: number,
    zoom: number,
    stage: { width: number; height: number },
  ): Promise<void> {
    const pdf = this.pdf;
    if (!pdf) return;
    this.renderTask?.cancel();
    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({
        scale: fitScale(page.getViewport({ scale: 1 }), stage) * zoom,
      });
      const ratio = this.document.defaultView?.devicePixelRatio || 1;
      const canvas = this.canvas().nativeElement;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      const task = page.render({
        canvas,
        viewport,
        transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
      });
      this.renderTask = task;
      await task.promise;
    } catch (error) {
      if ((error as { name?: string } | null)?.name !== 'RenderingCancelledException') {
        this.status.set('error');
      }
    }
  }

  private unload(): void {
    this.renderTask?.cancel();
    this.renderTask = null;
    // Destroying the loading task also releases the document it loaded.
    void this.loading?.destroy();
    this.loading = null;
    this.pdf = null;
  }
}
