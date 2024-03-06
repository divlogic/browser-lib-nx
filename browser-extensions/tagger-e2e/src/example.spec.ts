import { fixtures } from './fixtures';
const test = fixtures('tagger');
// const expect = test.expect;

test('Example test', async ({ browser, page }) => {
  await page.goto('https://developer.chrome.com/docs/extensions/mv3/');
  await page.pause();
});
