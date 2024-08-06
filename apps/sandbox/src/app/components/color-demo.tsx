import Color, { Coords } from 'colorjs.io';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  SimpleGrid,
  Switch,
  VStack,
} from '@chakra-ui/react';
import { ColorGenerator } from './color-generator';
import { useDeferredValue, useMemo, useState } from 'react';
import { ColorCard } from './color-card';

const presets = { increment: 20, hue: 30, saturation: 20, lightness: 20 };

function generateColors() {
  const colors = [];
  for (let i = 0; i < 360 / presets.hue; i += 1) {
    for (let j = 0; j < 100 / presets.saturation; j += 1) {
      for (let k = 0; k < 100 / presets.lightness; k += 1) {
        colors.push(
          new Color('hsl', [
            presets.hue * i,
            presets.saturation * j,
            presets.lightness * k,
          ])
        );
      }
    }
  }

  return colors;
}
export function ColorDemo() {
  const [colorHSL, setColorHSL] = useState([0, 0, 0]);
  const [wcagRatio, setWcagRatio] = useState(true);
  const [apcaRatio, setApcaRatio] = useState(true);
  console.log(wcagRatio, apcaRatio);
  const deferredHSL = useDeferredValue(colorHSL);
  const currentColor = new Color('hsl', deferredHSL as Coords);
  const startingColors = useMemo(() => {
    return generateColors();
  }, []);
  const colors = startingColors.filter((color) => {
    return (
      (wcagRatio && color.contrastWCAG21(currentColor) > 7) ||
      (apcaRatio && Math.abs(color.contrastAPCA(currentColor)) > 90)
    );
  });
  return (
    <Box width={'100%'}>
      <Grid templateColumns={'1fr 1fr 1fr'} rowGap={'3rem'}>
        <GridItem colSpan={{ base: 3, '2xl': 1 }}>
          <VStack width="100%">
            <ColorGenerator
              title={'Color Generator'}
              defaults={{ hue: 0, saturation: 100, lightness: 50 }}
              onChange={(value) => {
                setColorHSL(value);
              }}
            />
            <FormControl>
              <FormLabel>WCAG 2.1 Contrast Ratio greater than 7</FormLabel>
              <Switch
                isChecked={wcagRatio}
                onChange={(e) => {
                  e.preventDefault();
                  setWcagRatio(!wcagRatio);
                }}
              ></Switch>
            </FormControl>
            <FormControl>
              <FormLabel>APCA Contrast Ratio greater than 90</FormLabel>
              <Switch
                isChecked={apcaRatio}
                onChange={(e) => {
                  e.preventDefault();
                  setApcaRatio(!apcaRatio);
                }}
              ></Switch>
            </FormControl>
          </VStack>
        </GridItem>
        <GridItem colSpan={{ base: 3, '2xl': 2 }}>
          <SimpleGrid
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            columnGap={'1rem'}
            rowGap={'1rem'}
            width={'100%'}
            justifyItems={'center'}
          >
            {colors.length > 0 ? (
              colors.map((color, index) => {
                return (
                  <ColorCard
                    key={index}
                    constrastRatio={color.contrastWCAG21(currentColor)}
                    textColor={currentColor
                      .to('srgb')
                      .toString({ format: 'hex' })}
                    backgroundColor={color
                      .to('srgb')
                      .toString({ format: 'hex' })}
                    colorContrastAPCA={color.contrastAPCA(currentColor)}
                  />
                );
              })
            ) : (
              <Alert
                status="warning"
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                textAlign={'center'}
              >
                <AlertIcon />
                <AlertTitle>No accessible background colors found.</AlertTitle>
                <AlertDescription>
                  Tweaking lightness in either direction sufficiently should
                  solve this problem.
                </AlertDescription>
              </Alert>
            )}
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Box>
  );
}
