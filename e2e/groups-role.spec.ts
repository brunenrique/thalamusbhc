import { test, expect } from '@playwright/test';

async function login(page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

test.describe('Permissões de Grupos', () => {
  test('Admin vê botões de criar', async ({ page }) => {
    await login(page, process.env.TEST_EMAIL!, process.env.TEST_PASSWORD!);
    await page.goto('/groups');
    await expect(page.getByRole('link', { name: 'Criar Novo Grupo' })).toBeVisible();
  });

  test('Secretária não vê botões de criar', async ({ page }) => {
    await login(page, process.env.TEST_SECRETARY_EMAIL!, process.env.TEST_SECRETARY_PASSWORD!);
    await page.goto('/groups');
    await expect(page.getByRole('link', { name: 'Criar Novo Grupo' })).toHaveCount(0);
  });
});
