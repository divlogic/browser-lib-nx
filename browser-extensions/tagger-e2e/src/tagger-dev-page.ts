import { Page } from '@playwright/test';
import { HighlightStyle } from '@browser-lib-nx/tagger';

export class TaggerDevPage {
  readonly page: Page;
  readonly extensionId?: string | null;
  readonly storage: 'indexeddb' | 'browser.storage.local';
  readonly defaults = {
    style: {
      name: 'defaultTestStyle',
      color: 'white',
      backgroundColor: '#a32929',
    },
  };
  constructor(config: {
    page: Page;
    extensionId?: string;
    storage: 'indexeddb' | 'browser.storage.local';
  }) {
    this.page = config.page;
    this.extensionId = config.extensionId;
    this.storage = config.storage;
  }

  async goto() {
    if (this.storage === 'indexeddb') {
      await this.page.goto('/');
    } else {
      await this.page.goto(`chrome-extension://${this.extensionId}/index.html`);
    }
  }

  async gotoStyleTab() {
    await this.goto();
    const stylesTab = this.page.getByRole('tab', {
      name: 'Styles',
    });
    await stylesTab.click();
  }

  async gotoTagsTab() {
    console.log('Navigating to tags tab');
    await this.goto();
    let tagsTab = await this.page.getByRole('tab', {
      name: 'tags',
    });
    await tagsTab.click();
    tagsTab = this.page.getByRole('tab', {
      name: 'tags',
    });
    const heading = this.page.getByRole('heading', {
      name: 'tags',
      exact: true,
    });
    const textColorInput = this.page.getByRole('textbox', {
      name: 'Add tag:',
    });
  }

  async addTag({ text = 'defaultTestTag', style = 'defaultTestStyle' }) {
    await this.gotoTagsTab();
    await this.page.getByLabel('Add tag:').click();
    await this.page.getByLabel('Add tag:').fill(text);

    const styleOptions = this.page.getByLabel('Pick a style:');
    styleOptions.selectOption(style);
    await this.page.getByLabel('Add tag:').press('Enter');
  }

  async addStyle(style: HighlightStyle = this.defaults.style) {
    await this.gotoStyleTab();

    await this.page.getByLabel('Name of the style:').click();
    await this.page.getByLabel('Name of the style:').fill(style.name);

    await this.page.getByLabel('Text Color').click();
    await this.page.getByLabel('Text Color').fill(style.color);

    await this.page.getByLabel('Highlight Color').click();
    await this.page.getByLabel('Highlight Color').fill(style.backgroundColor);

    if ('textDecorationLine' in style) {
      for (const item of style.textDecorationLine) {
        await this.page
          .getByLabel(item, { exact: false })
          .check({ timeout: 3000, force: true });
      }
    }

    if ('textDecorationStyle' in style) {
      await this.page
        .getByLabel(style.textDecorationStyle, { exact: false })
        .click({ timeout: 3000, force: true });
    }

    if ('textDecorationThickness' in style) {
      await this.page.getByLabel('Text Decoration Thickness').click();
      await this.page
        .getByLabel('Text Decoration Thickness')
        .fill(style.textDecorationThickness);
    }
    if ('textDecorationColor' in style) {
      await this.page.getByLabel('Text Decoration Color').click();
      await this.page
        .getByLabel('Text Decoration Color')
        .fill(style.textDecorationColor);
    }

    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async getHighlightRegistryTextContents() {
    return this.page.evaluate(() => {
      const highlights = [...CSS.highlights.get('search-results').entries()];
      const ranges = highlights.flat();
      return ranges.map(
        (range: Range) => range.commonAncestorContainer.textContent
      );
    });
  }
}
