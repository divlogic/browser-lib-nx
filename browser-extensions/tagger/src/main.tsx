import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { Tag } from './tagger';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { RepositoryFactory } from './db';
import { StyleModel, TagModel } from './app';

async function initializeDB() {
  const tagRepository = await RepositoryFactory('tags');
  const tagModel = new TagModel(tagRepository);

  window.tag = tagModel;

  const styleRepository = await RepositoryFactory('styles');
  window.styleModel = new StyleModel(styleRepository);
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
