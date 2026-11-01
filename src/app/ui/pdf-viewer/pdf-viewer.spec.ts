import { TestBed } from '@angular/core/testing';
import { home } from '../../../content/en/home';
import { PDF_JS, type PdfJs } from './pdf-js';
import { PdfViewer, type ViewerDocument, fitScale, pageText } from './pdf-viewer';

const DOC: ViewerDocument = {
  href: '/docs/test.pdf',
  title: 'Japanese language, levels 1 and 2',
  summary: 'Two certificates of achievement.',
  pages: 2,
};

/** A two-page PDF whose pages are 100 × 140 at scale 1. */
function fakePdfJs(fail = false) {
  const render = vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() }));
  const pdf = {
    numPages: 2,
    getPage: vi.fn(async () => ({
      getViewport: ({ scale }: { scale: number }) => ({ width: 100 * scale, height: 140 * scale }),
      render,
    })),
  };
  const getDocument = vi.fn(() => ({
    promise: fail ? Promise.reject(new Error('broken')) : Promise.resolve(pdf),
    destroy: vi.fn(() => Promise.resolve()),
  }));
  return { pdfjs: { getDocument } as unknown as PdfJs, getDocument, render };
}

describe('pageText / fitScale', () => {
  it('fills the page template', () => {
    expect(pageText('{page} / {total}', 1, 2)).toBe('1 / 2');
  });

  it('fits the whole page inside the stage', () => {
    expect(fitScale({ width: 100, height: 140 }, { width: 400, height: 280 })).toBe(2);
    expect(fitScale({ width: 100, height: 140 }, { width: 100, height: 1000 })).toBe(1);
  });
});

describe('PdfViewer', () => {
  beforeEach(() => {
    // jsdom has no layout: report a 400 × 560 stage as soon as it is observed.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private cb: ResizeObserverCallback) {}
        observe() {
          this.cb(
            [{ contentRect: { width: 400, height: 560 } } as ResizeObserverEntry],
            this as unknown as ResizeObserver,
          );
        }
        disconnect = vi.fn();
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove('viewer-open');
  });

  async function render(fail = false) {
    const fake = fakePdfJs(fail);
    TestBed.configureTestingModule({
      providers: [{ provide: PDF_JS, useValue: () => Promise.resolve(fake.pdfjs) }],
    });
    const fixture = TestBed.createComponent(PdfViewer);
    fixture.componentRef.setInput('labels', home.documents.viewer);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const settle = async () => {
      await fixture.whenStable();
      await new Promise((r) => setTimeout(r));
      fixture.detectChanges();
    };
    const open = async () => {
      fixture.componentRef.setInput('doc', DOC);
      fixture.detectChanges();
      await settle();
    };
    const button = (name: string) => el.querySelector<HTMLButtonElement>(`[aria-label="${name}"]`)!;
    return { fixture, el, fake, settle, open, button };
  }

  it('is a dialog named after the document and described by its summary', async () => {
    const { el, open } = await render();
    await open();
    const dialog = el.querySelector('dialog')!;
    expect(dialog.getAttribute('aria-labelledby')).toBe('viewer-title');
    expect(el.querySelector('#viewer-title')?.textContent).toBe(DOC.title);
    expect(el.querySelector('#viewer-summary')?.textContent).toBe(DOC.summary);
    expect(document.documentElement.classList).toContain('viewer-open');
  });

  it('loads the PDF and draws the first page as a named image', async () => {
    const { el, fake, open } = await render();
    await open();
    expect(fake.getDocument).toHaveBeenCalledWith({ url: DOC.href });
    expect(fake.render).toHaveBeenCalled();
    const canvas = el.querySelector('canvas')!;
    expect(canvas.hidden).toBe(false);
    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Scanned page 1 of 2');
    // 100 × 140 fitted into 400 × 560: scale 4.
    expect(canvas.style.width).toBe('400px');
  });

  it('turns pages with the buttons and the arrow keys', async () => {
    const { el, open, button, fixture, settle } = await render();
    await open();
    const page = () => el.querySelector('.viewer__page')?.textContent?.trim();
    expect(page()).toBe('1 / 2');
    expect(button('Previous page').getAttribute('aria-disabled')).toBe('true');

    button('Next page').click();
    fixture.detectChanges();
    expect(page()).toBe('2 / 2');
    expect(button('Next page').getAttribute('aria-disabled')).toBe('true');

    el.querySelector('dialog')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    await settle();
    expect(page()).toBe('1 / 2');
  });

  it('zooms in and back to fit, within limits', async () => {
    const { el, open, button, fixture } = await render();
    await open();
    expect(button('Zoom out').getAttribute('aria-disabled')).toBe('true');
    button('Zoom in').click();
    fixture.detectChanges();
    expect(el.querySelector('.viewer__stage')?.classList).toContain('viewer__stage--zoomed');
    expect(button('Fit to screen').getAttribute('aria-disabled')).toBe('false');
    button('Fit to screen').click();
    fixture.detectChanges();
    expect(el.querySelector('.viewer__stage')?.classList).not.toContain('viewer__stage--zoomed');
  });

  it('offers the download and closes on the button or Esc', async () => {
    const { el, open, button, fixture } = await render();
    await open();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    const download = el.querySelector<HTMLAnchorElement>('[aria-label="Download PDF"]')!;
    expect(download.getAttribute('href')).toBe(DOC.href);
    expect(download.hasAttribute('download')).toBe(true);

    button('Close').click();
    el.querySelector('dialog')!.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(closed).toHaveBeenCalledTimes(2);
  });

  it('explains a failure and links to the file', async () => {
    const { el, open } = await render(true);
    await open();
    const alert = el.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('could not open this document');
    expect(alert?.querySelector('a')?.getAttribute('href')).toBe(DOC.href);
  });

  it('closes when the document is cleared', async () => {
    const { fixture, open } = await render();
    await open();
    fixture.componentRef.setInput('doc', null);
    fixture.detectChanges();
    expect(document.documentElement.classList).not.toContain('viewer-open');
  });
});
