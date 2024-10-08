import { test, expect } from '@playwright/test';
import { Model as Base } from '../src';

declare const window: {
  testModel: Base<{ text: string }>;
  Model: Base;
  pwModel: Base<{ text: string }>;
};

test('testModel is defined', async ({ page }) => {
  await page.goto('/');

  const testModel = await page.evaluate(() => {
    return window.testModel;
  });
  expect(testModel).toBeDefined();
});

test('Model.getDB() returns indexedDB', async ({ page }) => {
  await page.goto('/');

  const isDBInstance = await page.evaluate(async () => {
    const db = await window.testModel.getDB();
    return db instanceof IDBDatabase;
  });
  expect(isDBInstance).toBe(true);
});

test('Model.createStore() successfully creates a store', async ({ page }) => {
  await page.goto('/');

  const isStoreInstance = await page.evaluate(async () => {
    const store = await window.testModel.createStore();
    return store instanceof IDBObjectStore;
  });
  expect(isStoreInstance).toBe(true);
});

test('Model.createStore() successfully creates a store based on config', async ({
  page,
}) => {
  await page.goto('/');

  const storeIsConfigured = await page.evaluate(async () => {
    const store = await window.testModel.createStore({
      autoIncrement: true,
      keyPath: 'id',
    });

    return (
      store instanceof IDBObjectStore &&
      store.autoIncrement === true &&
      store.keyPath === 'id'
    );
  });
  expect(storeIsConfigured).toBe(true);
  const items = await page.evaluate(async () => {
    await window.testModel.add({ text: 'test' });
    const items = await window.testModel.getAll();
    return items;
  });
  expect(items).toMatchObject([{ id: 1, text: 'test' }]);
});

test('Model.createStore() throws if store exists', async ({ page }) => {
  await page.goto('/');

  const noStoresExist = await page.evaluate(async () => {
    class PlaywrightTestModel extends Model<{ text: string }> {
      store = 'playwright_test';
    }
    const pwModel = new PlaywrightTestModel();
    window.pwModel = pwModel;
    const db = await pwModel.getDB();
    return db.objectStoreNames.length === 0;
  });
  expect(noStoresExist).toBe(true);

  const storeIsPlaywrightTest = await page.evaluate(async () => {
    const store = await window.pwModel.createStore();
    return store?.name === 'playwright_test';
  });
  const modelThrowsIfStoreExists = await page.evaluate(async () => {
    let errored = false;
    try {
      const store2 = await window.pwModel.createStore();
    } catch (e) {
      errored = true;
    }
    return errored;
  });
  expect(storeIsPlaywrightTest).toBe(true);
});

test('Model.add(item) adds items to store', async ({ page }) => {
  await page.goto('/');

  const noStoresExist = await page.evaluate(async () => {
    class PlaywrightTestModel extends Model<{ text: string }> {
      store = 'playwright_test';
    }
    const pwModel = new PlaywrightTestModel();
    window.pwModel = pwModel;
    const db = await pwModel.getDB();
    return db.objectStoreNames.length === 0;
  });
  expect(noStoresExist).toBe(true);

  const storeIsPlaywrightTest = await page.evaluate(async () => {
    const store = await window.pwModel.createStore();
    return store?.name === 'playwright_test';
  });

  const addItem = await page.evaluate(async () => {
    const item = { text: 'playwright test' };
    const result = await window.pwModel.add(item);
    return result;
  });
  const items = await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open(window.pwModel.store);
      dbRequest.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const itemsTransaction = db
          .transaction(window.pwModel.store)
          .objectStore(window.pwModel.store)
          .getAll();
        itemsTransaction.onsuccess = (e) => {
          const items = (e.target as IDBRequest).result;
          resolve(items);
        };
      };
    });
  });
  expect(items).toMatchObject([{ text: 'playwright test' }]);
});

