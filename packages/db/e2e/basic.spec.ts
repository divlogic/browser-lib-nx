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

test('testModel.getDB() returns indexedDB', async ({ page }) => {
  await page.goto('/');

  const isDBInstance = await page.evaluate(async () => {
    const db = await window.testModel.getDB();
    return db instanceof IDBDatabase;
  });
  expect(isDBInstance).toBe(true);
});

test('testModel.createStore() successfully creates a store', async ({
  page,
}) => {
  await page.goto('/');

  const isStoreInstance = await page.evaluate(async () => {
    const store = await window.testModel.createStore();
    return store instanceof IDBObjectStore;
  });
  expect(isStoreInstance).toBe(true);
});

test('testModel.createStore() store ', async ({ page }) => {
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
    return store.name === 'playwright_test';
  });
  expect(storeIsPlaywrightTest).toBe(true);
});
