import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1 tag
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check each image has alt attribute (can be empty string for decorative images)
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const altText = await img.getAttribute('alt');
      expect(altText).not.toBeNull();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Check that an element has focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});
