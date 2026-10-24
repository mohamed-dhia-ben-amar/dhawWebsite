import { InjectionToken } from '@angular/core';
import { site as enSite } from '../../content/en/site';
import type { SiteContent } from '../../content/types';

/**
 * Site-wide copy (header, footer, skip link) for the current locale.
 * English only until the per-locale builds land in milestone 4.
 */
export const SITE_CONTENT = new InjectionToken<SiteContent>('SITE_CONTENT', {
  providedIn: 'root',
  factory: () => enSite,
});
