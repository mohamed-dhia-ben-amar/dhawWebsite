import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

test.describe('home page', () => {
  test('renders the hero, highlights and section headings', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle('Mohamed Dhia Ben Amar · Full-Stack Software Engineer');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Full-stack engineer building design systems and AI-assisted workflows.',
    );
    await expect(
      page.getByRole('region', { name: 'Highlights' }).getByRole('listitem'),
    ).toHaveCount(4);
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Selected projects',
      "Where I've worked",
      "Let's build something.",
    ]);
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(3);
  });

  test('header navigation scrolls to each section', async ({ page }) => {
    await page.goto('/en/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const [label, id] of [
      ['./work', 'work'],
      ['./experience', 'experience'],
      ['./contact', 'contact'],
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

  test('the hero terminal types out its lines and ends with every line visible', async ({
    page,
  }) => {
    await page.goto('/en/');
    const terminal = page.getByRole('group', { name: 'Terminal summary' });
    const lastOutput = terminal.locator('.session__out').last();
    // Hidden while the sequence plays, then revealed.
    await expect(lastOutput).toHaveCSS('opacity', '0');
    await expect(lastOutput).toHaveCSS('opacity', '1', { timeout: 10_000 });
    await expect(lastOutput).toHaveText(/available for new roles/);
  });

  test('with reduced motion, the terminal is fully visible at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/');
    const terminal = page.getByRole('group', { name: 'Terminal summary' });
    for (const output of await terminal.locator('.session__out').all()) {
      await expect(output).toHaveCSS('opacity', '1');
    }
    await expect(terminal.locator('.session__typed').first()).toHaveCSS('clip-path', 'none');
    await expect(terminal.locator('.session__cursor')).toHaveCSS('animation-name', 'none');
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`has no detectable accessibility violations (${viewport.name})`, async ({ page }) => {
      // Reduced motion so axe sees the final state rather than a half-typed terminal.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await page.goto('/en/');
      await expectNoA11yViolations(page);
    });
  }
});
