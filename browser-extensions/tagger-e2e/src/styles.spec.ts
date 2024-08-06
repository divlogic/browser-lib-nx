import { test } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

const expect = test.expect;

const styleTagId = '#styled-by-tagger';

// This might change from time to time in the early stages.
test.describe('This is a test', () => {
  test.beforeEach(async ({ page, tagger }) => {
    await tagger.gotoStyleTab();
  });

  test('There is a default style on the first load', async ({
    page,
    tagger,
  }) => {
    await tagger.gotoTagsTab();
    await expect(page.getByText('default').first()).toBeAttached({
      timeout: 2000,
    });
  });

  test('added styles persist', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test_name');
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

    await expect(page.getByText('test_name').first()).toBeAttached();
  });

  test('can delete styles', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test_name');
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
    await expect(page.getByText('test_name').first()).toBeAttached();

    await page
      .locator('li')
      .filter({ hasText: 'test_name' })
      .getByLabel('delete')
      .click();

    await expect(page.getByText('test_name').first()).not.toBeAttached();
  });

  test('added styles persist after reload', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test_name');

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

    await expect(page.getByText('test_name').first()).toBeAttached();

    await page.reload();
    await tagger.gotoStyleTab();

    await expect(page.getByText('test_name').first()).toBeAttached();
  });

  test('deletion of styles persists', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test_name');
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
    await expect(page.getByText('test_name').first()).toBeAttached();

    await page
      .locator('li')
      .filter({ hasText: 'test_name' })
      .getByLabel('delete')
      .click();

    await page.reload();
    await tagger.gotoStyleTab();

    await expect(page.getByText('test_name').first()).not.toBeAttached();
  });

  test('styles are an option for tags', async ({ page, tagger }) => {
    const nameInput = page.getByRole('textbox', {
      name: 'Name of the style',
    });
    await nameInput.fill('test_name');
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
    await expect(page.getByText('test_name').first()).toBeAttached();
    await page.reload();
    await tagger.gotoStyleTab();
    await expect(page.getByText('test_name').first()).toBeAttached();

    await tagger.gotoTagsTab();

    const styleOptions = page.getByLabel('Pick a style:');
    await expect(styleOptions).toBeAttached();
    styleOptions.selectOption('test_name');
    await expect(styleOptions).toHaveValue('test_name');
  });
});
