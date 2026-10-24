import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const ORIGIN = 'https://mohameddhia.dev';
const toLocal = (url: string) => url.replace(ORIGIN, '');

async function meta(page: Page, selector: string) {
  return page.locator(`head ${selector}`).getAttribute('content');
}

/** Width and height from a PNG header (IHDR chunk). */
async function pngSize(request: APIRequestContext, url: string) {
  const response = await request.get(toLocal(url));
  expect(response.status(), url).toBe(200);
  expect(response.headers()['content-type']).toBe('image/png');
  const bytes = await response.body();
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

test.describe('SEO', () => {
  for (const locale of ['en', 'fr'] as const) {
    test(`/${locale}/ has canonical, Open Graph, Twitter and a 1200×630 share image`, async ({
      page,
      request,
    }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${ORIGIN}/${locale}/`,
      );
      expect(await meta(page, 'meta[property="og:url"]')).toBe(`${ORIGIN}/${locale}/`);
      expect(await meta(page, 'meta[property="og:locale"]')).toBe(
        locale === 'en' ? 'en_US' : 'fr_FR',
      );
      expect(await meta(page, 'meta[property="og:title"]')).toBe(await page.title());
      expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
      const image = (await meta(page, 'meta[property="og:image"]')) ?? '';
      expect(image).toBe(`${ORIGIN}/${locale}/og/home.png`);
      expect(await meta(page, 'meta[name="twitter:image"]')).toBe(image);
      expect(await pngSize(request, image)).toEqual({ width: 1200, height: 630 });
    });
  }

  test('the homepage describes the owner as a schema.org Person', async ({ page }) => {
    await page.goto('/en/');
    const json = await page.locator('head script[type="application/ld+json"]').textContent();
    const person = JSON.parse(json ?? '{}');
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mohamed Dhia Ben Amar',
      url: `${ORIGIN}/en/`,
      sameAs: [
        'https://github.com/mohamed-dhia-ben-amar',
        'https://linkedin.com/in/mohameddhia-benamar',
      ],
    });
  });

  test('Person data does not leak onto other pages after client-side navigation', async ({
    page,
  }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: /Read case study — NOVA/ }).click();
    await expect(page).toHaveURL(/\/en\/work\/nova$/);
    await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(0);
  });

  test('every case study has its own share image', async ({ page, request }) => {
    for (const slug of ['widget-library', 'nova', 'converty-shop']) {
      await page.goto(`/fr/work/${slug}`);
      const image = (await meta(page, 'meta[property="og:image"]')) ?? '';
      expect(image).toBe(`${ORIGIN}/fr/og/${slug}.png`);
      expect(await meta(page, 'meta[property="og:type"]')).toBe('article');
      expect(await pngSize(request, image)).toEqual({ width: 1200, height: 630 });
    }
  });

  test('noindex pages have no canonical URL', async ({ page }) => {
    for (const path of ['/en/404', '/fr/404', '/en/styleguide']) {
      await page.goto(path);
      await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(0);
    }
  });

  test('sitemap.xml lists only indexable pages, with hreflang alternates', async ({
    request,
    page,
  }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toContain(`${ORIGIN}/en/`);
    expect(locs).toContain(`${ORIGIN}/fr/`);
    for (const slug of ['widget-library', 'nova', 'converty-shop']) {
      expect(locs).toContain(`${ORIGIN}/en/work/${slug}`);
      expect(locs).toContain(`${ORIGIN}/fr/work/${slug}`);
    }
    expect(locs).toHaveLength(8);
    expect(xml).toContain(`hreflang="x-default" href="${ORIGIN}/en/"`);
    for (const loc of locs) {
      expect(loc).not.toMatch(/styleguide|404/);
      await page.goto(toLocal(loc));
      await expect(page.locator('head meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', loc);
    }
  });

  test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
    const text = await (await request.get('/robots.txt')).text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });

  test('analytics is not loaded for automated browsers', async ({ page }) => {
    const insights: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/_vercel/insights')) insights.push(req.url());
    });
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    expect(insights).toEqual([]);
  });
});
