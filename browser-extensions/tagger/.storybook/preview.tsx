import React from 'react';

import type { Preview } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../src/theme';

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          return (
            // Your page layout is probably a little more complex than this ;)
            <div className="page-layout">
              <Story />
            </div>
          );
        case 'page-mobile':
          return (
            <div className="page-mobile-layout">
              <Story />
            </div>
          );
        default:
          // In the default case, don't apply a layout
          return (
            <ChakraProvider theme={theme}>
              <Story />
            </ChakraProvider>
          );
      }
    },
  ],
};

export default preview;
