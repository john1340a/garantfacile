import { test, expect } from '@playwright/test';

test('has title and brand name', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GarantFacile/);

  // Check if navbar brand is visible (using first to avoid multiple matches)
  const brand = page.locator('p', { hasText: 'GarantFacile' }).first();
  await expect(brand).toBeVisible();
});

test('check navigation links', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Nos Garants' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Commencer' })).toBeVisible();
});
test('check hero section styling', async ({ page }) => {
  await page.goto('/');

  const hero = page.locator('section').first();
  const styles = await hero.evaluate((el) => window.getComputedStyle(el).backgroundImage);
  expect(styles).not.toBe('none');

  // Check if a specific theme variable is set (HeroUI injects these)
  const [primaryColor, radiusVariable] = await page.evaluate(() => [
    getComputedStyle(document.documentElement).getPropertyValue('--heroui-primary').trim(),
    getComputedStyle(document.documentElement).getPropertyValue('--heroui-radius-medium').trim()
  ]);
  
  expect(primaryColor).not.toBe('');
  expect(radiusVariable).not.toBe('');

  // Check border radius on a button
  const button = page.getByRole('button', { name: 'Commencer maintenant' });
  const borderRadius = await button.evaluate((el) => window.getComputedStyle(el).borderRadius);
  
  // Radius medium is 12px by default (but can be 14px if large or inherited)
  expect(parseFloat(borderRadius)).toBeGreaterThan(0);
});
