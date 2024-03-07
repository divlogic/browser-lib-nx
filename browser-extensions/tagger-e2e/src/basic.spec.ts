import { expect } from '@playwright/test';
import { fixtures } from './fixtures';
const test = fixtures('tagger');

// This might change from time to time in the early stages.
const extension_id = 'eicmofgbobjihgidpnnagkceijhfeocg';

test('Example test', async ({ page }) => {
  await page.goto(`chrome-extension://${extension_id}/index.html`);
  await expect(page).toHaveTitle('Tagger');
});

test('Can add labels', async ({ page }) => {
  await page.goto(`chrome-extension://${extension_id}/index.html`);
  await page.getByLabel('Add tag:').click();
  await page.getByLabel('Add tag:').fill('test');
  await page.getByLabel('Add tag:').press('Enter');
  await expect(page.getByText('test')).toBeDefined();
});
