import { test as teardown } from './fixtures';
import { TaggerDevPage } from './tagger-dev-page';

if (process.env.STORAGE_TYPE === 'browser.storage.local') {
  teardown('clear browser.storage.local', async ({ page, extensionId }) => {
    console.log('clearing browser.storage.local...');
    const tagger = new TaggerDevPage(page, extensionId);
    await tagger.goto();

    await page.evaluate(() => {
      try {
        return window.tag.clear();
      } catch (e) {
        return e;
      }
    });
  });
}
