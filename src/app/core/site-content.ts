import { InjectionToken, inject } from '@angular/core';
import { site as enSite } from '../../content/en/site';
import { site as frSite } from '../../content/fr/site';
import type { SiteContent } from '../../content/types';
import { APP_LOCALE } from './locale';

/** Site-wide copy (header, footer, skip link) for the current locale. */
export const SITE_CONTENT = new InjectionToken<SiteContent>('SITE_CONTENT', {
  providedIn: 'root',
  factory: () => (inject(APP_LOCALE) === 'fr' ? frSite : enSite),
});
