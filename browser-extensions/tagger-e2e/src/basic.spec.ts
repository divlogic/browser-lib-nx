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
  const tagger = new TaggerDevPage(page, extensionId);
  await tagger.goto();
  await tagger.addTag({ text: 'test' });

  const highlights = await tagger.getHighlightRegistryTextContents();

  expect(highlights).toContain('test');
});

test('Added tags persist', async ({ extensionId, context }) => {
  const page = await context.newPage();
  const tagger = new TaggerDevPage(page, extensionId);
  await tagger.goto();
  await tagger.addTag({ text: 'test' });

  await expect(page.getByText('test').first()).toBeVisible();

  await page.close();

  const newPage = await context.newPage();
  await newPage.goto(`chrome-extension://${extensionId}/index.html`);
  await expect(newPage.getByText('test').first()).toBeVisible();
});

test('Tags highlight on arbitrary websites', async ({
  extensionId,
  context,
}) => {
  const testString = 'Business';
  const page = await context.newPage();
  const initialTagger = new TaggerDevPage(page, extensionId);

  await initialTagger.goto();
  await initialTagger.addTag({ text: testString });

  await expect(page.getByText(testString).first()).toBeVisible();

  const newPage = await context.newPage();
  await newPage.goto('https://google.com');
  const tagger = new TaggerDevPage(newPage, extensionId);

  const highlights = await tagger.getHighlightRegistryTextContents();
  expect(highlights).toContain(testString);
});

test('Can delete tags', async ({ page, extensionId }) => {
  const tagger = new TaggerDevPage(page, extensionId);
  await tagger.goto();

  await tagger.addTag({ text: 'item1' });
  await tagger.addTag({ text: 'item2' });
  await tagger.addTag({ text: 'item3' });

  await expect(page.getByText('item1')).toBeVisible();
  await expect(page.getByText('item2')).toBeVisible();
  await expect(page.getByText('item3')).toBeVisible();

  await page.getByRole('button', { name: 'delete' }).nth(1).click();

  await expect(page.getByText('item2')).toBeHidden();
});
