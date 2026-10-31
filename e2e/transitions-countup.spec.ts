import { expect, test, type Page } from '@playwright/test';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

/** Counts view transitions started and skipped (the theme wave uses them too). */
async function watchTransitions(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { started: number; skipped: number };
    w.started = 0;
    w.skipped = 0;
    const start = document.startViewTransition?.bind(document);
    if (!start) return;
    document.startViewTransition = ((arg: never) => {
      w.started++;
      const transition = start(arg);
      const skip = transition.skipTransition.bind(transition);
      transition.skipTransition = () => {
        w.skipped++;
        skip();
      };
      return transition;
    }) as typeof document.startViewTransition;
  });
}
const counts = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { started: number; skipped: number };
    return { started: w.started, skipped: w.skipped };
  });
/** Transitions that actually played (the first navigation's own one is skipped, as same-page). */
const played = async (page: Page) => {
  const { started, skipped } = await counts(page);
  return started - skipped;
};

test.describe('page transitions', () => {
  test('moving to a case study and back plays a transition each way', async ({ page }) => {
    await watchTransitions(page);
    await gotoApp(page, '/en/');
    await page
      .locator('#work')
      .getByRole('link', { name: /Read case study/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/work\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await played(page)).toBe(1);

    await page.getByRole('link', { name: /Back to/ }).click();
    await expect(page).toHaveURL(/\/en\/#work$/);
    expect(await played(page)).toBe(2);
  });

  test('homepage nav clicks only scroll: their transition is skipped', async ({ page }) => {
    await watchTransitions(page);
    await gotoApp(page, '/en/');
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Contact' })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    expect(await played(page)).toBe(0);
  });

  test('reduced motion skips page transitions', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await watchTransitions(page);
    await gotoApp(page, '/en/');
    await page
      .locator('#work')
      .getByRole('link', { name: /Read case study/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/work\//);
    expect(await played(page)).toBe(0);
    await context.close();
  });
});

test.describe('counting stats', () => {
  const values = (page: Page) => page.locator('.stats__value [aria-hidden="true"]');

  test('the prerendered HTML has the final values', async ({ request }) => {
    const html = await (await request.get('/en/')).text();
    for (const value of ['21', '~9,000', '4 days', '10k+']) expect(html).toContain(value);
  });

  test('below the fold, they count up from zero and end on the exact values', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await gotoApp(page, '/en/');
    await expect(values(page).nth(1)).toHaveText('~0');
    for (const value of await values(page).all()) await value.scrollIntoViewIfNeeded();
    await expect(values(page)).toHaveText(['21', '~9,000', '4 days', '10k+'], { timeout: 5000 });
    // Screen readers always get the value, never the counting text.
    await expect(page.locator('.stats__value .visually-hidden').nth(1)).toHaveText('~9,000');
  });

  test('French values keep their spacing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await gotoApp(page, '/fr/');
    await values(page).nth(1).scrollIntoViewIfNeeded();
    await expect(values(page).nth(1)).toHaveText('~9 000', { timeout: 5000 });
  });

  test('with reduced motion, the values never change', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 700 });
    await gotoApp(page, '/en/');
    await expect(values(page)).toHaveText(['21', '~9,000', '4 days', '10k+']);
  });
});
