import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/app';
import { tag } from './db';
import { TagType } from './app/form-reducer';
import { Tag } from './tagger';

async function initializeDB() {
  const tags = await tag.get();
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
    const tags = (await tag.get()).map((tag: TagType) => tag.text);
    Tag(tags);
  }
}

async function initialization() {
  await initializeDB();
  await initializeReact();
}

initialization();
