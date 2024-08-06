import { extendBaseTheme, theme as baseTheme } from '@chakra-ui/react';
const customTheme = {
  styles: {
    global: {
      body: {
        height: '590px',
        width: '750px',
      },
    },
  },
};

export const theme = extendBaseTheme(baseTheme, customTheme);
