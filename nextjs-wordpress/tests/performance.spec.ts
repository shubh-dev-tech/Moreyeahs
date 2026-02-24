import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for console errors (some might be acceptable, adjust as needed)
    expect(consoleErrors.length).toBe(0);
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Block all image requests to simulate slow network
    await page.route('**/*.{png,jpg,jpeg,gif,webp}', route => route.abort());
    
    await page.goto('/');
    
    // Page should still load even without images
    await expect(page).toHaveTitle(/.+/);
  });
});
