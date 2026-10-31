import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

test.describe('styleguide', () => {
  test('is excluded from search engines', async ({ page }) => {
    await page.goto('/en/styleguide');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });

  test('renders every signature component', async ({ page }) => {
    await page.goto('/en/styleguide');
    for (const name of [
      'TerminalWindow',
      'StatStrip',
      'ProjectCard',
      'ExperienceTabs',
      'FlowDiagram',
      'OwnerNote',
      'HeroConfig',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('group', { name: 'Terminal demo' })).toBeVisible();
    await expect(page.getByRole('group', { name: 'Config demo' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'minotore.json' })).toBeVisible();
  });

  test('has no detectable accessibility violations', async ({ page }) => {
    await page.goto('/en/styleguide');
    await expectNoA11yViolations(page);
  });

  test('has no detectable accessibility violations on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/styleguide');
    await expectNoA11yViolations(page);
  });
});
