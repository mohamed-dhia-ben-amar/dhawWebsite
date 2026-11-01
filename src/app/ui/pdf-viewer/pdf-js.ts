import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export type PdfJs = typeof import('pdfjs-dist');

/**
 * Loads pdf.js on first use (a lazy chunk: the homepage never downloads it) and points it at its
 * worker, which angular.json copies to `pdfjs/` next to each locale's index.html. A token so unit
 * tests can provide a fake.
 */
export const PDF_JS = new InjectionToken<() => Promise<PdfJs>>('PDF_JS', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    let loaded: Promise<PdfJs> | undefined;
    return () =>
      (loaded ??= import('pdfjs-dist').then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs/pdf.worker.min.mjs',
          document.baseURI,
        ).href;
        return pdfjs;
      }));
  },
});
