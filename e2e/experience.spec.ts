import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

const FILES = ['minotore.json', 'converty.json', 'ibspace.json', 'inoteqia.json'];

function experience(page: Page, label = 'Experience files') {
  const tablist = page.getByRole('tablist', { name: label });
  return {
    tablist,
    tab: (name: string) => tablist.getByRole('tab', { name }),
    panel: page.locator('#experience').getByRole('tabpanel'),
  };
}

test.describe('experience tabs', () => {
  test('every experience is in the prerendered HTML', async ({ request }) => {
    const html = await (await request.get('/en/')).text();
    for (const company of ['Minotore', 'Converty', 'IBSpace', 'Inoteqia']) {
      expect(html).toContain(`"${company}"`);
    }
  });

  test('clicking a file opens it', async ({ page }) => {
    await page.goto('/en/');
    const { tab, panel } = experience(page);
    await expect(tab('minotore.json')).toHaveAttribute('aria-selected', 'true');
    await expect(panel).toHaveCount(1);
    await expect(panel).toContainText('"Frontend Developer"');

    await tab('ibspace.json').click();
    await expect(tab('ibspace.json')).toHaveAttribute('aria-selected', 'true');
    await expect(tab('minotore.json')).toHaveAttribute('aria-selected', 'false');
    await expect(panel).toContainText('"IBSpace"');
    await expect(panel).toContainText('"Jul – Sep 2023"');
    await expect(page.locator('#experience .pane__tab--active')).toHaveText('ibspace.json');
  });

  test('the open file is kept in the URL and can be linked to', async ({ page }) => {
    await page.goto('/en/');
    await page.waitForFunction(() =>
      document.querySelector('app-root')?.hasAttribute('ng-version'),
    );
    const { tab } = experience(page);
    await page.evaluate(() => document.fonts.ready);
    await tab('converty.json').scrollIntoViewIfNeeded();
    const before = (await tab('converty.json').boundingBox())?.y;
    await tab('converty.json').click();
    await expect(page).toHaveURL(/[?&]experience=converty\b/);
    // Updating the URL must not jump the page: the tab stays where it was clicked (give or take
    // the last pixels of the pane's reveal animation).
    const after = (await tab('converty.json').boundingBox())?.y ?? 0;
    expect(Math.abs(after - (before ?? 0))).toBeLessThan(40);

    await page.goto('/en/?experience=ibspace#experience');
    await expect(experience(page).tab('ibspace.json')).toHaveAttribute('aria-selected', 'true');
  });

  test('the keyboard follows the tabs pattern', async ({ page }) => {
    await page.goto('/en/');
    const { tablist, tab, panel } = experience(page);
    await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

    await tab('minotore.json').focus();
    await page.keyboard.press('ArrowDown');
    await expect(tab('converty.json')).toBeFocused();
    await expect(tab('converty.json')).toHaveAttribute('aria-selected', 'true');
    await expect(panel).toContainText('"Converty"');

    await page.keyboard.press('End');
    await expect(tab('inoteqia.json')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(tab('minotore.json')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(tab('inoteqia.json')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tab('minotore.json')).toBeFocused();

    await page.keyboard.press('ArrowRight');
    await expect(panel).toContainText('"Converty"');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('region', { name: 'converty.json' })).toBeFocused();
    // One tab stop: Shift+Tab returns to the selected tab, not the last one in the list.
    await page.keyboard.press('Shift+Tab');
    await expect(tab('converty.json')).toBeFocused();
  });

  test('on mobile the explorer is a horizontal strip above the code', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/');
    const { tablist, tab, panel } = experience(page);
    await expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');

    const listBox = await tablist.boundingBox();
    const panelBox = await panel.boundingBox();
    expect(listBox && panelBox && listBox.y + listBox.height <= panelBox.y).toBe(true);
    const tabs = await Promise.all(FILES.map((f) => tab(f).boundingBox()));
    expect(new Set(tabs.map((b) => Math.round(b?.y ?? -1))).size).toBe(1);

    // The strip scrolls inside its own box, never the page.
    await tab('minotore.json').focus();
    await page.keyboard.press('End');
    await expect(tab('inoteqia.json')).toBeFocused();
    await expect(tab('inoteqia.json')).toBeInViewport();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('works in French', async ({ page }) => {
    await page.goto('/fr/');
    const { tab, panel } = experience(page, 'Fichiers d’expérience');
    await tab('converty.json').click();
    await expect(panel).toContainText('"Ingénieur full-stack (stage)"');
    await expect(panel).toContainText('"févr. – août 2024"');
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`no accessibility violations after switching files (${viewport.name})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/en/');
      await experience(page).tab('converty.json').click();
      await expectNoA11yViolations(page);
    });
  }
});
