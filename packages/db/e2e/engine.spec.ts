import { test, expect } from '@playwright/test';
import { Engine } from '../src';

declare const window: {
  Engine: Engine<unknown>;
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

  const db = await page.evaluate(async () => {
    const engine = window.Engine;
    const db = await engine.getDB('test');
    return db.name;
  });
  expect(db).toBe('test');
});
