import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

const mainNav = (page: Page) => page.getByRole('navigation', { name: 'Main' });
const stepper = (page: Page) => page.getByRole('navigation', { name: 'Page sections' });

test.describe('icon navigation', () => {
  test('every item has an icon and a label; Home is active at the top', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, '/en/');
    const links = mainNav(page).getByRole('link');
    await expect(links).toHaveText(['Home', 'Work', 'Experience', 'Journey', 'Contact']);
    await expect(mainNav(page).locator('svg[aria-hidden="true"]')).toHaveCount(5);
    await expect(mainNav(page).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('the active item follows the section being read', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, '/en/');
    await mainNav(page).getByRole('link', { name: 'Experience' }).click();
    await expect(mainNav(page).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(mainNav(page).locator('[aria-current="true"]')).toHaveCount(1);

    await page.keyboard.press('End');
    await expect(mainNav(page).getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('Work is active on case studies', async ({ page }) => {
    await gotoApp(page, '/en/work/nova');
    await expect(mainNav(page).getByRole('link', { name: 'Work' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('on phones the nav is a bottom tab bar that never covers the footer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoApp(page, '/en/');
    const bar = await mainNav(page).boundingBox();
    expect(bar && bar.y + bar.height).toBeGreaterThan(844 - 40);
    await expect(mainNav(page).getByRole('link', { name: 'Contact' })).toBeInViewport();

    await page.keyboard.press('End');
    await expect
      .poll(async () => {
        const footer = await page.getByRole('contentinfo').boundingBox();
        const nav = await mainNav(page).boundingBox();
        return Math.round((footer?.y ?? 0) + (footer?.height ?? 0) - (nav?.y ?? 0));
      })
      .toBeLessThanOrEqual(0);
  });
});

test('on a 320px phone every tab is fully on screen and still named', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await gotoApp(page, '/fr/');
  const links = page.getByRole('navigation', { name: 'Principale' }).getByRole('link');
  await expect(links).toHaveText(['Accueil', 'Projets', 'Expérience', 'Parcours', 'Contact']);
  for (const link of await links.all()) {
    const box = await link.boundingBox();
    expect(box && box.x >= 0 && box.x + box.width <= 320).toBe(true);
  }
});

test.describe('section stepper', () => {
  test('shows on wide homepages only', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, '/en/');
    await expect(stepper(page)).toBeVisible();
    await expect(stepper(page).getByRole('link')).toHaveText([
      'Home',
      'Work',
      'Experience',
      'Journey',
      'Contact',
    ]);

    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(stepper(page)).toBeHidden();

    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, '/en/work/nova');
    await expect(stepper(page)).toHaveCount(0);
  });

  test('dots jump to their section and track progress', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, '/en/');
    await stepper(page).getByRole('link', { name: 'Work' }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('#work')).toBeInViewport();
    await expect(stepper(page).getByRole('link', { name: 'Work' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect
      .poll(() =>
        page
          .locator('.stepper__fill')
          .evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--progress'))),
      )
      .toBeGreaterThan(0);
  });

  test('is keyboard reachable and shows the label on focus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, '/en/');
    const dot = stepper(page).getByRole('link', { name: 'Contact' });
    await dot.focus();
    await expect(dot.locator('.stepper__label')).toHaveCSS('opacity', '1');
  });
});

test.describe('scroll reveal', () => {
  test('below-the-fold cards fade in as they scroll into view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, '/en/');
    const lastCard = page.locator('app-project-card').last();
    await expect(lastCard).toHaveClass(/\breveal\b/);
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toHaveClass(/reveal--in/);
    await expect(lastCard).toHaveCSS('opacity', '1');
  });

  test('content visible on load is never hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoApp(page, '/en/');
    await expect(page.locator('#home .reveal')).toHaveCount(0);
  });

  test('nothing is hidden with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoApp(page, '/en/');
    await expect(page.locator('.reveal')).toHaveCount(0);
  });

  test('no accessibility violations once everything has revealed', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, '/en/');
    for (const y of [800, 1600, 2400, 3200, 4000, 6000]) {
      await page.mouse.wheel(0, y);
      await page.waitForTimeout(150);
    }
    await page.keyboard.press('End');
    await page.waitForTimeout(800);
    await expectNoA11yViolations(page);
  });
});
