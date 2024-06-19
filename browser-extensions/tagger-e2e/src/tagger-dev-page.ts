import { Page } from '@playwright/test';
import { HighlightStyle } from '@browser-lib-nx/tagger';

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

  async addTag(tag: { text: string; color?: string }) {
    await this.gotoTagsTab();
    await this.page.getByLabel('Add tag:').click();
    await this.page.getByLabel('Add tag:').fill(tag.text);

    if (typeof tag.color === 'string') {
      await this.page.getByLabel('Pick a color:').click();
      await this.page.getByLabel('Pick a color').fill(tag.color);
    }
    await this.page.getByLabel('Add tag:').press('Enter');
  }

  async addStyle(props: HighlightStyle) {
    await this.gotoStyleTab();

    await this.page.getByLabel('Name of the style:').click();
    await this.page.getByLabel('Name of the style:').fill(props.name);

    if (typeof props.color === 'string') {
      await this.page.getByLabel('Text Color').click();
      await this.page.getByLabel('Text Color').fill(props.color);
    }
    if (typeof props.backgroundColor === 'string') {
      await this.page.getByLabel('Highlight Color').click();
      await this.page.getByLabel('Highlight Color').fill(props.backgroundColor);
    }

    if ('textDecorationLine' in props) {
      for (const item of props.textDecorationLine) {
        await this.page
          .getByLabel(item, { exact: false })
          .check({ timeout: 3000, force: true });
      }
    }

    if ('textDecorationStyle' in props) {
      await this.page
        .getByLabel(props.textDecorationStyle, { exact: false })
        .click({ timeout: 3000, force: true });
    }

    if ('textDecorationThickness' in props) {
      await this.page.getByLabel('Text Decoration Thickness').click();
      await this.page
        .getByLabel('Text Decoration Thickness')
        .fill(props.textDecorationThickness);
    }
    if ('textDecorationColor' in props) {
      await this.page.getByLabel('Text Decoration Color').click();
      await this.page
        .getByLabel('Text Decoration Color')
        .fill(props.textDecorationColor);
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
