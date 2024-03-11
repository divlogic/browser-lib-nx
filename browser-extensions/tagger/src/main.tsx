import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/app';
import { tag } from './db';
window.tag = tag;
function initializeReact() {
  const el = document.getElementById('root') as HTMLElement;

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
    console.error('root element not found');
  }
}

async function initializeDB() {
  const db = await tag.getDB();
  db.close();
  if (db.objectStoreNames.contains(tag.store)) {
    console.log('contains it');
    initializeReact();
  } else {
    console.log('doesnt contain');
    await tag.createStore();
    initializeReact();
  }
}

initializeDB();
