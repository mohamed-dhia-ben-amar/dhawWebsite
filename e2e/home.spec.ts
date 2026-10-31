import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

test.describe('home page', () => {
  test('renders the hero, highlights and section headings', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle('Mohamed Dhia Ben Amar · Full-Stack Software Engineer');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Full-stack engineer building configurable widget libraries and AI-assisted workflows.',
    );
    await expect(
      page.getByRole('region', { name: 'Highlights' }).getByRole('listitem'),
    ).toHaveCount(4);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Selected projects',
      "Where I've worked",
      'My journey so far',
      "Let's build something.",
    ]);
    // 3 project cards + 6 journey steps.
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(9);
  });

  test('header navigation scrolls to each section', async ({ page }) => {
    await page.goto('/en/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const [label, id] of [
      ['Work', 'work'],
      ['Experience', 'experience'],
      ['Contact', 'contact'],
    ]) {
      await nav.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('"Get in touch" goes to the contact section', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('link', { name: 'Get in touch' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
    await expect(page.getByRole('link', { name: 'contact@mohameddhia.dev' })).toHaveAttribute(
      'href',
      'mailto:contact@mohameddhia.dev',
    );
  });

  test('both CV downloads are served as PDFs', async ({ page }) => {
    await page.goto('/en/');
    for (const name of ['Download CV in English, PDF: EN', 'Download CV in French, PDF: FR']) {
      const href = await page.getByRole('link', { name }).getAttribute('href');
      const response = await page.request.get(href ?? '');
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/pdf');
    }
  });

  test('profile links point to GitHub and LinkedIn', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/mohamed-dhia-ben-amar',
    );
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/mohameddhia-benamar',
    );
  });

  test('the hero config types itself in after the headline, ending fully visible', async ({
    page,
  }) => {
    await page.goto('/en/');
    const lastLine = page
      .getByRole('group', { name: 'Hero settings' })
      .locator('.cfg__line')
      .last();
    // Hidden behind a full clip while the sequence plays, then fully shown.
    await expect(lastLine).toHaveCSS('clip-path', /100%/);
    await expect(lastLine).toHaveCSS('clip-path', /^inset\(0px(?: 0%)?(?: 0px)*\)$/, {
      timeout: 10_000,
    });
  });

  test('with reduced motion, the hero config is fully visible at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/');
    const editor = page.getByRole('group', { name: 'Hero settings' });
    for (const line of await editor.locator('.cfg__line').all()) {
      await expect(line).toHaveCSS('clip-path', 'none');
    }
    await expect(editor.locator('.cfg__cursor')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.hero__title')).toHaveCSS('animation-name', 'none');
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`has no detectable accessibility violations (${viewport.name})`, async ({ page }) => {
      // Reduced motion so axe sees the final state rather than a half-typed config.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/en/');
      await expectNoA11yViolations(page);
    });
  }
});
