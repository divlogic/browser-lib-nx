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
