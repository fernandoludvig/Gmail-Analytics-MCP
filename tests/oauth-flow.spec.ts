import { test, expect } from '@playwright/test';

test.describe('OAuth Flow', () => {
  test('should redirect to Google OAuth without errors', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se a página carregou corretamente
    await expect(page.getByRole('heading', { name: 'Gmail Analytics MCP' })).toBeVisible();
    
    // Clicar no botão de login
    const loginButton = page.getByRole('button', { name: 'Conectar com Google' });
    await expect(loginButton).toBeVisible();
    
    // Interceptar requisições de rede para verificar se não há erros
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('accounts.google.com') && response.status() < 400
    );
    
    await loginButton.click();
    
    // Aguardar redirecionamento para Google
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    
    // Verificar se chegamos na página de login do Google
    expect(page.url()).toContain('accounts.google.com');
    
    // Verificar se não há mensagens de erro
    await expect(page.locator('text=erro de autorização')).not.toBeVisible();
    await expect(page.locator('text=invalid_request')).not.toBeVisible();
  });

  test('should handle OAuth callback correctly', async ({ page }) => {
    // Simular callback OAuth com parâmetros válidos
    await page.goto('/api/auth/callback/google?code=test_code&state=gmail_analytics_auth');
    
    // Verificar se não há erros na página de callback
    await expect(page.locator('text=error')).not.toBeVisible();
  });

  test('should display proper error for invalid OAuth parameters', async ({ page }) => {
    // Testar com parâmetros inválidos
    await page.goto('/api/auth/callback/google?error=access_denied');
    
    // Verificar se o erro é tratado corretamente
    await page.waitForURL(/\?error=/, { timeout: 5000 });
    expect(page.url()).toContain('error=');
  });
});
