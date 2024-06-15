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
    const addTagForm = page.getByRole('textbox', { name: 'Add tag:' });
    await expect(addTagForm).toBeVisible();
  });
});
