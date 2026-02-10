import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Find and click a link (adjust selector based on your actual navigation)
    const firstLink = page.locator('nav a').first();
    const linkText = await firstLink.textContent();
    
    if (linkText) {
      await firstLink.click();
      
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      
      // Verify we navigated (URL should have changed)
      expect(page.url()).not.toBe('http://localhost:3000/');
    }
  });

  test('should have working back button', async ({ page }) => {
    await page.goto('/');
    const homeUrl = page.url();
    
    // Navigate to another page if links exist
    const links = page.locator('nav a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      await links.first().click();
      await page.waitForLoadState('networkidle');
      
      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Should be back at home
      expect(page.url()).toBe(homeUrl);
    }
  });
});
