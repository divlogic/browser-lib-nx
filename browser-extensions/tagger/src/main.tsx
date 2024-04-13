import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/app';
import { tag } from './app/models/tag';
import { TagType } from './app/form-reducer';
import { Tag } from './tagger';

async function initializeDB() {
  let tags = null;
  tags = await tag.get();
  if (typeof tags === 'undefined') {
    await tag.set([]);
  }
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
  } else {
    const tags = await tag.get();
    try {
      Tag(tags);
    } catch (e) {
      // console.error(e);
    }
  }
}

async function initialization() {
  await initializeDB();
  await initializeReact();
}

initialization();

if (import.meta.env.DEV) {
  window.tag = tag;
}
