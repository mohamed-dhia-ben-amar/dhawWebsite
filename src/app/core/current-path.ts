import { Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

const stripQueryAndFragment = (url: string) => url.split(/[?#]/)[0];

/**
 * Current router path (no locale base href, query or fragment) as a signal, updated on every
 * navigation. `Router.url` alone is not reactive. Call in an injection context.
 */
export function injectCurrentPath(): Signal<string> {
  const router = inject(Router);
  return toSignal(
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => stripQueryAndFragment(event.urlAfterRedirects)),
    ),
    { initialValue: stripQueryAndFragment(router.url) },
  );
}
