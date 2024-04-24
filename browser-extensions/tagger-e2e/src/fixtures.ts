import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { TaggerDevPage } from './tagger-dev-page';

const extensionContext = async ({}, use, workerInfo) => {
  const storage = workerInfo.project.use.storage;
  const extensionName = 'tagger';
  const pathToExtension = path.join(
    path.resolve(),
    '../../dist/browser-extensions/',
    extensionName
  );
  // Pasing in an empty string as the first arg allows parallel testing
  // With a named dir, it will break.
  // This needs some figuring out because some things might be useful in one context, but not in another.
  const config = {
    devtools: true,
    viewport: { height: 1000, width: 1000 },
    headless: false,
  };
  if (storage === 'browser.storage.local') {
    config['args'] = [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ];
  }
  const context = await chromium.launchPersistentContext(
    process.env.USER_DATA_DIR || '',
    config
  );
  await use(context);
  await context.close();
};

const extensionId = async ({ context }, use, workerInfo) => {
  const storage = workerInfo.project.use.storage;
  if (storage === 'browser.storage.local') {
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
    await use(extensionId);
  } else {
    await use(null);
  }
};

export type StorageLocation = 'browser.storage.local' | 'indexeddb';

const storage: StorageLocation = 'browser.storage.local';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  storage: StorageLocation;
  tagger: TaggerDevPage;
}>({
  context: extensionContext,
  extensionId,
  storage: [storage, { option: true }],
  tagger: async ({ page, extensionId, storage }, use) => {
    const tagger = new TaggerDevPage({ page, extensionId, storage });
    await use(tagger);
  },
});
