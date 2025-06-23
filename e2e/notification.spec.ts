import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Notificacoes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('badge de notificacao visivel apos agendar', async ({ page }) => {
    await page.goto('/schedule/new');
    await page.fill('input[name="title"]', 'Notificacao Teste');
    await page.click('button[type="submit"]');
    await page.click('button[aria-label="Ver notificações"]');
    await expect(page.getByText('Notificacao Teste')).toBeVisible();
  });
});
