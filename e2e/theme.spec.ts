import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

const toggle = (page: Page) =>
  page.getByRole('banner').getByRole('button', { name: /Switch to (light|dark) theme/ });
const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const DARK_BG = 'rgb(14, 26, 43)';
const LIGHT_BG = 'rgb(244, 246, 249)';

test.describe('theme', () => {
  test('follows the system setting by default', async ({ browser }) => {
    for (const [colorScheme, bg, name] of [
      ['dark', DARK_BG, 'Switch to light theme'],
      ['light', LIGHT_BG, 'Switch to dark theme'],
    ] as const) {
      const context = await browser.newContext({ colorScheme });
      const page = await context.newPage();
      await gotoApp(page, '/en/');
      expect(await background(page)).toBe(bg);
      await expect(toggle(page)).toHaveAccessibleName(name);
      await context.close();
    }
  });

  test('the toggle switches the theme and names the next action', async ({ page }) => {
    await gotoApp(page, '/en/');
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect.poll(() => background(page)).toBe(LIGHT_BG);
    await expect(toggle(page)).toHaveAccessibleName('Switch to dark theme');
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      'content',
      '#f4f6f9',
    );
  });

  test('the choice is remembered and applied before the app starts', async ({ page }) => {
    await gotoApp(page, '/en/');
    await toggle(page).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Set by the inline script in <head>: present as soon as the HTML is parsed (no flash).
    await page.goto('/fr/', { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => document.documentElement.dataset['theme'])).toBe('light');
    await page.waitForFunction(() =>
      document.querySelector('app-root')?.hasAttribute('ng-version'),
    );
    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Passer au thème sombre' }),
    ).toBeVisible();
  });

  test('switches at once with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark', reducedMotion: 'reduce' });
    const page = await context.newPage();
    await gotoApp(page, '/en/');
    await toggle(page).click();
    await expect.poll(() => background(page)).toBe(LIGHT_BG);
    expect(
      await page.evaluate(() => document.documentElement.classList.contains('theme-wave')),
    ).toBe(false);
    await context.close();
  });

  test('a picked theme passes the axe scan', async ({ page }) => {
    await gotoApp(page, '/en/');
    await toggle(page).click();
    await expect.poll(() => background(page)).toBe(LIGHT_BG);
    await expectNoA11yViolations(page);
  });
});
