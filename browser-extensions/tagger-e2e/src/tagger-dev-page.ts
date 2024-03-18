import { Page } from '@playwright/test';

export class TaggerDevPage {
  readonly page: Page;
  readonly extensionId: string;
  constructor(page: Page, extensionId: string) {
    this.page = page;
    this.extensionId = extensionId;
  }

  async goto() {
    await this.page.goto(`chrome-extension://${this.extensionId}/index.html`);
  }

  async addTag(tag: { text: string }) {
    await this.page.getByLabel('Add tag:').click();
    await this.page.getByLabel('Add tag:').fill(tag.text);
    await this.page.getByLabel('Add tag:').press('Enter');
  }

  async getHighlightRegistryTextContents() {
    return this.page.evaluate(() => {
      const highlights = [...CSS.highlights.get('search-results').entries()];
      const ranges = highlights.flat();
      console.log('ranges is: ', ranges);
      return ranges.map(
        (range: Range) => range.commonAncestorContainer.textContent
      );
    });
  }
}
