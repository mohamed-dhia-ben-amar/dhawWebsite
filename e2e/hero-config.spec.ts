import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

const editor = (page: Page, name = 'Hero settings') => page.getByRole('group', { name });
const headline = (page: Page) => page.getByRole('heading', { level: 1 });

test.describe('hero live config', () => {
  test('the prerendered page shows the defaults', async ({ request }) => {
    const html = await (await request.get('/en/')).text();
    expect(html).toContain('hero.widget.json');
    expect(html).toContain('configurable widget libraries');
    expect(html).toContain('"amber"');
  });

  test('"focus" swaps the headline and announces it', async ({ page }) => {
    await gotoApp(page, '/en/');
    await editor(page)
      .getByRole('button', { name: /^Headline: widgets/ })
      .click();
    await expect(headline(page)).toHaveText(
      'Full-stack engineer leading AI-assisted development with Claude Code agents.',
    );
    await expect(editor(page).locator('[aria-live="polite"]')).toHaveText('Headline: ai');
  });

  test('"accent" recolours the hero and "align" centres it', async ({ page }) => {
    await gotoApp(page, '/en/');
    const cta = page.locator('.hero .button--primary');
    const before = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    await editor(page)
      .getByRole('button', { name: /^Accent colour/ })
      .click();
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(before);

    await editor(page)
      .getByRole('button', { name: /^Alignment/ })
      .click();
    await expect(headline(page)).toHaveCSS('text-align', 'center');
  });

  test('stack items hide and show their tag; reset restores everything', async ({ page }) => {
    await gotoApp(page, '/en/');
    const stack = page.getByRole('list', { name: 'Main stack' });
    const golang = editor(page).getByRole('button', { name: 'Golang', exact: true });
    await golang.click();
    await expect(golang).toHaveAttribute('aria-pressed', 'false');
    await expect(stack.getByText('Golang')).toHaveCount(0);

    await editor(page)
      .getByRole('button', { name: /^Headline/ })
      .click();
    const reset = editor(page).getByRole('button', { name: 'Reset' });
    await reset.click();
    await expect(stack.getByText('Golang')).toHaveCount(1);
    await expect(headline(page)).toContainText('configurable widget libraries');
    await expect(reset).toHaveAttribute('aria-disabled', 'true');
    await expect(reset).toBeFocused();
  });

  test('works with the keyboard', async ({ page }) => {
    await gotoApp(page, '/en/');
    const accent = editor(page).getByRole('button', { name: /^Accent colour/ });
    await accent.focus();
    await page.keyboard.press('Enter');
    await expect(accent).toHaveAccessibleName('Accent colour: sky. Change');
    await page.keyboard.press('Tab');
    await expect(editor(page).getByRole('button', { name: /^Alignment/ })).toBeFocused();
  });

  test('works in French', async ({ page }) => {
    await gotoApp(page, '/fr/');
    await editor(page, 'Réglages du hero')
      .getByRole('button', { name: /^Titre\s: widgets/ })
      .click();
    await expect(headline(page)).toContainText('développement assisté par IA');
  });

  test('no accessibility violations after changing every value', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoApp(page, '/en/');
    for (const name of [/^Accent colour/, /^Alignment/, /^Headline/]) {
      await editor(page).getByRole('button', { name }).click();
    }
    await editor(page).getByRole('button', { name: 'Nx', exact: true }).click();
    await expectNoA11yViolations(page);
  });
});
