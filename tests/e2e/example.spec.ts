import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  // Using the baseURL from config, this will resolve to http://localhost:3000
  await page.goto("");

  // Wait for the page to be loaded
  await page.waitForLoadState("domcontentloaded");

  // Add your test assertions here
  // For example:
  await expect(page).toHaveTitle(/Elevate Wellness/);
});