test('Model.getAll() fetches all items', async ({ page }) => {
  await page.goto('/');

  const noStoresExist = await page.evaluate(async () => {
    class PlaywrightTestModel extends Model<{ text: string }> {
      store = 'playwright_test';
    }
    const pwModel = new PlaywrightTestModel();
    window.pwModel = pwModel;
    const db = await pwModel.getDB();
    return db.objectStoreNames.length === 0;
  });
  expect(noStoresExist).toBe(true);

  const storeIsPlaywrightTest = await page.evaluate(async () => {
    const store = await window.pwModel.createStore();
    return store?.name === 'playwright_test';
  });

  const addItems = await page.evaluate(async () => {
    const item1 = { text: 'playwright test' };
    const item2 = { text: 'playwright test 2' };
    const result = await window.pwModel.add(item1);
    const result2 = await window.pwModel.add(item2);
    return;
  });

  const items = await page.evaluate(async () => {
    return await window.pwModel.getAll();
  });
  expect(items).toMatchObject([
    { text: 'playwright test' },
    { text: 'playwright test 2' },
  ]);
});

test('Model.delete(id) deletes items', async ({ page }) => {
  await page.goto('/');

  const noStoresExist = await page.evaluate(async () => {
    class PlaywrightTestModel extends Model<{ text: string }> {
      store = 'playwright_test';
    }
    const pwModel = new PlaywrightTestModel();
    window.pwModel = pwModel;
    const db = await pwModel.getDB();
    return db.objectStoreNames.length === 0;
  });
  expect(noStoresExist).toBe(true);

  const storeIsPlaywrightTest = await page.evaluate(async () => {
    const store = await window.pwModel.createStore();
    return store?.name === 'playwright_test';
  });

  const addItems = await page.evaluate(async () => {
    const item1 = { text: 'playwright test' };
    const item2 = { text: 'playwright test 2' };
    const result = await window.pwModel.add(item1);
    const result2 = await window.pwModel.add(item2);
    const deleted = await window.pwModel.delete(1);
    return deleted;
  });

  const items = await page.evaluate(async () => {
    const results = await window.pwModel.getAll();
    return results;
  });
  expect(items).toMatchObject([{ text: 'playwright test 2' }]);
});

test('Model.put(id) deletes items', async ({ page }) => {
  await page.goto('/');

  const noStoresExist = await page.evaluate(async () => {
    class PlaywrightTestModel extends Model<{ text: string }> {
      store = 'playwright_test';
    }
    const pwModel = new PlaywrightTestModel();
    window.pwModel = pwModel;
    const db = await pwModel.getDB();
    return db.objectStoreNames.length === 0;
  });
  expect(noStoresExist).toBe(true);

  const storeIsPlaywrightTest = await page.evaluate(async () => {
    const store = await window.pwModel.createStore();
    return store?.name === 'playwright_test';
  });

  const updatedItemKey = await page.evaluate(async () => {
    const item1 = { text: 'playwright test' };
    const item2 = { text: 'playwright test 2' };
    const item3 = { text: 'playwright test 3' };
    const result = await window.pwModel.add(item1);
    const result2 = await window.pwModel.add(item2);
    const result3 = await window.pwModel.add(item3);
    const updated = await window.pwModel.put({ id: 2, text: 'updated text' });
    return updated;
  });

  expect(updatedItemKey).toBe(2);

  const items = await page.evaluate(async () => {
    const results = await window.pwModel.getAll();
    return results;
  });
  expect(items).toMatchObject([
    { text: 'playwright test' },
    { text: 'updated text' },
    { text: 'playwright test 3' },
  ]);
});

test('Model.deleteStore() successfully deletes a store', async ({ page }) => {
  await page.goto('/');

  const isStoreInstance = await page.evaluate(async () => {
    const store = await window.testModel.createStore();
    return store instanceof IDBObjectStore;
  });
  expect(isStoreInstance).toBe(true);

  const storeNames = await page.evaluate(async () => {
    const db = await window.testModel.getDB();
    return Array.from(db.objectStoreNames);
  });

  expect(storeNames).toMatchObject(['test_model']);

  const updatedStoreNames = await page.evaluate(async () => {
    const deleteStoreResults = await window.testModel.deleteStore();
    console.log('delete store results: ', deleteStoreResults);
    const db = await window.testModel.getDB();
    console.log('db: ', db);
    return Array.from(db.objectStoreNames);
  });
  expect(updatedStoreNames).toMatchObject([]);
});
