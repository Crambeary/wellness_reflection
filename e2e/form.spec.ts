import { test, expect } from '@playwright/test';

test('form input should work correctly', async ({ page }) => {
  await page.goto('/');
  
  // Example test for your form input
  const input = page.getByTestId('test-id');
  await input.fill('Test Value');
  await expect(input).toHaveValue('Test Value');
});
