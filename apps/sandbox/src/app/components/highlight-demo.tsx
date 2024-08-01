import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Grid,
  GridItem,
  Link,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

export function HighlightDemo() {
  if (typeof CSS.highlights !== 'undefined') {
    return (
      <Box width={'100%'}>
        <Grid templateColumns={'1fr 1fr 1fr'} rowGap={'3rem'}>
          <GridItem colSpan={{ base: 3, '2xl': 1 }}></GridItem>
          <GridItem colSpan={{ base: 3, '2xl': 2 }}>
            <SimpleGrid
              columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
              columnGap={'1rem'}
              rowGap={'1rem'}
              width={'100%'}
              justifyItems={'center'}
            >
              <Box>Display demo</Box>
              <Box>Adding text Demo</Box>
              <Box>Removing text demo</Box>
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Box>
    );
  } else {
    return (
      <Alert status="error">
        <AlertIcon></AlertIcon>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <Text>
            CSS Custom Highlight API not supported. Please try this page again
            from a browser that supports it.
          </Text>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API#api.highlight">
            Table showing browser support
            <ExternalLinkIcon />
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
}
