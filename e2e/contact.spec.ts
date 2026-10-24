import { expect, test, type Page, type Route } from '@playwright/test';
import { expectNoA11yViolations } from './support/a11y';

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hello, I would like to talk about a frontend role.',
};

/** Mocks POST /api/contact (the function is not part of the static build). */
async function mockApi(page: Page, status: number, body: object) {
  const requests: unknown[] = [];
  await page.route('**/api/contact', async (route: Route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  return requests;
}

async function fill(page: Page, values: Partial<typeof VALID> = VALID) {
  const form = page.getByRole('form', { name: 'Contact form' });
  if (values.name !== undefined) await form.getByLabel('name:').fill(values.name);
  if (values.email !== undefined) await form.getByLabel('email:').fill(values.email);
  if (values.message !== undefined) await form.getByLabel('message:').fill(values.message);
  return form;
}

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('sends a message and shows the success state', async ({ page }) => {
    const requests = await mockApi(page, 200, { ok: true });
    await page.goto('/en/');
    const form = await fill(page, { ...VALID, name: '  Ada Lovelace  ' });
    await form.getByRole('button', { name: 'Send message' }).click();

    const title = page.getByRole('heading', { name: 'Message sent.' });
    await expect(title).toBeVisible();
    await expect(title).toBeFocused();
    expect(requests).toEqual([{ ...VALID, website: '' }]);

    await page.getByRole('button', { name: 'Send another message' }).click();
    await expect(page.getByLabel('name:')).toBeFocused();
    await expect(page.getByLabel('name:')).toHaveValue('');
  });

  test('shows the loading state while sending', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    await page.route('**/api/contact', async (route) => {
      await gate;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.goto('/en/');
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    const button = form.getByRole('button', { name: 'Sending…' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    release();
    await expect(page.getByRole('heading', { name: 'Message sent.' })).toBeVisible();
  });

  test('validates inline with a focused error summary, without calling the API', async ({
    page,
  }) => {
    const requests = await mockApi(page, 200, { ok: true });
    await page.goto('/en/');
    const form = await fill(page, { name: 'A', email: 'not-an-email' });
    await form.getByRole('button', { name: 'Send message' }).click();

    const summary = form.locator('.cf__summary');
    await expect(summary).toBeFocused();
    await expect(summary.getByRole('link')).toHaveText([
      'Your name needs at least 2 characters.',
      'Enter a valid email address, like name@example.com.',
      'Enter a message.',
    ]);
    const email = form.getByLabel('email:');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(/Enter a valid email address/);

    await summary.getByRole('link', { name: /valid email/ }).click();
    await expect(email).toBeFocused();
    expect(requests).toEqual([]);
  });

  test('shows a clear message when rate limited', async ({ page }) => {
    await mockApi(page, 429, { ok: false, error: 'rate_limited' });
    await page.goto('/en/');
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByRole('alert')).toContainText('Too many messages');
    await expect(form.getByLabel('name:')).toHaveValue(VALID.name);
  });

  test('shows server field errors on the right field', async ({ page }) => {
    await mockApi(page, 400, { ok: false, error: 'validation', fields: { email: 'invalid' } });
    await page.goto('/en/');
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByLabel('email:')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator('.cf__summary')).toBeFocused();
  });

  test('falls back to the email address when the request fails', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort());
    await page.goto('/en/');
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(form.getByRole('alert')).toContainText('mohameddhiabenamar@gmail.com');
  });

  test('the honeypot is not reachable by keyboard', async ({ page }) => {
    await page.goto('/en/');
    await page.getByLabel('message:').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Send message' })).toBeFocused();
  });

  test('works in French', async ({ page }) => {
    await mockApi(page, 200, { ok: true });
    await page.goto('/fr/');
    const form = page.getByRole('form', { name: 'Formulaire de contact' });
    await form.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(form.locator('.cf__summary')).toContainText('Indiquez votre nom.');
    await form.getByLabel('nom :').fill(VALID.name);
    await form.getByLabel('email :').fill(VALID.email);
    await form.getByLabel('message :').fill('Bonjour, je souhaite échanger sur un poste.');
    await form.getByRole('button', { name: 'Envoyer le message' }).click();
    await expect(page.getByRole('heading', { name: 'Message envoyé.' })).toBeFocused();
  });

  test('no accessibility violations in the error state', async ({ page }) => {
    await page.goto('/en/');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('.cf__summary')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('no accessibility violations in the success state (mobile)', async ({ page }) => {
    await mockApi(page, 200, { ok: true });
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/en/');
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByRole('heading', { name: 'Message sent.' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});
