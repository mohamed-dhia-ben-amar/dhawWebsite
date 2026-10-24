import { afterNextRender, isDevMode } from '@angular/core';
import { inject as injectVercelAnalytics } from '@vercel/analytics';

/**
 * Vercel Web Analytics (brief §8): cookieless, no personal data, loaded after the first render in
 * the browser only. Skipped for automated browsers (e2e tests, crawlers that announce themselves).
 * Must be enabled in the Vercel dashboard; until then its script simply 404s.
 */
export function startAnalytics(): void {
  afterNextRender(() => {
    if (navigator.webdriver) return;
    injectVercelAnalytics({
      framework: 'angular',
      mode: isDevMode() ? 'development' : 'production',
    });
  });
}
