import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import MarkJS from 'mark.js';

import App from './app/app';
import { tag } from './db';
import { TagType } from './app/form-reducer';

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
    const tags = await tag.get();
    const instance = new MarkJS(document.querySelectorAll('body')[0]);
    console.log('tags is: ', tags);
    tags.forEach((tag: TagType) => {
      if (typeof tag.text === 'string') {
        instance.mark(tag.text, {
          acrossElements: true,
          ignoreJoiners: true,
          separateWordSearch: false,
        });
      }
    });
  }
}

async function initialization() {
  await initializeDB();
  await initializeReact();
}

initialization();
