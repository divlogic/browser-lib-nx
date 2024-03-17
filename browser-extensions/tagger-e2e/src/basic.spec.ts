// import { expect } from '@playwright/test';
import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';
const expect = test.expect;

// This might change from time to time in the early stages.

test('Example test', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await expect(page).toHaveTitle('Tagger');
});

test('Can add tags', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.getByLabel('Add tag:').click();
  await page.getByLabel('Add tag:').fill('test');
  await page.getByLabel('Add tag:').press('Enter');

  await expect(page.locator('mark', { hasText: 'test' }).first()).toBeVisible();
});

test('Added tags persist', async ({ extensionId, context }) => {
  const page = await context.newPage();

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.getByLabel('Add tag:').click();
  await page.getByLabel('Add tag:').fill('test');
  await page.getByLabel('Add tag:').press('Enter');
  await expect(page.locator('mark', { hasText: 'test' }).first()).toBeVisible();
  await page.close();

  const newPage = await context.newPage();
  await newPage.goto(`chrome-extension://${extensionId}/index.html`);
  await expect(
    newPage.locator('mark', { hasText: 'test' }).first()
  ).toBeVisible();
});

test('Tags highlight on arbitrary websites', async ({
  extensionId,
  context,
}) => {
  const testString = 'Business';
  const page = await context.newPage();

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.getByLabel('Add tag:').click();
  await page.getByLabel('Add tag:').fill(testString);
  await page.getByLabel('Add tag:').press('Enter');
  await expect(
    page.locator('mark', { hasText: testString }).first()
  ).toBeVisible();
  const newPage = await context.newPage();
  await newPage.goto('https://google.com');
  await expect(
    newPage.locator('mark', { hasText: testString }).first()
  ).toBeVisible();
});

test('Can delete tags', async ({ page, extensionId }) => {
  const tagger = new TaggerDevPage(page, extensionId);
  await tagger.goto();

  await tagger.addTag({ text: 'item1' });
  await tagger.addTag({ text: 'item2' });
  await tagger.addTag({ text: 'item3' });

  await expect(
    page.locator('mark', { hasText: 'item1' }).first()
  ).toBeVisible();
  await expect(
    page.locator('mark', { hasText: 'item2' }).first()
  ).toBeVisible();
  await expect(
    page.locator('mark', { hasText: 'item3' }).first()
  ).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).click();

  await expect(
    page.locator('mark', { hasText: 'item2' }).first()
  ).toBeUndefined();
});
