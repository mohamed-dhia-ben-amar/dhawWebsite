import { InjectionToken, inject } from '@angular/core';
import { home as enHome } from '../../content/en/home';
import { home as frHome } from '../../content/fr/home';
import type { HomeContent } from '../../content/types';
import { APP_LOCALE } from './locale';

/** Homepage copy for the current locale. */
export const HOME_CONTENT = new InjectionToken<HomeContent>('HOME_CONTENT', {
  providedIn: 'root',
  factory: () => (inject(APP_LOCALE) === 'fr' ? frHome : enHome),
});
