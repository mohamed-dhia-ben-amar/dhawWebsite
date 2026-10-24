import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

/** Waits until Angular has bootstrapped (the button and scroll listeners exist only then). */
async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

test.describe('sticky header', () => {
  for (const viewport of [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 375, height: 740 },
  ]) {
    test(`stays at the top while scrolling (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/en/');
      await page.mouse.wheel(0, 2500);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
      const box = await page.getByRole('banner').boundingBox();
      expect(Math.round(box?.y ?? -1)).toBe(0);
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeInViewport();
    });

    test(`section links land below the header (${viewport.name})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/en/');
      const header = page.getByRole('banner');
      for (const [label, id] of [
        ['./experience', 'experience'],
        ['./contact', 'contact'],
        ['./work', 'work'],
      ]) {
        await page
          .getByRole('navigation', { name: 'Main' })
          .getByRole('link', { name: label })
          .click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect
          .poll(async () => {
            const headerBox = await header.boundingBox();
            const target = await page.locator(`#${id}`).boundingBox();
            return Math.round((target?.y ?? 0) - ((headerBox?.y ?? 0) + (headerBox?.height ?? 0)));
          })
          .toBeGreaterThanOrEqual(0);
      }
    });
  }
});

test.describe('back to top', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('appears after scrolling, returns to the top and focuses the logo', async ({ page }) => {
    await gotoApp(page, '/en/');
    const button = page.getByRole('button', { name: 'Back to top' });
    await expect(button).toHaveCount(0);

    await page.mouse.wheel(0, 3000);
    await expect(button).toBeVisible();
    await button.click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('#site-logo')).toBeFocused();
    await expect(button).toHaveCount(0);
  });

  test('is reachable by keyboard and never covers the footer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await gotoApp(page, '/en/');
    await page.keyboard.press('End');
    // Let the (animated) End-key scroll finish, as a person would.
    await expect
      .poll(() =>
        page.evaluate(() =>
          Math.round(document.documentElement.scrollHeight - innerHeight - scrollY),
        ),
      )
      .toBeLessThanOrEqual(1);
    const button = page.getByRole('button', { name: 'Back to top' });
    await expect(button).toBeVisible();

    const footer = await page.getByRole('contentinfo').boundingBox();
    await expect
      .poll(async () => {
        const box = await button.boundingBox();
        return Math.round((box?.y ?? 0) + (box?.height ?? 0) - (footer?.y ?? 0));
      })
      .toBeLessThanOrEqual(0);

    await button.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('#site-logo')).toBeFocused();
  });

  test('is labelled in French', async ({ page }) => {
    await gotoApp(page, '/fr/work/nova');
    await page.mouse.wheel(0, 3000);
    await expect(page.getByRole('button', { name: 'Retour en haut de page' })).toBeVisible();
  });

  test('no accessibility violations with the button shown', async ({ page }) => {
    await gotoApp(page, '/en/');
    await page.mouse.wheel(0, 3000);
    await expect(page.getByRole('button', { name: 'Back to top' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
