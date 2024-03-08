// import { expect } from '@playwright/test';
import { test } from './fixtures';
const expect = test.expect;

// This might change from time to time in the early stages.

test('Example test', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await expect(page).toHaveTitle('Tagger');
});

test('Can add labels', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.getByLabel('Add tag:').click();
  await page.getByLabel('Add tag:').fill('test');
  await page.getByLabel('Add tag:').press('Enter');

  await expect(page.locator('mark', { hasText: 'test' }).first()).toBeVisible();
});
