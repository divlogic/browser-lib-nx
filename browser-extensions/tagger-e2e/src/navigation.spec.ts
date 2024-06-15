import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('There should be some basic navigation tools', () => {
  test('There should be tabbed navigation', async ({ page, tagger }) => {
    await tagger.goto();
    const tagsTab = await page.getByRole('tab', {
      name: 'tags',
      selected: true,
    });
    await expect(tagsTab).toBeVisible();
    await expect(page).toHaveTitle('Tagger');
    const addTagInput = page.getByRole('textbox', { name: 'Add tag:' });
    await expect(addTagInput).toBeVisible();
  });

  test('Clicking the styles tab should present you with the styles form', async ({
    page,
    tagger,
  }) => {
    await tagger.goto();
    let tagsTab = await page.getByRole('tab', {
      name: 'styles',
      selected: false,
    });
    await expect(tagsTab).toBeVisible();
    await tagsTab.click();
    tagsTab = await page.getByRole('tab', {
      name: 'styles',
      selected: true,
    });
    await expect(tagsTab).toBeVisible();
    const heading = page.getByRole('heading', { name: 'styles' });
    await expect(heading).toBeVisible();
    const textColorInput = page.getByRole('textbox', { name: 'Text Color' });
    await expect(textColorInput).toBeVisible();
  });
});
