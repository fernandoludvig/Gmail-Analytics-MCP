import { test, expect } from '@playwright/test';

test.describe('Gmail Authentication', () => {
  test('should display login button', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se o botão de login está visível
    await expect(page.getByRole('button', { name: 'Conectar com Google' })).toBeVisible();
  });

  test('should show app title and description', async ({ page }) => {
    await page.goto('/');
    
    // Verificar título principal
    await expect(page.getByRole('heading', { name: 'Gmail Analytics MCP' })).toBeVisible();
    
    // Verificar descrição
    await expect(page.getByText('Análise inteligente de e-mails usando MCPs do Smithery.ai')).toBeVisible();
  });

  test('should navigate to auth URL when clicking login', async ({ page }) => {
    await page.goto('/');
    
    // Interceptar a navegação para o Google OAuth
    await page.getByRole('button', { name: 'Conectar com Google' }).click();
    
    // Aguardar redirecionamento (pode levar alguns segundos)
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    
    // Verificar se estamos na página de login do Google
    expect(page.url()).toContain('accounts.google.com');
  });
});
