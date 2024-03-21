import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

// export const fixtures = (extensionName) => {
const extensionName = 'tagger';
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(
      path.resolve(),
      '../../dist/browser-extensions/',
      extensionName
    );
    // Pasing in an empty string as the first arg allows parallel testing
    // With a named dir, it will break.
    // This needs some figuring out because some things might be useful in one context, but not in another.
    const context = await chromium.launchPersistentContext(
      process.env.USER_DATA_DIR || '',
      {
        devtools: true,
        viewport: { height: 1000, width: 1000 },
        headless: false,
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`,
        ],
      }
    );
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    /**
     * This all only works if the extension uses a service worker.
     */
    // for manifest v2:
    // let [background] = context.backgroundPages();
    // if (!background) {
    //   // background = await context.waitForEvent('backgroundpage');
    // }

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];

    // const extensionId = 'testing';
    await use(extensionId);
  },
});
// };
