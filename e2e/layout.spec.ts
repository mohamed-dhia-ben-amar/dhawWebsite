import { expect, test } from '@playwright/test';
import { expectNoHorizontalScroll } from './support/a11y';

const ROUTES = ['/en/', '/en/styleguide', '/fr/', '/fr/styleguide'];

test.describe('site layout', () => {
  test('has header, main and footer landmarks', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toContainText('main ✓ · Angular SSR · Vercel');
  });

  test('skip link is the first tab stop and moves focus to main', async ({ page }) => {
    await page.goto('/en/styleguide');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page).toHaveURL(/\/en\/styleguide$/);
  });

  test('loads the self-hosted fonts from /fonts', async ({ page }) => {
    const fontRequests: string[] = [];
    page.on('request', (req) => {
      if (req.resourceType() === 'font') fontRequests.push(new URL(req.url()).pathname);
    });
    await page.goto('/en/styleguide');
    await page.evaluate(() => document.fonts.ready);

    const loaded = await page.evaluate(() =>
      ['Inter Variable', 'Space Grotesk Variable', 'JetBrains Mono Variable'].map((family) =>
        document.fonts.check(`16px "${family}"`),
      ),
    );
    expect(loaded).toEqual([true, true, true]);
    expect(fontRequests.length).toBeGreaterThan(0);
    expect(fontRequests.every((path) => path.startsWith('/fonts/'))).toBe(true);
  });

  for (const route of ROUTES) {
    test(`no horizontal page scroll at 320px on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(route);
      await expectNoHorizontalScroll(page);
    });
  }
});
