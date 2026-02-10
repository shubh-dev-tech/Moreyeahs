# Playwright Testing Guide

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.

## Setup

### 1. Install Dependencies

First, install the npm packages:

```bash
npm install
```

### 2. Install Playwright Browsers

Install the Playwright browsers (only needs to be done once):

```bash
npx playwright install
```

Or install specific browsers:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Running Tests

### Run all tests (headless mode)
```bash
npm test
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/homepage.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:report
```

## Test Structure

Tests are organized in the `tests/` directory:

- **homepage.spec.ts** - Tests for homepage functionality
- **navigation.spec.ts** - Tests for navigation between pages
- **accessibility.spec.ts** - Accessibility tests
- **performance.spec.ts** - Performance and error handling tests

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }) => {
  // Navigate to page
  await page.goto('/');
  
  // Interact with elements
  await page.click('button');
  
  // Make assertions
  await expect(page.locator('h1')).toHaveText('Welcome');
});
```

### Common Selectors

```typescript
// By text
page.getByText('Click me')

// By role
page.getByRole('button', { name: 'Submit' })

// By test ID
page.getByTestId('my-element')

// By CSS selector
page.locator('.my-class')
page.locator('#my-id')

// By placeholder
page.getByPlaceholder('Enter email')
```

### Common Actions

```typescript
// Click
await page.click('button');

// Fill input
await page.fill('input[name="email"]', 'test@example.com');

// Select option
await page.selectOption('select', 'value');

// Check checkbox
await page.check('input[type="checkbox"]');

// Upload file
await page.setInputFiles('input[type="file"]', 'path/to/file');

// Wait for navigation
await page.waitForURL('**/dashboard');

// Wait for element
await page.waitForSelector('.loading', { state: 'hidden' });
```

### Common Assertions

```typescript
// Text content
await expect(page.locator('h1')).toHaveText('Hello');
await expect(page.locator('h1')).toContainText('Hello');

// Visibility
await expect(page.locator('button')).toBeVisible();
await expect(page.locator('.loader')).toBeHidden();

// Count
await expect(page.locator('.item')).toHaveCount(5);

// URL
await expect(page).toHaveURL(/dashboard/);

// Title
await expect(page).toHaveTitle('My Page');

// Attribute
await expect(page.locator('a')).toHaveAttribute('href', '/about');
```

## Best Practices

1. **Use data-testid attributes** for elements that need to be tested:
   ```tsx
   <button data-testid="submit-button">Submit</button>
   ```

2. **Wait for network idle** when testing pages with API calls:
   ```typescript
   await page.goto('/');
   await page.waitForLoadState('networkidle');
   ```

3. **Use meaningful test descriptions**:
   ```typescript
   test('should display error message when form is submitted with invalid email', async ({ page }) => {
     // ...
   });
   ```

4. **Group related tests** with describe blocks:
   ```typescript
   test.describe('Login Form', () => {
     test('should accept valid credentials', async ({ page }) => {});
     test('should reject invalid credentials', async ({ page }) => {});
   });
   ```

5. **Use beforeEach for common setup**:
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/');
   });
   ```

6. **Take screenshots on failure** (already configured):
   ```typescript
   // Manually take screenshot
   await page.screenshot({ path: 'screenshot.png' });
   ```

## Debugging Tests

### Visual Debugging
```bash
npm run test:debug
```

### Using VS Code Debugger
1. Install the [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) extension
2. Click the green play button next to any test
3. Set breakpoints in your test code

### Console Logs
```typescript
test('debug test', async ({ page }) => {
  console.log('Current URL:', page.url());
  
  const text = await page.textContent('h1');
  console.log('H1 text:', text);
});
```

### Pause Execution
```typescript
test('debug test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens Playwright Inspector
});
```

## CI/CD Integration

The tests are configured to run in CI with:
- 2 retries on failure
- Single worker to avoid conflicts
- Strict mode (fails if test.only is left in code)

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Configuration

The Playwright configuration is in [playwright.config.ts](playwright.config.ts). Key settings:

- **baseURL**: `http://localhost:3000`
- **timeout**: 30 seconds per test
- **retries**: 2 on CI, 0 locally
- **browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **webServer**: Automatically starts dev server before tests

## Troubleshooting

### Tests are flaky
- Add proper waits: `await page.waitForLoadState('networkidle')`
- Use `waitForSelector` instead of fixed timeouts
- Increase timeout if needed: `test.setTimeout(60000)`

### Element not found
- Check if element is in viewport: `await element.scrollIntoViewIfNeeded()`
- Wait for element: `await page.waitForSelector('.my-element')`
- Use more specific selectors

### Tests pass locally but fail in CI
- Check viewport size differences
- Ensure all assets load properly
- Check for timing issues

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
