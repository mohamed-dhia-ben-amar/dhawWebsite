import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { Locale } from '../../content/types';
import { localizedUrl } from './alternate-links';
import { APP_LOCALE, LOCALES } from './locale';
import { SITE_CONTENT } from './site-content';
import { SITE_ORIGIN } from './site-config';

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', fr: 'fr_FR' };

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Absolute URL of a generated share image (scripts/seo-assets.mts writes /{locale}/og/{name}.png). */
export function ogImageUrl(locale: Locale, name: string): string {
  return `${SITE_ORIGIN}/${locale}/og/${name}.png`;
}

export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /** Router path without the locale, e.g. `/` or `/work/nova`. */
  readonly path: string;
  /** Share image name (see scripts/seo-assets.mts). Defaults to the homepage image. */
  readonly image?: string;
  readonly type?: 'website' | 'article';
  /** Robots directive; indexable when omitted. Noindex pages get no canonical URL. */
  readonly robots?: string;
}

/**
 * Per-page SEO (brief §8): title, description, canonical URL, Open Graph and Twitter card, robots.
 * Every routed page calls `setPage`, so tags never leak from one page to the next. Runs during
 * prerendering, so all tags ship in the HTML.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(APP_LOCALE);
  private readonly site = inject(SITE_CONTENT);

  setPage(page: PageSeo): void {
    const url = localizedUrl(this.locale, page.path);
    const image = ogImageUrl(this.locale, page.image ?? 'home');

    this.title.setTitle(page.title);
    this.setName('description', page.description);
    this.setName('robots', page.robots);
    this.setCanonical(page.robots?.includes('noindex') ? null : url);

    this.setProperty('og:type', page.type ?? 'website');
    this.setProperty('og:site_name', this.site.seo.siteName);
    this.setProperty('og:title', page.title);
    this.setProperty('og:description', page.description);
    this.setProperty('og:url', url);
    this.setProperty('og:locale', OG_LOCALE[this.locale]);
    this.setProperty(
      'og:locale:alternate',
      OG_LOCALE[LOCALES.find((l) => l !== this.locale) ?? this.locale],
    );
    this.setProperty('og:image', image);
    this.setProperty('og:image:width', String(OG_IMAGE_SIZE.width));
    this.setProperty('og:image:height', String(OG_IMAGE_SIZE.height));
    this.setProperty('og:image:alt', page.title);

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', page.title);
    this.setName('twitter:description', page.description);
    this.setName('twitter:image', image);
  }

  private setName(name: string, content: string | undefined): void {
    if (content === undefined) this.meta.removeTag(`name="${name}"`);
    else this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(href: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
