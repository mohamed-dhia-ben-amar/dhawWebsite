import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LOCALES } from './locale';
import { SITE_ORIGIN } from './site-config';

/** Absolute URL of `path` (router URL, no locale prefix) in `locale`. */
export function localizedUrl(locale: string, path: string): string {
  const clean = path.split(/[?#]/)[0];
  return `${SITE_ORIGIN}/${locale}${clean === '/' ? '/' : clean}`;
}

/**
 * Keeps `<link rel="alternate" hreflang>` tags for every locale (plus x-default → English) in the
 * head, pointing at the current page. Runs during prerendering, so the tags ship in the HTML.
 */
@Injectable({ providedIn: 'root' })
export class AlternateLinks {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  start(): void {
    const subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.update(event.urlAfterRedirects));
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  update(path: string): void {
    const head = this.document.head;
    head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
    const entries: [string, string][] = [
      ...LOCALES.map((locale): [string, string] => [locale, localizedUrl(locale, path)]),
      ['x-default', localizedUrl('en', path)],
    ];
    for (const [hreflang, href] of entries) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      head.appendChild(link);
    }
  }
}
