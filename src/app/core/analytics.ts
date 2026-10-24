import { afterNextRender, isDevMode } from '@angular/core';

/**
 * Vercel Web Analytics (brief §8): cookieless, no personal data, loaded after the first render in
 * the browser only. Skipped for automated browsers (e2e tests, crawlers that announce themselves).
 * Must be enabled in the Vercel dashboard; until then its script simply 404s. Loaded with a dynamic
 * import so it stays out of the main bundle.
 */
export function startAnalytics(): void {
  afterNextRender(() => {
    if (navigator.webdriver) return;
    void import('@vercel/analytics').then(({ inject }) =>
      inject({ framework: 'angular', mode: isDevMode() ? 'development' : 'production' }),
    );
  });
}
