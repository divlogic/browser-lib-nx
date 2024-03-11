import { test, expect } from '@playwright/test';
import { Model } from '../src';

declare const window: {
  testModel: Model<{ text: string }>;
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
