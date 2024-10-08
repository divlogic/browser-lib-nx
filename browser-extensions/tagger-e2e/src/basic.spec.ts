import { Style, Tag } from '@browser-lib-nx/tagger';
import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('This is a test', () => {
  test('App loads successfully', async ({ page, tagger }) => {
    await tagger.goto();
    await expect(page).toHaveTitle('Tagger');
  });

  test('Can add tags', async ({ tagger, page }) => {
    // Failing because there currently isn't a proper trigger to highlight again
    await tagger.goto();
    await tagger.addTag({ text: 'test' });

    const highlights = await tagger.getHighlightRegistryTextContents('default');

    expect(highlights).toContain('test');
  });

  test('tag form requires a style be selected to submit the form', async ({
    tagger,
    page,
  }) => {
    await tagger.gotoStyleTab();
    await page.getByLabel('delete').click();

    // This test specifically applies the click instead of the helper method
    // because the helper method reloads the app which involves adding in the default style.
    await page
      .getByRole('tab', {
        name: 'tags',
      })
      .click();

    await page.getByLabel('Add tag:').click();
    await page.getByLabel('Add tag:').fill('testTag');
    const button = page.getByRole('button', { name: 'Add' });
    await expect(button).toBeDisabled({ timeout: 2000 });
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
      await initialTagger.addStyle();
      await initialTagger.addTag({ text: testString });

      await expect(page.getByText(testString).first()).toBeVisible();

      const newPage = await context.newPage();
      await newPage.goto('https://google.com');
      const tagger = new TaggerDevPage({
        page: newPage,
        extensionId: extensionId,
        storage: 'browser.storage.local',
      });

      const highlights = await tagger.getHighlightRegistryTextContents(
        'default'
      );
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

      const highlights = await tagger.getHighlightRegistryTextContents(
        'default'
      );
      expect(highlights).toContain(testString);

      await tagger.goto();

      await newPage.getByRole('button', { name: 'delete' }).first().click();
      await expect(newPage.getByText('item2')).toBeHidden();

      await newPage.goto('https://google.com');
      const searchResults = await newPage.evaluate(() => {
        const searchResults = CSS.highlights.get('default');
        return searchResults;
      });

      expect(searchResults).toBeUndefined();
    }
  );

  test('Added tags add a specific style tag', async ({ page, tagger }) => {
    await tagger.goto();
    await tagger.addStyle();
    await tagger.addTag({ text: 'testing' });

    await expect(page.locator(styleTagId)).toHaveCount(1);
    const tagName = await page.locator(styleTagId).evaluate((item) => {
      return item.tagName;
    });
    expect(tagName).toBe('STYLE');
  });

  test('Can edit tags', async ({ page, tagger }) => {
    const oldColor = 'blue';
    const newColor = 'red';
    await tagger.goto();
    await tagger.addStyle({
      backgroundColor: oldColor,
      name: 'oldStyle',
      color: 'black',
    });
    await tagger.addStyle({
      backgroundColor: newColor,
      name: 'newStyle',
      color: 'black',
    });

    await tagger.addTag({ text: 'item1', style: 'oldStyle' });

    await expect(page.getByText('item1')).toBeVisible();
    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${oldColor};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );

    await page.getByRole('button', { name: 'edit' }).first().click();
    await expect(page.getByLabel('').nth(1)).toBeVisible();
    await page.getByLabel('Pick a style:').nth(1).selectOption('newStyle');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator(styleTagId)).toContainText(
      `background-color: ${newColor};`,
      {
        ignoreCase: true,
        useInnerText: true,
      }
    );
  });

  /**
   * TODO: Add a check where deleting a style is prevented if any tags use it.
   */

  test('tags and styles use separate stores', async ({ tagger, page }) => {
    await tagger.goto();

    await tagger.addStyle({
      name: 'testStyle',
      backgroundColor: 'orange',
      color: 'white',
      textDecorationStyle: 'wavy',
      textDecorationLine: ['underline', 'overline'],
      textDecorationColor: 'green',
      textDecorationThickness: '1em',
    });

    await tagger.addTag({ text: 'testTag', style: 'testStyle' });

    const tags = await page.evaluate(async () => {
      if ('tagModel' in window) {
        return await (window.tagModel as Tag).get();
      } else {
        throw new Error('tag not in window');
      }
    });

    expect(tags.length).toBe(1);
    expect(tags[0]).toMatchObject({ text: 'testTag', style_name: 'testStyle' });

    const styles = await page.evaluate(async () => {
      if ('styleModel' in window) {
        return await (window.styleModel as Style).get();
      } else {
        throw new Error('styleModel not in window');
      }
    });

    // There currently will always be a default style.
    expect(styles.length).toBe(2);
    expect(styles[1]).toMatchObject({
      name: 'testStyle',
      backgroundColor: 'orange',
      color: 'white',
      textDecorationStyle: 'wavy',
      textDecorationLine: ['underline', 'overline'],
      textDecorationColor: 'green',
      textDecorationThickness: '1em',
    });
  });

  /**
   * TESTS TODO:
   * 7. What happens if a highlight is cread but the relevant dom is updated?
   * a. Text inserted inside?
   * b. Dom node removed somehow
   * c. Dom node added
   * d. Dom node + text added?
   * 7 might be more of a stretch goal thing depending on how far I want to go with this.
   */
});
