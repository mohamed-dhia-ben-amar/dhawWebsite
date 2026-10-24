import { InjectionToken, LOCALE_ID, inject } from '@angular/core';
import type { Locale } from '../../content/types';

export const LOCALES: readonly Locale[] = ['en', 'fr'];

/**
 * Locale of the current build. Each locale is a separate compile-time build (@angular/localize)
 * served under /en/ or /fr/, so this never changes at runtime.
 */
export const APP_LOCALE = new InjectionToken<Locale>('APP_LOCALE', {
  providedIn: 'root',
  factory: () => (inject(LOCALE_ID).toLowerCase().startsWith('fr') ? 'fr' : 'en'),
});
