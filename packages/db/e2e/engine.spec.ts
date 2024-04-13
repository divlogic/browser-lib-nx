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
        await engine.createStore(data.dbName, data.storeName);
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

test('add successfully adds new item', async ({ page }) => {
  await page.goto('/');

  const dbName = 'testdb';
  const storeName = 'teststore';
  const data = {
    dbName,
    storeName,
  };
  await page.evaluate(async (data) => {
    const engine = window.Engine;
    const db = await window.Engine.getDB(data.dbName);
    if (db.objectStoreNames.length > 0) {
      return false;
    } else {
      await engine.createStore(data.dbName, data.storeName);

      await window.Engine.add(data.dbName, data.storeName, {
        id: 1,
        name: 'test',
      });
      return;
    }
  }, data);

  const items = await page.evaluate(async (data) => {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open(data.dbName);
      dbRequest.onsuccess = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        const itemsTransaction = db
          .transaction(data.storeName)
          .objectStore(data.storeName)
          .getAll();
        itemsTransaction.onsuccess = (e) => {
          const items = (e.target as IDBRequest).result;
          resolve(items);
        };
      };
    });
  }, data);
  expect(items).toMatchObject([{ id: 1, name: 'test' }]);
});

test('Engine.deleteStore() successfully deletes a store', async ({ page }) => {
  test.slow();
  await page.goto('/');

  const storeName = 'testStore';
  const dbName = 'testDB';
  const data = {
    storeName,
    dbName,
  };
  const isStoreInstance = await page.evaluate(async (data) => {
    const store = await window.Engine.createStore(data.dbName, data.storeName);
    return store instanceof IDBObjectStore;
  }, data);
  expect(isStoreInstance).toBe(true);

  const storeNames = await page.evaluate(async (data) => {
    const db = await window.Engine.getDB(data.dbName);
    return Array.from(db.objectStoreNames);
  }, data);

  expect(storeNames).toMatchObject([storeName]);

  const updatedStoreNames = await page.evaluate(async (data) => {
    const deleteStoreResults = await window.Engine.deleteStore(
      data.dbName,
      data.storeName
    );
    const db = await window.Engine.getDB(data.dbName);
    return Array.from(db.objectStoreNames);
  }, data);
  expect(updatedStoreNames).toMatchObject([]);
  expect([]).toMatchObject([]);
});
