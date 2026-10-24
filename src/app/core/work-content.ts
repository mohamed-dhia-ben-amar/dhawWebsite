import { InjectionToken, inject } from '@angular/core';
import { notFound as enNotFound } from '../../content/en/not-found';
import { work as enWork } from '../../content/en/work';
import { notFound as frNotFound } from '../../content/fr/not-found';
import { work as frWork } from '../../content/fr/work';
import type { NotFoundContent, WorkContent } from '../../content/types';
import { APP_LOCALE } from './locale';

/** Case studies and their page labels for the current locale. */
export const WORK_CONTENT = new InjectionToken<WorkContent>('WORK_CONTENT', {
  providedIn: 'root',
  factory: () => (inject(APP_LOCALE) === 'fr' ? frWork : enWork),
});

/** 404 page copy for the current locale. */
export const NOT_FOUND_CONTENT = new InjectionToken<NotFoundContent>('NOT_FOUND_CONTENT', {
  providedIn: 'root',
  factory: () => (inject(APP_LOCALE) === 'fr' ? frNotFound : enNotFound),
});
