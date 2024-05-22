import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { Tag } from './tagger';
import { TagModel } from './app/models/tag';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react';

async function initializeDB() {
  let RepositoryClass;
  let config;
  let repository;
  if (import.meta.env.MODE === 'development') {
    RepositoryClass = (await import('./db/indexed-db-repository')).default;
    config = { dbName: 'tagger', storeName: 'tags' };
    repository = new RepositoryClass(config);
  } else {
    RepositoryClass = (await import('./db/browser-storage-repository')).default;
    repository = new RepositoryClass();
  }
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
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </StrictMode>
    );
  }
}
async function initializeContentScript() {
  const tags = await new TagModel().get();
  try {
    if (Array.isArray(tags)) {
      Tag(tags);
    }
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
