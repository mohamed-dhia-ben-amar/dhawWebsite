import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

test.describe('home page', () => {
  test('renders the placeholder heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('mdba:~$ coming soon');
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expectNoA11yViolations(page);
  });
});
