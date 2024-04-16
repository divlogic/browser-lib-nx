import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/app';
import { Tag } from './tagger';
import { TagModel } from './app/models/tag';

async function initializeDB() {
  let RepositoryClass;
  let config;
  if (import.meta.env.DEV) {
    RepositoryClass = (await import('./db/indexed-db-repository')).default;
    config = { dbName: 'tagger', storeName: 'tags' };
  } else {
    const browser = (await import('webextension-polyfill')).default;
    window.browser = browser;
    RepositoryClass = (await import('./db/browser-storage-repository')).default;
    config = {};
  }
  const repository = new RepositoryClass(config);
  await repository.initialize();
  const tagModel = new TagModel(repository);
  window.tag = tagModel;
}

async function initializeReact() {
  const el = document.getElementById('tagger-ext-root') as HTMLElement;

  if (el) {
    const root = ReactDOM.createRoot(el);

    root.render(
      <StrictMode>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </StrictMode>
    );
  }
}
async function initializeContentScript() {
  console.log('Initializing content script');
  const tags = await new TagModel().get();
  try {
    Tag(tags);
  } catch (e) {
    console.error(e);
  }
}

async function initialization() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    await initializeDB();
    await initializeReact();
    await initializeContentScript();
  }
}

initialization();
