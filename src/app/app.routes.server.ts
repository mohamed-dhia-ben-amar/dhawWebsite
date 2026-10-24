import { RenderMode, ServerRoute } from '@angular/ssr';
import { CASE_STUDY_SLUGS } from '../content/case-studies';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CASE_STUDY_SLUGS.map((slug) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
