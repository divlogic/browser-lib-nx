import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  RouterProvider,
  ToPathOption,
  createRouter,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import {
  ChakraProvider,
  extendBaseTheme,
  theme as baseTheme,
} from '@chakra-ui/react';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export type PathOptions = ToPathOption<typeof router.routeTree>;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const customTheme = {
  styles: {
    global: {
      'a.active': {
        textDecoration: 'underline',
        backgroundColor: 'blue.100',
      },
    },
  },
};

const theme = extendBaseTheme(baseTheme, customTheme);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
