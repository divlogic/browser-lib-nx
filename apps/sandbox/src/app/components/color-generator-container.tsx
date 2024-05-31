import { useReducer, useState } from 'react';
import Color from 'colorjs.io';
import { ColorGenerator } from './color-generator';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ColorCard } from './color-card';
import { reducer } from './reducer';

export function ColorGeneratorContainer() {
  const [state, dispatch] = useReducer(reducer, [
    [180, 50, 50],
    [180, 50, 50],
  ]);

  const [foreground, setForeground] = useState(0);
  const [background, setBackground] = useState(1);

  const textColor = new Color('hsl', state[foreground]);
  const backgroundColor = new Color('hsl', state[background]);
  const contrastRatio = textColor.contrastWCAG21(backgroundColor);
  const contrastRatioAPCA = backgroundColor.contrastAPCA(textColor).toString();

  const generators = [...state].map((item, index) => {
    return (
      <ColorGenerator
        title={'Generator ' + index}
        key={index}
        defaults={{ hue: item[0], saturation: item[1], lightness: item[2] }}
        onChange={(value) => {
          dispatch({ type: 'changed', payload: { index: index, data: value } });
        }}
      />
    );
  });
  return (
    <Box width="100%">
      <SimpleGrid columns={{ sm: 1, md: 2 }}>
        <VStack width="100%">
          <Heading>Contrasts:</Heading>
          <HStack>
            <FormControl>
              <FormLabel>Foreground(text):</FormLabel>
              <Select
                value={foreground}
                onChange={(e) => {
                  setForeground(Number(e.target.value));
                }}
              >
                {[...state].map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Background:</FormLabel>
              <Select
                value={background}
                onChange={(e) => {
                  setBackground(Number(e.target.value));
                }}
              >
                {[...state].map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          </HStack>
          <ColorCard
            constrastRatio={contrastRatio}
            textColor={textColor.to('srgb').toString({ format: 'hex' })}
            backgroundColor={backgroundColor
              .to('srgb')
              .toString({ format: 'hex' })}
            colorContrastAPCA={contrastRatioAPCA}
          />
        </VStack>
        <VStack width="100%">
          <VStack>
            <Container>
              <Text>Generators: {state.length}</Text>
            </Container>
            <HStack>
              <Button
                variant="solid"
                backgroundColor="green.300"
                color="black"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'added', payload: { data: [180, 50, 50] } });
                }}
              >
                Add
              </Button>
              <Button
                variant="solid"
                backgroundColor="red.300"
                color="black"
                onClick={() => {
                  if (state.length > 1) {
                    dispatch({ type: 'removed' });
                  }
                }}
              >
                Remove
              </Button>
            </HStack>
          </VStack>
          <SimpleGrid width={'100%'} columns={2} spacing={2}>
            {generators}
          </SimpleGrid>
        </VStack>
      </SimpleGrid>
    </Box>
  );
}
