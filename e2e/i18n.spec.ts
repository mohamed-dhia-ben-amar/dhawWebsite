import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

const ORIGIN = 'https://mohameddhia.dev';

test.describe('internationalisation', () => {
  test('the root redirects to the English homepage', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.request().redirectedFrom()?.url()).toMatch(/\/$/);
    await expect(page).toHaveURL(/\/en\/$/);
  });

  for (const [locale, title] of [
    ['en', 'Selected projects'],
    ['fr', 'Projets sélectionnés'],
  ]) {
    test(`/${locale}/ is served in its language`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(title);
    });

    test(`/${locale}/ declares hreflang alternates for every locale`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const alternates = await page
        .locator('head link[rel="alternate"][hreflang]')
        .evaluateAll((links) =>
          links.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
        );
      expect(alternates).toEqual([
        ['en', `${ORIGIN}/en/`],
        ['fr', `${ORIGIN}/fr/`],
        ['x-default', `${ORIGIN}/en/`],
      ]);
    });
  }

  test('the French homepage uses the French copy', async ({ page }) => {
    await page.goto('/fr/');
    await expect(page).toHaveTitle('Mohamed Dhia Ben Amar · Ingénieur logiciel full-stack');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Ingénieur full-stack : bibliothèques de widgets configurables et workflows assistés par IA.',
    );
    await expect(page.getByRole('link', { name: 'Me contacter' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Principale' })).toContainText('./parcours');
    await expect(page.getByRole('region', { name: 'Chiffres clés' })).toBeVisible();
  });

  test('the language switch links to the same page in the other locale', async ({ page }) => {
    await page.goto('/en/styleguide');
    const switcher = page.getByRole('banner').getByRole('list', { name: 'Language' });
    await expect(switcher.getByRole('link', { name: 'EN English' })).toHaveAttribute(
      'aria-current',
      'true',
    );

    await switcher.getByRole('link', { name: 'FR Français' }).click();
    await expect(page).toHaveURL(/\/fr\/styleguide$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

    const frSwitcher = page.getByRole('banner').getByRole('list', { name: 'Langue' });
    await expect(frSwitcher.getByRole('link', { name: 'FR Français' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await frSwitcher.getByRole('link', { name: 'EN English' }).click();
    await expect(page).toHaveURL(/\/en\/styleguide$/);
  });

  test('section links stay within the French site', async ({ page }) => {
    await page.goto('/fr/');
    await page
      .getByRole('navigation', { name: 'Principale' })
      .getByRole('link', { name: './parcours' })
      .click();
    await expect(page).toHaveURL(/\/fr\/#experience$/);
    await expect(page.locator('#experience')).toBeInViewport();
  });

  test('CVs and fonts are served from the root on French pages', async ({ page }) => {
    const fonts: number[] = [];
    page.on('response', (res) => {
      if (res.request().resourceType() === 'font') fonts.push(res.status());
    });
    await page.goto('/fr/');
    await page.evaluate(() => document.fonts.ready);
    expect(fonts.length).toBeGreaterThan(0);
    expect(fonts.every((status) => status === 200)).toBe(true);

    for (const name of [
      'Télécharger le CV en anglais, PDF : EN',
      'Télécharger le CV en français, PDF : FR',
    ]) {
      const link = page.getByRole('link', { name });
      const href = (await link.getAttribute('href')) ?? '';
      expect(href).toMatch(/^\/cv\//);
      const response = await page.request.get(href);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
    }
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`French homepage has no detectable accessibility violations (${viewport.name})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/fr/');
      await expectNoA11yViolations(page);
    });
  }
});
