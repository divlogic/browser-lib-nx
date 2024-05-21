import { chromium } from 'playwright';
import { generate_config, generate_context } from './fixtures';

async function open_in_chromium() {
  const config = generate_config();
  const context = await generate_context(chromium, config);
  return context;
}

open_in_chromium();
