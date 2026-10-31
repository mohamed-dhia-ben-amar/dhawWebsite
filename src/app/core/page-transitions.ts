import type { ActivatedRouteSnapshot, ViewTransitionInfo } from '@angular/router';

/** The route path of a snapshot tree, without query or fragment: `work/nova`. */
export function routePath(snapshot: ActivatedRouteSnapshot): string {
  const parts: string[] = [];
  for (let node: ActivatedRouteSnapshot | null = snapshot; node; node = node.firstChild) {
    parts.push(...node.url.map((segment) => segment.path));
  }
  return parts.join('/');
}

/**
 * Page transitions (router View Transitions): the page content cross-fades and rises between
 * pages, the header stays put (its own `view-transition-name`, see _motion.scss). Skipped when
 * only the fragment or query changes (the homepage nav scrolls, it does not change page) and
 * under reduced motion.
 */
export function onViewTransitionCreated({ transition, from, to }: ViewTransitionInfo): void {
  const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || routePath(from) === routePath(to)) transition.skipTransition();
}
