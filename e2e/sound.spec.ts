import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations, expectNoHorizontalScroll } from './support/a11y';

/** Counts Web Audio sources started, so tests can tell whether a sound played. */
async function countSounds(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { soundsPlayed: number };
    w.soundsPlayed = 0;
    const protos = [OscillatorNode.prototype, AudioBufferSourceNode.prototype] as unknown as {
      start: (...args: unknown[]) => void;
    }[];
    for (const proto of protos) {
      const start = proto.start;
      proto.start = function (this: unknown, ...args: unknown[]) {
        w.soundsPlayed++;
        return start.apply(this, args);
      };
    }
  });
}
const played = (page: Page) =>
  page.evaluate(() => (window as unknown as { soundsPlayed: number }).soundsPlayed);

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

const soundToggle = (page: Page) =>
  page.getByRole('banner').getByRole('button', { name: 'Sound effects' });

test.describe('sound effects', () => {
  test('are off by default: clicks stay silent', async ({ page }) => {
    await countSounds(page);
    await gotoApp(page, '/en/');
    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'false');
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Work' })
      .click();
    expect(await played(page)).toBe(0);
  });

  test('once turned on, clicks tick and the choice is remembered', async ({ page }) => {
    await countSounds(page);
    await gotoApp(page, '/en/');
    await soundToggle(page).click();
    await expect(soundToggle(page)).toHaveAttribute('aria-pressed', 'true');
    expect(await played(page)).toBe(1); // the confirmation click

    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Work' })
      .click();
    expect(await played(page)).toBe(2);

    await gotoApp(page, '/fr/');
    await expect(
      page.getByRole('banner').getByRole('button', { name: 'Effets sonores' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('the theme toggle plays the wave', async ({ page }) => {
    await countSounds(page);
    await gotoApp(page, '/en/');
    await soundToggle(page).click();
    const before = await played(page);
    await page
      .getByRole('banner')
      .getByRole('button', { name: /Switch to/ })
      .click();
    expect((await played(page)) - before).toBe(2); // noise sweep + tone
  });

  test('the header fits a 320px phone with both toggles', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await gotoApp(page, '/fr/');
    await expectNoHorizontalScroll(page);
    const box = await page.getByRole('banner').getByRole('link', { name: 'FR' }).boundingBox();
    expect(box && box.x + box.width <= 320).toBe(true);
  });

  test('the header has no accessibility violations with sound on', async ({ page }) => {
    await gotoApp(page, '/en/');
    await soundToggle(page).click();
    await expectNoA11yViolations(page);
  });
});
