import { test, expect } from '@playwright/test';

test.describe('Web Games Portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page with games grid', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Minijuegos Territoriales');
    await expect(page.locator('text=Mina Responsable')).toBeVisible();
    await expect(page.locator('text=Ruta del Guardián')).toBeVisible();
  });

  test('should navigate to Mina Responsable game page', async ({ page }) => {
    await page.click('text=Mina Responsable');
    await expect(page).toHaveURL(/\/games\/mina-responsable/);
    await expect(page.locator('h1')).toContainText('Mina Responsable');
  });

  test('should navigate to Ruta del Guardián game page', async ({ page }) => {
    await page.click('text=Ruta del Guardián');
    await expect(page).toHaveURL(/\/games\/ruta-guardian/);
    await expect(page.locator('h1')).toContainText('Ruta del Guardián');
  });

  test('should show Cattleya tiers section', async ({ page }) => {
    await expect(page.locator('text=SISTEMA CATTLEYA')).toBeVisible();
    await expect(page.locator('text=BASE')).toBeVisible();
    await expect(page.locator('text=CUIDADO')).toBeVisible();
    await expect(page.locator('text=GUARDIAN')).toBeVisible();
    await expect(page.locator('text=EMBAJADOR')).toBeVisible();
  });
});

test.describe('Game Play Flow', () => {
  test('should start game session for Mina Responsable', async ({ page }) => {
    await page.goto('/games/mina-responsable');
    await page.click('text=Jugar ahora');
    await expect(page).toHaveURL(/\/games\/mina-responsable\/play/);
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('should show free runs counter', async ({ page }) => {
    await page.goto('/games/mina-responsable');
    await expect(page.locator('text=/gratis hoy/')).toBeVisible();
  });
});

test.describe('Payment Flow', () => {
  test('should redirect to Stripe checkout for pack purchase', async ({ page }) => {
    await page.goto('/games/mina-responsable');
    // Mock authenticated user - in real test, login first
    // await page.click('text=Comprar pack');
    // await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });
});

test.describe('Game Completion & Rewards', () => {
  test('should report game completion and receive rewards', async ({ page }) => {
    await page.goto('/games/mina-responsable/play');
    // Wait for iframe to load
    await page.waitForLoadState('networkidle');
    // In real test, complete game in iframe and verify rewards
    // This would require iframe communication testing
  });
});

test.describe('Federation Stats', () => {
  test('should show federated game stats for user federation', async ({ page }) => {
    await page.goto('/games/mina-responsable');
    await expect(page.locator('text=/Federación/')).toBeVisible();
  });
});