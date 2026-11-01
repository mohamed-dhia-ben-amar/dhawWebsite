import { afterNextRender, isDevMode } from '@angular/core';

/** Served by Vercel on every deployment once Speed Insights is enabled (no npm package needed). */
export const SPEED_INSIGHTS_SRC = '/_vercel/speed-insights/script.js';

/**
 * Vercel Web Analytics (brief §8) and Speed Insights (real-user Core Web Vitals): cookieless, no
 * personal data, loaded after the first render in the browser only. Skipped for automated browsers
 * (e2e tests, crawlers that announce themselves), and Speed Insights in development (it only
 * reports from Vercel deployments). Both must be enabled in the Vercel dashboard; until then their
 * scripts simply 404. Neither is in the main bundle: Web Analytics is a dynamic import, Speed
 * Insights the script Vercel serves (its documented setup for sites without a framework package).
 */
export function startAnalytics(): void {
  afterNextRender(() => {
    if (navigator.webdriver) return;
    const dev = isDevMode();
    void import('@vercel/analytics').then(({ inject }) =>
      inject({ framework: 'angular', mode: dev ? 'development' : 'production' }),
    );
    if (dev) return;
    const script = document.createElement('script');
    script.src = SPEED_INSIGHTS_SRC;
    script.defer = true;
    document.head.append(script);
  });
}
