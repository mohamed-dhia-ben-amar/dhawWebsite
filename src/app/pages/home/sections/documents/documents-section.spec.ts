import { TestBed } from '@angular/core/testing';
import { DOCUMENTS } from '../../../../../content/documents';
import { home } from '../../../../../content/en/home';
import { PDF_JS, type PdfJs } from '../../../../ui/pdf-viewer/pdf-js';
import { DocumentsSection } from './documents-section';

describe('DocumentsSection', () => {
  afterEach(() => history.replaceState(null, '', '/'));

  async function render() {
    // The viewer never gets to pdf.js here: loading stays pending.
    const pending = {
      getDocument: () => ({ promise: new Promise(() => undefined), destroy: vi.fn() }),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: PDF_JS, useValue: () => Promise.resolve(pending as unknown as PdfJs) },
      ],
    });
    const fixture = TestBed.createComponent(DocumentsSection);
    fixture.componentRef.setInput('content', home.documents);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  afterEach(() =>
    document.body.querySelectorAll('app-documents-section').forEach((n) => n.remove()),
  );

  it('groups one card per document under the four kinds', async () => {
    const { el } = await render();
    expect([...el.querySelectorAll('h3')].map((h) => h.textContent)).toEqual([
      'Languages',
      'Internships',
      'Training',
      'Activities',
    ]);
    expect(el.querySelectorAll('button.doc')).toHaveLength(DOCUMENTS.length);
  });

  it('names each card by its visible text: title, issuer, date, pages', async () => {
    const { el } = await render();
    const card = el.querySelector<HTMLButtonElement>('#doc-tcf-french-c1')!;
    // No aria-label: the name is the content, so it always matches what is on screen (WCAG 2.5.3).
    expect(card.hasAttribute('aria-label')).toBe(false);
    expect(card.hasAttribute('aria-labelledby')).toBe(false);
    expect(card.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'TCF: French, level C1 France Éducation international Nov 2025 1 page View',
    );
    expect(card.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('shows thumbnails as decorative, sized, lazy images', async () => {
    const { el } = await render();
    for (const img of el.querySelectorAll('img')) {
      expect(img.getAttribute('alt')).toBe('');
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
    }
  });

  it('opening a card shows it in the viewer and keeps it in the URL', async () => {
    const { el, fixture } = await render();
    el.querySelector<HTMLButtonElement>('#doc-japanese-levels-1-2')!.click();
    fixture.detectChanges();
    expect(new URLSearchParams(location.search).get('doc')).toBe('japanese-levels-1-2');
    expect(el.querySelector('#viewer-title')?.textContent).toBe(
      'Japanese language, levels 1 and 2',
    );
  });

  it('closing the viewer clears the URL and returns focus to the card', async () => {
    const { el, fixture } = await render();
    const card = el.querySelector<HTMLButtonElement>('#doc-ismpt-study-day')!;
    card.click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('[aria-label="Close"]')!.click();
    fixture.detectChanges();
    expect(location.search).toBe('');
    expect(document.activeElement).toBe(card);
  });

  it('opens the document named in the URL after hydration', async () => {
    history.replaceState(null, '', '/?doc=converty-internship');
    const { el } = await render();
    expect(el.querySelector('#viewer-title')?.textContent).toBe(
      'End-of-studies engineering internship',
    );
  });

  it('offers every document as one download', async () => {
    const { el } = await render();
    const all = el.querySelector<HTMLAnchorElement>('.docs__all')!;
    expect(all.getAttribute('href')).toBe('docs/All_Documents.pdf');
    expect(all.hasAttribute('download')).toBe(true);
    expect(all.textContent?.trim()).toBe('Download all (PDF, 10 pages)');
  });
});
