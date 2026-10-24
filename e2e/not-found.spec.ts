import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

test.describe('404', () => {
  for (const path of ['/does-not-exist', '/en/work/unknown', '/fr/nope']) {
    test(`${path} responds 404 with the terminal page`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
      await expect(page.getByText('zsh: command not found')).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    });
  }

  test('shows the requested path and links home', async ({ page }) => {
    await page.goto('/en/no/such/page');
    await expect(page.getByText('zsh: command not found: /no/such/page')).toBeVisible();
    await page.getByRole('link', { name: 'cd ~' }).click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Full-stack engineer');
  });

  test('client-side navigation to an unknown route shows the 404 page', async ({ page }) => {
    await page.goto('/en/');
    await page.evaluate(() => {
      history.pushState({}, '', '/en/work/unknown');
      dispatchEvent(new PopStateEvent('popstate'));
    });
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  });

  test('/fr/404 is in French', async ({ page }) => {
    await page.goto('/fr/404');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await page.goto('/en/no/such/page');
    await expectNoA11yViolations(page);
  });
});
