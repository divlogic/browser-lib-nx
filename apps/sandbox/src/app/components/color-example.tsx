import Color from 'colorjs.io';
import { Box, Container, SimpleGrid } from '@chakra-ui/react';
import { ColorCard } from './color-card';

/* eslint-disable-next-line */
export interface ColorExampleProps {}

function colorGenerator(startingColor: string, hue: number) {
  const textColor = new Color(startingColor);
  const backgroundColor = new Color('hsl', [hue * 30, 100, 50]);
  return { textColor, backgroundColor };
}

export function ColorExample(props: ColorExampleProps) {
  const colors = Array(13)
    .fill(null)
    .map((item, index) => {
      const color = colorGenerator('black', index);
      return (
        <ColorCard
          key={index}
          constrastRatio={color.backgroundColor.contrastWCAG21(color.textColor)}
          textColor={color.textColor.toString()}
          backgroundColor={color.backgroundColor.toString()}
        />
      );
    });

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      columnGap={'1rem'}
      rowGap={'1rem'}
      border="1px solid black"
      width={'max-content'}
      backgroundColor={'orange'}
    >
      {colors}
    </SimpleGrid>
  );
}

export default ColorExample;
