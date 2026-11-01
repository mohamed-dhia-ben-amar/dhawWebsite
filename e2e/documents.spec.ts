import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

const section = (page: Page) => page.locator('#documents');
const viewer = (page: Page) => page.getByRole('dialog');
const pageCount = (page: Page) => viewer(page).locator('.viewer__page');
/** The canvas once pdf.js has drawn a page. */
const drawn = (page: Page) => viewer(page).locator('canvas:not([hidden])');

test.describe('certificates', () => {
  test('every document card is in the prerendered HTML', async ({ request }) => {
    const html = await (await request.get('/en/')).text();
    expect(html).toContain('id="documents"');
    for (const title of [
      'TCF: French, level C1',
      'Engineering internship',
      'Cloud Azure &amp; DevOps',
    ]) {
      expect(html).toContain(title);
    }
  });

  test('pdf.js loads only when a document is opened', async ({ page }) => {
    const worker: string[] = [];
    page.on('request', (r) => r.url().includes('pdf.worker') && worker.push(r.url()));
    await gotoApp(page, '/en/');
    await section(page).scrollIntoViewIfNeeded();
    expect(worker).toEqual([]);
    await section(page).getByRole('button', { name: 'TCF: French, level C1' }).click();
    await expect(drawn(page)).toBeVisible();
    expect(worker.length).toBeGreaterThan(0);
  });

  test('a card opens the viewer, Esc closes it and focus returns to the card', async ({ page }) => {
    await gotoApp(page, '/en/');
    const card = section(page).getByRole('button', { name: 'TCF: French, level C1' });
    await card.click();
    await expect(viewer(page)).toBeVisible();
    await expect(viewer(page)).toHaveAccessibleName('TCF: French, level C1');
    await expect(drawn(page)).toHaveAccessibleName('Scanned page 1 of 1');
    await expect(pageCount(page)).toHaveText('1 / 1');
    await expect(page).toHaveURL(/[?&]doc=tcf-french-c1\b/);

    await page.keyboard.press('Escape');
    await expect(viewer(page)).toBeHidden();
    await expect(card).toBeFocused();
    await expect(page).not.toHaveURL(/doc=/);
  });

  test('pages turn with the buttons and the arrow keys', async ({ page }) => {
    await gotoApp(page, '/en/?doc=japanese-levels-1-2');
    await expect(drawn(page)).toBeVisible();
    await expect(pageCount(page)).toHaveText('1 / 2');
    await viewer(page).getByRole('button', { name: 'Next page' }).click();
    await expect(pageCount(page)).toHaveText('2 / 2');
    await expect(drawn(page)).toHaveAccessibleName('Scanned page 2 of 2');
    await page.keyboard.press('ArrowLeft');
    await expect(pageCount(page)).toHaveText('1 / 2');
  });

  test('zooming in enlarges the page and fit brings it back', async ({ page }) => {
    await gotoApp(page, '/en/?doc=converty-internship');
    await expect(drawn(page)).toBeVisible();
    const width = () => drawn(page).evaluate((el) => el.getBoundingClientRect().width);
    const fitted = await width();
    await viewer(page).getByRole('button', { name: 'Zoom in' }).click();
    await expect.poll(width).toBeGreaterThan(fitted);
    await viewer(page).getByRole('button', { name: 'Fit to screen' }).click();
    await expect.poll(width).toBeCloseTo(fitted, 0);
  });

  test('the PDFs download from the locale folder', async ({ page, request }) => {
    await gotoApp(page, '/fr/?doc=ibspace-internship');
    const download = viewer(page).getByRole('link', { name: 'Télécharger le PDF' });
    const href = await download.evaluate((a: HTMLAnchorElement) => a.href);
    expect(href).toMatch(/\/fr\/docs\/2_Internships\/IB_Space_Internship_2023\.pdf$/);
    const response = await request.get(href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const all = await section(page)
      .getByRole('link', { name: /Tout télécharger/ })
      .evaluate((a: HTMLAnchorElement) => a.href);
    expect((await request.get(all)).status()).toBe(200);
  });

  test('the documents are kept out of search engines', () => {
    const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const rule = vercel.headers.find((h: { source: string }) => h.source.includes('docs'));
    expect(rule.source).toBe('/(en/|fr/)?docs/(.*)');
    expect(rule.headers).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
  });

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 760 },
  ]) {
    test(`no accessibility violations with the viewer open (${viewport.name})`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await gotoApp(page, '/en/?doc=japanese-levels-1-2');
      await expect(drawn(page)).toBeVisible();
      await expectNoA11yViolations(page);
    });
  }

  test('no accessibility violations in the section', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoApp(page, '/fr/');
    await section(page).scrollIntoViewIfNeeded();
    await expectNoA11yViolations(page);
  });
});
