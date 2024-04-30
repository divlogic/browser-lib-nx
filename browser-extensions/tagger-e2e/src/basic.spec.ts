import { pageAction } from 'webextension-polyfill';
import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('This is a test', () => {
  test('Example test', async ({ page, tagger }) => {
    await tagger.goto();
    await expect(page).toHaveTitle('Tagger');
  });

  test('Can add tags', async ({ tagger, page }) => {
    await tagger.goto();
    await tagger.addTag({ text: 'test' });

    const highlights = await tagger.getHighlightRegistryTextContents();

    expect(highlights).toContain('test');
  });

  test('Added tags persist', async ({ extensionId, context, storage }) => {
    const page = await context.newPage();
    const tagger = new TaggerDevPage({
      page,
      extensionId,
      storage,
    });
    await tagger.goto();
    await tagger.addTag({ text: 'test' });

    await expect(page.getByText('test').first()).toBeVisible();

    await page.close();

    const newPage = await context.newPage();
    const secondTagger = new TaggerDevPage({
      page: newPage,
      extensionId,
      storage,
    });
    secondTagger.goto();
    await expect(newPage.getByText('test').first()).toBeVisible();
  });

  test(
    'Tags highlight on arbitrary websites',
    { tag: ['@websurfing'] },
    async ({ extensionId, context, storage }) => {
      test.skip(storage === 'indexeddb', 'not applicable with storage type');
      const testString = 'Business';
      const page = await context.newPage();
      const initialTagger = new TaggerDevPage({
        page,
        extensionId,
        storage: 'browser.storage.local',
      });

      await initialTagger.goto();
      await initialTagger.addTag({ text: testString });

      await expect(page.getByText(testString).first()).toBeVisible();

      const newPage = await context.newPage();
      await newPage.goto('https://google.com');
      const tagger = new TaggerDevPage({
        page: newPage,
        extensionId: extensionId,
        storage: 'browser.storage.local',
      });

      const highlights = await tagger.getHighlightRegistryTextContents();
      expect(highlights).toContain(testString);
    }
  );

  test('Can delete tags', async ({ page, tagger }) => {
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

  test('Can delete tags after reloads', async ({ page, tagger }) => {
    await tagger.goto();

    await tagger.addTag({ text: 'item1' });
    await tagger.addTag({ text: 'item2' });
    await tagger.addTag({ text: 'item3' });

    await page.reload();

    await expect(page.getByText('item1')).toBeVisible();
    await expect(page.getByText('item2')).toBeVisible();
    await expect(page.getByText('item3')).toBeVisible();

    await page.getByRole('button', { name: 'delete' }).nth(1).click();

    await expect(page.getByText('item2')).toBeHidden();

    await page.reload();
    await expect(page.getByText('item2')).toBeHidden();
  });

  test(
    'Deleted tags no longer highlight on arbitrary websites',
    { tag: ['@websurfing'] },
    async ({ extensionId, context, storage }) => {
      test.skip(storage === 'indexeddb', 'not applicable with storage type');
      const testString = 'Business';
      const page = await context.newPage();
      const initialTagger = new TaggerDevPage({
        page,
        extensionId,
        storage: 'browser.storage.local',
      });

      await initialTagger.goto();
      await initialTagger.addTag({ text: testString });
      await initialTagger.addTag({ text: testString + 'b' });
      await initialTagger.addTag({ text: testString + 'c' });

      await expect(page.getByText(testString).first()).toBeVisible();

      const newPage = await context.newPage();
      await newPage.goto('https://google.com');
      const tagger = new TaggerDevPage({
        page: newPage,
        extensionId,
        storage: 'browser.storage.local',
      });

      const highlights = await tagger.getHighlightRegistryTextContents();
      expect(highlights).toContain(testString);

      await tagger.goto();

      await newPage.getByRole('button', { name: 'delete' }).first().click();
      await expect(newPage.getByText('item2')).toBeHidden();

      await newPage.goto('https://google.com');
      const searchResults = await newPage.evaluate(() => {
        const searchResults = CSS.highlights.get('search-results');
        return searchResults;
      });

      expect(searchResults).toBeUndefined();
    }
  );

  test('Added tags add a specific style tag', async ({ page, tagger }) => {
    await tagger.goto();

    await tagger.addTag({ text: 'testing' });
    await expect(page.locator(styleTagId)).toHaveCount(1);
    const tagName = await page.locator(styleTagId).evaluate((item) => {
      return item.tagName;
    });
    expect(tagName).toBe('STYLE');
  });

  test('Can add tags with color', async ({ page, tagger }) => {
    await tagger.goto();
    const tag = { text: 'test', color: 'hsl(135.19 33.143% 41.424%)' };
    await tagger.addTag(tag);

    const highlights = await tagger.getHighlightRegistryTextContents();
    await expect(page.locator(styleTagId)).toHaveCount(1);

    expect(highlights).toContain('test');
    await expect(page.getByText('test')).toHaveCount(1);
    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${tag.color};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );
  });

  test('Can edit tags', async ({ page, tagger }) => {
    const oldColor = 'blue';
    const newColor = 'red';
    await tagger.goto();

    await tagger.addTag({ text: 'item1', color: oldColor });

    await expect(page.getByText('item1')).toBeVisible();
    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${oldColor};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );

    await page.getByRole('button', { name: 'edit' }).first().click();
    await expect(page.getByLabel('Color:').nth(1)).toBeVisible();
    await page.getByLabel('Color:').nth(1).click();
    await page.getByLabel('Color:').nth(1).fill(newColor);
    await page.getByLabel('Color:').nth(1).press('Enter');
    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${newColor};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );
  });

  test('Editing tags requires color', async ({ page, tagger }) => {
    const oldColor = 'blue';
    await tagger.goto();

    await tagger.addTag({ text: 'item1', color: oldColor });

    await expect(page.getByText('item1')).toBeVisible();
    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${oldColor};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );

    const colorLocator = page.getByText('Color: ').nth(1);
    await page.getByRole('button', { name: 'edit' }).first().click();
    await expect(colorLocator).toBeVisible();
    await colorLocator.click();
    await colorLocator.fill('');
    await colorLocator.press('Enter');
    await expect(page.getByText('The color field is required.')).toBeVisible();
  });

  /**
 * TESTS TODO:
 * 1. Can input a color when creating a tag
 * 2. Can input a color when editing a tag
//  * 3. There is only one css style tag added
 * 4. There is a validation that predefined styles are mapped to the style tag
 * 5. When appropriate, the style tag will have multiple highlight selectors
 * 6. (maybe)
 * 7. What happens if a highlight is cread but the relevant dom is updated?
 * a. Text inserted inside?
 * b. Dom node removed somehow
 * c. Dom node added
 * d. Dom node + text added? 
 * 7 might be more of a stretch goal thing depending on how far I want to go with this. 
 */
});
