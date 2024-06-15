import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('This is a test', () => {
  test.beforeEach(async ({ page, tagger }) => {
    console.log('Navigating to styles tab');
    await tagger.goto();
    let tagsTab = await page.getByRole('tab', {
      name: 'styles',
      selected: false,
    });
    await expect(tagsTab).toBeVisible();
    await tagsTab.click();
    tagsTab = page.getByRole('tab', {
      name: 'styles',
      selected: true,
    });
    await expect(tagsTab).toBeVisible();
    const heading = page.getByRole('heading', { name: 'styles' });
    await expect(heading).toBeVisible();
    const textColorInput = page.getByRole('textbox', { name: 'Text Color' });
    await expect(textColorInput).toBeVisible();
  });

  test('added styles persist', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test Name');

    const textColorInput = page.getByRole('textbox', {
      name: 'Text Color',
    });
    textColorInput.fill('white');

    const highlightColorInput = page.getByRole('textbox', {
      name: 'Highlight Color',
    });
    highlightColorInput.fill('orange');

    const saveButton = page.getByRole('button', { name: 'Save' });

    await saveButton.click();

    await expect(page.getByText('test Name').first()).toBeVisible();
  });
});
