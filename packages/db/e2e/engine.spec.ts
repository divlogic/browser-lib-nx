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
