import { Box, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';

export function HighlightDemo() {
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
            <Box>Grid item box</Box>
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Box>
  );
}
