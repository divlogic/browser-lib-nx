import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('This is a test', () => {
  test.beforeEach(async ({ page, tagger }) => {
    tagger.gotoStyleTab();
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

  test('added styles persist after reload', async ({ page, tagger }) => {
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

    await page.reload();
    await tagger.gotoStyleTab();

    await expect(page.getByText('test Name').first()).toBeVisible();
  });

  test('styles are an option for tags', async ({ page, tagger }) => {
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
    await expect(page.getByText('test Name').first()).toBeAttached();
    await page.reload();
    await tagger.gotoStyleTab();
    await expect(page.getByText('test Name').first()).toBeAttached();

    await tagger.gotoTagsTab();

    const styleOptions = page.getByLabel('Pick a style:');
    await expect(styleOptions).toBeVisible();
    styleOptions.selectOption('test Name');
    await expect(styleOptions).toHaveValue('test Name');
  });
});
