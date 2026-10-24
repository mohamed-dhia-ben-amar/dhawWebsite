import { InjectionToken } from '@angular/core';
import { home as enHome } from '../../content/en/home';
import type { HomeContent } from '../../content/types';

/** Homepage copy for the current locale. English only until milestone 4. */
export const HOME_CONTENT = new InjectionToken<HomeContent>('HOME_CONTENT', {
  providedIn: 'root',
  factory: () => enHome,
});
