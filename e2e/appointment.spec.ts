import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', process.env.TEST_EMAIL!);
  await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Agendamento', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('cria novo agendamento', async ({ page }) => {
    await page.goto('/schedule/new');
    await page.fill('input[name="title"]', 'Consulta de teste');
    await page.click('button[type="submit"]');
    await expect(page.getByText('Consulta de teste')).toBeVisible();
  });
});
