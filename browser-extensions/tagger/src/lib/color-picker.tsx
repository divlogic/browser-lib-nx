import Color from 'colorjs.io';
import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { TwitterPicker } from 'react-color';
import {
  generateAccessibleColor,
  generateRandomAccessibleColor,
} from '../color-utils';

/* eslint-disable-next-line */
export interface ColorPickerProps {
  label: string;
  startingColor: string;
  defaultPresets: boolean;
  defaultcolors: string[];
}

export function ColorPicker({
  label = 'Color Picker',
  startingColor = 'black',
  defaultPresets = true,
}: ColorPickerProps) {
  const [presets, setPresets] = useState(defaultPresets);
  const [value, setValue] = useState('');
  const defaultColors: string[] = useMemo(() => {
    const colors = [0, 30, 45, 60, 100, 210, 270, 320];
    return colors.map((hue) => {
      const bgColor = generateAccessibleColor(startingColor, hue);
      if (bgColor === null) {
        return null;
      }
      const bgColorString = bgColor.to('srgb').toString({ format: 'hex' });
      return bgColorString;
    });
  }, []).filter((color) => {
    return color !== null;
  });

  return (
    <FormControl>
      <VStack>
        <FormLabel>{label}</FormLabel>
        <Text>Current value: {value}</Text>
        {presets ? (
          defaultColors.length > 1 ? (
            <TwitterPicker
              triangle="hide"
              colors={defaultColors}
              onChangeComplete={(color) => {
                setValue(color.hex);
              }}
            ></TwitterPicker>
          ) : (
            <Alert status="warning">
              <AlertIcon /> Could not generate presets. Trying a darker or
              lighter color should give better results.
            </Alert>
          )
        ) : (
          <Input
            onChange={(e) => {
              e.preventDefault();
              setValue(e.target.value);
            }}
          ></Input>
        )}
        <VStack>
          <Text>Manual | Presets</Text>
          <Switch
            isChecked={presets}
            onChange={(e) => {
              e.preventDefault();
              setPresets(!presets);
            }}
          ></Switch>
        </VStack>
      </VStack>
    </FormControl>
  );
}

export default ColorPicker;
