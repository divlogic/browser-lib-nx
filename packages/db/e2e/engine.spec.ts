import { test, expect } from '@playwright/test';
import { Engine } from '../src/lib/engine';

declare const window: {
  Engine: typeof Engine;
};

test('testEngine is defined', async ({ page }) => {
  await page.goto('/');

  const engine = await page.evaluate(() => {
    return typeof window.Engine;
  });
  expect(engine).toBe('function');
});

test('getDB successfully fetches DB', async ({ page }) => {
  await page.goto('/');

  const dbIsInstance = await page.evaluate(async () => {
    const db = await window.Engine.getDB('test');
    return db instanceof IDBDatabase;
  });
  expect(dbIsInstance).toBe(true);
});

test('createStore successfully creates Store', async ({ page }) => {
  await page.goto('/');

  const isStoreInstance = await page.evaluate(async () => {
    const engine = window.Engine;
    const db = await window.Engine.getDB('test');
    if (db.objectStoreNames.length > 0) {
      return false;
    } else {
      const store = await engine.createStore('test', 'testStore');
      return store instanceof IDBObjectStore;
    }
  });
  expect(isStoreInstance).toBe(true);
});

test('getStore successfully gets Store', async ({ page }) => {
  await page.goto('/');

  const dbName = 'testdb';
  const storeName = 'teststore';
  const isStoreInstance = await page.evaluate(
    async (data) => {
      const engine = window.Engine;
      const db = await window.Engine.getDB(data.dbName);
      if (db.objectStoreNames.length > 0) {
        return false;
      } else {
        const createdStore = await engine.createStore(
          data.dbName,
          data.storeName
        );
        const fetchedStore = await engine.getStore(data.dbName, data.storeName);
        return fetchedStore instanceof IDBObjectStore;
      }
    },
    {
      dbName,
      storeName,
    }
  );
  expect(isStoreInstance).toBe(true);
});
