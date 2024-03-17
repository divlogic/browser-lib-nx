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
}
