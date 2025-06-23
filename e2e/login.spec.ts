import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('autenticacao valida redireciona para dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('login invalido exibe erro', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'invalid');
    await page.click('button[type="submit"]');
    await expect(page.getByText(/erro ao fazer login/i)).toBeVisible();
  });

  test('logout redireciona para login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.TEST_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.click('button[aria-label="Menu do usuário"]');
    await page.getByText('Sair').click();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/login/);
  });
});
