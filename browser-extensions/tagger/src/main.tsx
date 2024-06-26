import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { HighlightTags } from './tagger';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { RepositoryFactory } from './db';
import { Style, Tag } from './app';
import { HighlightStyle } from './schemas';

declare const window: {
  tagModel: Tag;
  styleModel: Style;
};

async function initializeDB() {
  const tagRepository = await RepositoryFactory('tags');
  const tagModel = new Tag(tagRepository);
  const styleRepository = await RepositoryFactory('styles');
  window.styleModel = new Style(styleRepository);
  window.tagModel = tagModel;
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
  const tags = await new Tag().get();
  const styles: { [key: string]: HighlightStyle } = {};

  (await new Style().get())?.forEach((style: HighlightStyle) => {
    styles[style.name] = style;
  });

  try {
    if (Array.isArray(tags)) {
      HighlightTags(tags, styles);
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
