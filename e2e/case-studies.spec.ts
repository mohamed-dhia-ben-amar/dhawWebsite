import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

const STUDIES = [
  { slug: 'widget-library', title: 'Shared widget library for market finance' },
  { slug: 'nova', title: 'NOVA: AI-assisted development workflow' },
  { slug: 'converty-shop', title: 'Converty Shop merchant app' },
];

test.describe('case studies', () => {
  test('each project card opens its case study', async ({ page }) => {
    for (const { slug, title } of STUDIES) {
      await page.goto('/en/');
      await page.getByRole('link', { name: `Read case study — ${title}` }).click();
      await expect(page).toHaveURL(new RegExp(`/en/work/${slug}$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    }
  });

  for (const { slug, title } of STUDIES) {
    test(`/en/work/${slug} follows the case-study structure`, async ({ page }) => {
      await page.goto(`/en/work/${slug}`);
      await expect(page).toHaveTitle(`${title} · Mohamed Dhia Ben Amar`);
      const headings = (await page.getByRole('heading', { level: 2 }).allTextContents()).map((h) =>
        h.replace('##', '').trim(),
      );
      // Brief order; sections without facts are left out, the core ones are always there.
      const order = ['Context', 'Problem', 'What I did', 'Stack', 'Results', 'What I’d do next'];
      expect(headings).toEqual(order.filter((h) => headings.includes(h)));
      for (const required of ['Context', 'What I did', 'Stack', 'Results']) {
        expect(headings).toContain(required);
      }
      await expect(page.getByRole('figure')).toBeVisible();
    });
  }

  test('case studies are finished: no owner markers, indexable, canonical', async ({ page }) => {
    for (const { slug } of STUDIES) {
      await page.goto(`/en/work/${slug}`);
      await expect(page.getByText('[OWNER:')).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://mohameddhia.dev/en/work/${slug}`,
      );
    }
  });

  test('Converty Shop links to both stores and frames the figures as current', async ({ page }) => {
    await page.goto('/en/work/converty-shop');
    await expect(page.getByRole('link', { name: 'App Store' })).toHaveAttribute(
      'href',
      'https://apps.apple.com/dz/app/converty-shop/id6466304252',
    );
    await expect(page.getByRole('link', { name: 'Google Play' })).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=com.converty.app',
    );
    await expect(
      page.getByText(/current figures, not results of my internship alone/),
    ).toBeVisible();
  });

  test('the bottom navigation goes back to the projects and on to the next study', async ({
    page,
  }) => {
    await page.goto('/en/work/converty-shop');
    const nav = page.getByRole('navigation', { name: 'More work' });
    await nav.getByRole('link', { name: /Shared widget library/ }).click();
    await expect(page).toHaveURL(/\/en\/work\/widget-library$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(STUDIES[0].title);

    await page
      .getByRole('navigation', { name: 'More work' })
      .getByRole('link', { name: /Back/ })
      .click();
    await expect(page).toHaveURL(/\/en\/#work$/);
    await expect(page.locator('#work')).toBeInViewport();
  });

  test('the language switch keeps the case study', async ({ page }) => {
    await page.goto('/en/work/nova');
    await page.getByRole('banner').getByRole('link', { name: 'FR Français' }).click();
    await expect(page).toHaveURL(/\/fr\/work\/nova$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'NOVA : workflow de développement assisté par l’IA',
    );
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(/Contexte/);
  });

  test('declares hreflang alternates for the case study', async ({ page }) => {
    await page.goto('/fr/work/converty-shop');
    const hrefs = await page
      .locator('head link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((l) => l.getAttribute('href')));
    expect(hrefs).toEqual([
      'https://mohameddhia.dev/en/work/converty-shop',
      'https://mohameddhia.dev/fr/work/converty-shop',
      'https://mohameddhia.dev/en/work/converty-shop',
    ]);
  });

  for (const locale of ['en', 'fr']) {
    for (const { slug } of STUDIES) {
      test(`/${locale}/work/${slug} has no detectable accessibility violations`, async ({
        page,
      }) => {
        await page.goto(`/${locale}/work/${slug}`);
        await expectNoA11yViolations(page);
      });
    }
  }

  test('no horizontal scroll at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    for (const { slug } of STUDIES) {
      await page.goto(`/en/work/${slug}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, slug).toBeLessThanOrEqual(0);
    }
  });
});
