import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { HighlightTags } from './tagger';
import { theme } from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { RepositoryFactory } from './db';
import { Style, Tag } from './app';

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
  let tags = await new Tag().get();
  const styles = await new Style().get();
  if (Array.isArray(tags)) {
    tags = tags.map((tag) => {
      const style = styles?.find((style) => {
        return style.name === tag.style;
      });
      if (style) {
        tag.style = style;
      }

      return tag;
    });
  }

  try {
    if (Array.isArray(tags)) {
      HighlightTags(tags);
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
