import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';

import App from './app/app';
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
