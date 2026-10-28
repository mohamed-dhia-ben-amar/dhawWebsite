import { expect, test, type Page } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

async function gotoApp(page: Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector('app-root')?.hasAttribute('ng-version'));
}

/** A tag's text is its name, after an optional `›` mark when the tech has no logo. */
const tag = (name: string) => new RegExp(`^\\s*(›\\s*)?${name.replace('.', '\\.')}\\s*$`);

test.describe('stack tags', () => {
  test('the hero lists the main stack with logos', async ({ page }) => {
    await gotoApp(page, '/en/');
    const stack = page.getByRole('list', { name: 'Main stack' });
    await expect(stack.getByRole('listitem')).toHaveText([
      tag('Angular'),
      tag('Nx'),
      tag('TypeScript'),
      tag('RxJS'),
      tag('Node.js'),
      tag('React'),
      tag('Golang'),
      tag('Claude Code'),
    ]);
    await expect(stack.locator('svg[aria-hidden="true"]')).toHaveCount(8);
  });

  test('case studies use the same tags', async ({ page }) => {
    await gotoApp(page, '/en/work/converty-shop');
    const tags = page.locator('#study-stack ~ app-tech-tags li');
    await expect(tags).toHaveText([
      tag('React Native'),
      tag('Expo'),
      tag('Redux'),
      tag('Zustand'),
      tag('Node.js'),
      tag('Express'),
      tag('Golang'),
    ]);
    await expect(tags.filter({ hasText: 'Zustand' }).locator('.tag__mark')).toHaveCount(1);
  });
});

test.describe('my journey so far', () => {
  test('lists the steps newest first, from the nav', async ({ page }) => {
    await gotoApp(page, '/en/');
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Journey' })
      .click();
    await expect(page).toHaveURL(/#journey$/);
    const section = page.locator('#journey');
    await expect(section).toBeInViewport();
    await expect(section.getByRole('heading', { level: 2 })).toHaveText('My journey so far');
    await expect(section.getByRole('heading', { level: 3 })).toHaveText([
      'Frontend Developer',
      'Full-Stack Engineer Intern',
      'Software Engineer Intern',
      'Department Lead, then Mentor',
      'Front-End Mobile Developer Intern',
      'Engineering Degree in Full-Stack Software Engineering',
    ]);
    await expect(section.getByText('type: education')).toBeVisible();
  });

  test('is in French on /fr/, after the renamed experience section', async ({ page }) => {
    await gotoApp(page, '/fr/');
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Projets sélectionnés',
      'Où j’ai travaillé',
      'Mon parcours jusqu’ici',
      'Construisons quelque chose.',
    ]);
    await expect(page.locator('#journey').getByText('type: formation')).toBeAttached();
  });

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 375, height: 800 },
  ]) {
    test(`no accessibility violations (${viewport.name})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize(viewport);
      await gotoApp(page, '/en/');
      await page.locator('#journey').scrollIntoViewIfNeeded();
      await expectNoA11yViolations(page);
    });
  }
});
