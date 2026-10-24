import { Routes, UrlSegment } from '@angular/router';
import { isCaseStudySlug } from '../content/case-studies';

/** Only known case-study slugs match; anything else falls through to the 404 page. */
const knownCaseStudy = (_route: unknown, segments: UrlSegment[]) =>
  isCaseStudySlug(segments[1]?.path);

export const routes: Routes = [
  {
    // Title and description come from the locale's home content (see Home).
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'work/:slug',
    canMatch: [knownCaseStudy],
    loadComponent: () => import('./pages/case-study/case-study').then((m) => m.CaseStudy),
  },
  {
    // Internal component showcase (noindex). Revisit in milestone 9.
    path: 'styleguide',
    title: 'Styleguide · mdba',
    loadComponent: () => import('./pages/styleguide/styleguide').then((m) => m.Styleguide),
  },
  {
    // Prerendered per locale and copied to the site root as 404.html (scripts/copy-404.mjs).
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
