import { Page } from '@playwright/test';

export class TaggerDevPage {
  readonly page: Page;
  readonly extensionId?: string | null;
  readonly storage: 'indexeddb' | 'browser.storage.local';
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
    console.log('Navigating to styles tab');
    await this.goto();
    let tagsTab = await this.page.getByRole('tab', {
      name: 'styles',
      selected: false,
    });
    await tagsTab.click();
    tagsTab = this.page.getByRole('tab', {
      name: 'styles',
      selected: true,
    });
    const heading = this.page.getByRole('heading', {
      name: 'styles',
      exact: true,
    });
    const textColorInput = this.page.getByRole('textbox', {
      name: 'Text Color',
    });
  }

  async addTag(tag: { text: string; color?: string }) {
    await this.page.getByLabel('Add tag:').click();
    await this.page.getByLabel('Add tag:').fill(tag.text);

    if (typeof tag.color === 'string') {
      await this.page.getByLabel('Pick a color:').click();
      await this.page.getByLabel('Pick a color').fill(tag.color);
    }
    await this.page.getByLabel('Add tag:').press('Enter');
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
